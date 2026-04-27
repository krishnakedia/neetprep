import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ExamService } from '../../../services/exam.service';
import { SubjectService } from '../../../services/subject.service';
import { Exam, Subject } from '../../../models/models';
import { SidebarComponent } from '../../../shared/components';

@Component({
  selector: 'app-exam-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, SidebarComponent],
  templateUrl: './exam-management.component.html',
  styleUrls: ['./exam-management.component.css']
})
export class ExamManagementComponent implements OnInit {
  exams: Exam[] = [];
  filteredExams: Exam[] = [];
  subjects: Subject[] = [];
  selectedSubject: Subject | null = null;
  
  searchTerm = '';
  filterSubject = '';
  filterStatus = '';
  
  showExamModal = false;
  editingExam: Exam | null = null;
  
  examForm: Partial<Exam> = {
    title: '',
    description: '',
    subject_id: '',
    topic_ids: [],
    duration: 30,
    total_marks: 50,
    passing_marks: 25
  };

  constructor(
    private examService: ExamService,
    private subjectService: SubjectService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.examService.getExams().subscribe(exams => {
      this.exams = exams;
      this.filterExams();
    });

    this.subjectService.getSubjects().subscribe(subjects => {
      this.subjects = subjects;
    });
  }

  filterExams(): void {
    let result = [...this.exams];
    
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(e => 
        e.title.toLowerCase().includes(term) || 
        e.description.toLowerCase().includes(term)
      );
    }
    
    if (this.filterSubject) {
      result = result.filter(e => e.subject_id === this.filterSubject);
    }
    
    if (this.filterStatus) {
      const is_active = this.filterStatus === 'active';
      result = result.filter(e => e.is_active === is_active);
    }
    
    this.filteredExams = result;
  }

  getSubjectName(subject_id: string): string {
    const subject = this.subjects.find(s => s.id === subject_id);
    return subject?.name || 'Unknown';
  }

  openExamModal(): void {
    this.editingExam = null;
    this.examForm = {
      title: '',
      description: '',
      subject_id: '',
      topic_ids: [],
      duration: 30,
      total_marks: 50,
      passing_marks: 25
    };
    this.selectedSubject = null;
    this.showExamModal = true;
  }

  editExam(exam: Exam): void {
    this.editingExam = exam;
    this.examForm = { ...exam };
    this.selectedSubject = this.subjects.find(s => s.id === exam.subject_id) || null;
    this.showExamModal = true;
  }

  closeExamModal(): void {
    this.showExamModal = false;
    this.editingExam = null;
  }

  toggleTopic(topicId: string): void {
    if (!this.examForm.topic_ids) {
      this.examForm.topic_ids = [];
    }
    
    const index = this.examForm.topic_ids.indexOf(topicId);
    if (index === -1) {
      this.examForm.topic_ids.push(topicId);
    } else {
      this.examForm.topic_ids.splice(index, 1);
    }
  }

  isTopicSelected(topicId: string): boolean {
    return this.examForm.topic_ids?.includes(topicId) || false;
  }

  saveExam(): void {
    if (this.editingExam) {
      this.examService.updateExam(this.editingExam.id, this.examForm).subscribe(() => {
        this.loadData();
        this.closeExamModal();
      });
    } else {
      this.examService.createExam(this.examForm).subscribe(() => {
        this.loadData();
        this.closeExamModal();
      });
    }
  }

  toggleExamStatus(exam: Exam): void {
    this.examService.toggleExamStatus(exam.id).subscribe(() => {
      this.loadData();
    });
  }

  deleteExam(exam: Exam): void {
    if (confirm(`Are you sure you want to delete "${exam.title}"? This action cannot be undone.`)) {
      this.examService.deleteExam(exam.id).subscribe(() => {
        this.loadData();
      });
    }
  }

  logout(): void {
    this.router.navigate(['/login']);
  }
}

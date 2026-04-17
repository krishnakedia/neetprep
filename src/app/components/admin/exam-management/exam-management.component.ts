import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ExamService } from '../../../services/exam.service';
import { SubjectService } from '../../../services/subject.service';
import { Exam, Subject } from '../../../models/models';

@Component({
  selector: 'app-exam-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
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
    subjectId: '',
    topicIds: [],
    duration: 30,
    totalMarks: 50,
    passingMarks: 25
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
      result = result.filter(e => e.subjectId === this.filterSubject);
    }
    
    if (this.filterStatus) {
      const is_active = this.filterStatus === 'active';
      result = result.filter(e => e.is_active === is_active);
    }
    
    this.filteredExams = result;
  }

  getSubjectName(subjectId: string): string {
    const subject = this.subjects.find(s => s.id === subjectId);
    return subject?.name || 'Unknown';
  }

  openExamModal(): void {
    this.editingExam = null;
    this.examForm = {
      title: '',
      description: '',
      subjectId: '',
      topicIds: [],
      duration: 30,
      totalMarks: 50,
      passingMarks: 25
    };
    this.selectedSubject = null;
    this.showExamModal = true;
  }

  editExam(exam: Exam): void {
    this.editingExam = exam;
    this.examForm = { ...exam };
    this.selectedSubject = this.subjects.find(s => s.id === exam.subjectId) || null;
    this.showExamModal = true;
  }

  closeExamModal(): void {
    this.showExamModal = false;
    this.editingExam = null;
  }

  toggleTopic(topicId: string): void {
    if (!this.examForm.topicIds) {
      this.examForm.topicIds = [];
    }
    
    const index = this.examForm.topicIds.indexOf(topicId);
    if (index === -1) {
      this.examForm.topicIds.push(topicId);
    } else {
      this.examForm.topicIds.splice(index, 1);
    }
  }

  isTopicSelected(topicId: string): boolean {
    return this.examForm.topicIds?.includes(topicId) || false;
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

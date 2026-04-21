import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SubjectService } from '../../../services/subject.service';
import { Subject, Topic } from '../../../models/models';

@Component({
  selector: 'app-subject-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './subject-management.component.html',
  styleUrls: ['./subject-management.component.css']
})
export class SubjectManagementComponent implements OnInit {
  subjects: Subject[] = [];
  showSubjectModal = false;
  showTopicModal = false;
  editingSubject: Subject | null = null;
  editingTopic: Topic | null = null;
  selectedSubject: Subject | null = null;

  subjectForm: Partial<Subject> = {
    name: '',
    description: '',
    icon: 'fa-book',
    color: '#4f46e5'
  };

  topicForm: Partial<Topic> = {
    name: '',
    description: ''
  };

  icons = ['fa-book', 'fa-atom', 'fa-flask', 'fa-dna', 'fa-brain', 'fa-heart', 'fa-microscope', 'fa-rocket', 'fa-globe', 'fa-calculator'];
  colors = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6'];

  constructor(
    private subjectService: SubjectService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadSubjects();
  }

  loadSubjects(): void {
    this.subjectService.getSubjects().subscribe(subjects => {
      this.subjects = subjects;
    });
  }

  openSubjectModal(): void {
    this.editingSubject = null;
    this.subjectForm = {
      name: '',
      description: '',
      icon: 'fa-book',
      color: '#4f46e5'
    };
    this.showSubjectModal = true;
  }

  editSubject(subject: Subject): void {
    this.editingSubject = subject;
    this.subjectForm = { ...subject };
    this.showSubjectModal = true;
  }

  closeSubjectModal(): void {
    this.showSubjectModal = false;
    this.editingSubject = null;
  }

  saveSubject(): void {
    if (this.editingSubject) {
      this.subjectService.updateSubject(this.editingSubject.id, this.subjectForm).subscribe(() => {
        this.loadSubjects();
        this.closeSubjectModal();
      });
    } else {
      this.subjectService.createSubject(this.subjectForm).subscribe(() => {
        this.loadSubjects();
        this.closeSubjectModal();
      });
    }
  }

  toggleSubjectStatus(subject: Subject): void {
    this.subjectService.toggleSubjectStatus(subject.id).subscribe(() => {
      this.loadSubjects();
    });
  }

  openTopicModal(subject: Subject): void {
    this.selectedSubject = subject;
    this.editingTopic = null;
    this.topicForm = { name: '', description: '' };
    this.showTopicModal = true;
  }

  editTopic(subject: Subject, topic: Topic): void {
    this.selectedSubject = subject;
    this.editingTopic = topic;
    this.topicForm = { ...topic };
    this.showTopicModal = true;
  }

  closeTopicModal(): void {
    this.showTopicModal = false;
    this.selectedSubject = null;
    this.editingTopic = null;
  }

  saveTopic(): void {
    if (!this.selectedSubject) return;

    if (this.editingTopic) {
      this.subjectService.updateTopic(this.selectedSubject.id, this.editingTopic.id, this.topicForm).subscribe(() => {
        this.loadSubjects();
        this.closeTopicModal();
      });
    } else {
      this.subjectService.createTopic(this.selectedSubject.id, this.topicForm).subscribe(() => {
        this.loadSubjects();
        this.closeTopicModal();
      });
    }
  }

  deleteTopic(subject_id: string, topicId: string): void {
    if (confirm('Are you sure you want to delete this topic?')) {
      this.subjectService.deleteTopic(subject_id, topicId).subscribe(() => {
        this.loadSubjects();
      });
    }
  }

  logout(): void {
    this.router.navigate(['/login']);
  }
}

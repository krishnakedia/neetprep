import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { QuillModule } from 'ngx-quill';
import { PublicQuestionService } from '../../../services/public-question.service';
import { SubjectService } from '../../../services/subject.service';
import { PublicQuestion, Subject, Chapter, Topic } from '../../../models/models';
import { SidebarComponent } from '../../../shared/components';

@Component({
  selector: 'app-public-questions',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, QuillModule, SidebarComponent],
  templateUrl: './public-questions.component.html',
  styleUrls: ['./public-questions.component.css']
})
export class PublicQuestionsComponent implements OnInit {
  questions: PublicQuestion[] = [];
  subjects: Subject[] = [];
  chapters: Chapter[] = [];
  topics: Topic[] = [];
  years: number[] = [];

  filters = {
    subject_id: '',
    chapter_id: '',
    topic_id: '',
    ncert: '',
    difficulty: '',
    year: '',
    question_type: ''
  };

  showModal = false;
  editingQuestion: PublicQuestion | null = null;
  
  questionForm: Partial<PublicQuestion> = {
    subject_id: '',
    chapter_id: '',
    topic_id: '',
    question_text: '',
    option_a: '',
    option_b: '',
    option_c: '',
    option_d: '',
    correct_answer: 'A',
    explanation: '',
    marks: 1,
    ncert: 'no',
    difficulty: 'medium',
    year: undefined,
    question_type: 'theory',
    is_active: true
  };

  questionTypes = [
    { value: 'theory', label: 'Theory' },
    { value: 'numerical', label: 'Numerical' },
    { value: 'diagram', label: 'Diagram Based' },
    { value: 'assertion_reason', label: 'Assertion Reason' },
    { value: 'multiple_correct', label: 'Multiple Correct' }
  ];

  quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ 'header': 1 }, { 'header': 2 }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      ['clean']
    ]
  };

  constructor(
    private publicQuestionService: PublicQuestionService,
    private subjectService: SubjectService,
    private router: Router
  ) {
    const currentYear = new Date().getFullYear();
    for (let y = currentYear; y >= 2015; y--) {
      this.years.push(y);
    }
  }

  ngOnInit(): void {
    this.loadSubjects();
    this.loadQuestions();
  }

  loadSubjects(): void {
    this.subjectService.getSubjects().subscribe(subjects => {
      this.subjects = subjects;
    });
  }

  loadQuestions(): void {
    const filters: any = {};
    if (this.filters.subject_id) filters.subject_id = this.filters.subject_id;
    if (this.filters.chapter_id) filters.chapter_id = this.filters.chapter_id;
    if (this.filters.topic_id) filters.topic_id = this.filters.topic_id;
    if (this.filters.ncert) filters.ncert = this.filters.ncert;
    if (this.filters.difficulty) filters.difficulty = this.filters.difficulty;
    if (this.filters.year) filters.year = this.filters.year;
    if (this.filters.question_type) filters.question_type = this.filters.question_type;

    this.publicQuestionService.getQuestions(filters).subscribe(res => {
      this.questions = res.data;
    });
  }

  onSubjectChange(loadQuestions = true): void {
    if (this.filters.subject_id) {
      this.subjectService.getChaptersBySubject(this.filters.subject_id).subscribe(chapters => {
        this.chapters = chapters;
        this.topics = [];
        this.filters.chapter_id = '';
        this.filters.topic_id = '';
      });
    } else {
      this.chapters = [];
      this.topics = [];
      this.filters.chapter_id = '';
      this.filters.topic_id = '';
    }
    if (loadQuestions) this.loadQuestions();
  }

  onChapterChange(loadQuestions = true): void {
    if (this.filters.chapter_id) {
      this.subjectService.getTopicsByChapter(this.filters.chapter_id).subscribe(topics => {
        this.topics = topics;
        this.filters.topic_id = '';
      });
    } else {
      this.topics = [];
      this.filters.topic_id = '';
    }
    if (loadQuestions) this.loadQuestions();
  }

  applyFilters(): void {
    this.loadQuestions();
  }

  resetFilters(): void {
    this.filters = {
      subject_id: '',
      chapter_id: '',
      topic_id: '',
      ncert: '',
      difficulty: '',
      year: '',
      question_type: ''
    };
    this.chapters = [];
    this.topics = [];
    this.loadQuestions();
  }

  openAddModal(): void {
    this.editingQuestion = null;
    this.questionForm = {
      subject_id: '',
      chapter_id: '',
      topic_id: '',
      question_text: '',
      option_a: '',
      option_b: '',
      option_c: '',
      option_d: '',
      correct_answer: 'A',
      explanation: '',
      marks: 1,
      ncert: 'no',
      difficulty: 'medium',
      year: new Date().getFullYear(),
      question_type: 'theory',
      is_active: true
    };
    this.chapters = [];
    this.topics = [];
    this.showModal = true;
  }

  editQuestion(question: PublicQuestion): void {
    this.editingQuestion = question;
    this.questionForm = { ...question };
    this.showModal = true;
    
    if (question.subject_id) {
      this.subjectService.getChaptersBySubject(question.subject_id).subscribe(chapters => {
        this.chapters = chapters;
      });
    }
    if (question.chapter_id) {
      this.subjectService.getTopicsByChapter(question.chapter_id).subscribe(topics => {
        this.topics = topics;
      });
    }
  }

  closeModal(): void {
    this.showModal = false;
    this.editingQuestion = null;
  }

  onModalSubjectChange(): void {
    if (this.questionForm.subject_id) {
      this.subjectService.getChaptersBySubject(this.questionForm.subject_id!).subscribe(chapters => {
        this.chapters = chapters;
        this.questionForm.chapter_id = '';
        this.questionForm.topic_id = '';
      });
    } else {
      this.chapters = [];
      this.topics = [];
    }
  }

  onModalChapterChange(): void {
    if (this.questionForm.chapter_id) {
      this.subjectService.getTopicsByChapter(this.questionForm.chapter_id!).subscribe(topics => {
        this.topics = topics;
        this.questionForm.topic_id = '';
      });
    } else {
      this.topics = [];
    }
  }

  saveQuestion(): void {
    if (!this.isQuestionValid()) return;

    if (this.editingQuestion) {
      this.publicQuestionService.updateQuestion(this.editingQuestion.id, this.questionForm).subscribe({
        next: () => {
          this.loadQuestions();
          this.closeModal();
        },
        error: (err) => console.error('Error updating question:', err)
      });
    } else {
      this.publicQuestionService.createQuestion(this.questionForm).subscribe({
        next: () => {
          this.loadQuestions();
          this.closeModal();
        },
        error: (err) => console.error('Error creating question:', err)
      });
    }
  }

  deleteQuestion(question: PublicQuestion): void {
    if (confirm('Are you sure you want to delete this question?')) {
      this.publicQuestionService.deleteQuestion(question.id).subscribe({
        next: () => this.loadQuestions(),
        error: (err) => console.error('Error deleting question:', err)
      });
    }
  }

  toggleStatus(question: PublicQuestion): void {
    this.publicQuestionService.toggleStatus(question.id).subscribe({
      next: () => this.loadQuestions(),
      error: (err) => console.error('Error toggling status:', err)
    });
  }

  isQuestionValid(): boolean {
    return !!(
      this.questionForm.subject_id &&
      this.questionForm.question_text &&
      this.questionForm.option_a &&
      this.questionForm.option_b &&
      this.questionForm.option_c &&
      this.questionForm.option_d &&
      this.questionForm.correct_answer
    );
  }

  getDifficultyClass(difficulty?: string): string {
    return `badge-${difficulty || 'medium'}`;
  }
}
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PublicQuestionService } from '../../../services/public-question.service';
import { SubjectService } from '../../../services/subject.service';
import { AuthService } from '../../../services/auth.service';
import { PublicQuestion, Subject, Chapter, PublicQuestionFilter, PaginatedResponse, User } from '../../../models/models';

@Component({
  selector: 'app-public-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class PublicHomeComponent implements OnInit {
  subjects: Subject[] = [];
  chapters: Chapter[] = [];
  questions: PublicQuestion[] = [];
  totalQuestions = 0;
  years: number[] = [];
  isLoggedIn = false;
  currentUser: User | null = null;

  filters: PublicQuestionFilter = {
    subject_id: '',
    chapter_id: '',
    topic_id: '',
    ncert: '',
    difficulty: '',
    year: '',
    question_type: '',
    search: '',
    page: 1,
    per_page: 12
  };

  currentPage = 1;
  totalPages = 1;
  perPage = 12;

  questionTypes = [
    { value: 'theory', label: 'Theory' },
    { value: 'numerical', label: 'Numerical' },
    { value: 'diagram', label: 'Diagram Based' },
    { value: 'assertion_reason', label: 'Assertion Reason' },
    { value: 'multiple_correct', label: 'Multiple Correct' }
  ];

  showFilters = false;
  selectedAnswer: Record<string, string> = {};
  showResults: Record<string, boolean> = {};

  constructor(
    private publicQuestionService: PublicQuestionService,
    private subjectService: SubjectService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    const currentYear = new Date().getFullYear();
    for (let y = currentYear; y >= 2015; y--) {
      this.years.push(y);
    }
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.isLoggedIn = !!this.currentUser;
    this.loadSubjects();
    this.loadQuestions();
    
    this.route.queryParams.subscribe(params => {
      if (params['subject']) this.filters.subject_id = params['subject'];
      if (params['chapter']) this.filters.chapter_id = params['chapter'];
      if (params['ncert']) this.filters.ncert = params['ncert'];
      if (params['difficulty']) this.filters.difficulty = params['difficulty'];
      if (params['year']) this.filters.year = params['year'];
      if (params['q']) this.filters.search = params['q'];
      this.loadQuestions();
    });
  }

  loadSubjects(): void {
    this.subjectService.getSubjects().subscribe(subjects => {
      this.subjects = subjects.filter(s => s.is_active);
    });
  }

  loadQuestions(): void {
    this.publicQuestionService.getQuestions(this.filters).subscribe((res: PaginatedResponse<PublicQuestion>) => {
      this.questions = res.data;
      this.totalQuestions = res.total;
      this.currentPage = res.current_page;
      this.totalPages = res.last_page;
      this.perPage = res.per_page;
    });
  }

  onSubjectChange(): void {
    if (this.filters.subject_id) {
      this.subjectService.getChaptersBySubject(this.filters.subject_id).subscribe(chapters => {
        this.chapters = chapters.filter(c => c.isActive);
      });
    } else {
      this.chapters = [];
      this.filters.chapter_id = '';
    }
    this.filters.page = 1;
    this.loadQuestions();
  }

  applyFilters(): void {
    this.filters.page = 1;
    this.updateQueryParams();
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
      question_type: '',
      search: '',
      page: 1,
      per_page: 12
    };
    this.chapters = [];
    this.updateQueryParams();
    this.loadQuestions();
  }

  updateQueryParams(): void {
    const queryParams: any = {};
    if (this.filters.subject_id) queryParams.subject = this.filters.subject_id;
    if (this.filters.chapter_id) queryParams.chapter = this.filters.chapter_id;
    if (this.filters.ncert) queryParams.ncert = this.filters.ncert;
    if (this.filters.difficulty) queryParams.difficulty = this.filters.difficulty;
    if (this.filters.year) queryParams.year = this.filters.year;
    if (this.filters.search) queryParams.q = this.filters.search;
    
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge'
    });
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.filters.page = page;
      this.loadQuestions();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(this.totalPages, start + maxVisible - 1);
    
    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  selectAnswer(questionId: string, answer: string): void {
    if (!this.isLoggedIn) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/questions' } });
      return;
    }
    this.selectedAnswer[questionId] = answer;
  }

  submitAnswer(questionId: string): void {
    this.showResults[questionId] = true;
  }

  restorePendingAnswer(): void {
    // No longer needed - removed pending answer feature
  }

  isCorrect(question: PublicQuestion, selectedOption: string): boolean {
    return question.correct_answer === selectedOption;
  }

  getDifficultyClass(difficulty?: string): string {
    return `badge-${difficulty || 'medium'}`;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
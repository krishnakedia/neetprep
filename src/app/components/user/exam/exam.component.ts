import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { ExamService } from '../../../services/exam.service';
import { AuthService } from '../../../services/auth.service';
import { BookmarkService } from '../../../services/bookmark.service';
import { Exam, Question, ExamAttempt, ExamAnswer } from '../../../models/models';

@Component({
  selector: 'app-exam',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.css']
})
export class ExamComponent implements OnInit, OnDestroy {
  exam: Exam | null = null;
  examId: string = '';
  questions: Question[] = [];
  answers: (string | null)[] = [];
  currentIndex = 0;
  timeRemaining = 0;
  private timer: any;
  attemptId: string = '';
  showSubmitModal = false;
  showExitModal = false;
  isBookmarked = false;
  bookmarkedQuestions: Set<string> = new Set();

  constructor(
    private examService: ExamService,
    private authService: AuthService,
    private bookmarkService: BookmarkService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.examId = this.route.snapshot.paramMap.get('examId') || '';
    this.loadExam();
  }

  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  loadExam(): void {
    this.examService.getExamById(this.examId).subscribe(exam => {
      this.exam = exam || null;
      if (this.exam) {
        this.timeRemaining = this.exam.duration * 60;
        this.startTimer();
      }
    });

    this.examService.getQuestionsByExam(this.examId).subscribe(questions => {
      this.questions = questions;
      this.answers = new Array(questions.length).fill(null);
      this.checkBookmarks();
    });

    const user = this.authService.getCurrentUser();
    if (user) {
      this.examService.startExam(this.examId).subscribe(attempt => {
        this.attemptId = attempt.id;
      });
    }
  }

  startTimer(): void {
    this.timer = setInterval(() => {
      this.timeRemaining--;
      if (this.timeRemaining <= 0) {
        this.submitExam();
      }
    }, 1000);
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  selectAnswer(option: 'A' | 'B' | 'C' | 'D'): void {
    this.answers[this.currentIndex] = option;
  }

  nextQuestion(): void {
    if (this.currentIndex < this.questions.length - 1) {
      this.currentIndex++;
    }
  }

  previousQuestion(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  goToQuestion(index: number): void {
    this.currentIndex = index;
    this.updateBookmarkState();
  }

  get answeredCount(): number {
    return this.answers.filter(a => a !== null).length;
  }

  confirmSubmit(): void {
    this.showSubmitModal = true;
  }

  confirmExit(): void {
    this.showExitModal = true;
  }

  submitExam(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.showSubmitModal = false;

    const examAnswers: ExamAnswer[] = this.questions.map((q, i) => ({
      questionId: q.id,
      selectedAnswer: (this.answers[i] as 'A' | 'B' | 'C' | 'D') || null,
      isCorrect: false,
      marksObtained: 0
    }));

    this.examService.submitExam(this.attemptId, examAnswers).subscribe(() => {
      this.router.navigate(['/user/result', this.attemptId]);
    });
  }

  exitExam(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.router.navigate(['/user']);
  }

  toggleBookmark(): void {
    const question = this.questions[this.currentIndex];
    if (!question) return;

    if (this.bookmarkedQuestions.has(question.id)) {
      this.bookmarkService.removeBookmark(question.id).subscribe(() => {
        this.bookmarkedQuestions.delete(question.id);
        this.updateBookmarkState();
      });
    } else {
      this.bookmarkService.toggleBookmark(question.id).subscribe(() => {
        this.bookmarkedQuestions.add(question.id);
        this.updateBookmarkState();
      });
    }
  }

  updateBookmarkState(): void {
    const question = this.questions[this.currentIndex];
    this.isBookmarked = question ? this.bookmarkedQuestions.has(question.id) : false;
  }

  checkBookmarks(): void {
    this.questions.forEach(q => {
      this.bookmarkService.checkBookmark(q.id).subscribe(bookmarked => {
        if (bookmarked) {
          this.bookmarkedQuestions.add(q.id);
        }
      });
    });
  }
}

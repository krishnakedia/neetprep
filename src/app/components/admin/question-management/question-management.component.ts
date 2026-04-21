import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { ExamService } from '../../../services/exam.service';
import { Exam, Question } from '../../../models/models';

@Component({
  selector: 'app-question-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './question-management.component.html',
  styleUrls: ['./question-management.component.css']
})
export class QuestionManagementComponent implements OnInit {
  exam: Exam | null = null;
  examId: string = '';
  questions: Question[] = [];
  showQuestionModal = false;
  editingQuestion: Question | null = null;

  questionForm: Partial<Question> & { correct_answer: 'A' | 'B' | 'C' | 'D' } = {
    question_text: '',
    option_a: '',
    option_b: '',
    option_c: '',
    option_d: '',
    correct_answer: 'A',
    marks: 5,
    ncert: '',
    difficulty: 'medium',
    question_type: 'theory'
  };

  constructor(
    private examService: ExamService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.examId = this.route.snapshot.paramMap.get('examId') || '';
    this.loadExam();
    // this.loadQuestions();
  }

  loadExam(): void {
    this.examService.getExamById(this.examId).subscribe(exam => {
      this.exam = exam || null;
      this.questions = exam?.questions || [];
    });
  }

  loadQuestions(): void {
    this.examService.getQuestionsByExam(this.examId).subscribe(questions => {
      this.questions = questions;
    });
  }

  openQuestionModal(): void {
    this.editingQuestion = null;
    this.questionForm = {
      question_text: '',
      option_a: '',
      option_b: '',
      option_c: '',
      option_d: '',
      correct_answer: 'A',
      marks: 5
    };
    this.showQuestionModal = true;
  }

  editQuestion(question: Question): void {
    this.editingQuestion = question;
    this.questionForm = {
      question_text: question.question_text,
      option_a: question.option_a,
      option_b: question.option_b,
      option_c: question.option_c,
      option_d: question.option_d,
      correct_answer: question.correct_answer,
      ncert: question.ncert,
      difficulty: question.difficulty,
      year: question.year,
      question_type: question.question_type,
      marks: question.marks
    };
    this.showQuestionModal = true;
  }

  closeQuestionModal(): void {
    this.showQuestionModal = false;
    this.editingQuestion = null;
  }

  isQuestionValid(): boolean {
    return !!(
      this.questionForm.question_text &&
      this.questionForm.option_a &&
      this.questionForm.option_b &&
      this.questionForm.option_c &&
      this.questionForm.option_d &&
      this.questionForm.correct_answer
    );
  }

  saveQuestion(): void {
    if (!this.isQuestionValid()) return;

    if (this.editingQuestion) {
      this.examService.updateQuestion(this.editingQuestion.id, this.examId, {
        question_text: this.questionForm.question_text,
        option_a: this.questionForm.option_a,
        option_b: this.questionForm.option_b,
        option_c: this.questionForm.option_c,
        option_d: this.questionForm.option_d,
        correct_answer: this.questionForm.correct_answer,
        marks: this.questionForm.marks,
        ncert: this.questionForm.ncert,
        difficulty: this.questionForm.difficulty,
        year: this.questionForm.year,
        question_type: this.questionForm.question_type
      } as Partial<Question>).subscribe(() => {
        this.loadQuestions();
        this.loadExam();
        this.closeQuestionModal();
      });
    } else {
      this.examService.createQuestion(this.examId, {
        question_text: this.questionForm.question_text,
        option_a: this.questionForm.option_a,
        option_b: this.questionForm.option_b,
        option_c: this.questionForm.option_c,
        option_d: this.questionForm.option_d,
        correct_answer: this.questionForm.correct_answer,
        marks: this.questionForm.marks,
        ncert: this.questionForm.ncert,
        difficulty: this.questionForm.difficulty,
        year: this.questionForm.year,
        question_type: this.questionForm.question_type
      } as Partial<Question>).subscribe(() => {
        this.loadQuestions();
        this.loadExam();
        this.closeQuestionModal();
      });
    }
  }

  deleteQuestion(question: Question): void {
    if (confirm('Are you sure you want to delete this question?')) {
      this.examService.deleteQuestion(question.id, this.examId).subscribe(() => {
        this.loadQuestions();
        this.loadExam();
      });
    }
  }

  logout(): void {
    this.router.navigate(['/login']);
  }
}

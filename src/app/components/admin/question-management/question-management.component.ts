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
  
  questionForm: Partial<Question> & { correctAnswer: 'A' | 'B' | 'C' | 'D' } = {
    questionText: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctAnswer: 'A',
    marks: 5,
    ncert: '',
    difficulty: 'medium',
    questionType: 'theory'
  };

  constructor(
    private examService: ExamService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.examId = this.route.snapshot.paramMap.get('examId') || '';
    this.loadExam();
    this.loadQuestions();
  }

  loadExam(): void {
    this.examService.getExamById(this.examId).subscribe(exam => {
      this.exam = exam || null;
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
      questionText: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      correctAnswer: 'A',
      marks: 5
    };
    this.showQuestionModal = true;
  }

  editQuestion(question: Question): void {
    this.editingQuestion = question;
    this.questionForm = {
      questionText: question.questionText,
      optionA: question.optionA,
      optionB: question.optionB,
      optionC: question.optionC,
      optionD: question.optionD,
      correctAnswer: question.correctAnswer,
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
      this.questionForm.questionText &&
      this.questionForm.optionA &&
      this.questionForm.optionB &&
      this.questionForm.optionC &&
      this.questionForm.optionD &&
      this.questionForm.correctAnswer
    );
  }

  saveQuestion(): void {
    if (!this.isQuestionValid()) return;

    if (this.editingQuestion) {
      this.examService.updateQuestion(this.editingQuestion.id, this.examId, {
        questionText: this.questionForm.questionText,
        optionA: this.questionForm.optionA,
        optionB: this.questionForm.optionB,
        optionC: this.questionForm.optionC,
        optionD: this.questionForm.optionD,
        correctAnswer: this.questionForm.correctAnswer,
        marks: this.questionForm.marks,
        ncert: this.questionForm.ncert,
        difficulty: this.questionForm.difficulty,
        year: this.questionForm.year,
        questionType: this.questionForm.questionType
      } as Partial<Question>).subscribe(() => {
        this.loadQuestions();
        this.loadExam();
        this.closeQuestionModal();
      });
    } else {
      this.examService.createQuestion(this.examId, {
        questionText: this.questionForm.questionText,
        optionA: this.questionForm.optionA,
        optionB: this.questionForm.optionB,
        optionC: this.questionForm.optionC,
        optionD: this.questionForm.optionD,
        correctAnswer: this.questionForm.correctAnswer,
        marks: this.questionForm.marks,
        ncert: this.questionForm.ncert,
        difficulty: this.questionForm.difficulty,
        year: this.questionForm.year,
        questionType: this.questionForm.questionType
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

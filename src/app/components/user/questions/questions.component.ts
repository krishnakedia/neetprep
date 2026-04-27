import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SubjectService } from '../../../services/subject.service';
import { ExamService } from '../../../services/exam.service';
import { Subject, Chapter, Question } from '../../../models/models';
import { HeaderComponent } from '../../../shared/components';

@Component({
  selector: 'app-questions-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HeaderComponent],
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})
export class QuestionsPageComponent implements OnInit {
  subjects: Subject[] = [];
  chapters: Chapter[] = [];
  questions: Question[] = [];
  filteredQuestions: Question[] = [];

  filters = {
    subject_id: '',
    chapterId: '',
    ncert: '',
    difficulty: '',
    year: '',
    question_type: ''
  };

  years: number[] = [];

  constructor(
    private subjectService: SubjectService,
    private examService: ExamService,
    private router: Router
  ) {
    const currentYear = new Date().getFullYear();
    for (let y = currentYear; y >= 2015; y--) {
      this.years.push(y);
    }
  }

  ngOnInit(): void {
    this.loadSubjects();
    this.applyFilters();
  }

  loadSubjects(): void {
    this.subjectService.getSubjects().subscribe(subjects => {
      this.subjects = subjects;
    });
  }

  loadAllQuestions(): void {
    this.examService.getAllQuestions().subscribe(res => {
      this.questions = res.data;
      this.filteredQuestions = res.data;
    });
  }

  onSubjectChange(): void {
    if (this.filters.subject_id) {
      this.subjectService.getChaptersBySubject(this.filters.subject_id).subscribe(chapters => {
        this.chapters = chapters;
      });
    } else {
      this.chapters = [];
      this.filters.chapterId = '';
    }
  }

  applyFilters(): void {
    this.examService.getAllQuestions({
      subject_id: this.filters.subject_id || undefined,
      chapter_id: this.filters.chapterId || undefined,
      ncert: this.filters.ncert || undefined,
      difficulty: this.filters.difficulty || undefined,
      year: this.filters.year || undefined,
      question_type: this.filters.question_type || undefined
    }).subscribe(res => {
      this.filteredQuestions = res.data;
    });
  }

  getDifficultyClass(difficulty?: string): string {
    return `badge-${difficulty || 'medium'}`;
  }

  logout(): void {
    this.router.navigate(['/login']);
  }
}

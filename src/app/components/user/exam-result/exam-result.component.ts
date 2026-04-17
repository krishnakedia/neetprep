import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { ExamService } from '../../../services/exam.service';
import { ExamAttempt } from '../../../models/models';

@Component({
  selector: 'app-exam-result',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './exam-result.component.html',
  styleUrls: ['./exam-result.component.css']
})
export class ExamResultComponent implements OnInit {
  attempt: ExamAttempt | null = null;
  attemptId: string = '';
  notes = '';
  saving = false;

  constructor(
    private examService: ExamService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.attemptId = this.route.snapshot.paramMap.get('attemptId') || '';
    this.loadResult();
  }

  loadResult(): void {
    this.examService.getAllAttempts().subscribe(attempts => {
      this.attempt = attempts.find(a => a.id === this.attemptId) || null;
      if (this.attempt?.notes) {
        this.notes = this.attempt.notes;
      }
    });
  }

  saveNotes(): void {
    if (this.notes.trim() && this.attempt) {
      this.saving = true;
      const examAnswers = this.attempt.answers || [];
      this.examService.submitExam(this.attempt.id, examAnswers, this.notes).subscribe({
        next: () => {
          this.saving = false;
          alert('Notes saved successfully!');
        },
        error: () => {
          this.saving = false;
        }
      });
    }
  }

  viewAnswers(): void {
    console.log('View answers for attempt:', this.attemptId);
  }
}

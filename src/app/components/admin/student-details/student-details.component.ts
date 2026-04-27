import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { ExamService } from '../../../services/exam.service';
import { AuthService } from '../../../services/auth.service';
import { ExamAttempt, User } from '../../../models/models';
import { SidebarComponent } from '../../../shared/components';

@Component({
  selector: 'app-student-details',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, SidebarComponent],
  templateUrl: './student-details.component.html',
  styleUrls: ['./student-details.component.css']
})
export class StudentDetailsComponent implements OnInit {
  student: User | null = null;
  userId: string = '';
  attempts: ExamAttempt[] = [];
  notes: { date: Date; text: string }[] = [];
  adminNote = '';
  
  averageScore = 0;
  highestScore = 0;
  lowestScore = 0;

  constructor(
    private authService: AuthService,
    private examService: ExamService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('userId') || '';
    this.loadStudentData();
  }

  loadStudentData(): void {
    this.authService.getAllUsers().subscribe(users => {
      this.student = users.find(u => u.id === this.userId) || null;
      
      if (this.student?.notes) {
        this.notes.push({ date: this.student.createdAt, text: this.student.notes });
      }
    });

    this.examService.getUserAttemptsById(this.userId).subscribe(attempts => {      
      // console.log(attempts);
      this.attempts = attempts.filter(a => a.status === 'completed').sort(
        (a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime()
      );
      
      attempts.forEach(a => {
        if (a.notes) {
          this.notes.push({ date: a.completedAt || new Date(), text: a.notes });
        }
      });
      
      this.calculateStats();
    });
  }

  calculateStats(): void {
    const completed = this.attempts;
    if (completed.length > 0) {
      this.averageScore = Math.round(
        completed.reduce((sum, a) => sum + a.percentage, 0) / completed.length
      );
      this.highestScore = Math.max(...completed.map(a => a.percentage));
      this.lowestScore = Math.min(...completed.map(a => a.percentage));
    }
  }

  saveNote(): void {
    if (this.adminNote.trim() && this.student) {
      const updatedNotes = this.student.notes 
        ? this.student.notes + '\n' + this.adminNote 
        : this.adminNote;
      
      this.authService.updateUserNotes(this.student.id, updatedNotes).subscribe(() => {
        this.notes.push({ date: new Date(), text: this.adminNote });
        this.adminNote = '';
      });
    }
  }

  logout(): void {
    this.router.navigate(['/login']);
  }
}

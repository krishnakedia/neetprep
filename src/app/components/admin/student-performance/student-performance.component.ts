import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ExamService } from '../../../services/exam.service';
import { AuthService } from '../../../services/auth.service';
import { ExamAttempt, User } from '../../../models/models';

@Component({
  selector: 'app-student-performance',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './student-performance.component.html',
  styleUrls: ['./student-performance.component.css']
})
export class StudentPerformanceComponent implements OnInit {
  users: User[] = [];
  filteredStudents: any[] = [];
  allAttempts: ExamAttempt[] = [];
  recentAttempts: ExamAttempt[] = [];
  searchTerm = '';
  
  totalAttempts = 0;
  averageScore = 0;
  highestScore = 0;

  constructor(
    private authService: AuthService,
    private examService: ExamService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.authService.getAllUsers().subscribe(users => {
      this.users = users.filter(u => u.role === 'user');
      
      this.examService.getAllAttempts().subscribe(attempts => {
        this.allAttempts = attempts.filter(a => a.status === 'completed');
        this.recentAttempts = this.allAttempts
          .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime())
          .slice(0, 10);
        
        this.calculateStats();
        this.buildStudentData();
      });
    });
  }

  calculateStats(): void {
    this.totalAttempts = this.allAttempts.length;
    if (this.totalAttempts > 0) {
      this.averageScore = Math.round(
        this.allAttempts.reduce((sum, a) => sum + a.percentage, 0) / this.totalAttempts
      );
      this.highestScore = Math.max(...this.allAttempts.map(a => a.percentage));
    }
  }

  buildStudentData(): void {
    this.filteredStudents = this.users.map(user => {
      const attempts = this.allAttempts.filter(a => a.userId === user.id);
      const average = attempts.length > 0 
        ? Math.round(attempts.reduce((sum, a) => sum + a.percentage, 0) / attempts.length)
        : 0;
      const best = attempts.length > 0 
        ? Math.max(...attempts.map(a => a.percentage))
        : 0;
      
      return { user, attempts, average, best };
    });
  }

  filterStudents(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredStudents = this.users
      .filter(u => u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term))
      .map(user => {
        const attempts = this.allAttempts.filter(a => a.userId === user.id);
        const average = attempts.length > 0 
          ? Math.round(attempts.reduce((sum, a) => sum + a.percentage, 0) / attempts.length)
          : 0;
        const best = attempts.length > 0 
          ? Math.max(...attempts.map(a => a.percentage))
          : 0;
        return { user, attempts, average, best };
      });
  }

  getUserName(userId: string): string {
    const user = this.users.find(u => u.id === userId);
    return user?.name || 'Unknown';
  }

  viewStudentDetails(user: User): void {
    this.router.navigate(['/admin/student', user.id]);
  }

  logout(): void {
    this.router.navigate(['/login']);
  }
}

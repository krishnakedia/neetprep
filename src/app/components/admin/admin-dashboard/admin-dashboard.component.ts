import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ExamService } from '../../../services/exam.service';
import { SubjectService } from '../../../services/subject.service';
import { User } from '../../../models/models';
@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  currentUser: User | null = null;
  today = new Date();
  stats = {
    totalUsers: 0,
    activeUsers: 0,
    totalExams: 0,
    activeExams: 0
  };
  recentAttempts: any[] = [];
  activeExams: any[] = [];
  userNames: Record<string, string> = {};

  constructor(
    private authService: AuthService,
    private examService: ExamService,
    private subjectService: SubjectService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadStats();
  }

  loadStats(): void {
    this.authService.getAllUsers().subscribe(users => {
      this.stats.totalUsers = users.length;
      this.stats.activeUsers = users.filter(u => u.isActive).length;
      
      users.forEach(u => {
        this.userNames[u.id] = u.name;
      });
    });

    this.examService.getExams().subscribe(exams => {
      this.stats.totalExams = exams.length;
      this.stats.activeExams = exams.filter(e => e.isActive).length;
      this.activeExams = exams.filter(e => e.isActive).slice(0, 5);
    });

    this.examService.getAllAttempts().subscribe(attempts => {
      this.recentAttempts = attempts
        .filter(a => a.status === 'completed')
        .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime())
        .slice(0, 5);
    });
  }

  getUserName(userId: string): string {
    return this.userNames[userId] || 'Unknown User';
  }

  getSubjectName(subjectId: string): string {
    const subjects: Record<string, string> = {
      '1': 'Physics',
      '2': 'Chemistry',
      '3': 'Biology'
    };
    return subjects[subjectId] || 'Unknown';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

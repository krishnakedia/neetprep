import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ExamService } from '../../../services/exam.service';
import { SubjectService } from '../../../services/subject.service';
import { Exam, Subject, ExamAttempt, User } from '../../../models/models';
@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {
  currentUser: User | null = null;
  subjects: Subject[] = [];
  exams: Exam[] = [];
  assignedExams: Exam[] = [];
  recentAttempts: ExamAttempt[] = [];
  selectedSubjectForExams: Subject | null = null;
  
  stats = {
    completed: 0,
    average: 0,
    best: 0
  };

  constructor(
    private authService: AuthService,
    private examService: ExamService,
    private subjectService: SubjectService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadData();
  }

  loadData(): void {
    this.subjectService.getSubjects().subscribe(subjects => {
      this.subjects = subjects.filter(s => s.is_active);
    });
    
    this.examService.getMyAssignedExams().subscribe(exams => {
      this.assignedExams = exams;
      this.exams = exams;
    });
    
    /*
        // this.examService.getActiveExams().subscribe(exams => {
        //   this.exams = exams;
        // });
    if (this.currentUser) {
      this.examService.getUserAttempts().subscribe(attempts => {
        const completed = attempts.filter(a => a.status === 'completed');
        this.recentAttempts = completed.sort(
          (a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime()
        ).slice(0, 5);
        
        this.stats.completed = completed.length;
        if (completed.length > 0) {
          this.stats.average = Math.round(
            completed.reduce((sum, a) => sum + a.percentage, 0) / completed.length
          );
          this.stats.best = Math.max(...completed.map(a => a.percentage));
        }
      });
    } */
  }

  getExamCount(subject_id: string): number {
    return this.exams.filter(e => e.subject_id === subject_id && e.is_active).length;
  }

  getExamsBySubject(subject_id: string): Exam[] {
    return this.exams.filter(e => e.subject_id === subject_id);
  }

  selectSubject(subject: Subject): void {
    this.selectedSubjectForExams = subject;
  }

  startExam(exam: Exam): void {
    this.router.navigate(['/user/exam', exam.id]);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

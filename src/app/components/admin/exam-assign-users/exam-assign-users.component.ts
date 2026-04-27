import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ExamService } from '../../../services/exam.service';
import { AuthService } from '../../../services/auth.service';
import { Exam, User } from '../../../models/models';
import { SidebarComponent } from '../../../shared/components';

@Component({
  selector: 'app-exam-assign-users',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, SidebarComponent],
  templateUrl: './exam-assign-users.component.html',
  styleUrls: ['./exam-assign-users.component.css']
})
export class ExamAssignUsersComponent implements OnInit {
  exam: Exam | null = null;
  allUsers: User[] = [];
  assignedUsers: User[] = [];
  availableUsers: User[] = [];
  searchTerm = '';
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private examService: ExamService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const examId = this.route.snapshot.paramMap.get('examId');
    if (examId) {
      this.loadData(examId);
    } else {
      this.router.navigate(['/admin/exams']);
    }
  }

  loadData(examId: string): void {
    this.loading = true;
    this.examService.getExamById(examId).subscribe(exam => {
      this.exam = exam;
      this.loadUsers(examId);
    });
  }

  loadUsers(examId: string): void {
    this.examService.getAssignedUsers(examId).subscribe(assigned => {
      this.assignedUsers = assigned;
      this.authService.getAllUsers().subscribe(users => {
        const assignedIds = new Set(assigned.map(u => u.id));
        this.allUsers = users.filter(u => u.role === 'user');
        this.availableUsers = this.allUsers.filter(u => !assignedIds.has(u.id));
        this.loading = false;
      });
    });
  }

  get filteredAvailableUsers(): User[] {
    if (!this.searchTerm) return this.availableUsers;
    const term = this.searchTerm.toLowerCase();
    return this.availableUsers.filter(u => 
      u.name.toLowerCase().includes(term) || 
      u.email.toLowerCase().includes(term)
    );
  }

  assignUser(user: User): void {
    if (!this.exam) return;
    this.examService.assignUsers(this.exam.id, [user.id]).subscribe(() => {
      this.loadData(this.exam!.id);
    });
  }

  removeUser(user: User): void {
    if (!this.exam) return;
    if (confirm(`Remove ${user.name} from this exam?`)) {
      this.examService.removeUserFromExam(this.exam.id, user.id).subscribe(() => {
        this.loadData(this.exam!.id);
      });
    }
  }

  logout(): void {
    this.authService.logout();
  }
}

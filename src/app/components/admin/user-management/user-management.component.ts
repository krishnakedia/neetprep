import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/models';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  searchTerm = '';
  showModal = false;
  editingUser: User | null = null;
  formData: Partial<User> = {
    name: '',
    email: '',
    password: '',
    role: 'user'
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    /* console.time('API'); */
    this.authService.getAllUsers().subscribe(users => {
      /* console.timeEnd('API'); */
      this.users = users;
      this.filteredUsers = users;
      this.cd.detectChanges();
    });
  }

  filterUsers(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredUsers = this.users.filter(user =>
      user.name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term)
    );
  }

  trackByUser(index: number, user: any) {
    return user.id;
  }

  toggleUserStatus(user: User): void {
    this.authService.toggleUserStatus(user.id).subscribe({
      next: () => {
        user.isActive = !user.isActive;
      },
      error: (err) => console.error('Error toggling user status:', err)
    });
  }

  viewPerformance(user: User): void {
    this.router.navigate(['/admin/student', user.id]);
  }

  editUser(user: User): void {
    this.editingUser = user;
    this.formData = { ...user };
    this.showModal = true;
  }

  openAddModal(): void {
    this.editingUser = null;
    this.formData = {
      name: '',
      email: '',
      password: '',
      role: 'user'
    };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingUser = null;
  }

  saveUser(): void {
    if (this.editingUser) {
      console.log('Updating user:', this.editingUser.id, this.formData);
      this.closeModal();
    } else {
      this.authService.createUser(this.formData).subscribe({
        next: () => {
          this.loadUsers();
          this.closeModal();
        },
        error: (err: any) => console.error('Error adding user:', err)
      });
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

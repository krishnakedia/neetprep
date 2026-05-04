import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  showPassword = false;
  loading = false;
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  fillCredentials(email: string, password: string): void {
    this.email = email;
    this.password = password;
    this.error = '';
  }

  onSubmit(): void {
    if (!this.email || !this.password) {
      this.error = 'Please enter both email and password';
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        this.loading = false;
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || null;
        if (returnUrl) {
          this.router.navigateByUrl(returnUrl);
        } else if (response.user.role === 'admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/user']);
        }
      },
      error: (err) => {
        this.loading = false;
        console.log(err.error.message);
        this.error = err.error.message || 'Login failed. Please try again.';
      }
    });
  }
}

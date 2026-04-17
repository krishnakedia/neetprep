import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, map } from 'rxjs';
import { Router } from '@angular/router';
import { User, AuthResponse } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = 'http://127.0.0.1:8000/api';

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (storedUser && token) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, { email, password }).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        this.currentUserSubject.next(response.user);
      })
    );
  }

  logout(): void {
    const token = this.getToken();
    if (token) {
      this.http.post(`${this.apiUrl}/auth/logout`, {}, this.getHttpOptions()).subscribe({
        next: () => this.clearauth(),
        error: () => this.clearauth()
      });
    } else {
      this.clearauth();
    }
  }

  private clearauth(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'admin';
  }

  getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.getToken()}`,
        'Content-Type': 'application/json'
      })
    };
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<{ success: boolean; users: User[] }>(`${this.apiUrl}/admin/users`, this.getHttpOptions()).pipe(
      map(res => res.users || [])
    );
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<{ success: boolean; user: User }>(`${this.apiUrl}/admin/users/${id}`, this.getHttpOptions()).pipe(
      map(res => res.user)
    );
  }

  createUser(userData: Partial<User>): Observable<User> {
    return this.http.post<{ success: boolean; user: User }>(`${this.apiUrl}/admin/users`, userData, this.getHttpOptions()).pipe(
      map(res => res.user)
    );
  }

  updateUser(id: string, userData: Partial<User>): Observable<User> {
    return this.http.put<{ success: boolean; user: User }>(`${this.apiUrl}/admin/users/${id}`, userData, this.getHttpOptions()).pipe(
      map(res => res.user)
    );
  }

  toggleUserStatus(userId: string): Observable<User> {
    return this.http.patch<{ success: boolean; user: User }>(`${this.apiUrl}/admin/users/${userId}/toggle-status`, {}, this.getHttpOptions()).pipe(
      map(res => res.user)
    );
  }

  deleteUser(userId: string): Observable<void> {
    return this.http.delete<{ success: boolean }>(`${this.apiUrl}/admin/users/${userId}`, this.getHttpOptions()).pipe(
      map(() => void 0)
    );
  }

  updateUserNotes(userId: string, notes: string): Observable<User> {
    return this.http.put<{ success: boolean; user: User }>(`${this.apiUrl}/admin/users/${userId}/notes`, { notes }, this.getHttpOptions()).pipe(
      map(res => res.user)
    );
  }

  refreshToken(): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/refresh`, {}, this.getHttpOptions()).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
      })
    );
  }
}

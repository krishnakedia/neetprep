import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { ApiResponse, PaginatedResponse } from '../interfaces/api.interface';

@Injectable()
export abstract class BaseService<T extends { id: string }> {
  protected http = inject(HttpClient);
  protected abstract apiUrl: string;
  protected abstract endpoint: string;

  protected entitiesSubject = new BehaviorSubject<T[]>([]);
  entities$ = this.entitiesSubject.asObservable();

  protected selectedEntitySubject = new BehaviorSubject<T | null>(null);
  selectedEntity$ = this.selectedEntitySubject.asObservable();

  protected loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  protected errorSubject = new BehaviorSubject<string | null>(null);
  error$ = this.errorSubject.asObservable();

  protected getHttpOptions() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      })
    };
  }

  protected getAll(): Observable<T[]> {
    return this.http.get<ApiResponse<T[]>>(`${this.apiUrl}/${this.endpoint}`).pipe(
      map(res => res.data || []),
      tap(data => this.entitiesSubject.next(data))
    );
  }

  protected getById(id: string): Observable<T | null> {
    return this.http.get<ApiResponse<T>>(`${this.apiUrl}/${this.endpoint}/${id}`).pipe(
      map(res => res.data || null),
      tap(data => this.selectedEntitySubject.next(data))
    );
  }

  protected create(entity: Partial<T>): Observable<T> {
    return this.http.post<ApiResponse<T>>(`${this.apiUrl}/${this.endpoint}`, entity).pipe(
      map(res => {
        if (res.data) {
          const current = this.entitiesSubject.value;
          this.entitiesSubject.next([...current, res.data]);
        }
        return res.data!;
      })
    );
  }

  protected update(id: string, updates: Partial<T>): Observable<T> {
    return this.http.put<ApiResponse<T>>(`${this.apiUrl}/${this.endpoint}/${id}`, updates).pipe(
      map(res => {
        if (res.data) {
          const current = this.entitiesSubject.value;
          const index = current.findIndex(item => item.id === id);
          if (index !== -1) {
            current[index] = res.data;
            this.entitiesSubject.next([...current]);
          }
        }
        return res.data!;
      })
    );
  }

  protected delete(id: string): Observable<void> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}/${this.endpoint}/${id}`).pipe(
      map(() => {
        const current = this.entitiesSubject.value;
        this.entitiesSubject.next(current.filter(item => item.id !== id));
      })
    );
  }

  protected toggleStatus(id: string): Observable<T> {
    return this.http.patch<ApiResponse<T>>(`${this.apiUrl}/${this.endpoint}/${id}/toggle-status`, {}).pipe(
      map(res => res.data!)
    );
  }

  protected getPaginated(params: Record<string, any>): Observable<PaginatedResponse<T>> {
    let httpParams = new HttpParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        httpParams = httpParams.set(key, value);
      }
    });
    return this.http.get<any>(`${this.apiUrl}/${this.endpoint}`, { params: httpParams }).pipe(
      map(res => ({
        data: res.data?.data || res.data || [],
        current_page: res.data?.current_page || 1,
        last_page: res.data?.last_page || 1,
        per_page: res.data?.per_page || 15,
        total: res.data?.total || 0
      }))
    );
  }

  setLoading(loading: boolean): void {
    this.loadingSubject.next(loading);
  }

  setError(error: string | null): void {
    this.errorSubject.next(error);
  }

  clearError(): void {
    this.errorSubject.next(null);
  }
}

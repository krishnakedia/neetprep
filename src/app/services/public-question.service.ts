import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PublicQuestion, PublicQuestionFilter, PaginatedResponse } from '../models/models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PublicQuestionService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getQuestions(filters: PublicQuestionFilter): Observable<PaginatedResponse<PublicQuestion>> {
    let params = new HttpParams();
    
    if (filters.subject_id) params = params.set('subject_id', filters.subject_id);
    if (filters.chapter_id) params = params.set('chapter_id', filters.chapter_id);
    if (filters.topic_id) params = params.set('topic_id', filters.topic_id);
    if (filters.ncert) params = params.set('ncert', filters.ncert);
    if (filters.difficulty) params = params.set('difficulty', filters.difficulty);
    if (filters.year) params = params.set('year', filters.year.toString());
    if (filters.question_type) params = params.set('question_type', filters.question_type);
    if (filters.search) params = params.set('search', filters.search);
    if (filters.page) params = params.set('page', filters.page.toString());
    if (filters.per_page) params = params.set('per_page', filters.per_page.toString());

    return this.http.get<PaginatedResponse<PublicQuestion>>(`${this.apiUrl}/public-questions`, { params });
  }

  getQuestion(id: string): Observable<PublicQuestion> {
    return this.http.get<PublicQuestion>(`${this.apiUrl}/public-questions/${id}`);
  }

  createQuestion(question: Partial<PublicQuestion>): Observable<PublicQuestion> {
    return this.http.post<PublicQuestion>(`${this.apiUrl}/public-questions`, question);
  }

  updateQuestion(id: string, question: Partial<PublicQuestion>): Observable<PublicQuestion> {
    return this.http.put<PublicQuestion>(`${this.apiUrl}/public-questions/${id}`, question);
  }

  deleteQuestion(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/public-questions/${id}`);
  }

  toggleStatus(id: string): Observable<PublicQuestion> {
    return this.http.post<PublicQuestion>(`${this.apiUrl}/public-questions/${id}/toggle`, {});
  }
}
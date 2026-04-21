import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Subject, Chapter, Topic } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {
  private http = inject(HttpClient);
  private apiUrl = 'http://127.0.0.1:8000/api';

  private subjectsSubject = new BehaviorSubject<Subject[]>([]);
  subjects$ = this.subjectsSubject.asObservable();

  getSubjects(): Observable<Subject[]> {
    return this.http.get<{ success: boolean; subjects: Subject[] }>(`${this.apiUrl}/subjects`).pipe(
      map(res => {
        this.subjectsSubject.next(res.subjects || []);
        return res.subjects || [];
      })
    );
  }

  getActiveSubjects(): Observable<Subject[]> {
    return this.http.get<{ success: boolean; subjects: Subject[] }>(`${this.apiUrl}/subjects/active`).pipe(
      map(res => res.subjects || [])
    );
  }

  getSubjectById(id: string): Observable<Subject> {
    return this.http.get<{ success: boolean; subject: Subject }>(`${this.apiUrl}/subjects/${id}`).pipe(
      map(res => res.subject)
    );
  }

  createSubject(subject: Partial<Subject>): Observable<Subject> {
    return this.http.post<{ success: boolean; subject: Subject }>(`${this.apiUrl}/admin/subjects`, subject).pipe(
      map(res => res.subject)
    );
  }

  updateSubject(id: string, updates: Partial<Subject>): Observable<Subject> {
    return this.http.put<{ success: boolean; subject: Subject }>(`${this.apiUrl}/admin/subjects/${id}`, updates).pipe(
      map(res => res.subject)
    );
  }

  toggleSubjectStatus(id: string): Observable<Subject> {
    return this.http.patch<{ success: boolean; subject: Subject }>(`${this.apiUrl}/admin/subjects/${id}/toggle-status`, {}).pipe(
      map(res => res.subject)
    );
  }

  deleteSubject(id: string): Observable<void> {
    return this.http.delete<{ success: boolean }>(`${this.apiUrl}/admin/subjects/${id}`).pipe(
      map(() => void 0)
    );
  }

  getChaptersBySubject(subject_id: string): Observable<Chapter[]> {
    return this.http.get<{ success: boolean; chapters: Chapter[] }>(`${this.apiUrl}/subjects/${subject_id}/chapters`).pipe(
      map(res => res.chapters || [])
    );
  }

  createChapter(subject_id: string, chapter: Partial<Chapter>): Observable<Chapter> {
    return this.http.post<{ success: boolean; chapter: Chapter }>(`${this.apiUrl}/admin/subjects/${subject_id}/chapters`, chapter).pipe(
      map(res => res.chapter)
    );
  }

  updateChapter(id: string, updates: Partial<Chapter>): Observable<Chapter> {
    return this.http.put<{ success: boolean; chapter: Chapter }>(`${this.apiUrl}/admin/chapters/${id}`, updates).pipe(
      map(res => res.chapter)
    );
  }

  toggleChapterStatus(id: string): Observable<Chapter> {
    return this.http.patch<{ success: boolean; chapter: Chapter }>(`${this.apiUrl}/admin/chapters/${id}/toggle-status`, {}).pipe(
      map(res => res.chapter)
    );
  }

  deleteChapter(id: string): Observable<void> {
    return this.http.delete<{ success: boolean }>(`${this.apiUrl}/admin/chapters/${id}`).pipe(
      map(() => void 0)
    );
  }

  getTopicsBySubject(subject_id: string): Observable<Topic[]> {
    return this.http.get<{ success: boolean; topics: Topic[] }>(`${this.apiUrl}/subjects/${subject_id}/topics`).pipe(
      map(res => res.topics || [])
    );
  }

  getTopicById(subject_id: string, id: string): Observable<Topic> {
    return this.http.get<{ success: boolean; topic: Topic }>(`${this.apiUrl}/subjects/${subject_id}/topics/${id}`).pipe(
      map(res => res.topic)
    );
  }

  createTopic(subject_id: string, topic: Partial<Topic>): Observable<Topic> {
    return this.http.post<{ success: boolean; topic: Topic }>(`${this.apiUrl}/admin/subjects/${subject_id}/topics`, topic).pipe(
      map(res => res.topic)
    );
  }

  updateTopic(subject_id: string, id: string, updates: Partial<Topic>): Observable<Topic> {
    return this.http.put<{ success: boolean; topic: Topic }>(`${this.apiUrl}/admin/subjects/${subject_id}/topics/${id}`, updates).pipe(
      map(res => res.topic)
    );
  }

  deleteTopic(subject_id: string, id: string): Observable<void> {
    return this.http.delete<{ success: boolean }>(`${this.apiUrl}/admin/subjects/${subject_id}/topics/${id}`).pipe(
      map(() => void 0)
    );
  }
}

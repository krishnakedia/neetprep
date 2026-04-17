import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Question } from '../models/models';

export interface Bookmark {
  id: string;
  userId: string;
  questionId: string;
  question?: Question;
}

@Injectable({
  providedIn: 'root'
})
export class BookmarkService {
  private http = inject(HttpClient);
  private apiUrl = 'http://127.0.0.1:8000/api';

  getBookmarks(): Observable<Bookmark[]> {
    return this.http.get<{ success: boolean; bookmarks: Bookmark[] }>(`${this.apiUrl}/bookmarks`).pipe(
      map(res => res.bookmarks || [])
    );
  }

  toggleBookmark(questionId: string): Observable<boolean> {
    return this.http.post<{ success: boolean; message: string }>(`${this.apiUrl}/bookmarks`, { question_id: questionId }).pipe(
      map(res => res.success)
    );
  }

  removeBookmark(questionId: string): Observable<void> {
    return this.http.delete<{ success: boolean }>(`${this.apiUrl}/bookmarks/${questionId}`).pipe(
      map(() => void 0)
    );
  }

  checkBookmark(questionId: string): Observable<boolean> {
    return this.http.get<{ success: boolean; bookmarked: boolean }>(`${this.apiUrl}/bookmarks/check/${questionId}`).pipe(
      map(res => res.bookmarked)
    );
  }
}

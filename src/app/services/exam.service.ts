import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Exam, Question, ExamAttempt, ExamAnswer, PerformanceStats, User } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class ExamService {
  private http = inject(HttpClient);
  private apiUrl = 'http://127.0.0.1:8000/api';

  private examsSubject = new BehaviorSubject<Exam[]>([]);
  exams$ = this.examsSubject.asObservable();

  getExams(): Observable<Exam[]> {
    return this.http.get<{ success: boolean; exams: Exam[] }>(`${this.apiUrl}/exams`).pipe(
      map(res => {
        this.examsSubject.next(res.exams || []);
        return res.exams || [];
      })
    );
  }

  getActiveExams(): Observable<Exam[]> {
    return this.http.get<{ success: boolean; exams: Exam[] }>(`${this.apiUrl}/exams/active`).pipe(
      map(res => res.exams || [])
    );
  }

  getExamById(id: string): Observable<Exam | null> {
    return this.http.get<{ success: boolean; exam: Exam }>(`${this.apiUrl}/exams/${id}`).pipe(
      map(res => res.exam || null)
    );
  }

  getExamsBySubject(subject_id: string): Observable<Exam[]> {
    return this.http.get<{ success: boolean; exams: Exam[] }>(`${this.apiUrl}/exams/subject/${subject_id}`).pipe(
      map(res => res.exams || [])
    );
  }

  createExam(exam: Partial<Exam>): Observable<Exam> {
    return this.http.post<{ success: boolean; exam: Exam }>(`${this.apiUrl}/admin/exams`, exam).pipe(
      map(res => res.exam)
    );
  }

  updateExam(id: string, updates: Partial<Exam>): Observable<Exam> {
    return this.http.put<{ success: boolean; exam: Exam }>(`${this.apiUrl}/admin/exams/${id}`, updates).pipe(
      map(res => res.exam)
    );
  }

  toggleExamStatus(id: string): Observable<Exam> {
    return this.http.patch<{ success: boolean; exam: Exam }>(`${this.apiUrl}/admin/exams/${id}/toggle-status`, {}).pipe(
      map(res => res.exam)
    );
  }

  deleteExam(id: string): Observable<void> {
    return this.http.delete<{ success: boolean }>(`${this.apiUrl}/admin/exams/${id}`).pipe(
      map(() => void 0)
    );
  }

  getQuestionsByExam(examId: string): Observable<Question[]> {
    return this.http.get<{ success: boolean; questions: Question[] }>(`${this.apiUrl}/exams/${examId}/questions`).pipe(
      map(res => res.questions || [])
    );
  }

  createQuestion(examId: string, question: Partial<Question>): Observable<Question> {
    return this.http.post<{ success: boolean; question: Question }>(`${this.apiUrl}/admin/exams/${examId}/questions`, question).pipe(
      map(res => res.question)
    );
  }

  updateQuestion(id: string, examId: string, updates: Partial<Question>): Observable<Question> {
    return this.http.put<{ success: boolean; question: Question }>(`${this.apiUrl}/admin/exams/${examId}/questions/${id}`, updates).pipe(
      map(res => res.question)
    );
  }

  deleteQuestion(id: string, examId: string): Observable<void> {
    return this.http.delete<{ success: boolean }>(`${this.apiUrl}/admin/exams/${examId}/questions/${id}`).pipe(
      map(() => void 0)
    );
  }

  getAllQuestions(filters?: {
    subject_id?: string;
    chapter_id?: string;
    ncert?: string;
    difficulty?: string;
    year?: string;
    question_type?: string;
    per_page?: number;
  }): Observable<{ data: Question[]; current_page: number; last_page: number }> {
    let params = new HttpParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          params = params.set(key, value);
        }
      });
    }
    return this.http.get<any>(`${this.apiUrl}/questions`, { params }).pipe(
      map(res => ({
        data: res.questions?.data || res.questions || [],
        current_page: res.questions?.current_page || 1,
        last_page: res.questions?.last_page || 1
      }))
    );
  }

  startExam(examId: string): Observable<ExamAttempt> {
    return this.http.post<{ success: boolean; attempt: ExamAttempt }>(`${this.apiUrl}/exam-attempts/start`, { exam_id: examId }).pipe(
      map(res => res.attempt)
    );
  }

  submitExam(attemptId: string, answers: ExamAnswer[], notes?: string): Observable<ExamAttempt> {
    return this.http.post<{ success: boolean; attempt: ExamAttempt }>(`${this.apiUrl}/exam-attempts/${attemptId}/submit`, { answers, notes }).pipe(
      map(res => res.attempt)
    );
  }

  getUserAttempts(): Observable<ExamAttempt[]> {
    return this.http.get<{ success: boolean; attempts: ExamAttempt[] }>(`${this.apiUrl}/exam-attempts/my`).pipe(
      map(res => res.attempts || [])
    );
  }

  getUserAttemptsById(userId: string): Observable<ExamAttempt[]> {
    return this.http.get<{ success: boolean; attempts: ExamAttempt[] }>(`${this.apiUrl}/admin/performance/student/${userId}`).pipe(
      map(res => res.attempts || [])
    );
  }

  getUserPerformance(): Observable<PerformanceStats> {
    return this.http.get<{ success: boolean; stats: PerformanceStats }>(`${this.apiUrl}/exam-attempts/my/performance`).pipe(
      map(res => res.stats)
    );
  }

  getAttemptById(attemptId: string): Observable<ExamAttempt> {
    return this.http.get<{ success: boolean; attempt: ExamAttempt }>(`${this.apiUrl}/exam-attempts/${attemptId}`).pipe(
      map(res => res.attempt)
    );
  }

  getAllAttempts(): Observable<ExamAttempt[]> {
    return this.http.get<{ success: boolean; attempts: ExamAttempt[] }>(`${this.apiUrl}/admin/performance`).pipe(
      map(res => res.attempts || [])
    );
  }

  getStudentPerformance(userId: string): Observable<{ attempts: ExamAttempt[]; notes: string[] }> {
    return this.http.get<{ success: boolean; attempts: ExamAttempt[]; notes: string[] }>(`${this.apiUrl}/admin/performance/student/${userId}`).pipe(
      map(res => ({ attempts: res.attempts || [], notes: res.notes || [] }))
    );
  }

  getAssignedUsers(examId: string): Observable<User[]> {
    return this.http.get<{ success: boolean; users: User[] }>(`${this.apiUrl}/admin/exams/${examId}/users`).pipe(
      map(res => res.users || [])
    );
  }

  assignUsers(examId: string, userIds: string[]): Observable<User[]> {
    return this.http.post<{ success: boolean; users: User[] }>(`${this.apiUrl}/admin/exams/${examId}/users`, { user_ids: userIds }).pipe(
      map(res => res.users || [])
    );
  }

  removeUserFromExam(examId: string, userId: string): Observable<void> {
    return this.http.delete<{ success: boolean }>(`${this.apiUrl}/admin/exams/${examId}/users`, {
      body: { user_id: userId }
    }).pipe(
      map(() => void 0)
    );
  }

  getMyAssignedExams(): Observable<Exam[]> {
    return this.http.get<{ success: boolean; exams: Exam[] }>(`${this.apiUrl}/exams/assigned/my`).pipe(
      map(res => res.exams || [])
    );
  }
}

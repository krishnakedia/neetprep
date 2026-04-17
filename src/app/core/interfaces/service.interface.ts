import { Observable } from 'rxjs';
import { User } from '../../models/models';

export interface IAuthService {
  currentUser$: Observable<User | null>;
  login(email: string, password: string): any;
  logout(): void;
  getCurrentUser(): User | null;
  getToken(): string | null;
  isLoggedIn(): boolean;
  isAdmin(): boolean;
  getHttpOptions(): any;
}

export interface IExamService {
  getExams(): any;
  getActiveExams(): any;
  getExamById(id: string): any;
  getExamsBySubject(subjectId: string): any;
  createExam(exam: any): any;
  updateExam(id: string, updates: any): any;
  toggleExamStatus(id: string): any;
  deleteExam(id: string): any;
  getQuestionsByExam(examId: string): any;
  createQuestion(examId: string, question: any): any;
  updateQuestion(id: string, examId: string, updates: any): any;
  deleteQuestion(id: string, examId: string): any;
  getAllQuestions(filters?: any): any;
  startExam(examId: string): any;
  submitExam(attemptId: string, answers: any, notes?: string): any;
  getUserAttempts(): any;
  getUserAttemptsById(userId: string): any;
  getUserPerformance(): any;
  getAttemptById(attemptId: string): any;
  getAllAttempts(): any;
  getStudentPerformance(userId: string): any;
}

export interface ISubjectService {
  getSubjects(): any;
  getSubjectById(id: string): any;
  createSubject(subject: any): any;
  updateSubject(id: string, updates: any): any;
  deleteSubject(id: string): any;
  toggleSubjectStatus(id: string): any;
  getChaptersBySubject(subjectId: string): any;
  getTopicsBySubject(subjectId: string): any;
  getTopicsByChapter(chapterId: string): any;
}

export interface IBookmarkService {
  getBookmarks(): any;
  addBookmark(questionId: string): any;
  removeBookmark(questionId: string): any;
  isBookmarked(questionId: string): boolean;
}

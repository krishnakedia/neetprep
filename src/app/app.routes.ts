import { Routes } from '@angular/router';
import { AuthGuard, AdminGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/questions', pathMatch: 'full' },
  { path: '/', loadComponent: () => import('./components/public/home/home.component').then(m => m.PublicHomeComponent) },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'questions',
    loadComponent: () => import('./components/public/home/home.component').then(m => m.PublicHomeComponent)
  },
  {
    path: 'admin',
    canActivate: [AuthGuard, AdminGuard],
    loadComponent: () => import('./components/admin/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
  },
  {
    path: 'admin/public-questions',
    canActivate: [AuthGuard, AdminGuard],
    loadComponent: () => import('./components/admin/public-questions/public-questions.component').then(m => m.PublicQuestionsComponent)
  },
  {
    path: 'admin/users',
    canActivate: [AuthGuard, AdminGuard],
    loadComponent: () => import('./components/admin/user-management/user-management.component').then(m => m.UserManagementComponent)
  },
  {
    path: 'admin/subjects',
    canActivate: [AuthGuard, AdminGuard],
    loadComponent: () => import('./components/admin/subject-management/subject-management.component').then(m => m.SubjectManagementComponent)
  },
  {
    path: 'admin/exams',
    canActivate: [AuthGuard, AdminGuard],
    loadComponent: () => import('./components/admin/exam-management/exam-management.component').then(m => m.ExamManagementComponent)
  },
  {
    path: 'admin/exams/:examId/users',
    canActivate: [AuthGuard, AdminGuard],
    loadComponent: () => import('./components/admin/exam-assign-users/exam-assign-users.component').then(m => m.ExamAssignUsersComponent)
  },
  {
    path: 'admin/questions/:examId',
    canActivate: [AuthGuard, AdminGuard],
    loadComponent: () => import('./components/admin/question-management/question-management.component').then(m => m.QuestionManagementComponent)
  },
  {
    path: 'admin/performance',
    canActivate: [AuthGuard, AdminGuard],
    loadComponent: () => import('./components/admin/student-performance/student-performance.component').then(m => m.StudentPerformanceComponent)
  },
  {
    path: 'admin/student/:userId',
    canActivate: [AuthGuard, AdminGuard],
    loadComponent: () => import('./components/admin/student-details/student-details.component').then(m => m.StudentDetailsComponent)
  },
  {
    path: 'user',
    canActivate: [AuthGuard],
    loadComponent: () => import('./components/user/user-dashboard/user-dashboard.component').then(m => m.UserDashboardComponent)
  },
  {
    path: 'user/questions',
    canActivate: [AuthGuard],
    loadComponent: () => import('./components/user/questions/questions.component').then(m => m.QuestionsPageComponent)
  },
  {
    path: 'user/exam/:examId',
    canActivate: [AuthGuard],
    loadComponent: () => import('./components/user/exam/exam.component').then(m => m.ExamComponent)
  },
  {
    path: 'user/result/:attemptId',
    canActivate: [AuthGuard],
    loadComponent: () => import('./components/user/exam-result/exam-result.component').then(m => m.ExamResultComponent)
  },
  {
    path: '**', redirectTo: '/login' }
];

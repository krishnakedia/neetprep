<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BookmarkController;
use App\Http\Controllers\Api\ChapterController;
use App\Http\Controllers\Api\ExamAttemptController;
use App\Http\Controllers\Api\ExamController;
use App\Http\Controllers\Api\QuestionController;
use App\Http\Controllers\Api\PublicQuestionController;
use App\Http\Controllers\Api\SubjectController;
use App\Http\Controllers\Api\TopicController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::get('/', [AuthController::class, 'demo']);
Route::get('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/register', [AuthController::class, 'register']);

// Public Questions - accessible to all
Route::get('/public-questions', [PublicQuestionController::class, 'index']);
Route::get('/public-questions/{id}', [PublicQuestionController::class, 'show']);
Route::post('/public-questions', [PublicQuestionController::class, 'store']);
Route::put('/public-questions/{id}', [PublicQuestionController::class, 'update']);

// Subjects - public access
Route::get('/subjects', [SubjectController::class, 'index']);
Route::get('/subjects/active', [SubjectController::class, 'active']);
Route::get('/subjects/{id}', [SubjectController::class, 'show']);

// Chapters - public access
Route::get('/chapters', [ChapterController::class, 'all']);
Route::get('/subjects/{subjectId}/chapters', [ChapterController::class, 'index']);
Route::get('/chapters/{id}', [ChapterController::class, 'show']);

// Topics - public access
Route::get('/subjects/{subjectId}/topics', [TopicController::class, 'index']);
Route::get('/subjects/{subjectId}/topics/{id}', [TopicController::class, 'show']);
Route::get('/chapters/{chapterId}/topics', [TopicController::class, 'byChapter']);

// Protected routes
Route::middleware('auth:api')->group(function () {
    // Auth
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/refresh', [AuthController::class, 'refresh']);

    // Subjects (public access)
    Route::get('/subjects', [SubjectController::class, 'index']);
    Route::get('/subjects/active', [SubjectController::class, 'active']);
    Route::get('/subjects/{id}', [SubjectController::class, 'show']);

    // Chapters
    Route::get('/chapters', [ChapterController::class, 'all']);
    Route::get('/subjects/{subjectId}/chapters', [ChapterController::class, 'index']);
    Route::get('/chapters/{id}', [ChapterController::class, 'show']);

    // Topics (public access)
    Route::get('/subjects/{subjectId}/topics', [TopicController::class, 'index']);
    Route::get('/subjects/{subjectId}/topics/{id}', [TopicController::class, 'show']);

    // Exams (public access)
    Route::get('/exams', [ExamController::class, 'index']);
    Route::get('/exams/active', [ExamController::class, 'active']);
    Route::get('/exams/subject/{subjectId}', [ExamController::class, 'bySubject']);
    Route::get('/exams/{id}', [ExamController::class, 'show']);
    Route::get('/exams/assigned/my', [ExamController::class, 'myAssignedExams']);

    // Questions (public access - but admin can manage)
    Route::get('/exams/{examId}/questions', [QuestionController::class, 'index']);
    Route::get('/exams/{examId}/questions/{id}', [QuestionController::class, 'show']);
    Route::get('/questions', [QuestionController::class, 'all']);

    // Exam Attempts (user)
    Route::post('/exam-attempts/start', [ExamAttemptController::class, 'start']);
    Route::post('/exam-attempts/{attemptId}/submit', [ExamAttemptController::class, 'submit']);
    Route::get('/exam-attempts/{attemptId}', [ExamAttemptController::class, 'show']);
    Route::get('/exam-attempts/my', [ExamAttemptController::class, 'userAttempts']);
    Route::get('/exam-attempts/my/performance', [ExamAttemptController::class, 'userPerformance']);

    // Bookmarks (user)
    Route::get('/bookmarks', [BookmarkController::class, 'index']);
    Route::post('/bookmarks', [BookmarkController::class, 'store']);
    Route::delete('/bookmarks/{questionId}', [BookmarkController::class, 'destroy']);
    Route::get('/bookmarks/check/{questionId}', [BookmarkController::class, 'check']);

    // Admin only routes
    Route::middleware('role:admin')->group(function () {
        // Users
        Route::get('/admin/users', [UserController::class, 'index']);
        Route::post('/admin/users', [UserController::class, 'store']);
        Route::get('/admin/users/{id}', [UserController::class, 'show']);
        Route::put('/admin/users/{id}', [UserController::class, 'update']);
        Route::patch('/admin/users/{id}/toggle-status', [UserController::class, 'toggleStatus']);
        Route::delete('/admin/users/{id}', [UserController::class, 'destroy']);
        Route::put('/admin/users/{id}/notes', [UserController::class, 'updateNotes']);

        // Subjects management
        Route::post('/admin/subjects', [SubjectController::class, 'store']);
        Route::put('/admin/subjects/{id}', [SubjectController::class, 'update']);
        Route::patch('/admin/subjects/{id}/toggle-status', [SubjectController::class, 'toggleStatus']);
        Route::delete('/admin/subjects/{id}', [SubjectController::class, 'destroy']);

        // Chapters management
        Route::post('/admin/subjects/{subjectId}/chapters', [ChapterController::class, 'store']);
        Route::put('/admin/chapters/{id}', [ChapterController::class, 'update']);
        Route::patch('/admin/chapters/{id}/toggle-status', [ChapterController::class, 'toggleStatus']);
        Route::delete('/admin/chapters/{id}', [ChapterController::class, 'destroy']);

        // Topics management
        Route::post('/admin/subjects/{subjectId}/topics', [TopicController::class, 'store']);
        Route::put('/admin/subjects/{subjectId}/topics/{id}', [TopicController::class, 'update']);
        Route::delete('/admin/subjects/{subjectId}/topics/{id}', [TopicController::class, 'destroy']);

        // Exams management
        Route::post('/admin/exams', [ExamController::class, 'store']);
        Route::put('/admin/exams/{id}', [ExamController::class, 'update']);
        Route::patch('/admin/exams/{id}/toggle-status', [ExamController::class, 'toggleStatus']);
        Route::delete('/admin/exams/{id}', [ExamController::class, 'destroy']);
        Route::get('/admin/exams/{id}/users', [ExamController::class, 'getAssignedUsers']);
        Route::post('/admin/exams/{id}/users', [ExamController::class, 'assignUsers']);
        Route::delete('/admin/exams/{id}/users', [ExamController::class, 'removeUser']);

        // Questions management
        Route::post('/admin/exams/{examId}/questions', [QuestionController::class, 'store']);
        Route::put('/admin/exams/{examId}/questions/{id}', [QuestionController::class, 'update']);
        Route::delete('/admin/exams/{examId}/questions/{id}', [QuestionController::class, 'destroy']);

        // Performance
        Route::get('/admin/performance', [ExamAttemptController::class, 'allAttempts']);
        Route::get('/admin/performance/student/{userId}', [ExamAttemptController::class, 'studentPerformance']);

        // Public Questions management
        Route::post('/admin/public-questions', [PublicQuestionController::class, 'store']);
        Route::put('/admin/public-questions/{id}', [PublicQuestionController::class, 'update']);
        Route::delete('/admin/public-questions/{id}', [PublicQuestionController::class, 'destroy']);
        Route::post('/admin/public-questions/{id}/toggle', [PublicQuestionController::class, 'toggleStatus']);
    });
});

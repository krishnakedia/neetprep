<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Exam;
use App\Models\ExamAttempt;
use App\Models\ExamAnswer;
use App\Models\Question;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class ExamAttemptController extends Controller
{
    public function start(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'exam_id' => 'required|exists:exams,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $exam = Exam::with('questions')->find($request->exam_id);

        if (!$exam->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'Exam is not active'
            ], 403);
        }

        $user = auth('api')->user();

        $existingAttempt = ExamAttempt::where('user_id', $user->id)
            ->where('exam_id', $request->exam_id)
            ->where('status', 'in-progress')
            ->first();

        if ($existingAttempt) {
            return response()->json([
                'success' => true,
                'message' => 'Existing exam attempt found',
                'attempt' => $existingAttempt
            ]);
        }

        $attempt = ExamAttempt::create([
            'user_id' => $user->id,
            'exam_id' => $request->exam_id,
            'started_at' => now(),
            'total_marks' => $exam->total_marks,
            'status' => 'in-progress'
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Exam started successfully',
            'attempt' => $attempt
        ], 201);
    }

    public function submit(Request $request, string $attemptId): JsonResponse
    {
        $attempt = ExamAttempt::find($attemptId);

        if (!$attempt) {
            return response()->json([
                'success' => false,
                'message' => 'Exam attempt not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'answers' => 'required|array',
            'answers.*.question_id' => 'required|exists:questions,id',
            'answers.*.selected_answer' => 'nullable|in:A,B,C,D',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        return DB::transaction(function () use ($attempt, $request) {
            $questions = Question::where('exam_id', $attempt->exam_id)->get();
            $totalScore = 0;

            ExamAnswer::where('exam_attempt_id', $attempt->id)->delete();

            foreach ($request->answers as $answerData) {
                $question = $questions->find($answerData['question_id']);
                
                if (!$question) continue;

                $selectedAnswer = $answerData['selected_answer'] ?? null;
                $isCorrect = $selectedAnswer === $question->correct_answer;
                $marksObtained = $isCorrect ? $question->marks : 0;

                if ($isCorrect) {
                    $totalScore += $marksObtained;
                }

                ExamAnswer::create([
                    'exam_attempt_id' => $attempt->id,
                    'question_id' => $question->id,
                    'selected_answer' => $selectedAnswer,
                    'is_correct' => $isCorrect,
                    'marks_obtained' => $marksObtained
                ]);
            }

            $percentage = $attempt->total_marks > 0 
                ? round(($totalScore / $attempt->total_marks) * 100) 
                : 0;

            $attempt->update([
                'completed_at' => now(),
                'score' => $totalScore,
                'percentage' => $percentage,
                'status' => 'completed',
                'notes' => $request->notes ?? $attempt->notes
            ]);

            $attempt->load('answers');

            return response()->json([
                'success' => true,
                'message' => 'Exam submitted successfully',
                'attempt' => $attempt
            ]);
        });
    }

    public function show(string $attemptId): JsonResponse
    {
        $attempt = ExamAttempt::with(['exam', 'answers.question'])->find($attemptId);

        if (!$attempt) {
            return response()->json([
                'success' => false,
                'message' => 'Exam attempt not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'attempt' => $attempt
        ]);
    }

    public function userAttempts(): JsonResponse
    {
        $user = auth('api')->user();
        
        $attempts = ExamAttempt::with('exam')
            ->where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'attempts' => $attempts
        ]);
    }

    public function allAttempts(): JsonResponse
    {
        $attempts = ExamAttempt::with(['user', 'exam'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'attempts' => $attempts
        ]);
    }

    public function userPerformance(): JsonResponse
    {
        $user = auth('api')->user();

        $attempts = ExamAttempt::where('user_id', $user->id)
            ->where('status', 'completed')
            ->get();

        $totalExamsTaken = $attempts->count();
        $totalScore = $attempts->sum('score');
        $averagePercentage = $totalExamsTaken > 0 ? round($attempts->avg('percentage')) : 0;
        $highestScore = $totalExamsTaken > 0 ? $attempts->max('percentage') : 0;
        $lowestScore = $totalExamsTaken > 0 ? $attempts->min('percentage') : 0;

        $recentAttempts = ExamAttempt::with('exam')
            ->where('user_id', $user->id)
            ->where('status', 'completed')
            ->orderBy('completed_at', 'desc')
            ->limit(5)
            ->get();

        return response()->json([
            'success' => true,
            'stats' => [
                'total_exams_taken' => $totalExamsTaken,
                'total_score' => $totalScore,
                'average_percentage' => $averagePercentage,
                'highest_score' => $highestScore,
                'lowest_score' => $lowestScore,
                'recent_attempts' => $recentAttempts
            ]
        ]);
    }

    public function studentPerformance(string $userId): JsonResponse
    {
        $attempts = ExamAttempt::where('user_id', $userId)
            ->where('status', 'completed')
            ->get();

        $totalExamsTaken = $attempts->count();
        $totalScore = $attempts->sum('score');
        $averagePercentage = $totalExamsTaken > 0 ? round($attempts->avg('percentage')) : 0;
        $highestScore = $totalExamsTaken > 0 ? $attempts->max('percentage') : 0;
        $lowestScore = $totalExamsTaken > 0 ? $attempts->min('percentage') : 0;

        return response()->json([
            'success' => true,
            'stats' => [
                'total_exams_taken' => $totalExamsTaken,
                'total_score' => $totalScore,
                'average_percentage' => $averagePercentage,
                'highest_score' => $highestScore,
                'lowest_score' => $lowestScore
            ],
            'attempts' => $attempts
        ]);
    }
}

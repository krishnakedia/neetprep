<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Exam;
use App\Models\ExamAttempt;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ExamController extends Controller
{
    public function index(): JsonResponse
    {
        $exams = Exam::with(['subject', 'questions', 'topics'])->get();

        return response()->json([
            'success' => true,
            'exams' => $exams
        ]);
    }

    public function active(): JsonResponse
    {
        $user = auth('api')->user();
        $exams = Exam::with(['subject', 'questions'])
            ->join('exam_user', 'exams.id','=','exam_user.exam_id')
            ->where('exams.is_active', true)
            ->where('exam_user.user_id', $user->id)
            ->get();

        return response()->json([
            'success' => true,
            'exams' => $exams
        ]);
    }

    public function bySubject(string $subjectId): JsonResponse
    {
        $exams = Exam::with(['questions'])
            ->where('subject_id', $subjectId)
            ->get();

        return response()->json([
            'success' => true,
            'exams' => $exams
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'subject_id' => 'required|exists:subjects,id',
            'chapter_id' => 'nullable|exists:chapters,id',
            'topic_ids' => 'nullable|array',
            'topic_ids.*' => 'exists:topics,id',
            'duration' => 'required|integer|min:5|max:180',
            'total_marks' => 'required|integer|min:10',
            'passing_marks' => 'required|integer|min:1|lte:total_marks',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $exam = Exam::create([
            'title' => $request->title,
            'description' => $request->description,
            'subject_id' => $request->subject_id,
            'chapter_id' => $request->chapter_id,
            'duration' => $request->duration,
            'total_marks' => $request->total_marks,
            'passing_marks' => $request->passing_marks,
            'is_active' => false
        ]);

        if ($request->has('topic_ids')) {
            $exam->topics()->attach($request->topic_ids);
        }

        $exam->load(['subject', 'questions', 'topics']);

        return response()->json([
            'success' => true,
            'message' => 'Exam created successfully',
            'exam' => $exam
        ], 201);
    }

    public function show(string $id): JsonResponse
    {
        $exam = Exam::with(['subject', 'questions', 'topics'])->find($id);

        if (!$exam) {
            return response()->json([
                'success' => false,
                'message' => 'Exam not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'exam' => $exam
        ]);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $exam = Exam::find($id);

        if (!$exam) {
            return response()->json([
                'success' => false,
                'message' => 'Exam not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'subject_id' => 'sometimes|exists:subjects,id',
            'topic_ids' => 'nullable|array',
            'topic_ids.*' => 'exists:topics,id',
            'duration' => 'sometimes|integer|min:5|max:180',
            'total_marks' => 'sometimes|integer|min:10',
            'passing_marks' => 'sometimes|integer|min:1',
            'is_active' => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $exam->update($request->only([
            'title', 'description', 'subject_id', 'duration', 'total_marks', 'passing_marks', 'is_active'
        ]));

        if ($request->has('topic_ids')) {
            $exam->topics()->sync($request->topic_ids);
        }

        $exam->load(['subject', 'questions', 'topics']);

        return response()->json([
            'success' => true,
            'message' => 'Exam updated successfully',
            'exam' => $exam
        ]);
    }

    public function toggleStatus(string $id): JsonResponse
    {
        $exam = Exam::find($id);

        if (!$exam) {
            return response()->json([
                'success' => false,
                'message' => 'Exam not found'
            ], 404);
        }

        $exam->update(['is_active' => !$exam->is_active]);

        return response()->json([
            'success' => true,
            'message' => 'Exam status updated successfully',
            'exam' => $exam
        ]);
    }

    public function destroy(string $id): JsonResponse
    {
        $exam = Exam::find($id);

        if (!$exam) {
            return response()->json([
                'success' => false,
                'message' => 'Exam not found'
            ], 404);
        }

        $exam->delete();

        return response()->json([
            'success' => true,
            'message' => 'Exam deleted successfully'
        ]);
    }

    public function getAssignedUsers(string $id): JsonResponse
    {
        $exam = Exam::find($id);

        if (!$exam) {
            return response()->json([
                'success' => false,
                'message' => 'Exam not found'
            ], 404);
        }

        $users = $exam->assignedUsers()
            ->select('users.id', 'users.name', 'users.email', 'users.role', 'users.is_active', 'exam_user.is_assigned', 'exam_user.assigned_at')
            ->get();

        return response()->json([
            'success' => true,
            'users' => $users
        ]);
    }

    public function assignUsers(Request $request, string $id): JsonResponse
    {
        $exam = Exam::find($id);

        if (!$exam) {
            return response()->json([
                'success' => false,
                'message' => 'Exam not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'user_ids' => 'required|array',
            'user_ids.*' => 'exists:users,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $syncData = [];
        foreach ($request->user_ids as $userId) {
            $syncData[$userId] = ['is_assigned' => true, 'assigned_at' => now()];
        }
        $exam->assignedUsers()->syncWithoutDetaching($syncData);

        $users = $exam->assignedUsers()
            ->select('users.id', 'users.name', 'users.email', 'users.role', 'users.is_active', 'exam_user.is_assigned', 'exam_user.assigned_at')
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Users assigned successfully',
            'users' => $users
        ]);
    }

public function removeUser(Request $request, string $id): JsonResponse
    {
        $exam = Exam::findOrFail($id);
        $userId = $request->input('user_id');

        $exam->assignedUsers()->detach($userId);

        return response()->json([
            'success' => true,
            'message' => 'User removed from exam'
        ]);
    }

    public function myAssignedExams(): JsonResponse
    {
        $user = auth()->user();
        $exams = $user->assignedExams()
            ->with(['subject', 'questions'])
            ->where('is_active', true)
            ->get();

        return response()->json([
            'success' => true,
            'exams' => $exams
        ]);
    }
}

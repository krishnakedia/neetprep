<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Subject;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SubjectController extends Controller
{
    public function index(): JsonResponse
    {
        $subjects = Subject::with(['chapters', 'topics'])->get();

        return response()->json([
            'success' => true,
            'subjects' => $subjects
        ]);
    }

    public function active(): JsonResponse
    {
        $subjects = Subject::with(['chapters', 'topics'])->where('is_active', true)->get();

        return response()->json([
            'success' => true,
            'subjects' => $subjects
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'icon' => 'nullable|string|max:50',
            'color' => 'nullable|string|max:20',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $subject = Subject::create([
            'name' => $request->name,
            'description' => $request->description,
            'icon' => $request->icon ?? 'fa-book',
            'color' => $request->color ?? '#4f46e5',
            'is_active' => true
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Subject created successfully',
            'subject' => $subject
        ], 201);
    }

    public function show(string $id): JsonResponse
    {
        $subject = Subject::with('topics')->find($id);

        if (!$subject) {
            return response()->json([
                'success' => false,
                'message' => 'Subject not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'subject' => $subject
        ]);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $subject = Subject::find($id);

        if (!$subject) {
            return response()->json([
                'success' => false,
                'message' => 'Subject not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'icon' => 'nullable|string|max:50',
            'color' => 'nullable|string|max:20',
            'is_active' => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $subject->update($request->only(['name', 'description', 'icon', 'color', 'is_active']));

        return response()->json([
            'success' => true,
            'message' => 'Subject updated successfully',
            'subject' => $subject
        ]);
    }

    public function toggleStatus(string $id): JsonResponse
    {
        $subject = Subject::find($id);

        if (!$subject) {
            return response()->json([
                'success' => false,
                'message' => 'Subject not found'
            ], 404);
        }

        $subject->update(['is_active' => !$subject->is_active]);

        return response()->json([
            'success' => true,
            'message' => 'Subject status updated successfully',
            'subject' => $subject
        ]);
    }

    public function destroy(string $id): JsonResponse
    {
        $subject = Subject::find($id);

        if (!$subject) {
            return response()->json([
                'success' => false,
                'message' => 'Subject not found'
            ], 404);
        }

        $subject->delete();

        return response()->json([
            'success' => true,
            'message' => 'Subject deleted successfully'
        ]);
    }
}

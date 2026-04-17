<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Chapter;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ChapterController extends Controller
{
    public function index(string $subjectId): JsonResponse
    {
        $chapters = Chapter::with('topics')
            ->where('subject_id', $subjectId)
            ->orderBy('order')
            ->get();

        return response()->json([
            'success' => true,
            'chapters' => $chapters
        ]);
    }

    public function all(): JsonResponse
    {
        $chapters = Chapter::with(['subject', 'topics'])->orderBy('order')->get();

        return response()->json([
            'success' => true,
            'chapters' => $chapters
        ]);
    }

    public function store(Request $request, string $subjectId): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'order' => 'nullable|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $chapter = Chapter::create([
            'subject_id' => $subjectId,
            'name' => $request->name,
            'description' => $request->description,
            'order' => $request->order ?? 0,
            'is_active' => true
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Chapter created successfully',
            'chapter' => $chapter
        ], 201);
    }

    public function show(string $id): JsonResponse
    {
        $chapter = Chapter::with('topics')->find($id);

        if (!$chapter) {
            return response()->json([
                'success' => false,
                'message' => 'Chapter not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'chapter' => $chapter
        ]);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $chapter = Chapter::find($id);

        if (!$chapter) {
            return response()->json([
                'success' => false,
                'message' => 'Chapter not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'order' => 'sometimes|integer|min:0',
            'is_active' => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $chapter->update($request->only(['name', 'description', 'order', 'is_active']));

        return response()->json([
            'success' => true,
            'message' => 'Chapter updated successfully',
            'chapter' => $chapter
        ]);
    }

    public function toggleStatus(string $id): JsonResponse
    {
        $chapter = Chapter::find($id);

        if (!$chapter) {
            return response()->json([
                'success' => false,
                'message' => 'Chapter not found'
            ], 404);
        }

        $chapter->update(['is_active' => !$chapter->is_active]);

        return response()->json([
            'success' => true,
            'message' => 'Chapter status updated successfully',
            'chapter' => $chapter
        ]);
    }

    public function destroy(string $id): JsonResponse
    {
        $chapter = Chapter::find($id);

        if (!$chapter) {
            return response()->json([
                'success' => false,
                'message' => 'Chapter not found'
            ], 404);
        }

        $chapter->delete();

        return response()->json([
            'success' => true,
            'message' => 'Chapter deleted successfully'
        ]);
    }
}
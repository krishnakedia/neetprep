<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Topic;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TopicController extends Controller
{
    public function index(string $subjectId): JsonResponse
    {
        $topics = Topic::where('subject_id', $subjectId)->get();

        return response()->json([
            'success' => true,
            'topics' => $topics
        ]);
    }

    public function store(Request $request, string $subjectId): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $topic = Topic::create([
            'subject_id' => $subjectId,
            'name' => $request->name,
            'description' => $request->description,
            'is_active' => true
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Topic created successfully',
            'topic' => $topic
        ], 201);
    }

    public function show(string $subjectId, string $id): JsonResponse
    {
        $topic = Topic::where('subject_id', $subjectId)->find($id);

        if (!$topic) {
            return response()->json([
                'success' => false,
                'message' => 'Topic not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'topic' => $topic
        ]);
    }

    public function update(Request $request, string $subjectId, string $id): JsonResponse
    {
        $topic = Topic::where('subject_id', $subjectId)->find($id);

        if (!$topic) {
            return response()->json([
                'success' => false,
                'message' => 'Topic not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'is_active' => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $topic->update($request->only(['name', 'description', 'is_active']));

        return response()->json([
            'success' => true,
            'message' => 'Topic updated successfully',
            'topic' => $topic
        ]);
    }

    public function destroy(string $subjectId, string $id): JsonResponse
    {
        $topic = Topic::where('subject_id', $subjectId)->find($id);

        if (!$topic) {
            return response()->json([
                'success' => false,
                'message' => 'Topic not found'
            ], 404);
        }

        $topic->delete();

        return response()->json([
            'success' => true,
            'message' => 'Topic deleted successfully'
        ]);
    }
}

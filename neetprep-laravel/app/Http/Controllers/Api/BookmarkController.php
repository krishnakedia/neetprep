<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Bookmark;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BookmarkController extends Controller
{
    public function index(): JsonResponse
    {
        $userId = auth('api')->id();
        $bookmarks = Bookmark::with('question.exam')->where('user_id', $userId)->get();

        return response()->json([
            'success' => true,
            'bookmarks' => $bookmarks
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'question_id' => 'required|exists:questions,id'
        ]);

        $userId = auth('api')->id();

        $existing = Bookmark::where('user_id', $userId)
            ->where('question_id', $request->question_id)
            ->first();

        if ($existing) {
            return response()->json([
                'success' => false,
                'message' => 'Question already bookmarked'
            ], 400);
        }

        $bookmark = Bookmark::create([
            'user_id' => $userId,
            'question_id' => $request->question_id
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Question bookmarked successfully',
            'bookmark' => $bookmark
        ], 201);
    }

    public function destroy(string $questionId): JsonResponse
    {
        $userId = auth('api')->id();

        $bookmark = Bookmark::where('user_id', $userId)
            ->where('question_id', $questionId)
            ->first();

        if (!$bookmark) {
            return response()->json([
                'success' => false,
                'message' => 'Bookmark not found'
            ], 404);
        }

        $bookmark->delete();

        return response()->json([
            'success' => true,
            'message' => 'Bookmark removed successfully'
        ]);
    }

    public function check(string $questionId): JsonResponse
    {
        $userId = auth('api')->id();

        $bookmarked = Bookmark::where('user_id', $userId)
            ->where('question_id', $questionId)
            ->exists();

        return response()->json([
            'success' => true,
            'bookmarked' => $bookmarked
        ]);
    }
}
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PublicQuestion;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PublicQuestionController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = PublicQuestion::with(['subject', 'chapter', 'topic'])
            ->where('is_active', true);

        // Filters
        if ($request->subject_id) {
            $query->where('subject_id', $request->subject_id);
        }
        if ($request->chapter_id) {
            $query->where('chapter_id', $request->chapter_id);
        }
        if ($request->topic_id) {
            $query->where('topic_id', $request->topic_id);
        }
        if ($request->ncert) {
            $query->where('ncert', $request->ncert);
        }
        if ($request->difficulty) {
            $query->where('difficulty', $request->difficulty);
        }
        if ($request->year) {
            $query->where('year', $request->year);
        }
        if ($request->question_type) {
            $query->where('question_type', $request->question_type);
        }
        if ($request->search) {
            $query->where(function($q) use ($request) {
                $q->where('question_text', 'like', "%{$request->search}%")
                  ->orWhere('option_a', 'like', "%{$request->search}%")
                  ->orWhere('option_b', 'like', "%{$request->search}%")
                  ->orWhere('option_c', 'like', "%{$request->search}%")
                  ->orWhere('option_d', 'like', "%{$request->search}%");
            });
        }

        $perPage = $request->per_page ?? 12;
        $questions = $query->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $questions->items(),
            'current_page' => $questions->currentPage(),
            'last_page' => $questions->lastPage(),
            'per_page' => $questions->perPage(),
            'total' => $questions->total()
        ]);
    }

    public function show($id): JsonResponse
    {
        $question = PublicQuestion::with(['subject', 'chapter', 'topic'])
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $question
        ]);
    }

    // Admin methods
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'subject_id' => 'required|exists:subjects,id',
            'chapter_id' => 'nullable|exists:chapters,id',
            'topic_id' => 'nullable|exists:topics,id',
            'question_text' => 'required',
            'option_a' => 'required',
            'option_b' => 'required',
            'option_c' => 'required',
            'option_d' => 'required',
            'correct_answer' => 'required|in:A,B,C,D',
            'explanation' => 'nullable',
            'marks' => 'nullable|integer|min:1',
            'ncert' => 'nullable|in:yes,no',
            'difficulty' => 'nullable|in:easy,medium,hard',
            'year' => 'nullable|integer',
            'question_type' => 'nullable|string',
            'is_active' => 'nullable|boolean'
        ]);

        $question = PublicQuestion::create($validated);

        return response()->json([
            'success' => true,
            'data' => $question->load(['subject', 'chapter', 'topic'])
        ], 201);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $question = PublicQuestion::findOrFail($id);

        $validated = $request->validate([
            'subject_id' => 'sometimes|exists:subjects,id',
            'chapter_id' => 'nullable|exists:chapters,id',
            'topic_id' => 'nullable|exists:topics,id',
            'question_text' => 'sometimes',
            'option_a' => 'sometimes',
            'option_b' => 'sometimes',
            'option_c' => 'sometimes',
            'option_d' => 'sometimes',
            'correct_answer' => 'sometimes|in:A,B,C,D',
            'explanation' => 'nullable',
            'marks' => 'nullable|integer|min:1',
            'ncert' => 'nullable|in:yes,no',
            'difficulty' => 'nullable|in:easy,medium,hard',
            'year' => 'nullable|integer',
            'question_type' => 'nullable|string',
            'is_active' => 'nullable|boolean'
        ]);

        $question->update($validated);

        return response()->json([
            'success' => true,
            'data' => $question->load(['subject', 'chapter', 'topic'])
        ]);
    }

    public function destroy($id): JsonResponse
    {
        $question = PublicQuestion::findOrFail($id);
        $question->delete();

        return response()->json([
            'success' => true,
            'message' => 'Question deleted successfully'
        ]);
    }

    public function toggleStatus($id): JsonResponse
    {
        $question = PublicQuestion::findOrFail($id);
        $question->update(['is_active' => !$question->is_active]);

        return response()->json([
            'success' => true,
            'data' => $question
        ]);
    }
}
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Question;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class QuestionController extends Controller
{
    public function index(string $examId): JsonResponse
    {
        $questions = Question::where('exam_id', $examId)->get(['difficulty','exam_id','id','marks','ncert','option_a','option_b','option_c','option_d','question_text','question_type','year']);

        return response()->json([
            'success' => true,
            'questions' => $questions
        ]);
    }

    public function all(Request $request): JsonResponse
    {
        $query = Question::with('exam.subject');

        if ($request->has('subject_id')) {
            $query->whereHas('exam', function ($q) use ($request) {
                $q->where('subject_id', $request->subject_id);
            });
        }

        if ($request->has('chapter_id')) {
            $query->whereHas('exam', function ($q) use ($request) {
                $q->where('chapter_id', $request->chapter_id);
            });
        }

        if ($request->has('difficulty')) {
            $query->where('difficulty', $request->difficulty);
        }

        if ($request->has('year')) {
            $query->where('year', $request->year);
        }

        if ($request->has('question_type')) {
            $query->where('question_type', $request->question_type);
        }

        if ($request->has('ncert')) {
            $query->where('ncert', 'like', '%' . $request->ncert . '%');
        }

        $questions = $query->paginate($request->per_page ?? 20);

        return response()->json([
            'success' => true,
            'questions' => $questions
        ]);
    }

    public function store(Request $request, string $examId): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'question_text' => 'required|string',
            'option_a' => 'required|string|max:500',
            'option_b' => 'required|string|max:500',
            'option_c' => 'required|string|max:500',
            'option_d' => 'required|string|max:500',
            'correct_answer' => 'required|in:A,B,C,D',
            'marks' => 'nullable|integer|min:1|max:10',
            'ncert' => 'nullable|string|max:100',
            'difficulty' => 'nullable|in:easy,medium,hard',
            'year' => 'nullable|integer|min:2000|max:2030',
            'question_type' => 'nullable|in:theory,numerical,diagram,assertion_reason,multiple_correct',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $question = Question::create([
            'exam_id' => $examId,
            'question_text' => $request->question_text,
            'option_a' => $request->option_a,
            'option_b' => $request->option_b,
            'option_c' => $request->option_c,
            'option_d' => $request->option_d,
            'correct_answer' => $request->correct_answer,
            'marks' => $request->marks ?? 5,
            'ncert' => $request->ncert,
            'difficulty' => $request->difficulty ?? 'medium',
            'year' => $request->year,
            'question_type' => $request->question_type ?? 'theory'
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Question created successfully',
            'question' => $question
        ], 201);
    }

    public function show(string $examId, string $id): JsonResponse
    {
        $question = Question::where('exam_id', $examId)->find($id);

        if (!$question) {
            return response()->json([
                'success' => false,
                'message' => 'Question not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'question' => $question
        ]);
    }

    public function update(Request $request, string $examId, string $id): JsonResponse
    {
        $question = Question::where('exam_id', $examId)->find($id);

        if (!$question) {
            return response()->json([
                'success' => false,
                'message' => 'Question not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'question_text' => 'sometimes|string',
            'option_a' => 'sometimes|string|max:500',
            'option_b' => 'sometimes|string|max:500',
            'option_c' => 'sometimes|string|max:500',
            'option_d' => 'sometimes|string|max:500',
            'correct_answer' => 'sometimes|in:A,B,C,D',
            'marks' => 'sometimes|integer|min:1|max:10',
            'ncert' => 'nullable|string|max:100',
            'difficulty' => 'nullable|in:easy,medium,hard',
            'year' => 'nullable|integer|min:2000|max:2030',
            'question_type' => 'nullable|in:theory,numerical,diagram,assertion_reason,multiple_correct',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $question->update($request->only([
            'question_text', 'option_a', 'option_b', 'option_c', 'option_d', 'correct_answer', 'marks',
            'ncert', 'difficulty', 'year', 'question_type'
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Question updated successfully',
            'question' => $question
        ]);
    }

    public function destroy(string $examId, string $id): JsonResponse
    {
        $question = Question::where('exam_id', $examId)->find($id);

        if (!$question) {
            return response()->json([
                'success' => false,
                'message' => 'Question not found'
            ], 404);
        }

        $question->delete();

        return response()->json([
            'success' => true,
            'message' => 'Question deleted successfully'
        ]);
    }
}
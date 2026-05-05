<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\ServiceJob;
use App\Models\WorkerProfile;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class ReviewController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'job_id'          => 'required|integer|exists:service_jobs,id',
            'reviewee_id'     => 'required|integer|exists:users,id',
            'rating'          => 'required|numeric|min:1|max:5',
            'comment'         => 'nullable|string|max:1000',
            'quality'         => 'nullable|numeric|min:1|max:5',
            'punctuality'     => 'nullable|numeric|min:1|max:5',
            'communication'   => 'nullable|numeric|min:1|max:5',
            'professionalism' => 'nullable|numeric|min:1|max:5',
            'price'           => 'nullable|numeric|min:1|max:5',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Datos inválidos',
                'errors'  => $validator->errors(),
            ], 422);
        }

        $user = auth('api')->user();

        $existing = Review::where('job_id', $request->job_id)
            ->where('reviewer_id', $user->id)
            ->first();

        if ($existing) {
            return response()->json([
                'message' => 'Ya dejaste una reseña para este trabajo',
            ], 409);
        }

        $review = Review::create([
            'job_id'          => $request->job_id,
            'reviewer_id'     => $user->id,
            'reviewee_id'     => $request->reviewee_id,
            'rating'          => $request->rating,
            'comment'         => $request->comment,
            'quality'         => $request->quality,
            'punctuality'     => $request->punctuality,
            'communication'   => $request->communication,
            'professionalism' => $request->professionalism,
            'price'           => $request->price,
        ]);

        // Actualizar rating promedio del worker
        $this->updateWorkerRating($request->reviewee_id);

        return response()->json([
            'message' => 'Reseña publicada exitosamente',
            'data'    => $review->load(['reviewer:id,name,avatar']),
        ], 201);
    }

    public function workerReviews(int $workerId): JsonResponse
    {
        $reviews = Review::with(['reviewer:id,name,avatar'])
            ->where('reviewee_id', $workerId)
            ->where('fraud_flagged', false)
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json($reviews);
    }

    private function updateWorkerRating(int $workerId): void
    {
        $avgRating = Review::where('reviewee_id', $workerId)
            ->where('fraud_flagged', false)
            ->avg('rating');

        $totalReviews = Review::where('reviewee_id', $workerId)
            ->where('fraud_flagged', false)
            ->count();

        WorkerProfile::where('user_id', $workerId)->update([
            'rating'        => round($avgRating, 2),
            'total_reviews' => $totalReviews,
        ]);
    }
}

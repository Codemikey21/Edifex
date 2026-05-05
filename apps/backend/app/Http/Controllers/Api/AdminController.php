<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\WorkerProfile;
use App\Models\ServiceJob;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AdminController extends Controller
{
    public function dashboard(): JsonResponse
    {
        $stats = [
            'total_users'   => User::count(),
            'total_workers' => User::role('worker')->count(),
            'total_clients' => User::role('client')->count(),
            'total_jobs'    => ServiceJob::count(),
            'active_jobs'   => ServiceJob::where('status', 'published')->count(),
            'total_reviews' => Review::count(),
            'pending_workers' => WorkerProfile::where('status', 'pending')->count(),
        ];

        return response()->json(['data' => $stats]);
    }

    public function listWorkers(Request $request): JsonResponse
    {
        $status  = $request->query('status', 'pending');

        $workers = WorkerProfile::with(['user:id,name,email,phone'])
            ->where('status', $status)
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json($workers);
    }

    public function approveWorker(int $workerId): JsonResponse
    {
        $profile = WorkerProfile::where('user_id', $workerId)->firstOrFail();
        $profile->update(['status' => 'active']);

        return response()->json([
            'message' => 'Operario aprobado exitosamente',
            'data'    => $profile,
        ]);
    }

    public function suspendWorker(int $workerId): JsonResponse
    {
        $profile = WorkerProfile::where('user_id', $workerId)->firstOrFail();
        $profile->update(['status' => 'suspended']);

        return response()->json([
            'message' => 'Operario suspendido',
            'data'    => $profile,
        ]);
    }

    public function listUsers(Request $request): JsonResponse
    {
        $users = User::with('roles')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json($users);
    }

    public function suspendUser(int $userId): JsonResponse
    {
        $user = User::findOrFail($userId);
        $user->update(['email_verified_at' => null]);

        return response()->json([
            'message' => 'Usuario suspendido',
        ]);
    }

    public function listJobs(Request $request): JsonResponse
    {
        $jobs = ServiceJob::with(['client:id,name,email'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json($jobs);
    }

    public function flaggedReviews(): JsonResponse
    {
        $reviews = Review::with([
                'reviewer:id,name,email',
                'reviewee:id,name,email',
            ])
            ->where('fraud_flagged', true)
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json($reviews);
    }
}

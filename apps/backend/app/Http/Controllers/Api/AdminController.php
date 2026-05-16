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
            'total_users'     => User::count(),
            'total_workers'   => User::role('worker')->count(),
            'total_clients'   => User::role('client')->count(),
            'total_jobs'      => ServiceJob::count(),
            'active_jobs'     => ServiceJob::where('status', 'published')->count(),
            'total_reviews'   => Review::count(),
            'flagged_reviews' => Review::where('fraud_flagged', true)->count(),
            'pending_workers' => WorkerProfile::where('status', 'pending')->count(),
        ];

        $activity = $this->getRecentActivity();

        return response()->json([
            'data'     => $stats,
            'activity' => $activity,
        ]);
    }

    private function getRecentActivity(): array
    {
        $items = [];

        // Últimos usuarios registrados
        $users = User::orderBy('created_at', 'desc')->take(3)->get();
        foreach ($users as $user) {
            $roles = $user->getRoleNames();
            $role  = $roles->first() ?? 'usuario';
            $items[] = [
                'type' => $role === 'worker' ? 'worker' : 'user',
                'text' => "Nuevo {$role} registrado: {$user->name}",
                'time' => $user->created_at->diffForHumans(),
                'dot'  => $role === 'worker' ? 'green' : 'dark',
            ];
        }

        // Últimas reviews reportadas
        $flagged = Review::where('fraud_flagged', true)
            ->orderBy('created_at', 'desc')
            ->take(2)
            ->get();
        foreach ($flagged as $review) {
            $items[] = [
                'type' => 'review',
                'text' => "Review reportada como fraude",
                'time' => $review->created_at->diffForHumans(),
                'dot'  => 'red',
            ];
        }

        // Últimos trabajos
        $jobs = ServiceJob::orderBy('created_at', 'desc')->take(2)->get();
        foreach ($jobs as $job) {
            $items[] = [
                'type' => 'job',
                'text' => "Nuevo trabajo publicado: {$job->title}",
                'time' => $job->created_at->diffForHumans(),
                'dot'  => 'teal',
            ];
        }

        // Ordenar por tiempo
        usort($items, fn($a, $b) => 0);

        return array_slice($items, 0, 6);
    }

    public function listWorkers(Request $request): JsonResponse
    {
        $status  = $request->query('status', 'pending');
        $workers = WorkerProfile::with(['user:id,name,email,created_at'])
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

    public function rejectWorker(int $workerId): JsonResponse
    {
        $profile = WorkerProfile::where('user_id', $workerId)->firstOrFail();
        $profile->update(['status' => 'rejected']);

        return response()->json([
            'message' => 'Operario rechazado',
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

        return response()->json(['message' => 'Usuario suspendido']);
    }

    public function listJobs(Request $request): JsonResponse
    {
        $status = $request->query('status');
        $query  = ServiceJob::with(['client:id,name,email'])
            ->orderBy('created_at', 'desc');

        if ($status) {
            $query->where('status', $status);
        }

        return response()->json($query->paginate(20));
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

    public function stats(): JsonResponse
    {
        return response()->json([
            'data' => [
                'total_users'     => User::count(),
                'total_workers'   => User::role('worker')->count(),
                'total_clients'   => User::role('client')->count(),
                'active_jobs'     => ServiceJob::where('status', 'published')->count(),
                'pending_workers' => WorkerProfile::where('status', 'pending')->count(),
                'flagged_reviews' => Review::where('fraud_flagged', true)->count(),
            ]
        ]);
    }
}

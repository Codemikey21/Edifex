<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\WorkerProfile;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class MarketplaceController extends Controller
{
    public function getWorkers(Request $request): JsonResponse
    {
        $query = WorkerProfile::with(['user:id,name,avatar', 'skills', 'certifications'])
            ->where('status', 'active');

        if ($request->category) {
            $query->whereJsonContains('categories', $request->category);
        }

        if ($request->city) {
            $query->where('city', 'like', '%' . $request->city . '%');
        }

        if ($request->search) {
            $query->whereHas('skills', function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%');
            });
        }

        $workers = $query->orderBy('rating', 'desc')
            ->paginate(12);

        return response()->json($workers);
    }

    public function getWorker(int $id): JsonResponse
    {
        $worker = WorkerProfile::with([
            'user:id,name,avatar,email,phone',
            'skills',
            'certifications',
        ])
        ->where('user_id', $id)
        ->where('status', 'active')
        ->firstOrFail();

        return response()->json(['data' => $worker]);
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ServiceJob;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class JobController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $jobs = ServiceJob::with(['client:id,name,avatar'])
            ->where('status', 'published')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json($jobs);
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'title'           => 'required|string|max:200',
            'description'     => 'required|string|max:5000',
            'category'        => 'required|string',
            'required_skills' => 'nullable|array',
            'city'            => 'nullable|string',
            'department'      => 'nullable|string',
            'latitude'        => 'nullable|numeric',
            'longitude'       => 'nullable|numeric',
            'budget_min'      => 'nullable|numeric|min:0',
            'budget_max'      => 'nullable|numeric|min:0',
            'budget_type'     => 'nullable|in:fixed,hourly,daily,negotiable',
            'currency'        => 'nullable|in:COP,USD,EUR',
            'urgency'         => 'nullable|in:flexible,normal,urgent,emergency',
            'start_date'      => 'nullable|date',
            'end_date'        => 'nullable|date|after:start_date',
            'estimated_days'  => 'nullable|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Datos inválidos',
                'errors'  => $validator->errors(),
            ], 422);
        }

        $user = auth('api')->user();

        $job = ServiceJob::create([
            'client_id'       => $user->id,
            'title'           => $request->title,
            'description'     => $request->description,
            'category'        => $request->category,
            'status'          => 'published',
            'required_skills' => $request->required_skills,
            'city'            => $request->city,
            'department'      => $request->department,
            'latitude'        => $request->latitude,
            'longitude'       => $request->longitude,
            'budget_min'      => $request->budget_min,
            'budget_max'      => $request->budget_max,
            'budget_type'     => $request->budget_type ?? 'negotiable',
            'currency'        => $request->currency ?? 'COP',
            'urgency'         => $request->urgency ?? 'normal',
            'start_date'      => $request->start_date,
            'end_date'        => $request->end_date,
            'estimated_days'  => $request->estimated_days,
        ]);

        return response()->json([
            'message' => 'Trabajo publicado exitosamente',
            'data'    => $job->load('client:id,name,avatar'),
        ], 201);
    }

    public function show(int $id): JsonResponse
    {
        $job = ServiceJob::with(['client:id,name,avatar'])
            ->findOrFail($id);

        return response()->json(['data' => $job]);
    }

    public function myJobs(Request $request): JsonResponse
    {
        $user = auth('api')->user();

        $jobs = ServiceJob::where('client_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json($jobs);
    }

    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:draft,published,cancelled',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Estado inválido',
                'errors'  => $validator->errors(),
            ], 422);
        }

        $user = auth('api')->user();
        $job  = ServiceJob::where('client_id', $user->id)->findOrFail($id);

        $job->update(['status' => $request->status]);

        return response()->json([
            'message' => 'Estado actualizado',
            'data'    => $job,
        ]);
    }
}

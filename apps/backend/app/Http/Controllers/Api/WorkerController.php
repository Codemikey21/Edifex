<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\WorkerProfile;
use App\Models\WorkerSkill;
use App\Models\WorkerCertification;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class WorkerController extends Controller
{
    public function getProfile(): JsonResponse
    {
        $user = auth('api')->user();

        $profile = WorkerProfile::with(['skills', 'certifications'])
            ->where('user_id', $user->id)
            ->first();

        if (!$profile) {
            return response()->json([
                'message' => 'Perfil no encontrado',
            ], 404);
        }

        return response()->json(['data' => $profile]);
    }

    public function createOrUpdateProfile(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'bio'                  => 'nullable|string|max:1000',
            'categories'           => 'nullable|array',
            'experience_years'     => 'nullable|integer|min:0',
            'hourly_rate'          => 'nullable|numeric|min:0',
            'daily_rate'           => 'nullable|numeric|min:0',
            'currency'             => 'nullable|string|in:COP,USD,EUR',
            'city'                 => 'nullable|string',
            'department'           => 'nullable|string',
            'latitude'             => 'nullable|numeric',
            'longitude'            => 'nullable|numeric',
            'is_available'         => 'nullable|boolean',
            'working_days'         => 'nullable|array',
            'working_hours_start'  => 'nullable|date_format:H:i',
            'working_hours_end'    => 'nullable|date_format:H:i',
            'max_travel_radius_km' => 'nullable|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Datos inválidos',
                'errors'  => $validator->errors(),
            ], 422);
        }

        $user = auth('api')->user();

        $profile = WorkerProfile::updateOrCreate(
            ['user_id' => $user->id],
            $request->only([
                'bio', 'categories', 'experience_years', 'hourly_rate',
                'daily_rate', 'currency', 'city', 'department', 'country',
                'latitude', 'longitude', 'is_available', 'working_days',
                'working_hours_start', 'working_hours_end', 'max_travel_radius_km',
            ])
        );

        return response()->json([
            'message' => 'Perfil actualizado exitosamente',
            'data'    => $profile->load(['skills', 'certifications']),
        ]);
    }

    public function addSkill(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name'             => 'required|string|max:100',
            'category'         => 'nullable|string',
            'years_experience' => 'nullable|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Datos inválidos',
                'errors'  => $validator->errors(),
            ], 422);
        }

        $user    = auth('api')->user();
        $profile = WorkerProfile::firstOrCreate(['user_id' => $user->id]);

        $skill = WorkerSkill::create([
            'worker_profile_id' => $profile->id,
            'name'              => $request->name,
            'category'          => $request->category,
            'years_experience'  => $request->years_experience ?? 0,
        ]);

        return response()->json([
            'message' => 'Skill agregado exitosamente',
            'data'    => $skill,
        ], 201);
    }

    public function addCertification(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name'   => 'required|string|max:200',
            'issuer' => 'nullable|string',
            'year'   => 'nullable|integer|min:1990|max:2030',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Datos inválidos',
                'errors'  => $validator->errors(),
            ], 422);
        }

        $user    = auth('api')->user();
        $profile = WorkerProfile::firstOrCreate(['user_id' => $user->id]);

        $certification = WorkerCertification::create([
            'worker_profile_id' => $profile->id,
            'name'              => $request->name,
            'issuer'            => $request->issuer,
            'year'              => $request->year,
        ]);

        return response()->json([
            'message' => 'Certificación agregada exitosamente',
            'data'    => $certification,
        ], 201);
    }
}

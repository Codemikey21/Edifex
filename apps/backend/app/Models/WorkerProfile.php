<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WorkerProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'status', 'bio', 'categories', 'experience_years',
        'hourly_rate', 'daily_rate', 'currency', 'cv_url', 'ai_score',
        'rating', 'total_reviews', 'total_jobs_completed', 'verified',
        'latitude', 'longitude', 'city', 'department', 'country',
        'is_available', 'working_days', 'working_hours_start',
        'working_hours_end', 'max_travel_radius_km',
    ];

    protected $casts = [
        'categories'    => 'array',
        'working_days'  => 'array',
        'is_available'  => 'boolean',
        'verified'      => 'boolean',
        'hourly_rate'   => 'decimal:2',
        'daily_rate'    => 'decimal:2',
        'ai_score'      => 'decimal:2',
        'rating'        => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function skills()
    {
        return $this->hasMany(WorkerSkill::class);
    }

    public function certifications()
    {
        return $this->hasMany(WorkerCertification::class);
    }
}

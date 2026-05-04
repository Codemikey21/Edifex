<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WorkerSkill extends Model
{
    use HasFactory;

    protected $fillable = [
        'worker_profile_id',
        'name',
        'category',
        'confidence',
        'years_experience',
        'ai_extracted',
    ];

    protected $casts = [
        'ai_extracted' => 'boolean',
        'confidence'   => 'decimal:2',
    ];

    public function workerProfile()
    {
        return $this->belongsTo(WorkerProfile::class);
    }
}

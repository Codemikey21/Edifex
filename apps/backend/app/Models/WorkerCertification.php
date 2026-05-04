<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WorkerCertification extends Model
{
    use HasFactory;

    protected $fillable = [
        'worker_profile_id',
        'name',
        'issuer',
        'year',
        'document_url',
        'verified',
        'ai_verified',
    ];

    protected $casts = [
        'verified'    => 'boolean',
        'ai_verified' => 'boolean',
    ];

    public function workerProfile()
    {
        return $this->belongsTo(WorkerProfile::class);
    }
}

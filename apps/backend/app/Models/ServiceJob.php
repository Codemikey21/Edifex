<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ServiceJob extends Model
{
    use HasFactory;

    protected $table = 'service_jobs';

    protected $fillable = [
        'client_id', 'worker_id', 'title', 'description', 'category',
        'status', 'required_skills', 'latitude', 'longitude', 'city',
        'department', 'country', 'budget_min', 'budget_max', 'agreed_amount',
        'currency', 'budget_type', 'start_date', 'end_date', 'urgency',
        'estimated_days',
    ];

    protected $casts = [
        'required_skills' => 'array',
        'budget_min'      => 'decimal:2',
        'budget_max'      => 'decimal:2',
        'agreed_amount'   => 'decimal:2',
        'start_date'      => 'date',
        'end_date'        => 'date',
    ];

    public function client()
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    public function worker()
    {
        return $this->belongsTo(User::class, 'worker_id');
    }
}

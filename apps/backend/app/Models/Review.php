<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    use HasFactory;

    protected $fillable = [
        'job_id', 'reviewer_id', 'reviewee_id', 'rating', 'comment',
        'quality', 'punctuality', 'communication', 'professionalism',
        'price', 'fraud_flagged',
    ];

    protected $casts = [
        'rating'           => 'decimal:1',
        'quality'          => 'decimal:1',
        'punctuality'      => 'decimal:1',
        'communication'    => 'decimal:1',
        'professionalism'  => 'decimal:1',
        'price'            => 'decimal:1',
        'fraud_flagged'    => 'boolean',
    ];

    public function job()
    {
        return $this->belongsTo(ServiceJob::class, 'job_id');
    }

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewer_id');
    }

    public function reviewee()
    {
        return $this->belongsTo(User::class, 'reviewee_id');
    }
}

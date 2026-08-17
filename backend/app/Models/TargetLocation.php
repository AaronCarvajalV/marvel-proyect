<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TargetLocation extends Model
{
    use HasFactory;

    protected $fillable = [
        'city',
        'country',
        'country_code',
    ];

    public function missions()
    {
        return $this->hasMany(Mission::class);
    }
}

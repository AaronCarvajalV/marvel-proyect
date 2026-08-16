<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Mission extends Model
{
    use HasFactory;

    protected $table = 'missions';

    protected $fillable = [
        'titulo',
        'descripcion',
        'ubicacion',
        'fecha',
        'nivel_peligro',
        'estado',
        'superheroe_id',
    ];

    protected function casts(): array
    {
        return [
            'fecha' => 'date:Y-m-d',
            'superheroe_id' => 'integer',
        ];
    }

    /**
     * Get the superhero assigned to this mission.
     */
    public function hero(): BelongsTo
    {
        return $this->belongsTo(Hero::class, 'superheroe_id');
    }
}

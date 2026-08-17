<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Hero extends Model
{
    use HasFactory;

    protected $table = 'heroes';

    protected $fillable = [
        'nombre',
        'nombre_real',
        'poder_principal',
        'nivel_poder',
        'imagen_url',
        'estado',
    ];

    protected function casts(): array
    {
        return [
            'nivel_poder' => 'integer',
        ];
    }

    /**
     * Get the missions associated with the superhero.
     */
    public function missions(): HasMany
    {
        return $this->hasMany(Mission::class, 'superheroe_id');
    }

    /**
     * Scope a query to search heroes by name, real name, or main power.
     */
    public function scopeSearch(Builder $query, ?string $term): Builder
    {
        if (empty($term)) {
            return $query;
        }

        return $query->where(function (Builder $q) use ($term) {
            $q->where('nombre', 'like', "%{$term}%")
                ->orWhere('nombre_real', 'like', "%{$term}%")
                ->orWhere('poder_principal', 'like', "%{$term}%");
        });
    }
}

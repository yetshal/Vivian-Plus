<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PrioritySeeder extends Seeder
{
    public function run(): void
    {
        $priorities = [
            ['name' => 'Baja', 'color' => '#10B981', 'level' => 1],
            ['name' => 'Media', 'color' => '#F59E0B', 'level' => 2],
            ['name' => 'Alta', 'color' => '#EF4444', 'level' => 3],
            ['name' => 'Urgente', 'color' => '#7C3AED', 'level' => 4],
        ];

        foreach ($priorities as $priority) {
            DB::table('priorities')->insert($priority);
        }
    }
}
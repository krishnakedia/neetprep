<?php

namespace Database\Seeders;

use App\Models\Chapter;
use App\Models\Subject;
use Illuminate\Database\Seeder;

class ChapterSeeder extends Seeder
{
    public function run(): void
    {
        $physics = Subject::where('name', 'Physics')->first();
        $chemistry = Subject::where('name', 'Chemistry')->first();
        $biology = Subject::where('name', 'Biology')->first();

        if (! $physics || ! $chemistry || ! $biology) {
            return;
        }

        Chapter::create(['subject_id' => $physics->id, 'name' => 'Mechanics', 'description' => 'Laws of Motion, Work, Energy, Power, Gravitation', 'order' => 1]);
        Chapter::create(['subject_id' => $physics->id, 'name' => 'Heat & Thermodynamics', 'description' => 'Heat transfer, Laws of Thermodynamics', 'order' => 2]);
        Chapter::create(['subject_id' => $physics->id, 'name' => 'Waves & Optics', 'description' => 'Wave motion, Sound, Light, Optical instruments', 'order' => 3]);
        Chapter::create(['subject_id' => $physics->id, 'name' => 'Electricity & Magnetism', 'description' => 'Electrostatics, Current electricity, Magnetism', 'order' => 4]);
        Chapter::create(['subject_id' => $physics->id, 'name' => 'Modern Physics', 'description' => 'Atoms, Nuclei, Semi-conductors, Photoelectric effect', 'order' => 5]);

        Chapter::create(['subject_id' => $chemistry->id, 'name' => 'Physical Chemistry', 'description' => 'Atomic Structure, Chemical Bonding, Equilibrium, Thermodynamics', 'order' => 1]);
        Chapter::create(['subject_id' => $chemistry->id, 'name' => 'Organic Chemistry', 'description' => 'Hydrocarbons, Functional groups, Reactions, Mechanisms', 'order' => 2]);
        Chapter::create(['subject_id' => $chemistry->id, 'name' => 'Inorganic Chemistry', 'description' => 'Periodic table, p-block, d-block, f-block elements', 'order' => 3]);

        Chapter::create(['subject_id' => $biology->id, 'name' => 'Botany', 'description' => 'Plant kingdom, Morphology, Anatomy, Photosynthesis', 'order' => 1]);
        Chapter::create(['subject_id' => $biology->id, 'name' => 'Zoology', 'description' => 'Animal kingdom, Human physiology, Reproduction', 'order' => 2]);
        Chapter::create(['subject_id' => $biology->id, 'name' => 'Cell Biology & Genetics', 'description' => 'Cell structure, Cell division, Heredity, Molecular basis of inheritance', 'order' => 3]);
        Chapter::create(['subject_id' => $biology->id, 'name' => 'Ecology & Evolution', 'description' => 'Ecosystem, Biodiversity, Environmental issues, Evolution', 'order' => 4]);
    }
}

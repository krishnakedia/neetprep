<?php

namespace Database\Seeders;

use App\Models\Exam;
use App\Models\Question;
use App\Models\Subject;
use App\Models\Topic;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create admin user
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@neetprep.com',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
            'is_active' => true,
        ]);

        // Create test users
        User::create([
            'name' => 'John Student',
            'email' => 'john@neetprep.com',
            'password' => Hash::make('user123'),
            'role' => 'user',
            'is_active' => true,
        ]);

        User::create([
            'name' => 'Jane Doe',
            'email' => 'jane@neetprep.com',
            'password' => Hash::make('user123'),
            'role' => 'user',
            'is_active' => false,
        ]);

        User::create([
            'name' => 'Alex Smith',
            'email' => 'alex@neetprep.com',
            'password' => Hash::make('user123'),
            'role' => 'user',
            'is_active' => true,
        ]);

        // Create subjects
        $physics = Subject::create([
            'name' => 'Physics',
            'description' => 'NEET Physics covers Mechanics, Thermodynamics, Waves, Optics, and Modern Physics',
            'icon' => 'fa-atom',
            'color' => '#4f46e5',
            'is_active' => true,
        ]);

        $chemistry = Subject::create([
            'name' => 'Chemistry',
            'description' => 'NEET Chemistry includes Physical, Organic, and Inorganic Chemistry',
            'icon' => 'fa-flask',
            'color' => '#10b981',
            'is_active' => true,
        ]);

        $biology = Subject::create([
            'name' => 'Biology',
            'description' => 'NEET Biology covers Botany and Zoology with emphasis on Human Physiology',
            'icon' => 'fa-dna',
            'color' => '#f59e0b',
            'is_active' => true,
        ]);

        // Physics chapters
        Chapter::create(['subject_id' => $physics->id, 'name' => 'Mechanics', 'description' => 'Laws of Motion, Work, Energy, Power, Gravitation', 'order' => 1]);
        Chapter::create(['subject_id' => $physics->id, 'name' => 'Heat & Thermodynamics', 'description' => 'Heat transfer, Laws of Thermodynamics', 'order' => 2]);
        Chapter::create(['subject_id' => $physics->id, 'name' => 'Waves & Optics', 'description' => 'Wave motion, Sound, Light, Optical instruments', 'order' => 3]);
        Chapter::create(['subject_id' => $physics->id, 'name' => 'Electricity & Magnetism', 'description' => 'Electrostatics, Current electricity, Magnetism', 'order' => 4]);
        Chapter::create(['subject_id' => $physics->id, 'name' => 'Modern Physics', 'description' => 'Atoms, Nuclei, Semi-conductors, Photoelectric effect', 'order' => 5]);

        // Chemistry chapters
        Chapter::create(['subject_id' => $chemistry->id, 'name' => 'Physical Chemistry', 'description' => 'Atomic Structure, Chemical Bonding, Equilibrium, Thermodynamics', 'order' => 1]);
        Chapter::create(['subject_id' => $chemistry->id, 'name' => 'Organic Chemistry', 'description' => 'Hydrocarbons, Functional groups, Reactions, Mechanisms', 'order' => 2]);
        Chapter::create(['subject_id' => $chemistry->id, 'name' => 'Inorganic Chemistry', 'description' => 'Periodic table, p-block, d-block, f-block elements', 'order' => 3]);

        // Biology chapters
        Chapter::create(['subject_id' => $biology->id, 'name' => 'Botany', 'description' => 'Plant kingdom, Morphology, Anatomy, Photosynthesis', 'order' => 1]);
        Chapter::create(['subject_id' => $biology->id, 'name' => 'Zoology', 'description' => 'Animal kingdom, Human physiology, Reproduction', 'order' => 2]);
        Chapter::create(['subject_id' => $biology->id, 'name' => 'Cell Biology & Genetics', 'description' => 'Cell structure, Cell division, Heredity, Molecular basis of inheritance', 'order' => 3]);
        Chapter::create(['subject_id' => $biology->id, 'name' => 'Ecology & Evolution', 'description' => 'Ecosystem, Biodiversity, Environmental issues, Evolution', 'order' => 4]);

        // Physics topics
        Topic::create(['subject_id' => $physics->id, 'name' => 'Laws of Motion', 'description' => "Newton's laws, friction, circular motion"]);
        Topic::create(['subject_id' => $physics->id, 'name' => 'Work, Energy & Power', 'description' => 'Work-energy theorem, conservation laws']);
        Topic::create(['subject_id' => $physics->id, 'name' => 'Gravitation', 'description' => 'Universal law, orbital velocity, escape velocity']);
        Topic::create(['subject_id' => $physics->id, 'name' => 'Thermodynamics', 'description' => 'Heat, laws of thermodynamics, heat transfer']);

        // Chemistry topics
        Topic::create(['subject_id' => $chemistry->id, 'name' => 'Atomic Structure', 'description' => 'Bohr model, quantum numbers, electronic configuration']);
        Topic::create(['subject_id' => $chemistry->id, 'name' => 'Chemical Bonding', 'description' => 'Ionic, covalent, metallic bonding, VSEPR theory']);
        Topic::create(['subject_id' => $chemistry->id, 'name' => 'Organic Chemistry', 'description' => 'Nomenclature, reactions, mechanisms']);
        Topic::create(['subject_id' => $chemistry->id, 'name' => 'Equilibrium', 'description' => "Chemical and ionic equilibrium, Le Chatelier's principle"]);

        // Biology topics
        Topic::create(['subject_id' => $biology->id, 'name' => 'Cell Biology', 'description' => 'Cell structure, cell division, organelles']);
        Topic::create(['subject_id' => $biology->id, 'name' => 'Human Physiology', 'description' => 'Digestion, circulation, respiration, nervous system']);
        Topic::create(['subject_id' => $biology->id, 'name' => 'Genetics', 'description' => 'Mendelian inheritance, DNA, RNA, protein synthesis']);
        Topic::create(['subject_id' => $biology->id, 'name' => 'Ecology', 'description' => 'Ecosystem, biodiversity, environmental issues']);

        // Create exam
        $exam1 = Exam::create([
            'title' => 'Physics - Laws of Motion',
            'description' => "Test your knowledge of Newton's laws, friction, and circular motion",
            'subject_id' => $physics->id,
            'duration' => 30,
            'total_marks' => 50,
            'passing_marks' => 25,
            'is_active' => true,
        ]);

        // Add questions for exam1
        Question::create([
            'exam_id' => $exam1->id,
            'question_text' => 'A body of mass 5 kg is acted upon by two perpendicular forces of 6 N and 8 N. The magnitude of acceleration produced is:',
            'option_a' => '1 m/s²',
            'option_b' => '2 m/s²',
            'option_c' => '4 m/s²',
            'option_d' => '10 m/s²',
            'correct_answer' => 'B',
            'marks' => 5,
        ]);

        Question::create([
            'exam_id' => $exam1->id,
            'question_text' => 'A car of mass 1000 kg is moving with a velocity of 20 m/s. The driver applies brakes and the car stops after 10 seconds. The average retarding force is:',
            'option_a' => '1000 N',
            'option_b' => '2000 N',
            'option_c' => '4000 N',
            'option_d' => '500 N',
            'correct_answer' => 'B',
            'marks' => 5,
        ]);

        Question::create([
            'exam_id' => $exam1->id,
            'question_text' => "According to Newton's first law, an object continues in its state of rest or uniform motion unless acted upon by:",
            'option_a' => 'Potential energy',
            'option_b' => 'Kinetic energy',
            'option_c' => 'External force',
            'option_d' => 'Internal force',
            'correct_answer' => 'C',
            'marks' => 5,
        ]);

        Question::create([
            'exam_id' => $exam1->id,
            'question_text' => 'The momentum of a body is doubled. Its kinetic energy becomes:',
            'option_a' => 'Double',
            'option_b' => 'Half',
            'option_c' => 'Four times',
            'option_d' => 'Triple',
            'correct_answer' => 'C',
            'marks' => 5,
        ]);

        Question::create([
            'exam_id' => $exam1->id,
            'question_text' => 'A body of mass 2 kg is moving in a circle of radius 5 m with uniform speed. The centripetal force acting on it is 8 N. The speed of the body is:',
            'option_a' => '2 m/s',
            'option_b' => '4 m/s',
            'option_c' => '6 m/s',
            'option_d' => '√20 m/s',
            'correct_answer' => 'D',
            'marks' => 5,
        ]);

        // Create second exam
        $exam2 = Exam::create([
            'title' => 'Chemistry - Atomic Structure',
            'description' => 'Comprehensive test on atomic models and electronic configuration',
            'subject_id' => $chemistry->id,
            'duration' => 30,
            'total_marks' => 50,
            'passing_marks' => 25,
            'is_active' => true,
        ]);

        Question::create([
            'exam_id' => $exam2->id,
            'question_text' => 'The maximum number of electrons that can be accommodated in the M shell is:',
            'option_a' => '2',
            'option_b' => '8',
            'option_c' => '18',
            'option_d' => '32',
            'correct_answer' => 'C',
            'marks' => 5,
        ]);

        Question::create([
            'exam_id' => $exam2->id,
            'question_text' => 'Which of the following has the highest ionization energy?',
            'option_a' => 'Sodium',
            'option_b' => 'Magnesium',
            'option_c' => 'Aluminum',
            'option_d' => 'Silicon',
            'correct_answer' => 'B',
            'marks' => 5,
        ]);

        Question::create([
            'exam_id' => $exam2->id,
            'question_text' => 'The shape of s-orbital is:',
            'option_a' => 'Spherical',
            'option_b' => 'Dumbbell',
            'option_c' => 'Double dumbbell',
            'option_d' => 'Cloverleaf',
            'correct_answer' => 'A',
            'marks' => 5,
        ]);
    }
}

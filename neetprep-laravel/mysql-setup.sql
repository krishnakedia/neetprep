-- MySQL Database Setup for NEET Prep
-- Run this in MySQL command line or phpMyAdmin

-- Create database
CREATE DATABASE IF NOT EXISTS neetprep CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Use the database
USE neetprep;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user',
    is_active TINYINT(1) DEFAULT 1,
    notes TEXT NULL,
    remember_token VARCHAR(100) NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create subjects table
CREATE TABLE IF NOT EXISTS subjects (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NULL,
    icon VARCHAR(50) DEFAULT 'fa-book',
    color VARCHAR(20) DEFAULT '#4f46e5',
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create topics table
CREATE TABLE IF NOT EXISTS topics (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    subject_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT NULL,
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create exams table
CREATE TABLE IF NOT EXISTS exams (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    subject_id BIGINT UNSIGNED NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NULL,
    duration INT DEFAULT 30,
    total_marks INT DEFAULT 50,
    passing_marks INT DEFAULT 25,
    is_active TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create exam_topic pivot table
CREATE TABLE IF NOT EXISTS exam_topic (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    exam_id BIGINT UNSIGNED NOT NULL,
    topic_id BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE,
    FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create questions table
CREATE TABLE IF NOT EXISTS questions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    exam_id BIGINT UNSIGNED NOT NULL,
    question_text TEXT NOT NULL,
    option_a VARCHAR(500) NOT NULL,
    option_b VARCHAR(500) NOT NULL,
    option_c VARCHAR(500) NOT NULL,
    option_d VARCHAR(500) NOT NULL,
    correct_answer ENUM('A', 'B', 'C', 'D') NOT NULL,
    marks INT DEFAULT 5,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create exam_attempts table
CREATE TABLE IF NOT EXISTS exam_attempts (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    exam_id BIGINT UNSIGNED NOT NULL,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    score INT DEFAULT 0,
    total_marks INT NOT NULL,
    percentage INT DEFAULT 0,
    status ENUM('in-progress', 'completed') DEFAULT 'in-progress',
    notes TEXT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create exam_answers table
CREATE TABLE IF NOT EXISTS exam_answers (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    exam_attempt_id BIGINT UNSIGNED NOT NULL,
    question_id BIGINT UNSIGNED NOT NULL,
    selected_answer ENUM('A', 'B', 'C', 'D') NULL,
    is_correct TINYINT(1) DEFAULT 0,
    marks_obtained INT DEFAULT 0,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (exam_attempt_id) REFERENCES exam_attempts(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create sessions table
CREATE TABLE IF NOT EXISTS sessions (
    id VARCHAR(255) NOT NULL PRIMARY KEY,
    user_id BIGINT UNSIGNED NULL,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    payload LONGTEXT NOT NULL,
    last_activity INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create cache table
CREATE TABLE IF NOT EXISTS cache (
    `key` VARCHAR(255) NOT NULL,
    value LONGTEXT NOT NULL,
    expiration INT NOT NULL,
    PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create cache_locks table
CREATE TABLE IF NOT EXISTS cache_locks (
    `key` VARCHAR(255) NOT NULL,
    owner VARCHAR(255) NOT NULL,
    expiration INT NOT NULL,
    PRIMARY KEY(`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create jobs table
CREATE TABLE IF NOT EXISTS jobs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    queue VARCHAR(255) NOT NULL,
    payload LONGTEXT NOT NULL,
    attempts TINYINT UNSIGNED NOT NULL,
    reserved_at INT UNSIGNED NULL,
    available_at INT UNSIGNED NOT NULL,
    created_at INT UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create job_batches table
CREATE TABLE IF NOT EXISTS job_batches (
    id VARCHAR(255) NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    total_jobs INT NOT NULL,
    pending_jobs INT NOT NULL,
    failed_jobs INT NOT NULL,
    failed_job_ids LONGTEXT NOT NULL,
    options MEDIUMTEXT NULL,
    cancelled_at INT UNSIGNED NULL,
    created_at INT UNSIGNED NOT NULL,
    finished_at INT UNSIGNED NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create password_reset_tokens table
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    email VARCHAR(255) NOT NULL PRIMARY KEY,
    token VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create personal_access_tokens table (for Sanctum)
CREATE TABLE IF NOT EXISTS personal_access_tokens (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tokenable_type VARCHAR(255) NOT NULL,
    tokenable_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(255) NOT NULL,
    token VARCHAR(64) NOT NULL UNIQUE,
    abilities TEXT NULL,
    last_used_at TIMESTAMP NULL,
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (tokenable_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert demo data

-- Admin user
INSERT INTO users (name, email, password, role, is_active, created_at, updated_at) VALUES
('Admin User', 'admin@neetprep.com', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.qL8Z4pJ5F5GqKq', 'admin', 1, NOW(), NOW());

-- Regular users
INSERT INTO users (name, email, password, role, is_active, created_at, updated_at) VALUES
('John Student', 'john@neetprep.com', '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', 1, NOW(), NOW()),
('Jane Doe', 'jane@neetprep.com', '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', 0, NOW(), NOW()),
('Alex Smith', 'alex@neetprep.com', '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', 1, NOW(), NOW());

-- Subjects
INSERT INTO subjects (name, description, icon, color, is_active, created_at, updated_at) VALUES
('Physics', 'NEET Physics covers Mechanics, Thermodynamics, Waves, Optics, and Modern Physics', 'fa-atom', '#4f46e5', 1, NOW(), NOW()),
('Chemistry', 'NEET Chemistry includes Physical, Organic, and Inorganic Chemistry', 'fa-flask', '#10b981', 1, NOW(), NOW()),
('Biology', 'NEET Biology covers Botany and Zoology with emphasis on Human Physiology', 'fa-dna', '#f59e0b', 1, NOW(), NOW());

-- Physics topics
INSERT INTO topics (subject_id, name, description, is_active, created_at, updated_at) VALUES
(1, 'Laws of Motion', "Newton's laws, friction, circular motion", 1, NOW(), NOW()),
(1, 'Work, Energy & Power', 'Work-energy theorem, conservation laws', 1, NOW(), NOW()),
(1, 'Gravitation', 'Universal law, orbital velocity, escape velocity', 1, NOW(), NOW()),
(1, 'Thermodynamics', 'Heat, laws of thermodynamics, heat transfer', 1, NOW(), NOW());

-- Chemistry topics
INSERT INTO topics (subject_id, name, description, is_active, created_at, updated_at) VALUES
(2, 'Atomic Structure', 'Bohr model, quantum numbers, electronic configuration', 1, NOW(), NOW()),
(2, 'Chemical Bonding', 'Ionic, covalent, metallic bonding, VSEPR theory', 1, NOW(), NOW()),
(2, 'Organic Chemistry', 'Nomenclature, reactions, mechanisms', 1, NOW(), NOW()),
(2, 'Equilibrium', "Chemical and ionic equilibrium, Le Chatelier's principle", 1, NOW(), NOW());

-- Biology topics
INSERT INTO topics (subject_id, name, description, is_active, created_at, updated_at) VALUES
(3, 'Cell Biology', 'Cell structure, cell division, organelles', 1, NOW(), NOW()),
(3, 'Human Physiology', 'Digestion, circulation, respiration, nervous system', 1, NOW(), NOW()),
(3, 'Genetics', 'Mendelian inheritance, DNA, RNA, protein synthesis', 1, NOW(), NOW()),
(3, 'Ecology', 'Ecosystem, biodiversity, environmental issues', 1, NOW(), NOW());

-- Exams
INSERT INTO exams (subject_id, title, description, duration, total_marks, passing_marks, is_active, created_at, updated_at) VALUES
(1, 'Physics - Laws of Motion', "Test your knowledge of Newton's laws, friction, and circular motion", 30, 50, 25, 1, NOW(), NOW()),
(2, 'Chemistry - Atomic Structure', 'Comprehensive test on atomic models and electronic configuration', 30, 50, 25, 1, NOW(), NOW()),
(3, 'Biology - Cell Biology', 'Test covering cell structure, organelles, and cell division', 45, 100, 50, 1, NOW(), NOW()),
(1, 'Physics - Gravitation', 'Comprehensive test on gravitational concepts', 30, 50, 25, 0, NOW(), NOW());

-- Questions for Physics exam
INSERT INTO questions (exam_id, question_text, option_a, option_b, option_c, option_d, correct_answer, marks, created_at, updated_at) VALUES
(1, 'A body of mass 5 kg is acted upon by two perpendicular forces of 6 N and 8 N. The magnitude of acceleration produced is:', '1 m/s²', '2 m/s²', '4 m/s²', '10 m/s²', 'B', 5, NOW(), NOW()),
(1, 'A car of mass 1000 kg is moving with a velocity of 20 m/s. The driver applies brakes and the car stops after 10 seconds. The average retarding force is:', '1000 N', '2000 N', '4000 N', '500 N', 'B', 5, NOW(), NOW()),
(1, "According to Newton's first law, an object continues in its state of rest or uniform motion unless acted upon by:", 'Potential energy', 'Kinetic energy', 'External force', 'Internal force', 'C', 5, NOW(), NOW()),
(1, 'The momentum of a body is doubled. Its kinetic energy becomes:', 'Double', 'Half', 'Four times', 'Triple', 'C', 5, NOW(), NOW()),
(1, 'A body of mass 2 kg is moving in a circle of radius 5 m with uniform speed. The centripetal force acting on it is 8 N. The speed of the body is:', '2 m/s', '4 m/s', '6 m/s', '√20 m/s', 'D', 5, NOW(), NOW()),
(1, 'The coefficient of friction between two surfaces is μ. The angle of friction is:', 'tan⁻¹(μ)', 'sin⁻¹(μ)', 'cos⁻¹(μ)', 'cot⁻¹(μ)', 'A', 5, NOW(), NOW()),
(1, 'A block of mass 10 kg is placed on a rough horizontal surface. A horizontal force of 20 N is applied. If μ = 0.3 and g = 10 m/s², the block will:', 'Move with acceleration', 'Remain at rest', 'Start sliding immediately', 'Become zero', 'B', 5, NOW(), NOW()),
(1, 'Impulse is equal to the change in:', 'Force', 'Momentum', 'Energy', 'Velocity', 'B', 5, NOW(), NOW()),
(1, 'A body is moving with constant velocity. Its acceleration is:', 'Maximum', 'Minimum', 'Zero', 'Constant', 'C', 5, NOW(), NOW()),
(1, 'The tension in a string supporting a mass m rotating in a vertical circle at the lowest point is:', 'mg', '3mg', '5mg', '6mg', 'D', 5, NOW(), NOW());

-- Questions for Chemistry exam
INSERT INTO questions (exam_id, question_text, option_a, option_b, option_c, option_d, correct_answer, marks, created_at, updated_at) VALUES
(2, 'The maximum number of electrons that can be accommodated in the M shell is:', '2', '8', '18', '32', 'C', 5, NOW(), NOW()),
(2, 'Which of the following has the highest ionization energy?', 'Sodium', 'Magnesium', 'Aluminum', 'Silicon', 'B', 5, NOW(), NOW()),
(2, 'The shape of s-orbital is:', 'Spherical', 'Dumbbell', 'Double dumbbell', 'Cloverleaf', 'A', 5, NOW(), NOW()),
(2, 'The Aufbau principle states that:', 'Electrons fill lowest energy orbitals first', 'Electrons fill highest energy orbitals first', 'Electrons fill randomly', 'Electrons pair first before filling', 'A', 5, NOW(), NOW()),
(2, 'The Heisenberg uncertainty principle deals with:', 'Position and momentum', 'Energy and time', 'Wavelength and frequency', 'Both A and B', 'D', 5, NOW(), NOW()),
(2, 'The quantum number that defines the shape of orbital is:', 'Principal quantum number', 'Azimuthal quantum number', 'Magnetic quantum number', 'Spin quantum number', 'B', 5, NOW(), NOW()),
(2, 'Which element has the electronic configuration 1s² 2s² 2p⁶ 3s² 3p⁶?', 'Argon', 'Krypton', 'Neon', 'Xenon', 'A', 5, NOW(), NOW()),
(2, 'The nodal plane in dz² orbital is:', 'XY plane', 'XZ plane', 'YZ plane', 'A cone-shaped nodal surface', 'D', 5, NOW(), NOW()),
(2, 'The energy of an electron in the hydrogen atom is given by:', 'En = -13.6/n² eV', 'En = 13.6/n² eV', 'En = -13.6 × n² eV', 'En = n²/13.6 eV', 'A', 5, NOW(), NOW()),
(2, 'Which of the following sets of quantum numbers is not allowed?', 'n=1, l=0, m=0, s=+1/2', 'n=2, l=1, m=0, s=+1/2', 'n=2, l=2, m=1, s=+1/2', 'n=3, l=2, m=2, s=+1/2', 'C', 5, NOW(), NOW());

-- Questions for Biology exam
INSERT INTO questions (exam_id, question_text, option_a, option_b, option_c, option_d, correct_answer, marks, created_at, updated_at) VALUES
(3, 'The cell organelle responsible for protein synthesis is:', 'Mitochondria', 'Ribosome', 'Golgi apparatus', 'Lysosome', 'B', 5, NOW(), NOW()),
(3, 'Which organelle is known as the powerhouse of the cell?', 'Nucleus', 'Mitochondria', 'Endoplasmic reticulum', 'Golgi apparatus', 'B', 5, NOW(), NOW()),
(3, 'The fluid mosaic model describes the structure of:', 'Cell wall', 'Cytoplasm', 'Plasma membrane', 'Nucleus', 'C', 5, NOW(), NOW()),
(3, 'DNA replication is:', 'Conservative', 'Semi-conservative', 'Dispersive', 'Non-conservative', 'B', 5, NOW(), NOW()),
(3, 'The process of cell division that results in two identical daughter cells is:', 'Meiosis', 'Mitosis', 'Cytokinesis', 'Binary fission', 'B', 5, NOW(), NOW()),
(3, 'Which of the following is not a component of a prokaryotic cell?', 'Plasma membrane', 'Ribosome', 'Mitochondria', 'Nucleoid', 'C', 5, NOW(), NOW()),
(3, 'The phase of cell cycle where DNA replication occurs:', 'G1 phase', 'S phase', 'G2 phase', 'M phase', 'B', 5, NOW(), NOW()),
(3, 'Chromosomes are most visible during:', 'Interphase', 'Prophase', 'Telophase', 'Cytokinesis', 'B', 5, NOW(), NOW()),
(3, 'The powerhouse of the cell produces ATP through:', 'Glycolysis', 'Krebs cycle', 'Oxidative phosphorylation', 'Fermentation', 'C', 5, NOW(), NOW()),
(3, 'Which organelle contains digestive enzymes?', 'Mitochondria', 'Chloroplast', 'Lysosome', 'Vacuole', 'C', 5, NOW(), NOW()),
(3, 'The cell wall of plant cells is composed of:', 'Cellulose', 'Chitin', 'Peptidoglycan', 'Lipid', 'A', 5, NOW(), NOW()),
(3, 'Vacuoles in plant cells are responsible for:', 'Protein synthesis', 'Storage and turgidity', 'Energy production', 'Cell division', 'B', 5, NOW(), NOW()),
(3, 'The site of photosynthesis in a cell is:', 'Mitochondria', 'Chloroplast', 'Ribosome', 'Nucleus', 'B', 5, NOW(), NOW()),
(3, 'Endoplasmic reticulum with ribosomes is called:', 'Smooth ER', 'Rough ER', 'Granular ER', 'Both B and C', 'D', 5, NOW(), NOW()),
(3, 'The process of movement of water across a semipermeable membrane is called:', 'Osmosis', 'Diffusion', 'Active transport', 'Pinocytosis', 'A', 5, NOW(), NOW()),
(3, 'Which organelle is involved in detoxification?', 'Lysosome', 'Peroxisome', 'Ribosome', 'Vacuole', 'B', 5, NOW(), NOW()),
(3, 'The genetic code is:', 'Ambiguous', 'Degenerate', 'Non-universal', 'Linear', 'B', 5, NOW(), NOW()),
(3, 'RNA polymerase is responsible for:', 'DNA replication', 'Protein synthesis', 'Transcription', 'Translation', 'C', 5, NOW(), NOW()),
(3, 'The control center of the cell is:', 'Mitochondria', 'Nucleus', 'Ribosome', 'Golgi apparatus', 'B', 5, NOW(), NOW()),
(3, 'Plasmids are found in:', 'Animal cells', 'Plant cells', 'Bacterial cells', 'Fungal cells', 'C', 5, NOW(), NOW());

-- Show success message
SELECT 'Database and tables created successfully!' AS Status;

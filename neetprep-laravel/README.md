# NEET Prep Backend API (MySQL)

Laravel-based REST API for the NEET Prep Online Examination Portal.

## Requirements

- PHP 8.2+
- Composer
- MySQL 5.7+ (recommended) or 8.0+

## Installation

1. Navigate to the backend directory:
```bash
cd neetprep-laravel
```

2. Install dependencies:
```bash
composer install
```

3. Copy environment file:
```bash
cp .env.example .env
```

4. Create MySQL database:
```bash
# Login to MySQL
mysql -u root -p

# Run these commands in MySQL:
CREATE DATABASE neetprep CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

Or use phpMyAdmin:
- Create a new database named `neetprep`
- Select utf8mb4_unicode_ci as collation
- Import `mysql-setup.sql` from the project root

5. Update `.env` with your MySQL credentials:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=neetprep
DB_USERNAME=root
DB_PASSWORD=your_password
```

6. Generate application key:
```bash
php artisan key:generate
```

7. Generate JWT secret:
```bash
php artisan jwt:secret
```

8. Run migrations:
```bash
php artisan migrate
```

9. Seed the database with sample data:
```bash
php artisan db:seed
```

10. Start the development server:
```bash
php artisan serve
```

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/register` | User registration |
| POST | `/api/auth/logout` | User logout |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/auth/refresh` | Refresh JWT token |

### Subjects (Public)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/subjects` | Get all subjects |
| GET | `/api/subjects/active` | Get active subjects |
| GET | `/api/subjects/{id}` | Get subject by ID |

### Topics (Public)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/subjects/{id}/topics` | Get topics for subject |
| GET | `/api/subjects/{subjectId}/topics/{id}` | Get topic by ID |

### Exams (Public)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/exams` | Get all exams |
| GET | `/api/exams/active` | Get active exams |
| GET | `/api/exams/subject/{id}` | Get exams by subject |
| GET | `/api/exams/{id}` | Get exam by ID |

### Questions (Public)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/exams/{examId}/questions` | Get questions for exam |
| GET | `/api/exams/{examId}/questions/{id}` | Get question by ID |

### Exam Attempts (User)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/exam-attempts/start` | Start exam attempt |
| POST | `/api/exam-attempts/{id}/submit` | Submit exam |
| GET | `/api/exam-attempts/{id}` | Get attempt details |
| GET | `/api/exam-attempts/my` | Get user's attempts |
| GET | `/api/exam-attempts/my/performance` | Get user's performance |

### Admin Only

#### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/users` | Get all users |
| POST | `/api/admin/users` | Create user |
| GET | `/api/admin/users/{id}` | Get user by ID |
| PUT | `/api/admin/users/{id}` | Update user |
| PATCH | `/api/admin/users/{id}/toggle-status` | Toggle user status |
| DELETE | `/api/admin/users/{id}` | Delete user |
| PUT | `/api/admin/users/{id}/notes` | Update user notes |

#### Subjects Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/subjects` | Create subject |
| PUT | `/api/admin/subjects/{id}` | Update subject |
| PATCH | `/api/admin/subjects/{id}/toggle-status` | Toggle status |
| DELETE | `/api/admin/subjects/{id}` | Delete subject |

#### Topics Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/subjects/{id}/topics` | Create topic |
| PUT | `/api/admin/subjects/{id}/topics/{topicId}` | Update topic |
| DELETE | `/api/admin/subjects/{id}/topics/{topicId}` | Delete topic |

#### Exams Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/exams` | Create exam |
| PUT | `/api/admin/exams/{id}` | Update exam |
| PATCH | `/api/admin/exams/{id}/toggle-status` | Toggle status |
| DELETE | `/api/admin/exams/{id}` | Delete exam |

#### Questions Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/exams/{id}/questions` | Create question |
| PUT | `/api/admin/exams/{id}/questions/{qId}` | Update question |
| DELETE | `/api/admin/exams/{id}/questions/{qId}` | Delete question |

#### Performance

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/performance` | Get all attempts |
| GET | `/api/admin/performance/student/{id}` | Get student performance |

## Authentication

The API uses JWT (JSON Web Token) authentication. Include the token in the Authorization header:

```
Authorization: Bearer your-jwt-token
```

## Demo Credentials

### Admin Account
- Email: `admin@neetprep.com`
- Password: `admin123`

### User Account
- Email: `john@neetprep.com`
- Password: `user123`

## Example API Usage

### Login
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@neetprep.com", "password": "admin123"}'
```

### Get Subjects
```bash
curl http://localhost:8000/api/subjects \
  -H "Authorization: Bearer your-token-here"
```

### Start Exam
```bash
curl -X POST http://localhost:8000/api/exam-attempts/start \
  -H "Authorization: Bearer your-token-here" \
  -H "Content-Type: application/json" \
  -d '{"exam_id": 1}'
```

### Submit Exam
```bash
curl -X POST http://localhost:8000/api/exam-attempts/1/submit \
  -H "Authorization: Bearer your-token-here" \
  -H "Content-Type: application/json" \
  -d '{"answers": [{"question_id": 1, "selected_answer": "B"}]}'
```

## Tech Stack

- **Framework**: Laravel 11
- **Authentication**: JWT (tymon/jwt-auth)
- **Database**: SQLite/MySQL/PostgreSQL
- **API**: RESTful

## License

MIT License

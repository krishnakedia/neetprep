# AGENTS.md

## Project Overview
Laravel 11 REST API for NEET Prep Online Examination Portal.

## Setup Commands
```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan jwt:secret
php artisan migrate
php artisan db:seed
php artisan serve
```

## Key Commands
```bash
php artisan migrate          # Run migrations
php artisan db:seed         # Seed demo data
php artisan jwt:secret      # Generate JWT secret
php artisan serve           # Start dev server (localhost:8000)
```

## Auth Setup
- JWT via `tymon/jwt-auth` with custom guard in `app/Extensions/JWTGuard.php`
- Default TTL: 60 minutes (configured in `config/jwt.php`)
- Guard: `auth('api')` (configured in `config/auth.php`)
- Custom role middleware `role:admin` in `app/Http/Middleware/CheckRole.php`
- Custom provider `JWTAuthServiceProvider` registered in `bootstrap/providers.php`

## API Routes
- Entry: `routes/api.php`
- Auth: `/api/auth/login`, `/api/auth/register`, `/api/auth/logout`, `/api/auth/me`, `/api/auth/refresh`
- Public: `/api/subjects`, `/api/exams`, `/api/questions`
- Protected: `/api/exam-attempts/*`, `/api/bookmarks/*`
- Admin: `/api/admin/*` (requires `role:admin` middleware)

## Demo Credentials
- Admin: `admin@neetprep.com` / `admin123`
- User: `john@neetprep.com` / `user123`

## Architecture Notes
- Controllers: `app/Http/Controllers/Api/`
- Models: `app/Models/`
- Middleware: `app/Http/Middleware/CheckRole.php`
- Extensions: `app/Extensions/JWTGuard.php`
- Data stores: `database/migrations/`, `database/seeders/`

## Not in README (API Gaps)
- `/api/chapters` endpoints (GET all, GET by subject)
- `/api/bookmarks` endpoints (CRUD for question bookmarks)
- Chapters and Bookmarks are registered routes but undocumented

## Database
- MySQL by default; supports SQLite/PostgreSQL
- Cache and session drivers default to `database`
- Migration files have non-sequential timestamps (intentional)

## Testing
- No `tests/` directory currently exists
- Dev deps include `phpunit/phpunit`, `fakerphp/faker`, `mockery/mockery`, `laravel/sail`

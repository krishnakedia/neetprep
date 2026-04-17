# NEET Prep

Angular 21 frontend + Laravel 11 backend (monorepo).

## Project Structure

```
neetprep/              # Angular 21 frontend (localhost:4200)
├── src/app/           # Components, services, guards, interceptors
├── src/assets/        # Static assets
├── angular.json       # Build config
├── package.json       # npm scripts and dependencies
└── dist/              # Build output

neetprep-laravel/      # Laravel 11 REST API (localhost:8000)
├── app/               # Controllers, Models, Middleware
├── routes/api.php     # API routes
├── database/          # Migrations and seeders
└── .env               # Database + JWT config
```

## Commands

### Frontend (Angular)
```bash
npm install              # Install dependencies
npm start                # Dev server (localhost:4200)
npm run build            # Production build -> dist/neet-prep
ng test                  # Run tests
```

### Backend (Laravel)
```bash
cd neetprep-laravel
composer install
cp .env.example .env
php artisan key:generate
php artisan jwt:secret
php artisan migrate
php artisan db:seed
php artisan serve        # localhost:8000
```

## API Connection

Frontend connects to backend at `http://127.0.0.1:8000/api` (hardcoded in services).

**Start both servers for full functionality:**
1. `php artisan serve` (Laravel - port 8000)
2. `npm start` (Angular - port 4200)

## Demo Credentials
- Admin: `admin@neetprep.com` / `admin123`
- User: `john@neetprep.com` / `user123`

## Architecture Notes

- **Auth**: JWT tokens stored in localStorage; intercepted by `src/app/interceptors/auth.interceptor.ts`
- **Routing**: Lazy-loaded components with `AuthGuard` and `AdminGuard`
- **State**: RxJS BehaviorSubjects in services (no NgRx)
- **Models**: Defined in `src/app/models/models.ts`

## Pending Work

See `issues.txt`:
- Add chapters/topics hierarchy to subjects
- Connect frontend to live API endpoints
- Fix responsive styling
- Redesign questions page with difficulty/year/type filters

## Backend Details

See `neetprep-laravel/AGENTS.md` for detailed Laravel setup, API routes, and architecture.

# Gyan Vikash - Online Examination Portal

A comprehensive Angular-based online examination system for Gyan Vikasharation.

## Features

### Admin Panel
- **User Management**: Enable/disable users, view all registered users
- **Subject Management**: Create subjects with custom icons and colors, add topics
- **Exam Management**: Create exams, assign to subjects, set duration and marks
- **Question Management**: Add questions with 4-option format (A, B, C, D) with correct answer marking
- **Performance Analytics**: View all student performance, track progress, review notes

### User Panel
- **Dashboard**: View available subjects and exams
- **Take Exams**: Start timed exams with question navigation
- **View Results**: See scores and performance after completing exams
- **Add Notes**: Share thoughts and learning notes after each exam

## Demo Credentials

### Admin Account
- Email: `admin@neetprep.com`
- Password: `admin123`

### User Account
- Email: `john@neetprep.com`
- Password: `user123`

## Installation

1. Install Node.js (v18 or higher)

2. Install Angular CLI:
```bash
npm install -g @angular/cli
```

3. Navigate to project directory:
```bash
cd neetprep
```

4. Install dependencies:
```bash
npm install
```

5. Start the development server:
```bash
npm start
# or
ng serve
```

6. Open your browser and navigate to:
```
http://localhost:4200
```

## Tech Stack

- **Frontend**: Angular 17
- **Styling**: SCSS with custom CSS
- **Icons**: Font Awesome 6
- **Fonts**: Poppins (Google Fonts)
- **State Management**: RxJS BehaviorSubjects
- **Routing**: Angular Router with Guards

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── admin/
│   │   │   ├── admin-dashboard/
│   │   │   ├── user-management/
│   │   │   ├── subject-management/
│   │   │   ├── exam-management/
│   │   │   ├── question-management/
│   │   │   ├── student-performance/
│   │   │   └── student-details/
│   │   ├── user/
│   │   │   ├── user-dashboard/
│   │   │   ├── exam/
│   │   │   └── exam-result/
│   │   └── login/
│   ├── guards/
│   │   └── auth.guard.ts
│   ├── models/
│   │   └── models.ts
│   └── services/
│       ├── auth.service.ts
│       ├── exam.service.ts
│       └── subject.service.ts
├── styles.scss
└── index.html
```

## Key Features

### Question Format
All questions support 4-option format with:
- Option A, B, C, D
- Single correct answer selection
- Marks per question

### User Status Control
Admins can enable/disable users. Disabled users cannot log in.

### Exam Status Control
Admins can activate/deactivate exams. Only active exams are visible to users.

### Timer System
- Countdown timer during exam
- Auto-submit when time expires
- Visual warning when time is low

## License

This project is for educational purposes.

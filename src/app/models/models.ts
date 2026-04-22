export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'user';
  is_active: boolean;
  createdAt: Date;
  notes?: string;
  is_assigned?: boolean;
  assigned_at?: Date;
}

export interface Subject {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  is_active: boolean;
  createdAt: Date;
  chapters?: Chapter[];
  topics?: Topic[];
}

export interface Chapter {
  id: string;
  subject_id: string;
  name: string;
  description: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  topics?: Topic[];
}

export interface Topic {
  id: string;
  subject_id: string;
  chapterId?: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: Date;
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  subject_id: string;
  chapterId?: string;
  topicIds: string[];
  duration: number;
  total_marks: number;
  passingMarks: number;
  is_active: boolean;
  createdAt: Date;
  questions?: Question[];
  questionCount?: number;
  subject?: Subject;
  chapter?: Chapter;
}

export interface Question {
  id: string;
  examId: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: 'A' | 'B' | 'C' | 'D';
  marks: number;
  ncert?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  year?: number;
  question_type?: 'theory' | 'numerical' | 'diagram' | 'assertion_reason' | 'multiple_correct';
  createdAt: Date;
}

export interface ExamAttempt {
  id: string;
  userId: string;
  examId: string;
  examTitle: string;
  startedAt: Date;
  completedAt?: Date;
  score: number;
  total_marks: number;
  percentage: number;
  status: string;
  answers?: ExamAnswer[];
  notes?: string;
}
// status: 'in-progress' | 'completed';

export interface ExamAnswer {
  questionId: string;
  selectedAnswer: 'A' | 'B' | 'C' | 'D' | null;
  isCorrect: boolean;
  marksObtained: number;
}

export interface PerformanceStats {
  totalExamsTaken: number;
  totalScore: number;
  averagePercentage: number;
  highestScore: number;
  lowestScore: number;
  examsBySubject: { subjectName: string; percentage: number }[];
  recentAttempts: ExamAttempt[];
}

export interface AuthResponse {
  user: User;
  token: string;
}
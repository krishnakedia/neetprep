export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface BaseEntity {
  id: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface User extends BaseEntity {
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'user';
  isActive: boolean;
  notes?: string;
}

export interface Subject extends BaseEntity {
  name: string;
  description: string;
  icon: string;
  color: string;
  isActive: boolean;
  chapters?: Chapter[];
  topics?: Topic[];
}

export interface Chapter extends BaseEntity {
  subject_id: string;
  name: string;
  description: string;
  order: number;
  isActive: boolean;
  topics?: Topic[];
}

export interface Topic extends BaseEntity {
  subject_id: string;
  chapterId?: string;
  name: string;
  description: string;
  isActive: boolean;
}

export interface Exam extends BaseEntity {
  title: string;
  description: string;
  subject_id: string;
  chapterId?: string;
  topicIds: string[];
  duration: number;
  totalMarks: number;
  passingMarks: number;
  isActive: boolean;
  questions?: Question[];
  questionCount?: number;
  subject?: Subject;
  chapter?: Chapter;
}

export interface Question extends BaseEntity {
  examId: string;
  question_text: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  marks: number;
  ncert?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  year?: number;
  question_type?: 'theory' | 'numerical' | 'diagram' | 'assertion_reason' | 'multiple_correct';
}

export interface ExamAttempt extends BaseEntity {
  userId: string;
  examId: string;
  examTitle: string;
  startedAt: Date;
  completedAt?: Date;
  score: number;
  totalMarks: number;
  percentage: number;
  status: 'in-progress' | 'completed';
  answers?: ExamAnswer[];
  notes?: string;
}

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

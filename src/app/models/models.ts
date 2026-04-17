export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'user';
  isActive: boolean;
  createdAt: Date;
  notes?: string;
}

export interface Subject {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  isActive: boolean;
  createdAt: Date;
  chapters?: Chapter[];
  topics?: Topic[];
}

export interface Chapter {
  id: string;
  subjectId: string;
  name: string;
  description: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  topics?: Topic[];
}

export interface Topic {
  id: string;
  subjectId: string;
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
  subjectId: string;
  chapterId?: string;
  topicIds: string[];
  duration: number;
  totalMarks: number;
  passingMarks: number;
  isActive: boolean;
  createdAt: Date;
  questions?: Question[];
  questionCount?: number;
  subject?: Subject;
  chapter?: Chapter;
}

export interface Question {
  id: string;
  examId: string;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  marks: number;
  ncert?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  year?: number;
  questionType?: 'theory' | 'numerical' | 'diagram' | 'assertion_reason' | 'multiple_correct';
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
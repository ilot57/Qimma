// Import and re-export database types
import type { Tables, TablesInsert, TablesUpdate } from './database';

export type { Database, Tables, TablesInsert, TablesUpdate } from './database';

// Utility type aliases for easier usage
export type User = Tables<'users'>;
export type UserInsert = TablesInsert<'users'>;
export type UserUpdate = TablesUpdate<'users'>;

export type Exam = Tables<'exams'>;
export type ExamInsert = TablesInsert<'exams'>;
export type ExamUpdate = TablesUpdate<'exams'>;

export type StudentSubmission = Tables<'student_submissions'>;
export type StudentSubmissionInsert = TablesInsert<'student_submissions'>;
export type StudentSubmissionUpdate = TablesUpdate<'student_submissions'>;

export type CreditTransaction = Tables<'credit_transactions'>;
export type CreditTransactionInsert = TablesInsert<'credit_transactions'>;
export type CreditTransactionUpdate = TablesUpdate<'credit_transactions'>;

// Enums based on database constraints
export enum UserRole {
  STUDENT = 'student',
  TEACHER = 'teacher',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
}

export enum SubscriptionTier {
  FREE = 'free',
  STANDARD = 'standard',
  PLUS = 'plus',
  FULL = 'full',
}

export enum ExamStatus {
  DRAFT = 'draft',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  ERROR = 'error',
}

export enum ProcessingStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  ERROR = 'error',
}

export enum TransactionType {
  PURCHASE = 'purchase',
  USAGE = 'usage',
  REFUND = 'refund',
  BONUS = 'bonus',
}

// Extended types with relationships
export interface UserWithProfile extends User {
  fullName: string;
  displayName: string;
  isAdmin: boolean;
  canCreateExams: boolean;
}

export interface ExamWithTeacher extends Exam {
  teacher: Pick<User, 'id' | 'first_name' | 'last_name' | 'email'>;
}

export interface ExamWithSubmissions extends Exam {
  submissions: StudentSubmission[];
  submissionCount: number;
  averageScore: number | null;
}

export interface StudentSubmissionWithExam extends StudentSubmission {
  exam: Pick<Exam, 'id' | 'title' | 'subject' | 'grade_level' | 'total_points'>;
}

export interface CreditTransactionWithDetails extends CreditTransaction {
  exam?: Pick<Exam, 'id' | 'title'>;
  user: Pick<User, 'id' | 'first_name' | 'last_name' | 'email'>;
}

// AI Feedback structure
export interface AIFeedback {
  overall_score: number;
  max_score: number;
  percentage: number;
  questions: QuestionFeedback[];
  summary: string;
  strengths: string[];
  improvements: string[];
  processing_time: number;
  confidence_score: number;
}

export interface QuestionFeedback {
  question_number: number;
  question_text: string;
  student_answer: string;
  expected_answer: string;
  score: number;
  max_score: number;
  feedback: string;
  partial_credit_reasons?: string[];
  confidence: number;
}

// File upload types
export interface FileUploadProgress {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
  url?: string;
}

export interface ExamFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: Date;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Dashboard statistics
export interface DashboardStats {
  totalExams: number;
  completedExams: number;
  processingExams: number;
  totalSubmissions: number;
  averageScore: number | null;
  creditsRemaining: number;
  recentActivity: RecentActivity[];
}

export interface RecentActivity {
  id: string;
  type:
    | 'exam_created'
    | 'exam_completed'
    | 'submission_processed'
    | 'credits_purchased';
  title: string;
  description: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

// Form types
export interface CreateExamForm {
  title: string;
  subject: string;
  grade_level: string;
  description?: string;
  total_points: number;
  reference_file?: File;
}

export interface UploadSubmissionsForm {
  exam_id: string;
  files: File[];
}

export interface UserProfileForm {
  first_name?: string;
  last_name?: string;
  email: string;
}

// Search and filter types
export interface ExamFilters {
  status?: ExamStatus[];
  subject?: string[];
  grade_level?: string[];
  date_range?: {
    start: Date;
    end: Date;
  };
  search?: string;
}

export interface SubmissionFilters {
  processing_status?: ProcessingStatus[];
  score_range?: {
    min: number;
    max: number;
  };
  date_range?: {
    start: Date;
    end: Date;
  };
  search?: string;
}

// Credit system types
export interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price: number;
  description: string;
  popular?: boolean;
}

export interface SubscriptionPlan {
  id: SubscriptionTier;
  name: string;
  credits: number;
  price: number;
  features: string[];
  popular?: boolean;
}

// Error types
export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
}

// Storage types
export type StorageBucket =
  | 'exam-files'
  | 'student-submissions'
  | 'processed-results';

export interface StorageFile {
  name: string;
  size: number;
  type: string;
  lastModified: Date;
  bucket: StorageBucket;
  path: string;
}

// Webhook types
export interface ClerkWebhookEvent {
  type: string;
  data: {
    id: string;
    email_addresses: Array<{ email_address: string }>;
    first_name?: string;
    last_name?: string;
    created_at: number;
    updated_at: number;
  };
}

// Export utility functions for type guards
export const isUserRole = (role: string): role is UserRole => {
  return Object.values(UserRole).includes(role as UserRole);
};

export const isSubscriptionTier = (tier: string): tier is SubscriptionTier => {
  return Object.values(SubscriptionTier).includes(tier as SubscriptionTier);
};

export const isExamStatus = (status: string): status is ExamStatus => {
  return Object.values(ExamStatus).includes(status as ExamStatus);
};

export const isProcessingStatus = (
  status: string
): status is ProcessingStatus => {
  return Object.values(ProcessingStatus).includes(status as ProcessingStatus);
};

export const isTransactionType = (type: string): type is TransactionType => {
  return Object.values(TransactionType).includes(type as TransactionType);
};

import { z } from 'zod';

// ================================
// AUTH SCHEMAS
// ================================

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters'),
});

export const signupSchema = z
  .object({
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Please enter a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one lowercase letter, one uppercase letter, and one number'
      ),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    name: z
      .string()
      .min(1, 'Name is required')
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name must be less than 50 characters'),
    acceptTerms: z
      .boolean()
      .refine(
        (val) => val === true,
        'You must accept the terms and conditions'
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// ================================
// USER PROFILE SCHEMAS
// ================================

export const profileSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),
  email: z.string().email('Please enter a valid email address'),
  language: z.enum(['en', 'fr', 'ar'], {
    errorMap: () => ({ message: 'Please select a valid language' }),
  }),
  notifications: z.object({
    email: z.boolean(),
    push: z.boolean(),
    marketing: z.boolean(),
  }),
  timezone: z.string().min(1, 'Please select a timezone'),
});

// ================================
// EXAM CREATION SCHEMAS
// ================================

export const examMetadataSchema = z.object({
  title: z
    .string()
    .min(1, 'Exam title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters'),
  subject: z.enum(['math', 'science', 'language', 'history', 'other'], {
    errorMap: () => ({ message: 'Please select a subject' }),
  }),
  gradeLevel: z.enum(['elementary', 'middle', 'high', 'university'], {
    errorMap: () => ({ message: 'Please select a grade level' }),
  }),
  description: z
    .string()
    .max(500, 'Description must be less than 500 characters')
    .optional(),
  tags: z.array(z.string()).max(5, 'Maximum 5 tags allowed').optional(),
  totalPoints: z
    .number()
    .min(1, 'Total points must be at least 1')
    .max(1000, 'Total points cannot exceed 1000'),
  timeLimit: z
    .number()
    .min(15, 'Time limit must be at least 15 minutes')
    .max(480, 'Time limit cannot exceed 8 hours')
    .optional(),
});

export const fileUploadSchema = z.object({
  files: z
    .array(
      z.object({
        name: z.string(),
        size: z
          .number()
          .max(50 * 1024 * 1024, 'File size must be less than 50MB'),
        type: z
          .string()
          .refine(
            (type) =>
              ['application/pdf', 'image/jpeg', 'image/png'].includes(type),
            'Only PDF, JPEG, and PNG files are allowed'
          ),
      })
    )
    .min(1, 'At least one file is required')
    .max(10, 'Maximum 10 files allowed'),
});

// ================================
// PAYMENT SCHEMAS
// ================================

export const creditPurchaseSchema = z.object({
  package: z.enum(['small', 'medium', 'large', 'premium'], {
    errorMap: () => ({ message: 'Please select a credit package' }),
  }),
  paymentMethod: z.enum(['card', 'paypal'], {
    errorMap: () => ({ message: 'Please select a payment method' }),
  }),
});

export const subscriptionSchema = z.object({
  plan: z.enum(['free', 'standard', 'plus', 'full'], {
    errorMap: () => ({ message: 'Please select a subscription plan' }),
  }),
  billingCycle: z.enum(['monthly', 'annual'], {
    errorMap: () => ({ message: 'Please select a billing cycle' }),
  }),
});

// ================================
// FEEDBACK AND GRADING SCHEMAS
// ================================

export const gradingCriteriaSchema = z.object({
  questionId: z.string().min(1, 'Question ID is required'),
  points: z
    .number()
    .min(0, 'Points cannot be negative')
    .max(100, 'Points cannot exceed 100'),
  feedback: z
    .string()
    .max(1000, 'Feedback must be less than 1000 characters')
    .optional(),
  rubric: z
    .array(
      z.object({
        criteria: z.string(),
        points: z.number().min(0).max(10),
        description: z.string().optional(),
      })
    )
    .optional(),
});

export const bulkGradingSchema = z.object({
  examId: z.string().min(1, 'Exam ID is required'),
  adjustments: z.array(
    z.object({
      studentId: z.string(),
      questionId: z.string(),
      newGrade: z.number().min(0).max(100),
      reason: z.string().optional(),
    })
  ),
});

// ================================
// SEARCH AND FILTER SCHEMAS
// ================================

export const examFilterSchema = z.object({
  search: z.string().optional(),
  subject: z.string().optional(),
  gradeLevel: z.string().optional(),
  status: z.enum(['draft', 'processing', 'completed', 'archived']).optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  sortBy: z.enum(['title', 'date', 'grade', 'status']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

// ================================
// TYPE EXPORTS
// ================================

export type LoginForm = z.infer<typeof loginSchema>;
export type SignupForm = z.infer<typeof signupSchema>;
export type ProfileForm = z.infer<typeof profileSchema>;
export type ExamMetadataForm = z.infer<typeof examMetadataSchema>;
export type FileUploadForm = z.infer<typeof fileUploadSchema>;
export type CreditPurchaseForm = z.infer<typeof creditPurchaseSchema>;
export type SubscriptionForm = z.infer<typeof subscriptionSchema>;
export type GradingCriteriaForm = z.infer<typeof gradingCriteriaSchema>;
export type BulkGradingForm = z.infer<typeof bulkGradingSchema>;
export type ExamFilterForm = z.infer<typeof examFilterSchema>;

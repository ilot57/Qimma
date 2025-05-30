-- Migration: 001_initial_schema.sql
-- Description: Initial database schema for Qimma AI platform
-- Created: 2025-05-30
-- Author: Qimma AI Development Team

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- USERS TABLE
-- Synced with Clerk user data
-- =====================================================

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clerk_user_id TEXT UNIQUE NOT NULL,
    email TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    role TEXT DEFAULT 'teacher' CHECK (role IN ('student', 'teacher', 'admin', 'super_admin')),
    subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'standard', 'plus', 'full')),
    credits_remaining INTEGER DEFAULT 30,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- =====================================================
-- EXAMS TABLE
-- Store exam metadata and configurations
-- =====================================================

CREATE TABLE IF NOT EXISTS exams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    subject TEXT NOT NULL,
    grade_level TEXT NOT NULL,
    description TEXT,
    total_points INTEGER DEFAULT 100,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'processing', 'completed', 'error')),
    reference_file_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_exams_teacher_id ON exams(teacher_id);
CREATE INDEX IF NOT EXISTS idx_exams_status ON exams(status);
CREATE INDEX IF NOT EXISTS idx_exams_created_at ON exams(created_at);

-- =====================================================
-- STUDENT SUBMISSIONS TABLE
-- Store individual student exam submissions
-- =====================================================

CREATE TABLE IF NOT EXISTS student_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
    student_name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    processing_status TEXT DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processing', 'completed', 'error')),
    total_score DECIMAL(5,2),
    max_score DECIMAL(5,2),
    ai_feedback JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_submissions_exam_id ON student_submissions(exam_id);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON student_submissions(processing_status);

-- =====================================================
-- CREDIT TRANSACTIONS TABLE
-- Track credit usage and purchases
-- =====================================================

CREATE TABLE IF NOT EXISTS credit_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    transaction_type TEXT NOT NULL CHECK (transaction_type IN ('purchase', 'usage', 'refund', 'bonus')),
    amount INTEGER NOT NULL, -- Positive for additions, negative for usage
    description TEXT,
    exam_id UUID REFERENCES exams(id),
    stripe_transaction_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_credit_transactions_user_id ON credit_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_type ON credit_transactions(transaction_type);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- USERS TABLE POLICIES
-- =====================================================

-- Users can read their own data
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (clerk_user_id = auth.jwt() ->> 'sub');

-- Users can update their own data
CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (clerk_user_id = auth.jwt() ->> 'sub');

-- Admins can view all users
CREATE POLICY "Admins can view all users" ON users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users u 
            WHERE u.clerk_user_id = auth.jwt() ->> 'sub' 
            AND u.role IN ('admin', 'super_admin')
        )
    );

-- =====================================================
-- EXAMS TABLE POLICIES
-- =====================================================

-- Teachers can view their own exams
CREATE POLICY "Teachers can view own exams" ON exams
    FOR SELECT USING (
        teacher_id = (
            SELECT id FROM users 
            WHERE clerk_user_id = auth.jwt() ->> 'sub'
        )
    );

-- Teachers can create exams
CREATE POLICY "Teachers can create exams" ON exams
    FOR INSERT WITH CHECK (
        teacher_id = (
            SELECT id FROM users 
            WHERE clerk_user_id = auth.jwt() ->> 'sub'
        )
    );

-- Teachers can update their own exams
CREATE POLICY "Teachers can update own exams" ON exams
    FOR UPDATE USING (
        teacher_id = (
            SELECT id FROM users 
            WHERE clerk_user_id = auth.jwt() ->> 'sub'
        )
    );

-- Teachers can delete their own exams
CREATE POLICY "Teachers can delete own exams" ON exams
    FOR DELETE USING (
        teacher_id = (
            SELECT id FROM users 
            WHERE clerk_user_id = auth.jwt() ->> 'sub'
        )
    );

-- =====================================================
-- STUDENT SUBMISSIONS TABLE POLICIES
-- =====================================================

-- Teachers can view submissions for their exams
CREATE POLICY "Teachers can view submissions for own exams" ON student_submissions
    FOR SELECT USING (
        exam_id IN (
            SELECT id FROM exams 
            WHERE teacher_id = (
                SELECT id FROM users 
                WHERE clerk_user_id = auth.jwt() ->> 'sub'
            )
        )
    );

-- Teachers can insert submissions for their exams
CREATE POLICY "Teachers can create submissions for own exams" ON student_submissions
    FOR INSERT WITH CHECK (
        exam_id IN (
            SELECT id FROM exams 
            WHERE teacher_id = (
                SELECT id FROM users 
                WHERE clerk_user_id = auth.jwt() ->> 'sub'
            )
        )
    );

-- Teachers can update submissions for their exams
CREATE POLICY "Teachers can update submissions for own exams" ON student_submissions
    FOR UPDATE USING (
        exam_id IN (
            SELECT id FROM exams 
            WHERE teacher_id = (
                SELECT id FROM users 
                WHERE clerk_user_id = auth.jwt() ->> 'sub'
            )
        )
    );

-- =====================================================
-- CREDIT TRANSACTIONS TABLE POLICIES
-- =====================================================

-- Users can view their own credit transactions
CREATE POLICY "Users can view own credit transactions" ON credit_transactions
    FOR SELECT USING (
        user_id = (
            SELECT id FROM users 
            WHERE clerk_user_id = auth.jwt() ->> 'sub'
        )
    );

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_exams_updated_at BEFORE UPDATE ON exams
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_submissions_updated_at BEFORE UPDATE ON student_submissions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- STORAGE BUCKETS AND POLICIES
-- =====================================================

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('exam-files', 'exam-files', false) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('student-submissions', 'student-submissions', false) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('processed-results', 'processed-results', false) ON CONFLICT DO NOTHING; 
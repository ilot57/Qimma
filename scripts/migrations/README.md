# Database Migrations

This directory contains database migration files for the Qimma AI platform.

## Overview

Migrations are SQL files that define incremental changes to the database schema. They are applied in order and tracked to ensure consistency across environments.

## File Naming Convention

Migration files should follow this naming pattern:
```
{number}_{description}.sql
```

Examples:
- `001_initial_schema.sql`
- `002_add_questions_table.sql`
- `003_add_feedback_indexes.sql`

## Running Migrations

### Apply all pending migrations:
```bash
npm run db:migrate
```

### Set up database from scratch:
```bash
npm run db:setup
```

## Migration Structure

Each migration file should:

1. **Include a header comment** with description and metadata
2. **Use IF NOT EXISTS** for CREATE statements when possible
3. **Be idempotent** - safe to run multiple times
4. **Include rollback instructions** in comments if needed

### Example Migration File:

```sql
-- Migration: 002_add_questions_table.sql
-- Description: Add questions table for storing exam questions
-- Created: 2025-05-30
-- Author: Qimma AI Development Team

-- Create questions table
CREATE TABLE IF NOT EXISTS questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
    question_number INTEGER NOT NULL,
    question_text TEXT NOT NULL,
    max_points DECIMAL(5,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_questions_exam_id ON questions(exam_id);
CREATE INDEX IF NOT EXISTS idx_questions_number ON questions(exam_id, question_number);

-- Enable RLS
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

-- Add RLS policies
CREATE POLICY "Teachers can manage questions for own exams" ON questions
    FOR ALL USING (
        exam_id IN (
            SELECT id FROM exams 
            WHERE teacher_id = (
                SELECT id FROM users 
                WHERE clerk_user_id = auth.jwt() ->> 'sub'
            )
        )
    );
```

## Migration Tracking

The system automatically tracks applied migrations in a `migrations` table:

```sql
CREATE TABLE migrations (
    id TEXT PRIMARY KEY,
    filename TEXT NOT NULL,
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Best Practices

1. **Test migrations** on a copy of production data before applying
2. **Keep migrations small** and focused on a single change
3. **Never modify existing migrations** once they've been applied to production
4. **Use transactions** for complex migrations when possible
5. **Document breaking changes** clearly in migration comments
6. **Backup database** before applying migrations in production

## Rollback Strategy

While the migration system doesn't include automatic rollbacks, you can:

1. **Create a new migration** to undo changes
2. **Use database backups** to restore to a previous state
3. **Document rollback steps** in migration comments

## Environment Variables

Ensure these environment variables are set:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Troubleshooting

### Migration fails with permission error
- Ensure you're using the service role key, not the anon key
- Check that the service role has necessary permissions

### Migration appears to hang
- Check for long-running queries or locks
- Consider breaking large migrations into smaller chunks

### Migration tracking table missing
- Run `npm run db:migrate` - it will create the table automatically

## Security Notes

- Migration files may contain sensitive schema information
- Service role key has elevated permissions - keep it secure
- Review all migrations before applying to production
- Consider using separate databases for development/staging/production 
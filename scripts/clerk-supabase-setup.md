# Clerk-Supabase Integration Setup Guide

This guide walks you through setting up the integration between Clerk authentication and Supabase database for the Qimma AI platform.

## Prerequisites

- ✅ Clerk account with active application
- ✅ Supabase project created
- ✅ Clerk API keys configured in .env.local
- ⚠️ Supabase API keys needed in .env.local

## Step 1: Add Supabase Environment Variables

Add these to your `.env.local` file:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
```

**Where to find these values:**

1. Go to your Supabase project dashboard
2. Navigate to Settings → API
3. Copy the Project URL and anon/public key
4. Copy the service_role key (keep this secret!)

## Step 2: Configure Clerk JWT Template

### 2.1 Create Supabase JWT Template in Clerk

1. Go to your Clerk Dashboard
2. Navigate to **JWT Templates** in the sidebar
3. Click **New template**
4. Choose **Supabase** from the template gallery (or create blank)
5. Set the template name to: `supabase`

### 2.2 Configure the JWT Template

Use this configuration for your Supabase JWT template:

```json
{
  "aud": "authenticated",
  "email": "{{user.primary_email_address}}",
  "phone": "{{user.primary_phone_number}}",
  "app_metadata": {
    "provider": "clerk",
    "providers": ["clerk"]
  },
  "user_metadata": {
    "first_name": "{{user.first_name}}",
    "last_name": "{{user.last_name}}",
    "full_name": "{{user.full_name}}"
  },
  "role": "authenticated"
}
```

### 2.3 Set the Signing Key

1. In the JWT template configuration
2. Set the **Signing algorithm** to `HS256`
3. For the **Signing key**, use your Supabase JWT secret:
   - Go to Supabase Dashboard → Settings → API
   - Copy the JWT Secret
   - Paste it in the Clerk JWT template signing key field

## Step 3: Set Up Supabase Database

### 3.1 ✅ Database Schema Applied Successfully

The database schema has been successfully created via MCP (Model Context Protocol) tools with the following migration:

**Migration Name**: `initial_qimma_schema_with_clerk`

**Tables Created:**

- ✅ **users** - Clerk user synchronization (RLS enabled)
- ✅ **exams** - Exam metadata storage (RLS enabled)
- ✅ **student_submissions** - Student submissions (RLS enabled)
- ✅ **credit_transactions** - Credit tracking (RLS enabled)

**Features Applied:**

- ✅ Row Level Security (RLS) policies on all tables
- ✅ Foreign key relationships and constraints
- ✅ Performance indexes on critical columns
- ✅ Automatic `updated_at` triggers
- ✅ UUID generation extension

### 3.2 ✅ Database Setup Verification Complete

You can verify the schema was applied correctly by checking your Supabase dashboard:

1. Go to **Table Editor** in your Supabase project
2. Confirm all 4 tables are present: `users`, `exams`, `student_submissions`, `credit_transactions`
3. Check that RLS is enabled (shield icon should be visible on each table)

**Verification Results:**

✅ **Tables Created**: All 4 tables properly created
✅ **RLS Status**: Row Level Security enabled on all tables
✅ **Foreign Keys**: All relationships properly established
✅ **Indexes**: Performance indexes created on critical columns
✅ **Policies**: 11 RLS policies applied for data protection
✅ **API Endpoints**: Responding correctly (unauthorized as expected)

**Database Schema Summary:**

| Table                 | Columns    | RLS        | Foreign Keys             | Indexes   |
| --------------------- | ---------- | ---------- | ------------------------ | --------- |
| `users`               | 10 columns | ✅ Enabled | -                        | 3 indexes |
| `exams`               | 11 columns | ✅ Enabled | → users(id)              | 3 indexes |
| `student_submissions` | 10 columns | ✅ Enabled | → exams(id)              | 2 indexes |
| `credit_transactions` | 8 columns  | ✅ Enabled | → users(id), → exams(id) | 2 indexes |

**RLS Policies Applied:**

- **Users**: View/update own profile, admin view all
- **Exams**: Teachers can manage their own exams
- **Submissions**: Teachers can manage submissions for their exams
- **Transactions**: Users can view their own credit history

Alternatively, run this verification query in the SQL Editor:

```sql
-- Check RLS status
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('users', 'exams', 'student_submissions', 'credit_transactions');
```

All tables should show `rowsecurity = true`.

## Step 4: ✅ Integration Testing Complete

### 4.1 ✅ API Endpoints Testing

**Test Results:**

✅ **User Sync GET Endpoint**: `http://localhost:3001/api/user/sync`

```bash
# Response: HTTP 401 Unauthorized (Expected - not authenticated)
# Headers: x-clerk-auth-status: signed-out, x-clerk-auth-reason: dev-browser-missing
```

✅ **User Sync POST Endpoint**: `http://localhost:3001/api/user/sync`

```bash
# Response: HTTP 401 Unauthorized (Expected - not authenticated)
# Headers: Clerk authentication working properly
```

✅ **Homepage**: `http://localhost:3001/`

```bash
# Response: HTTP 200 OK
# Clerk JavaScript loading with correct publishable key
# Sign In/Sign Up links present and functional
```

✅ **Authentication Pages**: `http://localhost:3001/sign-in`

```bash
# Response: HTTP 200 OK
# Middleware working: x-middleware-rewrite: /sign-in
# Clerk authentication flow ready
```

**Integration Status:**

- ✅ API routes properly protected by Clerk authentication
- ✅ Middleware redirecting correctly
- ✅ Clerk JavaScript loading with correct configuration
- ✅ Database schema ready for user synchronization
- ✅ Supabase connection established

### 4.2 ✅ Manual Testing Complete - SUCCESSFUL!

**Testing Results:**

✅ **Step 1**: Homepage loads without hydration errors  
✅ **Step 2**: Sign-up flow works perfectly  
✅ **Step 3**: GET `/api/user/sync` auto-syncs users  
✅ **Step 4**: Database synchronization confirmed  
✅ **Step 5**: POST `/api/user/sync` force sync works  
✅ **Step 6**: Authentication status displays correctly  
✅ **Step 7**: Protected route access verified

**Test Users Created:**

- ✅ User 1: `toto@toto.fr` → Synced successfully
- ✅ User 2: `yacine.landolsi1@gmail.com` → Synced successfully

**API Responses Verified:**

**GET Response:**

```json
{
  "success": true,
  "message": "User profile retrieved successfully",
  "data": {
    "id": "eedeb934-5266-4a6c-ae74-20aa668f8cc5",
    "clerkUserId": "user_2xo8y7maTyIkVmfCjzB8RGz7pRN",
    "email": "yacine.landolsi1@gmail.com",
    "firstName": "yacine",
    "lastName": "landolsi",
    "role": "teacher",
    "subscriptionTier": "free",
    "creditsRemaining": 30
  }
}
```

**POST Response:**

```json
{
  "success": true,
  "message": "User synced successfully",
  "data": {
    /* same user data structure */
  }
}
```

**Database Verification:**

- ✅ Users table populated correctly
- ✅ Clerk user IDs properly mapped
- ✅ Default roles and credits assigned
- ✅ RLS policies protecting data correctly

To test the complete user authentication flow yourself:

1. **Open your browser** and navigate to: `http://localhost:3001`

2. **Click "Sign Up"** to create a new account:

   - This will take you to Clerk's sign-up flow
   - Create an account with email/password or social login

3. **After successful sign-up**, test the user sync:

   ```javascript
   // In browser console (while authenticated):
   fetch('/api/user/sync')
     .then((r) => r.json())
     .then(console.log);
   ```

4. **Verify database synchronization**:

   - Check your Supabase dashboard → Table Editor → users table
   - Your user record should be automatically created with Clerk user ID

5. **Test force sync**:
   ```javascript
   // This should work when authenticated:
   fetch('/api/user/sync', { method: 'POST' })
     .then((r) => r.json())
     .then(console.log);
   ```

## Step 5: Configure User Roles (Optional)

### 5.1 Set User Roles in Clerk

You can set user roles in Clerk's public metadata:

1. Go to Clerk Dashboard → Users
2. Select a user
3. Edit **Public metadata**
4. Add:

```json
{
  "role": "teacher"
}
```

Valid roles: `student`, `teacher`, `admin`, `super_admin`

### 5.2 Update Middleware for Role-Based Access

The middleware in `src/middleware.ts` already supports role-based access control using the role from Clerk's session claims.

## Step 6: Environment Variables Summary

Your complete `.env.local` should include:

```bash
# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME="Qimma AI"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_key
CLERK_SECRET_KEY=sk_test_your_actual_key

# Supabase Database
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Troubleshooting

### Common Issues

1. **React Hydration Error** ⚠️

   **Error**: "Hydration failed because the server rendered HTML didn't match the client"

   **Cause**: Browser extensions (like ColorZilla) or authentication state mismatches

   **Solution**:

   - ✅ **Fixed**: Use client components for authentication-dependent content
   - ✅ **Fixed**: Add `suppressHydrationWarning` to `html` and `body` tags
   - ✅ **Fixed**: Implement loading states in client components

   **Implementation**:

   ```tsx
   // src/components/AuthenticatedContent.tsx
   'use client';

   import { useUser } from '@clerk/nextjs';

   // src/components/AuthenticatedContent.tsx

   export function AuthenticatedHeader() {
     const { isSignedIn, user, isLoaded } = useUser();

     if (!isLoaded) return <LoadingState />;
     // ... rest of component
   }
   ```

2. **JWT Token Invalid**

   - Verify the Supabase JWT secret matches between Clerk and Supabase
   - Check the JWT template is named exactly `supabase`
   - Ensure the signing algorithm is HS256

3. **RLS Blocking Queries**

   - Verify the JWT template includes the correct `sub` claim
   - Check that RLS policies reference `auth.jwt() ->> 'sub'`
   - Ensure the user exists in the users table

4. **User Sync Failing**
   - Check Supabase API keys are correct
   - Verify network connectivity to Supabase
   - Check server logs for detailed error messages

### Debug Commands

```bash
# Check if JWT template is working
# (Run this in browser console when authenticated)
fetch('/api/user/profile')
  .then(r => r.json())
  .then(console.log);

# Test Supabase connection
curl -H "apikey: YOUR_ANON_KEY" \
  "https://YOUR_PROJECT.supabase.co/rest/v1/users?select=*"
```

## Next Steps

Once the integration is working:

1. ✅ Users automatically sync between Clerk and Supabase
2. ✅ RLS policies protect user data
3. ✅ API routes can securely access user-specific data
4. ✅ Ready to build exam management features

The authentication foundation is now complete and ready for building the core application features!

# Environment Variables Documentation

## Overview

This document explains how to set up and manage environment variables for the Qimma AI Exam Correction Platform.

## Files Structure

- `.env.example` - Template file with all required environment variables
- `.env.local` - Local development environment variables (git ignored)
- `.env.production` - Production environment variables (git ignored)
- `.env.staging` - Staging environment variables (git ignored)

## Setup Instructions

### 1. Local Development Setup

1. Copy the example file:

   ```bash
   cp .env.example .env.local
   ```

2. Fill in your actual values in `.env.local`

### 2. Production Setup

Create `.env.production` with production values:

```bash
cp .env.example .env.production
```

## Environment Variables Guide

### Next.js & Deployment

- `NEXT_PUBLIC_APP_URL` - Your application URL (public)
- `NEXT_PUBLIC_SITE_NAME` - Site name for branding (public)
- `NODE_ENV` - Environment type (development/production)

### Authentication (Clerk)

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk public key
- `CLERK_SECRET_KEY` - Clerk secret key (server-side only)
- `CLERK_WEBHOOK_SECRET` - Webhook verification secret

### Database (Supabase)

- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Public anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key (admin access)

### Payments (Stripe)

- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe public key
- `STRIPE_SECRET_KEY` - Stripe secret key (server-side only)
- `STRIPE_WEBHOOK_SECRET` - Webhook verification secret

### AI Processing (OpenAI)

- `OPENAI_API_KEY` - OpenAI API key for AI processing

### File Storage (AWS S3)

- `AWS_S3_BUCKET_NAME` - S3 bucket for file storage

## Security Best Practices

1. **Never commit actual environment files** (only .env.example)
2. **Use different values for each environment**
3. **Rotate secrets regularly**
4. **Use strong, randomly generated secrets**
5. **Limit access to production environment variables**

## Quick Commands

```bash
# Check environment variables are loaded
npm run build

# Verify Next.js can access environment variables
npm run dev

# Format environment files
npm run format
```

## Troubleshooting

### Common Issues

1. **Environment variables not loading**

   - Ensure `.env.local` exists
   - Check file naming (no extra extensions)
   - Restart development server

2. **Build failures**

   - Verify all required variables are set
   - Check for typos in variable names
   - Ensure secrets don't contain special characters

3. **Clerk authentication issues**
   - Verify publishable and secret keys match
   - Check webhook secret is correct
   - Ensure domain matches Clerk dashboard

### Environment-Specific Notes

- **Development**: Use test keys and local URLs
- **Staging**: Use staging keys and staging URLs
- **Production**: Use production keys and production URLs

## Getting Service Keys

### Clerk

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Select your application
3. Go to "API Keys" section
4. Copy publishable and secret keys

### Supabase

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to "Settings" > "API"
4. Copy URL and anon key

### Stripe

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Go to "Developers" > "API keys"
3. Copy publishable and secret keys

### OpenAI

1. Go to [OpenAI Platform](https://platform.openai.com)
2. Go to "API keys"
3. Create and copy API key

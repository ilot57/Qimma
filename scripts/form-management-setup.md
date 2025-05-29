# Form Management Setup Guide

This document provides a comprehensive guide to the form management setup in the Qimma application, featuring React Hook Form, Zod validation, and Zustand state management.

## 📋 Overview

Our form management system combines three powerful libraries:

- **React Hook Form** - Performant forms with easy validation
- **Zod** - TypeScript-first schema validation
- **Zustand** - Simple, fast state management

## 🚀 Quick Start

### Basic Form with Validation

```tsx
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { type LoginForm, loginSchema } from '@/lib/schemas';

function MyForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginForm) => {
    console.log(data); // Type-safe form data
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}

      <input {...register('password')} type="password" />
      {errors.password && <span>{errors.password.message}</span>}

      <button type="submit">Submit</button>
    </form>
  );
}
```

### Using our Custom Hook

```tsx
import { useFormWithStore } from '@/lib/hooks/useFormWithStore';
import { type LoginForm, loginSchema } from '@/lib/schemas';

function MyForm() {
  const { register, submitWithLoading, isSubmitting, error, clearError } =
    useFormWithStore<LoginForm>({
      schema: loginSchema,
      persistKey: 'login-form', // Auto-save to localStorage
      resetOnSuccess: true,
    });

  const handleSubmit = async (data: LoginForm) => {
    // Your API call here
    await authService.login(data);
  };

  return (
    <form onSubmit={submitWithLoading(handleSubmit)}>{/* Form fields */}</form>
  );
}
```

## 📁 File Structure

```
src/
├── lib/
│   ├── schemas/
│   │   └── index.ts           # Zod validation schemas
│   ├── stores/
│   │   └── useStore.ts        # Zustand global store
│   └── hooks/
│       └── useFormWithStore.ts # Custom form hook
├── components/
│   └── forms/
│       └── LoginForm.tsx      # Example form component
└── app/
    └── test-forms/
        └── page.tsx           # Test/demo page
```

## 🔧 Configuration

### 1. Zod Schemas (`src/lib/schemas/index.ts`)

Define validation schemas for all your forms:

```typescript
import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type LoginForm = z.infer<typeof loginSchema>;
```

**Available Schemas:**

- `loginSchema` - Login form validation
- `signupSchema` - User registration with password confirmation
- `profileSchema` - User profile with notifications and preferences
- `examMetadataSchema` - Exam creation form
- `fileUploadSchema` - File upload validation
- `creditPurchaseSchema` - Payment form validation

### 2. Zustand Store (`src/lib/stores/useStore.ts`)

Global application state with persistence:

```typescript
export const useStore = create<AppState>()(
  devtools(
    persist(
      (set, get) => ({
        // State and actions
      }),
      {
        name: 'qimma-store',
        partialize: (state) => ({
          // Only persist certain parts
          theme: state.theme,
          sidebarOpen: state.sidebarOpen,
        }),
      }
    )
  )
);
```

**Store Features:**

- ✅ User authentication state
- ✅ UI preferences (theme, sidebar)
- ✅ Credit balance tracking
- ✅ Persistent storage
- ✅ DevTools integration

### 3. Custom Form Hook (`src/lib/hooks/useFormWithStore.ts`)

Enhanced form management with additional features:

```typescript
export function useFormWithStore<T extends FormData>({
  schema,
  persistKey,
  onSuccess,
  onError,
  resetOnSuccess = true,
  ...formOptions
}: UseFormWithStoreOptions<T>): UseFormWithStoreReturn<T>;
```

**Features:**

- ✅ Automatic Zod validation
- ✅ Loading state management
- ✅ Error handling and display
- ✅ Auto-save to localStorage
- ✅ Success/error callbacks
- ✅ Integration with Zustand store

## 📝 Usage Examples

### 1. Login Form

```tsx
import { useLoginForm } from '@/lib/hooks/useFormWithStore';

function LoginForm() {
  const { register, submitWithLoading, isSubmitting, error } = useLoginForm();

  const handleLogin = async (data: LoginForm) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }
  };

  return (
    <form onSubmit={submitWithLoading(handleLogin)}>
      {/* Form implementation */}
    </form>
  );
}
```

### 2. Profile Form with Auto-save

```tsx
function ProfileForm() {
  const form = useFormWithStore({
    schema: profileSchema,
    persistKey: 'profile', // Auto-saves to localStorage
    resetOnSuccess: false, // Keep data after save
  });

  return (
    <form onSubmit={form.submitWithLoading(handleSave)}>
      {/* Form automatically saves as user types */}
    </form>
  );
}
```

### 3. Accessing Global State

```tsx
import { useCredits, useStore, useUser } from '@/lib/stores/useStore';

function Dashboard() {
  const user = useUser(); // Selector hook
  const credits = useCredits(); // Selector hook
  const { setCredits } = useStore(); // Full store access

  return (
    <div>
      <p>Welcome, {user?.name}</p>
      <p>Credits: {credits}</p>
      <button onClick={() => setCredits(credits + 10)}>Add Credits</button>
    </div>
  );
}
```

## 🧪 Testing

Visit `/test-forms` to see all components in action:

- **Global State Demo** - Zustand store manipulation
- **Profile Form** - Auto-save and validation
- **Login Form** - Complete authentication flow

### Test Credentials

- Email: `demo@qimma.ai`
- Password: `password123`

## 🔍 Advanced Features

### Form Persistence

Forms with `persistKey` automatically save to localStorage:

```typescript
const form = useFormWithStore({
  schema: mySchema,
  persistKey: 'my-form', // Saves as 'form_my-form' in localStorage
});
```

### Error Handling

Comprehensive error management:

```typescript
const form = useFormWithStore({
  schema: mySchema,
  onError: (error) => {
    // Custom error handling
    toast.error(error.message);
  },
});

// In component
{form.error && (
  <Alert variant="destructive">
    <AlertDescription>
      {form.error}
      <Button onClick={form.clearError}>Dismiss</Button>
    </AlertDescription>
  </Alert>
)}
```

### Success Callbacks

Handle successful form submissions:

```typescript
const form = useFormWithStore({
  schema: mySchema,
  onSuccess: async (data) => {
    // Update global state
    setUser(data.user);

    // Navigate
    router.push('/dashboard');

    // Show notification
    toast.success('Profile updated!');
  },
});
```

## 🎯 Best Practices

### 1. Schema Organization

Group related schemas and export types:

```typescript
// Authentication schemas
export const loginSchema = z.object({...});
export const signupSchema = z.object({...});

// Type exports
export type LoginForm = z.infer<typeof loginSchema>;
export type SignupForm = z.infer<typeof signupSchema>;
```

### 2. Store Structure

Keep store focused and use selectors:

```typescript
// ✅ Good - Use selectors
const user = useUser();
const credits = useCredits();

// ❌ Avoid - Accessing full store
const { user, credits } = useStore();
```

### 3. Form Validation

Use descriptive error messages:

```typescript
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'Password must contain uppercase, lowercase, and number'
  );
```

### 4. Performance

Use form persistence judiciously:

```typescript
// ✅ Good - For long forms
persistKey: 'exam-creation';

// ❌ Avoid - For simple forms
persistKey: 'login-form';
```

## 🐛 Troubleshooting

### Common Issues

1. **Form not validating**

   - Check schema import path
   - Ensure resolver is applied
   - Verify field registration

2. **State not persisting**

   - Check partialize configuration
   - Verify localStorage availability
   - Check for naming conflicts

3. **TypeScript errors**
   - Ensure schema types are exported
   - Check hook generic types
   - Verify component prop types

### Debug Tools

- **React DevTools** - Component state
- **Zustand DevTools** - Store actions
- **Browser DevTools** - localStorage data

## 📚 Additional Resources

- [React Hook Form Documentation](https://react-hook-form.com/)
- [Zod Documentation](https://zod.dev/)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
- [Shadcn/UI Components](https://ui.shadcn.com/)

## 🚀 Next Steps

1. Implement authentication forms
2. Create exam creation wizard
3. Add file upload handling
4. Integrate with API endpoints
5. Add form analytics

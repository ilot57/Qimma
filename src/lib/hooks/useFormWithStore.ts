import React from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { UseFormProps, UseFormReturn, useForm } from 'react-hook-form';
import { ZodSchema } from 'zod';

import { useStore } from '@/lib/stores/useStore';

// Generic type for form data
type FormData = Record<string, any>;

// Options for the form hook
interface UseFormWithStoreOptions<T extends FormData> extends UseFormProps<T> {
  schema: ZodSchema<T>;
  onSuccess?: (data: T) => void | Promise<void>;
  onError?: (error: Error) => void;
  persistKey?: string; // Key to persist form data in localStorage
  resetOnSuccess?: boolean;
}

// Return type for the hook
interface UseFormWithStoreReturn<T extends FormData> extends UseFormReturn<T> {
  submitWithLoading: (
    onSubmit: (data: T) => Promise<void>
  ) => (e?: React.BaseSyntheticEvent) => Promise<void>;
  isSubmitting: boolean;
  error: string | null;
  clearError: () => void;
}

/**
 * Custom hook that combines React Hook Form with Zod validation and Zustand store
 * Provides additional functionality like loading states, error handling, and persistence
 */
export function useFormWithStore<T extends FormData>({
  schema,
  onSuccess,
  onError,
  persistKey,
  resetOnSuccess = true,
  ...formOptions
}: UseFormWithStoreOptions<T>): UseFormWithStoreReturn<T> {
  // Get store actions
  const { setUser, setAuthenticated } = useStore();

  // Initialize form with Zod resolver
  const form = useForm<T>({
    resolver: zodResolver(schema),
    ...formOptions,
  });

  const { handleSubmit, reset, formState } = form;

  // Local state for additional form management
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Clear error function
  const clearError = () => setError(null);

  // Enhanced submit handler with loading and error management
  const submitWithLoading = (onSubmit: (data: T) => Promise<void>) => {
    return handleSubmit(async (data: T) => {
      setIsSubmitting(true);
      setError(null);

      try {
        await onSubmit(data);

        if (onSuccess) {
          await onSuccess(data);
        }

        if (resetOnSuccess) {
          reset();
        }

        // Clear persisted data on success if using persistence
        if (persistKey) {
          localStorage.removeItem(`form_${persistKey}`);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'An unexpected error occurred';
        setError(errorMessage);

        if (onError) {
          onError(err instanceof Error ? err : new Error(errorMessage));
        }
      } finally {
        setIsSubmitting(false);
      }
    });
  };

  // Auto-save form data to localStorage if persistKey is provided
  React.useEffect(() => {
    if (!persistKey) return;

    const subscription = form.watch((data) => {
      localStorage.setItem(`form_${persistKey}`, JSON.stringify(data));
    });

    return () => subscription.unsubscribe();
  }, [form, persistKey]);

  // Restore form data from localStorage on mount
  React.useEffect(() => {
    if (!persistKey) return;

    try {
      const savedData = localStorage.getItem(`form_${persistKey}`);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        form.reset(parsedData);
      }
    } catch (err) {
      console.warn('Failed to restore form data from localStorage:', err);
    }
  }, [form, persistKey]);

  return {
    ...form,
    submitWithLoading,
    isSubmitting: isSubmitting || formState.isSubmitting,
    error,
    clearError,
  };
}

// Specific hooks for common forms in the application
export function useLoginForm() {
  return useFormWithStore({
    schema: require('@/lib/schemas').loginSchema,
    defaultValues: {
      email: '',
      password: '',
    },
    onSuccess: async (data) => {
      // Update global state on successful login
      // This would typically be handled by the authentication system
      console.log('Login successful, updating global state');
    },
  });
}

export function useSignupForm() {
  return useFormWithStore({
    schema: require('@/lib/schemas').signupSchema,
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      acceptTerms: false,
    },
    resetOnSuccess: true,
  });
}

export function useProfileForm() {
  return useFormWithStore({
    schema: require('@/lib/schemas').profileSchema,
    persistKey: 'profile', // Auto-save profile changes
    defaultValues: {
      name: '',
      email: '',
      language: 'en' as const,
      notifications: {
        email: true,
        push: false,
        marketing: false,
      },
      timezone: '',
    },
  });
}

export function useExamMetadataForm() {
  return useFormWithStore({
    schema: require('@/lib/schemas').examMetadataSchema,
    persistKey: 'exam-metadata', // Auto-save exam creation progress
    defaultValues: {
      title: '',
      subject: 'other' as const,
      gradeLevel: 'middle' as const,
      description: '',
      tags: [],
      totalPoints: 100,
      timeLimit: 60,
    },
    resetOnSuccess: false, // Keep form data until exam is fully created
  });
}

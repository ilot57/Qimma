'use client';

import React from 'react';

import { Eye, EyeOff, Loader2, Settings, User } from 'lucide-react';

import { LoginForm } from '@/components/forms/LoginForm';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useFormWithStore } from '@/lib/hooks/useFormWithStore';
import {
  type ExamMetadataForm,
  type ProfileForm,
  examMetadataSchema,
  profileSchema,
} from '@/lib/schemas';
import {
  useCredits,
  useSidebarOpen,
  useStore,
  useTheme,
  useUser,
} from '@/lib/stores/useStore';

// Profile Form Component
function ProfileFormDemo() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    submitWithLoading,
    isSubmitting,
    error,
    clearError,
  } = useFormWithStore<ProfileForm>({
    schema: profileSchema,
    persistKey: 'profile-demo',
    defaultValues: {
      name: 'John Doe',
      email: 'john@example.com',
      language: 'en',
      notifications: {
        email: true,
        push: false,
        marketing: false,
      },
      timezone: 'UTC',
    },
  });

  const handleProfileSubmit = async (data: ProfileForm) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log('Profile updated:', data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Profile Form (with Auto-save)
        </CardTitle>
        <CardDescription>
          Demonstrates React Hook Form + Zod + localStorage persistence
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={submitWithLoading(handleProfileSubmit)}
          className="space-y-4"
        >
          {error && (
            <Alert variant="destructive">
              <AlertDescription>
                {error}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearError}
                  className="ml-2"
                >
                  Dismiss
                </Button>
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                {...register('name')}
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Select {...register('language')}>
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="fr">French</SelectItem>
                <SelectItem value="ar">Arabic</SelectItem>
              </SelectContent>
            </Select>
            {errors.language && (
              <p className="text-sm text-red-500">{errors.language.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Notification Preferences</Label>
            <div className="flex flex-wrap gap-2">
              <label className="flex items-center space-x-2">
                <input type="checkbox" {...register('notifications.email')} />
                <span className="text-sm">Email notifications</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" {...register('notifications.push')} />
                <span className="text-sm">Push notifications</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...register('notifications.marketing')}
                />
                <span className="text-sm">Marketing emails</span>
              </label>
            </div>
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Profile'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

// Zustand Store Demo Component
function ZustandStoreDemo() {
  const {
    user,
    credits,
    sidebarOpen,
    theme,
    setUser,
    setCredits,
    toggleSidebar,
    setTheme,
    resetState,
  } = useStore();

  const handleUpdateUser = () => {
    setUser({
      id: '123',
      email: 'demo@qimma.ai',
      name: 'Demo User',
      credits: 150,
    });
    setCredits(150);
  };

  const handleClearUser = () => {
    setUser(null);
    setCredits(0);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Zustand Store Demo
        </CardTitle>
        <CardDescription>
          Global state management with persistence
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Current User</Label>
            <div className="mt-2">
              {user ? (
                <div className="space-y-1">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  <Badge variant="secondary">{user.credits} credits</Badge>
                </div>
              ) : (
                <p className="text-sm text-gray-500">No user logged in</p>
              )}
            </div>
          </div>

          <div>
            <Label>UI State</Label>
            <div className="mt-2 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm">Sidebar:</span>
                <Badge variant={sidebarOpen ? 'default' : 'secondary'}>
                  {sidebarOpen ? 'Open' : 'Closed'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Theme:</span>
                <Badge variant="outline">{theme}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Credits:</span>
                <Badge variant="secondary">{credits}</Badge>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        <div className="flex flex-wrap gap-2">
          <Button onClick={handleUpdateUser} size="sm">
            Set Demo User
          </Button>
          <Button onClick={handleClearUser} variant="outline" size="sm">
            Clear User
          </Button>
          <Button onClick={toggleSidebar} variant="outline" size="sm">
            Toggle Sidebar
          </Button>
          <Button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            variant="outline"
            size="sm"
          >
            Toggle Theme
          </Button>
          <Button onClick={resetState} variant="destructive" size="sm">
            Reset All State
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Main Test Page Component
export default function TestFormsPage() {
  const user = useUser();
  const credits = useCredits();
  const sidebarOpen = useSidebarOpen();
  const theme = useTheme();

  return (
    <div className="container mx-auto space-y-8 py-8">
      <div className="space-y-2 text-center">
        <h1 className="text-4xl font-bold">Form Management Test Suite</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Testing React Hook Form + Zod + Zustand Integration
        </p>
      </div>

      {/* Current State Display */}
      <Card>
        <CardHeader>
          <CardTitle>Current Global State</CardTitle>
          <CardDescription>Live view of Zustand store state</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-center md:grid-cols-4">
            <div>
              <p className="text-sm font-medium">User</p>
              <p className="text-lg">{user ? user.name : 'Not logged in'}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Credits</p>
              <p className="text-lg">{credits}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Sidebar</p>
              <p className="text-lg">{sidebarOpen ? 'Open' : 'Closed'}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Theme</p>
              <p className="text-lg capitalize">{theme}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form Examples */}
      <div className="grid gap-8 lg:grid-cols-2">
        <ZustandStoreDemo />
        <ProfileFormDemo />
      </div>

      {/* Login Form Example */}
      <div className="mx-auto max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Login Form Example</CardTitle>
            <CardDescription>
              Use demo@qimma.ai / password123 for testing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm
              onSubmit={async (data) => {
                await new Promise((resolve) => setTimeout(resolve, 2000));
                console.log('Login attempt:', data);
              }}
            />
          </CardContent>
        </Card>
      </div>

      {/* Integration Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Integration Features Demonstrated</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li>
              ✅ <strong>React Hook Form</strong> - Form validation and state
              management
            </li>
            <li>
              ✅ <strong>Zod Schemas</strong> - Type-safe validation with custom
              error messages
            </li>
            <li>
              ✅ <strong>Zustand Store</strong> - Global state with persistence
              middleware
            </li>
            <li>
              ✅ <strong>Custom Hooks</strong> - Reusable form logic with
              loading states
            </li>
            <li>
              ✅ <strong>Auto-save</strong> - Form data persistence in
              localStorage
            </li>
            <li>
              ✅ <strong>Error Handling</strong> - Comprehensive error states
              and recovery
            </li>
            <li>
              ✅ <strong>TypeScript</strong> - Full type safety across all
              components
            </li>
            <li>
              ✅ <strong>Shadcn/UI</strong> - Beautiful, accessible form
              components
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

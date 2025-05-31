import { useRouter } from 'next/navigation';

import {
  BarChart3,
  BookOpen,
  CreditCard,
  FileText,
  FolderOpen,
  Plus,
  Settings,
  Users,
} from 'lucide-react';

import { Button } from '@/components/ui/button';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<React.ComponentProps<'svg'>>;
  href?: string;
  onClick?: () => void;
  primary?: boolean;
  color: 'emerald' | 'blue' | 'amber' | 'purple' | 'gray';
}

interface QuickActionCardsProps {
  className?: string;
}

export function QuickActionCards({ className = '' }: QuickActionCardsProps) {
  const router = useRouter();

  const quickActions: QuickAction[] = [
    {
      id: 'create-exam',
      title: 'Create New Exam',
      description: 'Start a new exam correction process',
      icon: Plus,
      href: '/dashboard/exams/create',
      primary: true,
      color: 'emerald',
    },
    {
      id: 'all-exams',
      title: 'View All Exams',
      description: 'Manage and filter all your exams',
      icon: FolderOpen,
      href: '/dashboard/exams',
      color: 'blue',
    },
    {
      id: 'recent-results',
      title: 'Recent Results',
      description: 'Check latest grading results',
      icon: BarChart3,
      href: '/dashboard/results',
      color: 'purple',
    },
    {
      id: 'upload-papers',
      title: 'Quick Upload',
      description: 'Upload student papers to existing exam',
      icon: FileText,
      onClick: () => {
        // TODO: Implement upload modal or navigate to upload page
        // Will be implemented in later tasks
      },
      color: 'amber',
    },
    {
      id: 'exam-templates',
      title: 'Exam Templates',
      description: 'Browse saved exam templates',
      icon: BookOpen,
      href: '/dashboard/templates',
      color: 'blue',
    },
    {
      id: 'credits',
      title: 'Manage Credits',
      description: 'View usage and purchase more credits',
      icon: CreditCard,
      href: '/dashboard/credits',
      color: 'emerald',
    },
    {
      id: 'student-analytics',
      title: 'Student Analytics',
      description: 'View detailed student performance',
      icon: Users,
      href: '/dashboard/analytics',
      color: 'purple',
    },
    {
      id: 'settings',
      title: 'Settings',
      description: 'Configure grading preferences',
      icon: Settings,
      href: '/dashboard/settings',
      color: 'gray',
    },
  ];

  const handleActionClick = (action: QuickAction) => {
    if (action.onClick) {
      action.onClick();
    } else if (action.href) {
      router.push(action.href);
    }
  };

  const getColorClasses = (color: QuickAction['color'], isPrimary = false) => {
    if (isPrimary) {
      return {
        card: 'border-emerald-200 bg-emerald-50 hover:bg-emerald-100',
        icon: 'bg-emerald-600 text-white',
        title: 'text-emerald-900',
        description: 'text-emerald-700',
      };
    }

    switch (color) {
      case 'emerald':
        return {
          card: 'border-gray-200 bg-white hover:bg-emerald-50',
          icon: 'bg-emerald-100 text-emerald-600',
          title: 'text-gray-900',
          description: 'text-gray-600',
        };
      case 'blue':
        return {
          card: 'border-gray-200 bg-white hover:bg-blue-50',
          icon: 'bg-blue-100 text-blue-600',
          title: 'text-gray-900',
          description: 'text-gray-600',
        };
      case 'purple':
        return {
          card: 'border-gray-200 bg-white hover:bg-purple-50',
          icon: 'bg-purple-100 text-purple-600',
          title: 'text-gray-900',
          description: 'text-gray-600',
        };
      case 'amber':
        return {
          card: 'border-gray-200 bg-white hover:bg-amber-50',
          icon: 'bg-amber-100 text-amber-600',
          title: 'text-gray-900',
          description: 'text-gray-600',
        };
      case 'gray':
        return {
          card: 'border-gray-200 bg-white hover:bg-gray-50',
          icon: 'bg-gray-100 text-gray-600',
          title: 'text-gray-900',
          description: 'text-gray-600',
        };
      default:
        return {
          card: 'border-gray-200 bg-white hover:bg-gray-50',
          icon: 'bg-gray-100 text-gray-600',
          title: 'text-gray-900',
          description: 'text-gray-600',
        };
    }
  };

  return (
    <div className={className}>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
          <p className="mt-1 text-sm text-gray-600">
            Common tasks to help you get things done faster
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {quickActions.map((action) => {
          const IconComponent = action.icon;
          const colorClasses = getColorClasses(action.color, action.primary);

          return (
            <Button
              key={action.id}
              variant="ghost"
              className={`group h-auto p-0 transition-all duration-200 ${colorClasses.card} border`}
              onClick={() => handleActionClick(action)}
            >
              <div className="flex w-full flex-col p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${colorClasses.icon} transition-transform duration-200 group-hover:scale-105`}
                  >
                    <IconComponent className="h-5 w-5" />
                  </div>
                  {action.primary && (
                    <div className="rounded-full bg-emerald-600 px-2 py-1 text-xs font-medium text-white">
                      Popular
                    </div>
                  )}
                </div>

                <div className="text-left">
                  <h3
                    className={`font-medium ${colorClasses.title} transition-colors group-hover:text-emerald-700`}
                  >
                    {action.title}
                  </h3>
                  <p className={`mt-1 text-sm ${colorClasses.description}`}>
                    {action.description}
                  </p>
                </div>
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
}

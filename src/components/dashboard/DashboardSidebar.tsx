'use client';

import { useState } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  BarChart3,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  FileText,
  Home,
  Settings,
  Users,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Exams', href: '/dashboard/exams', icon: FileText },
  { name: 'Students', href: '/dashboard/students', icon: Users },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'Credits', href: '/dashboard/credits', icon: CreditCard },
  { name: 'Library', href: '/dashboard/library', icon: BookOpen },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <div
      className={cn(
        'flex flex-col border-r border-gray-200 bg-white transition-all duration-300',
        collapsed ? 'w-14' : 'w-56'
      )}
    >
      {/* Sidebar Header */}
      <div className="flex h-16 items-center justify-between px-3">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-emerald-600">
              <span className="text-sm font-bold text-white">Q</span>
            </div>
            <span className="text-lg font-semibold text-gray-900">
              Qimma AI
            </span>
          </div>
        )}

        {/* Toggle button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-2 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'group flex items-center rounded-md px-2 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-emerald-100 text-emerald-900'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <item.icon
                className={cn(
                  'h-5 w-5 flex-shrink-0',
                  collapsed ? 'mx-auto' : 'mr-3',
                  isActive
                    ? 'text-emerald-600'
                    : 'text-gray-400 group-hover:text-gray-500'
                )}
              />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Credit Balance */}
      {!collapsed && (
        <div className="border-t border-gray-200 p-3">
          <div className="rounded-lg bg-gray-50 p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Credits</p>
                <p className="text-xs text-gray-500">Available</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">150</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-1 h-6 text-xs"
                >
                  Buy More
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

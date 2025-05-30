'use client';

import { UserButton, useUser } from '@clerk/nextjs';
import { Bell, Menu, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface DashboardHeaderProps {
  onToggleSidebar?: () => void;
}

export function DashboardHeader({ onToggleSidebar }: DashboardHeaderProps) {
  const { user } = useUser();

  return (
    <header className="border-b border-gray-200 bg-white shadow-sm">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left side - Mobile menu and search */}
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={onToggleSidebar}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Search bar */}
          <div className="hidden sm:block">
            <div className="relative">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="search"
                placeholder="Search exams..."
                className="w-64 border-gray-200 pl-10 focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Right side - User info and actions */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <Button
            variant="ghost"
            size="sm"
            className="relative hover:bg-gray-100"
          >
            <Bell className="h-5 w-5" />
            {/* Notification badge */}
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-xs font-medium text-white">
              2
            </span>
          </Button>

          {/* User info */}
          <div className="hidden sm:flex sm:items-center sm:space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500">
                {user?.emailAddresses[0]?.emailAddress}
              </p>
            </div>
          </div>

          {/* User menu */}
          <UserButton
            appearance={{
              elements: {
                avatarBox: 'w-8 h-8',
              },
            }}
          />
        </div>
      </div>
    </header>
  );
}

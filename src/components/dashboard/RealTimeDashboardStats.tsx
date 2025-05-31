'use client';

import {
  AlertCircle,
  BookOpen,
  CheckCircle,
  Clock,
  Coins,
  TrendingUp,
} from 'lucide-react';

import { RefreshIndicator } from '@/components/ui/refresh-indicator';
import { useDashboardStats } from '@/hooks/useRealTimeData';
import { cn } from '@/lib/utils';

interface RealTimeDashboardStatsProps {
  userId: string;
  className?: string;
}

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ComponentType<any>;
  iconBgColor: string;
  iconColor: string;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  isLoading?: boolean;
}

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconBgColor,
  iconColor,
  trend,
  isLoading,
}: StatCardProps) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          {isLoading ? (
            <div className="mt-2 h-8 w-16 animate-pulse rounded bg-gray-200"></div>
          ) : (
            <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
          )}
          {subtitle && !isLoading && (
            <p
              className={cn(
                'mt-1 text-sm',
                trend?.isPositive === false
                  ? 'text-red-600'
                  : 'text-emerald-600'
              )}
            >
              {trend && (
                <TrendingUp
                  className={cn(
                    'mr-1 inline h-3 w-3',
                    trend.isPositive === false && 'rotate-180'
                  )}
                />
              )}
              {subtitle}
            </p>
          )}
        </div>
        <div
          className={cn(
            'flex h-12 w-12 items-center justify-center rounded-xl',
            iconBgColor
          )}
        >
          <Icon className={cn('h-6 w-6', iconColor)} />
        </div>
      </div>
    </div>
  );
}

export function RealTimeDashboardStats({
  userId,
  className,
}: RealTimeDashboardStatsProps) {
  const [statsState, statsActions] = useDashboardStats(userId);
  const { data: stats, loading, error, isRefreshing, lastUpdated } = statsState;

  // Calculate derived values
  const completionRate = stats
    ? Math.round((stats.completedExams / Math.max(stats.totalExams, 1)) * 100)
    : 0;

  const hasProcessingExams = stats ? stats.processingExams > 0 : false;

  return (
    <div className={className}>
      {/* Real-time indicator header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          Dashboard Overview
        </h2>
        <RefreshIndicator
          isRefreshing={isRefreshing}
          lastUpdated={lastUpdated}
          error={error}
          enabled={true}
          onRefresh={statsActions.refresh}
          onToggle={statsActions.toggle}
        />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Exams */}
        <StatCard
          title="Total Exams"
          value={stats?.totalExams ?? 0}
          subtitle={`+${Math.floor((stats?.totalExams ?? 0) * 0.15)} this week`}
          icon={BookOpen}
          iconBgColor="bg-emerald-100"
          iconColor="text-emerald-600"
          trend={{ value: 'up', isPositive: true }}
          isLoading={loading}
        />

        {/* Completed */}
        <StatCard
          title="Completed"
          value={stats?.completedExams ?? 0}
          subtitle={`${completionRate}% completion rate`}
          icon={CheckCircle}
          iconBgColor="bg-emerald-100"
          iconColor="text-emerald-600"
          isLoading={loading}
        />

        {/* Processing */}
        <StatCard
          title="Processing"
          value={stats?.processingExams ?? 0}
          subtitle={
            hasProcessingExams
              ? `~${Math.floor(Math.random() * 10) + 2} min remaining`
              : 'No pending exams'
          }
          icon={hasProcessingExams ? Clock : CheckCircle}
          iconBgColor={hasProcessingExams ? 'bg-amber-100' : 'bg-emerald-100'}
          iconColor={hasProcessingExams ? 'text-amber-600' : 'text-emerald-600'}
          isLoading={loading}
        />

        {/* Credits */}
        <StatCard
          title="Credits Remaining"
          value={stats?.creditsRemaining ?? 0}
          subtitle="Standard plan"
          icon={stats && stats.creditsRemaining < 20 ? AlertCircle : Coins}
          iconBgColor={
            stats && stats.creditsRemaining < 20
              ? 'bg-red-100'
              : 'bg-indigo-100'
          }
          iconColor={
            stats && stats.creditsRemaining < 20
              ? 'text-red-600'
              : 'text-indigo-600'
          }
          isLoading={loading}
        />
      </div>

      {/* Error state */}
      {error && !loading && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="flex items-center">
            <AlertCircle className="mr-2 h-4 w-4 text-red-600" />
            <p className="text-sm font-medium text-red-800">
              Failed to load dashboard data
            </p>
          </div>
          <p className="mt-1 text-sm text-red-700">{error}</p>
          <button
            onClick={statsActions.refresh}
            className="mt-2 text-sm font-medium text-red-800 underline hover:text-red-900"
          >
            Try again
          </button>
        </div>
      )}
    </div>
  );
}

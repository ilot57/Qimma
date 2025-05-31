'use client';

import { useState } from 'react';

import {
  AlertTriangle,
  Clock,
  Coins,
  CreditCard,
  History,
  Plus,
  TrendingDown,
  TrendingUp,
  Zap,
} from 'lucide-react';

import { CreditPurchaseModal } from '@/components/dashboard/CreditPurchaseModal';
import { RefreshIndicator } from '@/components/ui/refresh-indicator';
import { useDashboardStats } from '@/hooks/useRealTimeData';
import { cn } from '@/lib/utils';

interface CreditDisplaySystemProps {
  userId: string;
  className?: string;
  showDetailedView?: boolean;
}

interface CreditTransaction {
  id: string;
  type: 'purchase' | 'usage' | 'refund' | 'bonus';
  amount: number;
  description: string;
  timestamp: Date;
  examName?: string;
}

// Mock credit transaction data
const generateMockTransactions = (): CreditTransaction[] => [
  {
    id: '1',
    type: 'usage',
    amount: -5,
    description: 'Exam grading: Math Quiz #3',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    examName: 'Math Quiz #3',
  },
  {
    id: '2',
    type: 'usage',
    amount: -3,
    description: 'Exam grading: Science Test',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    examName: 'Science Test',
  },
  {
    id: '3',
    type: 'purchase',
    amount: 50,
    description: 'Credit package purchase',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
  },
  {
    id: '4',
    type: 'bonus',
    amount: 10,
    description: 'Welcome bonus credits',
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
  },
];

function CreditBalanceCard({
  credits,
  isLoading,
  onPurchaseClick,
}: {
  credits: number;
  isLoading: boolean;
  onPurchaseClick: () => void;
}) {
  // Calculate remaining exams based on average usage (3.5 credits per exam)
  const averageCreditsPerExam = 3.5;
  const remainingExams = Math.floor(credits / averageCreditsPerExam);

  // Updated warning thresholds based on exams remaining
  const isLowBalance = remainingExams <= 10 && remainingExams > 3;
  const isCriticalBalance = remainingExams <= 3;
  const isGoodBalance = remainingExams > 10;

  const getBalanceMessage = () => {
    if (isCriticalBalance) {
      return `Around ${remainingExams} exam${remainingExams === 1 ? '' : 's'} left`;
    } else if (isLowBalance) {
      return `Around ${remainingExams} exams left`;
    } else {
      return `Around ${remainingExams} exams left`;
    }
  };

  const getBalanceColor = () => {
    if (isCriticalBalance) return 'text-red-600';
    if (isLowBalance) return 'text-amber-600';
    return 'text-emerald-600';
  };

  return (
    <div
      className={cn(
        'rounded-xl border bg-white p-6 shadow-sm transition-colors',
        isLowBalance && !isCriticalBalance
          ? 'border-amber-200 bg-amber-50'
          : isCriticalBalance
            ? 'border-red-200 bg-red-50'
            : 'border-gray-100'
      )}
    >
      <div className="flex min-h-[120px] items-center justify-between">
        <div className="flex flex-1 flex-col justify-center">
          <div className="mb-4 flex items-center gap-2">
            <h3 className="text-sm font-medium text-gray-600">
              Credit Balance
            </h3>
            {(isLowBalance || isCriticalBalance) && (
              <AlertTriangle
                className={cn(
                  'h-4 w-4',
                  isCriticalBalance ? 'text-red-500' : 'text-amber-500'
                )}
              />
            )}
          </div>

          {isLoading ? (
            <div className="mb-3 h-8 w-16 animate-pulse rounded bg-gray-200"></div>
          ) : (
            <p className="mb-3 text-3xl font-bold text-gray-900">{credits}</p>
          )}

          <div className="flex items-center gap-2">
            <p className={cn('text-sm', getBalanceColor())}>
              {isLoading ? (
                <span className="inline-block h-4 w-24 animate-pulse rounded bg-gray-200"></span>
              ) : (
                getBalanceMessage()
              )}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-2">
          <div
            className={cn(
              'flex h-12 w-12 items-center justify-center rounded-xl',
              isCriticalBalance
                ? 'bg-red-100'
                : isLowBalance
                  ? 'bg-amber-100'
                  : 'bg-emerald-100'
            )}
          >
            <Coins
              className={cn(
                'h-6 w-6',
                isCriticalBalance
                  ? 'text-red-600'
                  : isLowBalance
                    ? 'text-amber-600'
                    : 'text-emerald-600'
              )}
            />
          </div>

          <button
            onClick={onPurchaseClick}
            className={cn(
              'flex items-center gap-1 rounded-lg px-3 py-1 text-xs font-medium transition-colors',
              isCriticalBalance || isLowBalance
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            )}
          >
            <Plus className="h-3 w-3" />
            Buy More
          </button>
        </div>
      </div>
    </div>
  );
}

function CreditUsageCard({
  credits,
  isLoading,
}: {
  credits: number;
  isLoading: boolean;
}) {
  // Mock usage data - in real app would come from API
  const weeklyUsage = 12;
  const monthlyUsage = 47;
  const averagePerExam = 3.5;

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="flex-1">
        <h3 className="text-sm font-medium text-gray-600">Usage Overview</h3>

        {isLoading ? (
          <div className="mt-4 space-y-2">
            <div className="h-4 w-24 animate-pulse rounded bg-gray-200"></div>
            <div className="h-4 w-32 animate-pulse rounded bg-gray-200"></div>
            <div className="h-4 w-28 animate-pulse rounded bg-gray-200"></div>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">This week</span>
              <div className="flex items-center gap-1">
                <TrendingDown className="h-3 w-3 text-emerald-500" />
                <span className="text-sm font-medium text-gray-900">
                  {weeklyUsage} credits
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">This month</span>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-blue-500" />
                <span className="text-sm font-medium text-gray-900">
                  {monthlyUsage} credits
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Avg per exam</span>
              <span className="text-sm font-medium text-gray-900">
                {averagePerExam} credits
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function RecentTransactions({
  transactions,
  isLoading,
}: {
  transactions: CreditTransaction[];
  isLoading: boolean;
}) {
  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - timestamp.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return `${Math.floor(diffInDays / 7)}w ago`;
  };

  const getTransactionIcon = (type: CreditTransaction['type']) => {
    switch (type) {
      case 'purchase':
        return <CreditCard className="h-4 w-4 text-emerald-600" />;
      case 'usage':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'refund':
        return <TrendingUp className="h-4 w-4 text-indigo-600" />;
      case 'bonus':
        return <Zap className="h-4 w-4 text-amber-600" />;
      default:
        return <Coins className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <History className="h-5 w-5 text-gray-400" />
        <h3 className="text-sm font-medium text-gray-600">Recent Activity</h3>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200"></div>
              <div className="flex-1">
                <div className="h-4 w-32 animate-pulse rounded bg-gray-200"></div>
                <div className="mt-1 h-3 w-20 animate-pulse rounded bg-gray-200"></div>
              </div>
              <div className="h-4 w-12 animate-pulse rounded bg-gray-200"></div>
            </div>
          ))}
        </div>
      ) : transactions.length === 0 ? (
        <div className="py-8 text-center">
          <Clock className="mx-auto h-8 w-8 text-gray-300" />
          <p className="mt-2 text-sm text-gray-500">No recent activity</p>
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.slice(0, 5).map((transaction) => (
            <div key={transaction.id} className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-50">
                {getTransactionIcon(transaction.type)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900">
                  {transaction.description}
                </p>
                <p className="text-xs text-gray-500">
                  {formatTimeAgo(transaction.timestamp)}
                </p>
              </div>
              <div
                className={cn(
                  'text-sm font-medium',
                  transaction.amount > 0 ? 'text-emerald-600' : 'text-gray-900'
                )}
              >
                {transaction.amount > 0 ? '+' : ''}
                {transaction.amount}
              </div>
            </div>
          ))}
        </div>
      )}

      <button className="mt-4 w-full rounded-lg border border-gray-200 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50">
        View All Transactions
      </button>
    </div>
  );
}

export function CreditDisplaySystem({
  userId,
  className = '',
  showDetailedView = false,
}: CreditDisplaySystemProps) {
  const [statsState, statsActions] = useDashboardStats(userId);
  const { data: stats, loading, error, isRefreshing, lastUpdated } = statsState;
  const [showTransactions, setShowTransactions] = useState(showDetailedView);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);

  // Mock transaction data
  const transactions = generateMockTransactions();

  const handlePurchaseClick = () => {
    setIsPurchaseModalOpen(true);
  };

  const handlePurchaseComplete = (purchasedCredits: number) => {
    // Refresh the dashboard stats to get updated credit balance
    statsActions.refresh();

    // Show success notification (could be replaced with a toast)
    console.log(`✅ Successfully purchased ${purchasedCredits} credits!`);
  };

  const handleViewTransactions = () => {
    setShowTransactions(!showTransactions);
  };

  return (
    <div className={className}>
      {/* Header with refresh indicator */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          Credit Management
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

      {/* Credit cards grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Credit Balance Card */}
        <CreditBalanceCard
          credits={stats?.creditsRemaining ?? 0}
          isLoading={loading}
          onPurchaseClick={handlePurchaseClick}
        />

        {/* Credit Usage Card */}
        <CreditUsageCard
          credits={stats?.creditsRemaining ?? 0}
          isLoading={loading}
        />
      </div>

      {/* Recent Transactions (toggleable) */}
      {showDetailedView && (
        <div className="mt-6">
          <RecentTransactions transactions={transactions} isLoading={loading} />
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="flex items-center">
            <AlertTriangle className="mr-2 h-4 w-4 text-red-600" />
            <p className="text-sm font-medium text-red-800">
              Failed to load credit data
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

      {/* Credit Purchase Modal */}
      <CreditPurchaseModal
        isOpen={isPurchaseModalOpen}
        onClose={() => setIsPurchaseModalOpen(false)}
        currentCredits={stats?.creditsRemaining ?? 0}
        onPurchaseComplete={handlePurchaseComplete}
      />
    </div>
  );
}

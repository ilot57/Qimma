import { formatDistanceToNow } from 'date-fns';
import { RefreshCw, Wifi, WifiOff } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface RefreshIndicatorProps {
  isRefreshing: boolean;
  lastUpdated: Date | null;
  error: string | null;
  enabled: boolean;
  onRefresh: () => void;
  onToggle: () => void;
  className?: string;
}

export function RefreshIndicator({
  isRefreshing,
  lastUpdated,
  error,
  enabled,
  onRefresh,
  onToggle,
  className,
}: RefreshIndicatorProps) {
  return (
    <div className={cn('flex items-center space-x-2 text-sm', className)}>
      {/* Status Indicator */}
      <div className="flex items-center space-x-1">
        {enabled ? (
          <Wifi className="h-3 w-3 text-emerald-600" />
        ) : (
          <WifiOff className="h-3 w-3 text-gray-400" />
        )}
        <span
          className={cn(
            'text-xs font-medium',
            enabled ? 'text-emerald-600' : 'text-gray-400'
          )}
        >
          {enabled ? 'Live' : 'Paused'}
        </span>
      </div>

      {/* Last Updated Time */}
      {lastUpdated && (
        <span className="text-xs text-gray-500">
          Updated {formatDistanceToNow(lastUpdated, { addSuffix: true })}
        </span>
      )}

      {/* Error State */}
      {error && (
        <span className="text-xs text-red-500" title={error}>
          Error
        </span>
      )}

      {/* Refresh Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onRefresh}
        disabled={isRefreshing}
        className="h-6 w-6 p-0"
      >
        <RefreshCw
          className={cn(
            'h-3 w-3',
            isRefreshing && 'animate-spin',
            isRefreshing ? 'text-emerald-600' : 'text-gray-400'
          )}
        />
      </Button>

      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggle}
        className="h-6 px-2 text-xs"
      >
        {enabled ? 'Pause' : 'Resume'}
      </Button>
    </div>
  );
}

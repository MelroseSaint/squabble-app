import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
  overlay?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  text,
  className = '',
  overlay = false
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const spinner = (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <Loader2 
        size={size === 'sm' ? 16 : size === 'md' ? 32 : 48}
        className={`${sizeClasses[size]} text-squabble-red animate-spin`}
      />
      {text && (
        <span className={`${textSizeClasses[size]} text-gray-300 font-medium`}>
          {text}
        </span>
      )}
    </div>
  );

  if (overlay) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
};

// Skeleton loader components for different content types
export const CardSkeleton: React.FC = () => (
  <div className="bg-squabble-gray border border-gray-700 rounded-lg p-4 animate-pulse">
    <div className="flex items-center space-x-4">
      <div className="w-16 h-16 bg-gray-700 rounded-full"></div>
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-700 rounded w-3/4"></div>
        <div className="h-3 bg-gray-700 rounded w-1/2"></div>
      </div>
    </div>
  </div>
);

export const ListSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => (
  <div className="space-y-3">
    {Array.from({ length: count }, (_, i) => (
      <CardSkeleton key={i} />
    ))}
  </div>
);

export const ProfileSkeleton: React.FC = () => (
  <div className="bg-squabble-gray border border-gray-700 rounded-lg p-6 animate-pulse">
    <div className="flex items-center space-x-4 mb-6">
      <div className="w-20 h-20 bg-gray-700 rounded-full"></div>
      <div className="flex-1 space-y-2">
        <div className="h-6 bg-gray-700 rounded w-1/2"></div>
        <div className="h-4 bg-gray-700 rounded w-3/4"></div>
      </div>
    </div>
    <div className="space-y-3">
      <div className="h-4 bg-gray-700 rounded"></div>
      <div className="h-4 bg-gray-700 rounded w-5/6"></div>
      <div className="h-4 bg-gray-700 rounded w-4/6"></div>
    </div>
  </div>
);

export const StatsSkeleton: React.FC = () => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    {Array.from({ length: 4 }, (_, i) => (
      <div key={i} className="bg-squabble-gray border border-gray-700 rounded-lg p-4 animate-pulse">
        <div className="h-8 bg-gray-700 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-700 rounded w-1/2"></div>
      </div>
    ))}
  </div>
);

// Hook for managing loading states
export const useLoadingState = (initialState = false) => {
  const [isLoading, setIsLoading] = React.useState(initialState);
  const [loadingText, setLoadingText] = React.useState<string>('');

  const startLoading = (text?: string) => {
    setIsLoading(true);
    if (text) setLoadingText(text);
  };

  const stopLoading = () => {
    setIsLoading(false);
    setLoadingText('');
  };

  return {
    isLoading,
    loadingText,
    startLoading,
    stopLoading,
    setLoadingText
  };
};

// Higher-order component for loading states
export const withLoading = <P extends object>(
  Component: React.ComponentType<P>,
  LoadingComponent?: React.ComponentType
) => {
  const WrappedComponent = ({ isLoading, ...props }: P & { isLoading?: boolean }) => {
    if (isLoading) {
      return LoadingComponent ? <LoadingComponent /> : <LoadingSpinner overlay />;
    }
    return <Component {...(props as P)} />;
  };

  WrappedComponent.displayName = `withLoading(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
};

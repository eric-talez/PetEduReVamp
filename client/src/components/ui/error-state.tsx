import React from 'react';
import { 
  AlertCircle, 
  RefreshCw, 
  WifiOff, 
  FileX, 
  Lock, 
  Server, 
  AlertTriangle,
  Home,
  ArrowLeft,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type ErrorType = 
  | 'network' 
  | '404' 
  | 'permission' 
  | 'server' 
  | 'loading-failed'
  | 'generic'
  | 'offline'
  | 'timeout';

interface BaseErrorAction {
  label: string;
  onClick: () => void;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  icon?: React.ReactNode;
  'data-testid'?: string;
}

export interface ErrorStateProps {
  type: ErrorType;
  title?: string;
  message?: string;
  statusCode?: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  actions?: BaseErrorAction[];
  retryAction?: () => void;
  homeAction?: () => void;
  backAction?: () => void;
  'data-testid'?: string;
}

interface ErrorConfig {
  icon: React.ComponentType<{ className?: string }>;
  defaultTitle: string;
  defaultMessage: string;
  color: string;
  bgColor: string;
  borderColor: string;
  iconColor: string;
}

/**
 * Comprehensive error state component for consistent error handling
 * across the TALEZ platform with accessibility and responsive design
 */
export function ErrorState({
  type,
  title,
  message,
  statusCode,
  className,
  size = 'md',
  showIcon = true,
  actions = [],
  retryAction,
  homeAction,
  backAction,
  'data-testid': testId,
}: ErrorStateProps) {
  // Error configuration mapping
  const errorConfigs: Record<ErrorType, ErrorConfig> = {
    network: {
      icon: WifiOff,
      defaultTitle: '네트워크 연결 오류',
      defaultMessage: '인터넷 연결을 확인하고 다시 시도해 주세요.',
      color: 'text-red-800 dark:text-red-400',
      bgColor: 'bg-red-50 dark:bg-red-900/10',
      borderColor: 'border-red-200 dark:border-red-800',
      iconColor: 'text-red-600 dark:text-red-400'
    },
    '404': {
      icon: FileX,
      defaultTitle: '페이지를 찾을 수 없습니다',
      defaultMessage: '요청하신 페이지가 존재하지 않거나 이동되었습니다.',
      color: 'text-blue-800 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/10',
      borderColor: 'border-blue-200 dark:border-blue-800',
      iconColor: 'text-blue-600 dark:text-blue-400'
    },
    permission: {
      icon: Lock,
      defaultTitle: '접근 권한이 없습니다',
      defaultMessage: '이 콘텐츠에 접근할 권한이 없습니다. 로그인하거나 관리자에게 문의하세요.',
      color: 'text-orange-800 dark:text-orange-400',
      bgColor: 'bg-orange-50 dark:bg-orange-900/10',
      borderColor: 'border-orange-200 dark:border-orange-800',
      iconColor: 'text-orange-600 dark:text-orange-400'
    },
    server: {
      icon: Server,
      defaultTitle: '서버 오류가 발생했습니다',
      defaultMessage: '서버에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.',
      color: 'text-purple-800 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-900/10',
      borderColor: 'border-purple-200 dark:border-purple-800',
      iconColor: 'text-purple-600 dark:text-purple-400'
    },
    'loading-failed': {
      icon: RefreshCw,
      defaultTitle: '데이터 로딩에 실패했습니다',
      defaultMessage: '데이터를 불러오는 중 오류가 발생했습니다. 페이지를 새로고침해 주세요.',
      color: 'text-amber-800 dark:text-amber-400',
      bgColor: 'bg-amber-50 dark:bg-amber-900/10',
      borderColor: 'border-amber-200 dark:border-amber-800',
      iconColor: 'text-amber-600 dark:text-amber-400'
    },
    generic: {
      icon: AlertCircle,
      defaultTitle: '오류가 발생했습니다',
      defaultMessage: '예상치 못한 오류가 발생했습니다. 다시 시도해 주세요.',
      color: 'text-gray-800 dark:text-gray-400',
      bgColor: 'bg-gray-50 dark:bg-gray-900/10',
      borderColor: 'border-gray-200 dark:border-gray-800',
      iconColor: 'text-gray-600 dark:text-gray-400'
    },
    offline: {
      icon: WifiOff,
      defaultTitle: '오프라인 상태입니다',
      defaultMessage: '인터넷 연결을 확인하고 다시 시도해 주세요.',
      color: 'text-slate-800 dark:text-slate-400',
      bgColor: 'bg-slate-50 dark:bg-slate-900/10',
      borderColor: 'border-slate-200 dark:border-slate-800',
      iconColor: 'text-slate-600 dark:text-slate-400'
    },
    timeout: {
      icon: AlertTriangle,
      defaultTitle: '요청 시간이 초과되었습니다',
      defaultMessage: '서버 응답이 지연되고 있습니다. 잠시 후 다시 시도해 주세요.',
      color: 'text-yellow-800 dark:text-yellow-400',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/10',
      borderColor: 'border-yellow-200 dark:border-yellow-800',
      iconColor: 'text-yellow-600 dark:text-yellow-400'
    }
  };

  // Get status code specific messages
  const getStatusMessage = (code: number): string => {
    switch(code) {
      case 400:
        return '잘못된 요청입니다. 입력 정보를 확인해 주세요.';
      case 401:
        return '로그인이 필요하거나 세션이 만료되었습니다.';
      case 403:
        return '이 콘텐츠에 접근할 권한이 없습니다.';
      case 404:
        return '요청하신 정보를 찾을 수 없습니다.';
      case 429:
        return '요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.';
      case 500:
        return '서버 내부 오류가 발생했습니다.';
      case 502:
        return '서버 게이트웨이 오류가 발생했습니다.';
      case 503:
        return '서비스를 일시적으로 사용할 수 없습니다.';
      case 504:
        return '서버 응답 시간이 초과되었습니다.';
      default:
        return message || errorConfigs[type].defaultMessage;
    }
  };

  const config = errorConfigs[type];
  const IconComponent = config.icon;
  const finalTitle = title || config.defaultTitle;
  const finalMessage = statusCode ? getStatusMessage(statusCode) : (message || config.defaultMessage);

  // Size configuration
  const sizeConfig = {
    sm: {
      container: 'py-6 px-4 space-y-3',
      icon: 'w-8 h-8',
      iconContainer: 'w-10 h-10',
      title: 'text-sm font-medium',
      message: 'text-xs',
      statusCode: 'text-xs'
    },
    md: {
      container: 'py-8 px-6 space-y-4',
      icon: 'w-6 h-6',
      iconContainer: 'w-12 h-12',
      title: 'text-base font-medium',
      message: 'text-sm',
      statusCode: 'text-xs'
    },
    lg: {
      container: 'py-12 px-8 space-y-6',
      icon: 'w-8 h-8',
      iconContainer: 'w-16 h-16',
      title: 'text-lg font-medium',
      message: 'text-base',
      statusCode: 'text-sm'
    }
  };

  const sizes = sizeConfig[size];

  // Build default actions based on type and provided actions
  const defaultActions: BaseErrorAction[] = [];

  if (retryAction) {
    defaultActions.push({
      label: '다시 시도',
      onClick: retryAction,
      variant: 'outline',
      icon: <RefreshCw className="h-4 w-4" />,
      'data-testid': `${testId || 'error-state'}-retry-button`
    });
  }

  if (backAction) {
    defaultActions.push({
      label: '돌아가기',
      onClick: backAction,
      variant: 'ghost',
      icon: <ArrowLeft className="h-4 w-4" />,
      'data-testid': `${testId || 'error-state'}-back-button`
    });
  }

  if (homeAction || type === '404') {
    defaultActions.push({
      label: '홈으로 이동',
      onClick: homeAction || (() => window.location.href = '/'),
      variant: 'secondary',
      icon: <Home className="h-4 w-4" />,
      'data-testid': `${testId || 'error-state'}-home-button`
    });
  }

  const allActions = [...actions, ...defaultActions];

  return (
    <div 
      className={cn(
        'flex flex-col items-center justify-center rounded-lg border',
        config.bgColor,
        config.borderColor,
        sizes.container,
        className
      )}
      role="alert"
      aria-live="assertive"
      aria-labelledby={`error-title-${testId || type}`}
      aria-describedby={`error-desc-${testId || type}`}
      data-testid={testId || `error-state-${type}`}
    >
      {showIcon && (
        <div className={cn(
          'flex items-center justify-center rounded-full',
          config.bgColor,
          sizes.iconContainer
        )}>
          <IconComponent 
            className={cn(sizes.icon, config.iconColor)} 
            aria-hidden="true" 
          />
        </div>
      )}
      
      <div className="text-center">
        <h3 
          id={`error-title-${testId || type}`}
          className={cn(sizes.title, config.color)}
        >
          {finalTitle}
        </h3>
        <div id={`error-desc-${testId || type}`}>
          <p className={cn('mt-2', sizes.message, config.color.replace('800', '700').replace('400', '300'))}>
            {finalMessage}
          </p>
          {statusCode && (
            <p className={cn('mt-1', sizes.statusCode, config.color.replace('800', '600').replace('400', '400'))}>
              오류 코드: {statusCode}
            </p>
          )}
        </div>
      </div>
      
      {allActions.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center mt-4">
          {allActions.map((action, index) => (
            <Button 
              key={index}
              variant={action.variant || 'default'}
              size="sm"
              className={cn(
                'flex items-center gap-2',
                action.variant === 'outline' && cn(
                  config.borderColor,
                  config.color.replace('dark:text', 'dark:hover:text').replace('text', 'hover:text'),
                  config.bgColor.replace('bg-', 'hover:bg-').replace('/10', '/30')
                )
              )}
              onClick={action.onClick}
              data-testid={action['data-testid'] || `${testId || 'error-state'}-action-${index}`}
            >
              {action.icon}
              {action.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}

// Convenient preset components for common error types
export function NetworkError(props: Omit<ErrorStateProps, 'type'>) {
  return <ErrorState type="network" {...props} />;
}

export function NotFoundError(props: Omit<ErrorStateProps, 'type'>) {
  return <ErrorState type="404" {...props} />;
}

export function PermissionError(props: Omit<ErrorStateProps, 'type'>) {
  return <ErrorState type="permission" {...props} />;
}

export function ServerError(props: Omit<ErrorStateProps, 'type'>) {
  return <ErrorState type="server" {...props} />;
}

export function LoadingFailedError(props: Omit<ErrorStateProps, 'type'>) {
  return <ErrorState type="loading-failed" {...props} />;
}

export function GenericError(props: Omit<ErrorStateProps, 'type'>) {
  return <ErrorState type="generic" {...props} />;
}

export function OfflineError(props: Omit<ErrorStateProps, 'type'>) {
  return <ErrorState type="offline" {...props} />;
}

export function TimeoutError(props: Omit<ErrorStateProps, 'type'>) {
  return <ErrorState type="timeout" {...props} />;
}
import React from 'react';
import { cn } from '@/lib/utils';

interface DividerProps {
  className?: string;
  text?: string;
}

export function Divider({ className, text }: DividerProps) {
  if (!text) {
    return (
      <div className={cn("relative my-4", className)}>
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative my-4", className)}>
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
      </div>
      <div className="relative flex justify-center text-xs">
        <span className="bg-white dark:bg-gray-900 px-2 text-gray-500 dark:text-gray-400">
          {text}
        </span>
      </div>
    </div>
  );
}
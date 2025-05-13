import React from 'react';
import { cn } from '@/lib/utils';

interface SidebarIconItemProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  isActive?: boolean;
}

export function SidebarIconItem({ icon, label, onClick, isActive = false }: SidebarIconItemProps) {
  return (
    <div
      className={cn(
        "w-10 h-10 flex flex-col items-center justify-center rounded-md cursor-pointer mx-auto mb-2",
        isActive ? "bg-primary/10 text-primary" : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
      )}
      onClick={onClick}
      aria-label={label}
      role="button"
      tabIndex={0}
    >
      {icon}
    </div>
  );
}
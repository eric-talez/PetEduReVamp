import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarMenuGroupProps {
  expanded: boolean;
  title: string;
  groupName: string;
  isOpen: boolean;
  toggleGroup: (group: string) => void;
  icon: React.ReactNode;
}

export function SidebarMenuGroup({ 
  expanded, 
  title, 
  groupName, 
  isOpen, 
  toggleGroup,
  icon
}: SidebarMenuGroupProps) {
  const handleToggle = () => {
    toggleGroup(groupName);
  };

  return (
    <>
      {expanded ? (
        <div 
          className="px-3 py-2 flex items-center justify-between cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-all duration-200 shadow-sm hover:shadow-md border border-transparent hover:border-gray-200 dark:hover:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 hover:scale-105" 
          onClick={handleToggle}
          role="button"
          aria-expanded={isOpen}
          aria-label={`${title} 메뉴 토글`}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleToggle();
            }
          }}
        >
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{title}</h3>
          <div className="transition-transform duration-200">
            {isOpen ? <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" /> : <ChevronRight className="h-4 w-4 text-gray-500 dark:text-gray-400" />}
          </div>
        </div>
      ) : (
        <div 
          className="py-2 flex justify-center"
          onClick={handleToggle}
          role="button"
          aria-expanded={isOpen}
          aria-label={`${title} 메뉴 토글`}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleToggle();
            }
          }}
        >
          <div className={cn(
            "w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer relative transition-all duration-200 shadow-sm hover:shadow-md border border-transparent hover:border-gray-200 dark:hover:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 hover:scale-110"
          )}>
            {icon}
            <div className="absolute -top-1 -right-1 transition-transform duration-200">
              {isOpen ? 
                <ChevronDown className="h-3 w-3 text-gray-500 dark:text-gray-400" /> : 
                <ChevronRight className="h-3 w-3 text-gray-500 dark:text-gray-400" />
              }
            </div>
          </div>
        </div>
      )}
    </>
  );
}
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight } from "lucide-react";

// 메뉴 그룹 헤더 개선
export function MenuGroupHeader({ 
  title, 
  isOpen, 
  onToggle, 
  icon,
  badge 
}: {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  icon?: React.ReactNode;
  badge?: number;
}) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "flex items-center justify-between w-full px-4 py-2 text-sm font-semibold",
        "text-gray-600 dark:text-gray-300 hover:text-primary transition-colors",
        "group focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-md"
      )}
      aria-expanded={isOpen}
      aria-controls={`menu-group-${title.toLowerCase()}`}
    >
      <div className="flex items-center gap-2">
        {icon && (
          <span className="text-gray-500 dark:text-gray-400 group-hover:text-primary transition-colors">
            {icon}
          </span>
        )}
        <span>{title}</span>
        {badge && badge > 0 && (
          <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full font-medium">
            {badge}
          </span>
        )}
      </div>
      <span className="text-gray-400 group-hover:text-primary transition-transform duration-200">
        {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </span>
    </button>
  );
}

// 메뉴 항목 개선
export function MenuItemImproved({
  icon,
  label,
  href,
  active,
  onClick,
  badge,
  description,
  isNew
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
  onClick?: () => void;
  badge?: number;
  description?: string;
  isNew?: boolean;
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-4 py-2.5 text-sm rounded-md transition-all duration-200",
        "hover:bg-gray-100 dark:hover:bg-gray-800 group",
        active && "bg-primary/10 text-primary border-r-2 border-primary"
      )}
      aria-current={active ? "page" : undefined}
    >
      <span className={cn(
        "flex-shrink-0 transition-colors",
        active ? "text-primary" : "text-gray-500 group-hover:text-primary"
      )}>
        {icon}
      </span>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={cn(
            "font-medium truncate",
            active ? "text-primary" : "text-gray-700 dark:text-gray-200"
          )}>
            {label}
          </span>
          {isNew && (
            <span className="bg-green-100 text-green-800 text-xs px-1.5 py-0.5 rounded-full font-medium">
              New
            </span>
          )}
          {badge && badge > 0 && (
            <span className="bg-primary text-white text-xs px-1.5 py-0.5 rounded-full font-medium ml-auto">
              {badge}
            </span>
          )}
        </div>
        {description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
            {description}
          </p>
        )}
      </div>
    </a>
  );
}

// 색상 대비 개선
export const improvedColors = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe', 
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    900: '#1e3a8a'
  },
  success: {
    50: '#f0fdf4',
    500: '#22c55e',
    600: '#16a34a'
  },
  warning: {
    50: '#fffbeb',
    500: '#f59e0b',
    600: '#d97706'
  },
  error: {
    50: '#fef2f2',
    500: '#ef4444',
    600: '#dc2626'
  }
};
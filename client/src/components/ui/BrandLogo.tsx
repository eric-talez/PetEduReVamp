import { Link } from "wouter";
import { cn } from "@/lib/utils";
import talezLogo from "@/assets/main-banner-talez.png";

interface BrandLogoProps {
  /** Logo variant to display */
  variant?: 'full' | 'compact' | 'symbol' | 'text-only';
  /** Logo size preset */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Custom height in pixels (overrides size preset) */
  height?: number;
  /** Whether logo should be clickable and navigate to home */
  clickable?: boolean;
  /** Custom href when clickable (defaults to "/") */
  href?: string;
  /** Additional CSS classes */
  className?: string;
  /** Whether to show brand text alongside logo */
  showText?: boolean;
  /** Custom text to display (defaults to "Talez") */
  text?: string;
  /** Loading state - shows placeholder */
  loading?: boolean;
  /** Custom alt text for accessibility */
  altText?: string;
  /** Test ID for testing */
  testId?: string;
  /** Custom logo source URL (overrides variant-based selection) */
  customSrc?: string;
  /** Fallback behavior when custom source fails */
  fallbackToDefault?: boolean;
}

/**
 * Reusable TALEZ Brand Logo Component
 * 
 * Provides consistent brand logo implementation across the platform
 * with responsive sizing, error handling, and accessibility support.
 * 
 * Usage Examples:
 * - Header Navigation: <BrandLogo variant="compact" size="md" clickable showText />
 * - Sidebar: <BrandLogo variant="full" size="lg" clickable />  
 * - Loading screens: <BrandLogo variant="symbol" size="xl" />
 * - Footer: <BrandLogo variant="full" size="sm" clickable showText />
 */
export function BrandLogo({
  variant = 'compact',
  size = 'md',
  height,
  clickable = false,
  href = "/",
  className = "",
  showText = false,
  text = "Talez",
  loading = false,
  altText,
  testId = "brand-logo",
  customSrc,
  fallbackToDefault = true
}: BrandLogoProps) {
  
  // Size presets mapping
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8", 
    lg: "h-12 w-12",
    xl: "h-16 w-16"
  };

  // Logo file mapping
  const logoFiles = {
    full: talezLogo,
    compact: talezLogo, 
    symbol: talezLogo,
    'text-only': null // No image for text-only
  };

  // Determine logo source - prioritize custom source, then fall back to variant-based selection
  const logoSrc = customSrc || logoFiles[variant];
  
  // Custom height override
  const imageClasses = height 
    ? `h-[${height}px] w-auto`
    : variant === 'full' 
      ? `h-${size === 'sm' ? '6' : size === 'md' ? '8' : size === 'lg' ? '12' : '16'} w-auto`
      : sizeClasses[size];

  // Error handler for image loading failures
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    
    // If using custom source and fallback is enabled, try default logos
    if (customSrc && fallbackToDefault) {
      if (!img.src.includes('logo-compact.svg') && !img.src.includes('logo.svg') && !img.src.includes('logo-symbol.svg')) {
        // First fallback: try the variant-based default logo
        img.src = logoFiles[variant] || '/logo-compact.svg';
        return;
      }
    }
    
    // Standard fallback hierarchy: compact -> full -> symbol
    if (img.src.includes('logo-compact.svg')) {
      img.src = '/logo.svg';
      img.className = img.className.replace(/w-\d+/, 'w-auto');
    } else if (img.src.includes('logo.svg') && !img.src.includes('symbol')) {
      img.src = '/logo-symbol.svg';
    } else {
      // Final fallback - hide image and show text
      img.style.display = 'none';
      const textSpan = img.parentElement?.querySelector('[data-logo-text]');
      if (textSpan) {
        (textSpan as HTMLElement).style.display = 'inline';
      }
    }
  };

  // Loading placeholder
  if (loading) {
    return (
      <div 
        className={cn(
          "bg-gray-200 dark:bg-gray-700 animate-pulse rounded flex items-center space-x-2",
          imageClasses,
          className
        )}
        data-testid={`${testId}-loading`}
      >
        <div className="flex-shrink-0 bg-gray-300 dark:bg-gray-600 rounded" />
        {showText && <div className="h-4 w-16 bg-gray-300 dark:bg-gray-600 rounded" />}
      </div>
    );
  }

  // Logo content
  const logoContent = (
    <div className={cn(
      "flex items-center space-x-2",
      clickable && "hover:opacity-80 transition-opacity cursor-pointer",
      className
    )}>
      {/* Logo Image */}
      {logoSrc && variant !== 'text-only' && (
        <img
          src={logoSrc}
          alt={altText || (customSrc ? 'TALEZ logo' : `TALEZ ${variant} logo`)}
          className={cn(imageClasses, "flex-shrink-0")}
          onError={handleImageError}
          data-testid={`${testId}-image`}
        />
      )}
      
      {/* Brand Text */}
      {(showText || variant === 'text-only') && (
        <span 
          className={cn(
            "font-bold text-primary",
            size === 'sm' && "text-base",
            size === 'md' && "text-lg", 
            size === 'lg' && "text-xl",
            size === 'xl' && "text-2xl"
          )}
          data-logo-text="true"
          data-testid={`${testId}-text`}
        >
          {text}
        </span>
      )}
    </div>
  );

  // Wrap in Link if clickable
  if (clickable) {
    return (
      <Link
        href={href}
        className="inline-flex"
        aria-label={`${text} 홈페이지로 이동`}
        data-testid={`${testId}-link`}
      >
        {logoContent}
      </Link>
    );
  }

  return logoContent;
}

/**
 * Pre-configured logo variants for common use cases
 */
export const BrandLogoVariants = {
  /** Header navigation logo */
  Header: () => (
    <BrandLogo 
      variant="compact" 
      size="md" 
      clickable 
      showText 
      testId="header-logo"
    />
  ),
  
  /** Sidebar logo for expanded state */
  SidebarExpanded: () => (
    <BrandLogo 
      variant="full" 
      size="lg" 
      clickable 
      testId="sidebar-logo-expanded"
    />
  ),
  
  /** Sidebar logo for collapsed state */
  SidebarCollapsed: () => (
    <BrandLogo 
      variant="compact" 
      size="md" 
      clickable 
      testId="sidebar-logo-collapsed"
    />
  ),
  
  /** Loading screen logo */
  Loading: () => (
    <BrandLogo 
      variant="symbol" 
      size="xl" 
      showText 
      testId="loading-logo"
    />
  ),
  
  /** Footer logo */
  Footer: () => (
    <BrandLogo 
      variant="full" 
      size="sm" 
      clickable 
      showText 
      testId="footer-logo"
    />
  ),
  
  /** Authentication page logo */
  Auth: () => (
    <BrandLogo 
      variant="text-only" 
      size="xl" 
      showText 
      testId="auth-logo"
    />
  )
};
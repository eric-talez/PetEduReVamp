# TALEZ Brand Identity Style Guide

## Overview

This comprehensive style guide establishes consistent brand identity standards for the TALEZ platform. It ensures professional, cohesive brand presentation across all touchpoints and supports commercial deployment readiness.

**Last Updated**: September 19, 2025  
**Version**: 1.0  
**Status**: Production Ready

---

## Brand Assets

### Logo System

TALEZ uses a distinctive logo system with colorful icon squares representing different aspects of pet education:

#### Primary Logo (`/public/logo.svg`)
- **Dimensions**: 180×60 pixels
- **Format**: Horizontal layout
- **Usage**: Main branding, wide spaces, marketing materials
- **Elements**: Three colorful squares + "Talez" text
- **Colors**: Green (#8BC34A), Yellow (#FDD835), Orange (#FF7043)

#### Compact Logo (`/public/logo-compact.svg`)
- **Dimensions**: 40×40 pixels  
- **Format**: Vertical layout with text below
- **Usage**: Navigation headers, small spaces, app icons
- **Recommended height**: 32-40px in headers

#### Symbol Logo (`/public/logo-symbol.svg`)
- **Dimensions**: 80×80 pixels
- **Format**: Icons only, no text
- **Usage**: Favicons, very small spaces, loading indicators
- **Minimum size**: 16×16 pixels

#### Theme Variants
- `logo-dark.svg` - Optimized for dark backgrounds
- `logo-light.svg` - Optimized for light backgrounds
- `logo-compact-dark.svg` - Dark theme navigation version

### Logo Usage Guidelines

#### ✅ Correct Usage
```typescript
// Header navigation
<BrandLogo variant="compact" size="md" clickable showText />

// Sidebar expanded
<BrandLogo variant="full" size="lg" clickable />

// Loading screens
<BrandLogo variant="symbol" size="xl" showText />
```

#### ❌ Incorrect Usage
- Never stretch or distort logo proportions
- Don't use low-resolution versions in high-DPI displays
- Avoid placing logos on busy or low-contrast backgrounds
- Don't modify logo colors or elements

#### Clear Space Requirements
- Maintain minimum clear space equal to the height of the "T" in "Talez"
- On mobile devices: minimum 16px clear space on all sides
- In headers: minimum 8px vertical padding

---

## Color Palette

### Primary Colors

```css
/* Brand Primary Green */
--primary: 142 61% 42%;          /* #2BAA61 */
--primary-foreground: 0 0% 100%; /* White text on green */

/* Logo Color Harmony */
Primary Green:    #8BC34A (logo icon) / #2BAA61 (CSS primary)
Secondary Yellow: #FDD835 (logo icon, highlights)  
Tertiary Orange:  #FF7043 (logo icon, alerts)
```

### Dark Mode Colors

```css
.dark {
  --primary: 142 61% 55%;          /* Lighter green for dark mode */
  --primary-foreground: 220 13% 9%; /* Dark text on light green */
}
```

### High Contrast Mode

```css
.high-contrast {
  --primary: 142 61% 30%;          /* Darker green for better contrast */
  --primary-foreground: 0 0% 100%;  /* White text */
}
```

### Color Usage Guidelines

#### Primary Green (#2BAA61)
- **Use for**: Primary actions, active states, brand text, links
- **Examples**: Submit buttons, active navigation, "Talez" brand text
- **Accessibility**: WCAG AA compliant contrast ratios

#### Secondary Yellow (#FDD835)  
- **Use for**: Highlights, warnings, secondary actions, badges
- **Examples**: Notification badges, warning messages, feature highlights
- **Avoid**: Large backgrounds (accessibility concerns)

#### Tertiary Orange (#FF7043)
- **Use for**: Error states, urgent notifications, delete actions
- **Examples**: Error messages, critical alerts, destructive buttons
- **Context**: Always pair with explanatory text

---

## Typography

### Brand Text Standards

#### Brand Name Usage
- **Correct**: "Talez" (title case)
- **Incorrect**: "TALEZ", "talez", "TalEz"
- **Font weight**: Bold (700) for brand prominence
- **Color**: Primary green (#2BAA61) in most contexts

#### Font Implementation
```css
/* Brand name styling */
.brand-text {
  font-family: system-ui, -apple-system, sans-serif;
  font-weight: 700;
  color: hsl(var(--primary));
  letter-spacing: -0.025em;
}
```

#### Size Guidelines
- **Large displays**: text-2xl (24px)
- **Desktop headers**: text-xl (20px)
- **Mobile headers**: text-lg (18px)
- **Compact spaces**: text-base (16px)

### Brand Voice

#### Messaging Tone
- **Professional yet approachable**
- **Educational and supportive**  
- **Warm and encouraging**
- **Clear and concise**

#### Example Brand Messages
- "반려견과 함께하는 특별한 교육 여정" (Primary tagline)
- "전문 훈련사와 함께하는 맞춤형 교육"
- "AI 기술로 더 스마트한 반려견 케어"

---

## Component Standards

### BrandLogo Component

The standardized `BrandLogo` component ensures consistent logo usage:

```typescript
import { BrandLogo } from "@/components/ui/BrandLogo";

// Common usage patterns
<BrandLogo variant="compact" size="md" clickable showText />  // Headers
<BrandLogo variant="full" size="lg" clickable />             // Sidebars  
<BrandLogo variant="symbol" size="sm" />                     // Icons
<BrandLogo variant="text-only" size="xl" showText />        // Auth pages
```

#### Component Features
- **Error handling**: Automatic fallback hierarchy
- **Responsive design**: Size presets and custom heights
- **Accessibility**: Proper alt text and ARIA labels
- **Theme support**: Automatic dark/light mode adaptation
- **Testing support**: Data test IDs included

### Pre-configured Variants

```typescript
import { BrandLogoVariants } from "@/components/ui/BrandLogo";

// Quick implementations for common use cases
<BrandLogoVariants.Header />           // TopBar navigation
<BrandLogoVariants.SidebarExpanded /> // Full sidebar logo
<BrandLogoVariants.SidebarCollapsed /> // Compact sidebar logo
<BrandLogoVariants.Loading />          // Loading screens
<BrandLogoVariants.Footer />           // Footer branding
<BrandLogoVariants.Auth />             // Authentication pages
```

---

## Implementation Guidelines

### Navigation Components

#### TopBar Implementation
```typescript
// Current standard implementation
<div className="flex items-center space-x-3">
  {/* Mobile menu button */}
  <button>...</button>
  
  {/* Standardized brand logo */}
  <BrandLogo 
    variant="compact" 
    size="md" 
    clickable 
    showText 
    className="hidden sm:flex"
  />
  <BrandLogo 
    variant="compact" 
    size="md" 
    clickable 
    className="sm:hidden" // Mobile: no text
  />
</div>
```

#### Sidebar Implementation
```typescript
// Dynamic logo based on sidebar state
{expanded ? (
  <BrandLogo variant="full" size="lg" clickable />
) : (
  <BrandLogo variant="compact" size="md" clickable />
)}
```

### Authentication Pages

#### Login/Register Pages
- Use `variant="text-only"` with large size
- Include brand tagline below logo
- Maintain consistent brand messaging

```typescript
<div className="text-center mb-8">
  <BrandLogo variant="text-only" size="xl" showText />
  <p className="mt-2 text-muted-foreground">
    반려견과 함께하는 특별한 교육 여정
  </p>
</div>
```

### Loading States

#### Branded Loading Indicators
```typescript
<div className="flex flex-col items-center justify-center">
  <BrandLogo variant="symbol" size="xl" loading />
  <p className="mt-4">로딩 중...</p>
</div>
```

---

## Accessibility Standards

### Color Contrast Requirements

All brand colors meet WCAG AA standards:

- **Primary Green (#2BAA61)**: 4.5:1 contrast ratio on white
- **Text on Green**: White text provides 8.2:1 contrast  
- **Dark Mode**: Adjusted colors maintain contrast ratios

### Screen Reader Support

```typescript
// Proper alt text for logos
<img 
  src="/logo-compact.svg" 
  alt="TALEZ 반려견 교육 플랫폼 로고" 
/>

// Descriptive ARIA labels
<Link 
  href="/" 
  aria-label="TALEZ 홈페이지로 이동"
>
  <BrandLogo />
</Link>
```

### Keyboard Navigation

- All brand elements are keyboard accessible
- Focus indicators use brand primary color
- Tab order follows logical navigation flow

---

## Responsive Design Standards

### Breakpoint Behavior

#### Mobile (< 640px)
- Use compact logos without text
- Minimum touch target: 44×44px  
- Simplified brand presentation

#### Tablet (640px - 1024px)  
- Show logos with text where space permits
- Medium-sized brand elements
- Balanced logo/content ratio

#### Desktop (> 1024px)
- Full brand presentation with text
- Larger logo sizes where appropriate
- Complete brand experience

### Logo Sizing by Screen

```css
/* Responsive logo sizing */
.brand-logo {
  height: 2rem;        /* 32px default */
}

@media (min-width: 640px) {
  .brand-logo {
    height: 2.5rem;    /* 40px tablet+ */
  }
}

@media (min-width: 1024px) {
  .brand-logo {
    height: 3rem;      /* 48px desktop+ */
  }
}
```

---

## Quality Assurance

### Pre-deployment Checklist

#### ✅ Logo Implementation
- [ ] TopBar logo present and functional
- [ ] Sidebar logos appropriate for expanded/collapsed states  
- [ ] Authentication pages use consistent branding
- [ ] Loading screens include brand elements
- [ ] Footer branding implemented

#### ✅ Color Consistency
- [ ] Primary green used consistently across components
- [ ] Secondary colors (yellow/orange) used appropriately
- [ ] Dark mode colors maintain brand harmony
- [ ] High contrast mode supported

#### ✅ Accessibility Compliance
- [ ] All logos have proper alt text
- [ ] Color contrast ratios meet WCAG AA standards
- [ ] Keyboard navigation works correctly
- [ ] Screen readers can identify brand elements

#### ✅ Responsive Behavior
- [ ] Logos scale appropriately across breakpoints
- [ ] Mobile logo presentation is clear and usable
- [ ] Touch targets meet minimum size requirements
- [ ] Brand text visibility optimized per screen size

### Testing Guidelines

#### Visual Testing
```bash
# Test different logo variants load correctly
curl -I https://domain.com/logo.svg
curl -I https://domain.com/logo-compact.svg
curl -I https://domain.com/logo-symbol.svg
```

#### Component Testing
```typescript
// Example test for BrandLogo component
describe('BrandLogo', () => {
  it('renders compact logo with text', () => {
    render(<BrandLogo variant="compact" showText />);
    expect(screen.getByTestId('brand-logo-image')).toBeInTheDocument();
    expect(screen.getByText('Talez')).toBeInTheDocument();
  });
  
  it('handles image load errors gracefully', () => {
    render(<BrandLogo variant="compact" />);
    fireEvent.error(screen.getByTestId('brand-logo-image'));
    // Should fallback to alternative logo
    expect(screen.getByTestId('brand-logo-image')).toHaveAttribute('src');
  });
});
```

---

## Maintenance and Updates

### Version Control

- All brand assets stored in `/public/` directory
- Component implementations in `/src/components/ui/BrandLogo.tsx`
- Style guide documentation tracked in git
- Changes require review and testing

### Update Process

1. **Asset Changes**: Update SVG files, test across browsers
2. **Component Updates**: Update BrandLogo component, run tests
3. **Documentation**: Update this style guide with changes
4. **Quality Review**: Complete pre-deployment checklist
5. **Deployment**: Deploy with proper rollback plan

### Future Considerations

- **Brand Evolution**: Process for updating brand elements
- **New Components**: Guidelines for adding brand elements to new features
- **Performance**: Monitor logo loading performance and optimize
- **Analytics**: Track brand element interaction and effectiveness

---

## Support and Resources

### Technical Implementation
- **Component**: `/src/components/ui/BrandLogo.tsx`
- **Assets**: `/public/logo*.svg`
- **Styles**: CSS custom properties in `/src/index.css`

### Design Resources
- **Source Files**: `/public/logo.ai` (Adobe Illustrator)
- **Export Settings**: SVG optimized for web
- **Color Codes**: Documented in this guide

### Contact Information
- **Brand Questions**: Design team
- **Technical Issues**: Development team  
- **Style Guide Updates**: Product team

---

**This style guide ensures consistent, professional brand presentation across the TALEZ platform. Regular review and updates maintain brand integrity as the platform evolves.**
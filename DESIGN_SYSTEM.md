# Professional Design System - Kodotakai

## Design Philosophy

The Kodotakai application follows modern enterprise design principles:

- **Clean & Professional**: Minimal design with focus on functionality
- **Full-page Layouts**: No unnecessary containers or boxes
- **Consistent**: Unified design language across components  
- **Accessible**: WCAG compliant with proper contrast ratios
- **Responsive**: Mobile-first approach with seamless adaptation
- **Performance-oriented**: Optimized animations and transitions

## Color Palette

### Primary Colors
```css
--primary-blue: #3b82f6
--primary-blue-hover: #2563eb
--primary-blue-active: #1d4ed8
```

### Background Colors
```css
--bg-primary: #ffffff
--bg-secondary: #f8fafc
--bg-tertiary: #f1f5f9
--bg-quaternary: #e2e8f0
```

### Text Colors
```css
--text-primary: #1e293b
--text-secondary: #475569
--text-muted: #64748b
--text-placeholder: #9ca3af
```

### Border Colors
```css
--border-primary: #e2e8f0
--border-secondary: #d1d5db
--border-focus: #3b82f6
```

## Typography

### Font Stack
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
```

### Type Scale
- **Heading 1**: 1.75rem (28px), weight 600, -0.02em letter-spacing
- **Heading 2**: 1.5rem (24px), weight 600, -0.02em letter-spacing
- **Body**: 1rem (16px), weight 400, 0.02em letter-spacing
- **Caption**: 0.875rem (14px), weight 400, 0.02em letter-spacing
- **Small**: 0.8rem (12.8px), weight 400, 0.05em letter-spacing

## Spacing System

Based on 4px grid system:
- **xs**: 0.25rem (4px)
- **sm**: 0.5rem (8px)
- **md**: 1rem (16px)
- **lg**: 1.5rem (24px)
- **xl**: 2rem (32px)
- **2xl**: 3rem (48px)

## Components

### Splash Screen
- **Duration**: 3 seconds optimal
- **Logo**: 80px × 80px, minimal animation
- **Progress**: Linear progress bar with subtle styling
- **Background**: Dark gradient for contrast with light login

### Login Page
- **Layout**: 60/40 split layout (brand/form)
- **Full Height**: 100vh with no scrolling
- **Brand Section**: White background with professional features list
- **Form Section**: Light gray background with elevated form
- **Logo**: Simple, professional styling without childish effects
- **Typography**: Left-aligned, professional hierarchy

## Layout Principles

### No Scrolling on Key Pages
- Login page: Fixed height, no scroll
- Splash screen: Full viewport coverage
- Forms: Proper spacing without overflow

### Professional Logo Treatment
- Simple, clean presentation
- No unnecessary animations or effects
- Appropriate sizing for context
- Consistent brand representation

### Full-Page Layouts
- Avoid small centered boxes
- Use available space effectively
- Create visual hierarchy through layout
- Maintain professional appearance

## Animation Principles

### Timing Functions
- **Standard**: cubic-bezier(0.4, 0, 0.2, 1)
- **Decelerate**: cubic-bezier(0, 0, 0.2, 1)
- **Accelerate**: cubic-bezier(0.4, 0, 1, 1)

### Duration Guidelines
- **Micro-interactions**: 150-200ms
- **Component transitions**: 300-400ms
- **Page transitions**: 500-600ms
- **Loading states**: 800ms+

### Motion Principles
- **Subtle**: Minimal movement, professional feel
- **Purposeful**: Animations guide user attention
- **Respectful**: Honor `prefers-reduced-motion`
- **Consistent**: Same timing across similar interactions

## Accessibility

### Contrast Ratios
- **Normal text**: 4.5:1 minimum
- **Large text**: 3:1 minimum
- **UI components**: 3:1 minimum

### Motion Sensitivity
- Respect `prefers-reduced-motion`
- Provide static alternatives
- Reduce animation intensity

### Focus Management
- Clear focus indicators
- Logical tab order
- Skip links where appropriate

## Implementation Guidelines

### Glass Morphism Effect
```css
background: rgba(255, 255, 255, 0.02);
backdrop-filter: blur(20px);
border: 1px solid rgba(255, 255, 255, 0.1);
```

### Professional Gradients
```css
background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
```

### Elevated Surfaces
```css
box-shadow: 
  0 8px 32px rgba(0, 0, 0, 0.3),
  inset 0 1px 0 rgba(255, 255, 255, 0.1);
```

### Responsive Breakpoints
- **Mobile**: 480px and below
- **Tablet**: 768px and below
- **Desktop**: 1024px and above

This design system ensures a consistent, professional, and accessible user experience across the Kodotakai application.

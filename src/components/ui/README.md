# UI Components Documentation

## Logo Component

The `Logo` component displays the professional Qimma AI logo with embedded text or as an icon-only version.

### Usage

```tsx
import { Logo } from '@/components/ui/logo';

// Basic usage (full logo with text)
<Logo />

// Large logo with text
<Logo size="lg" />

// Icon only (Q symbol)
<Logo iconOnly />

// Custom styling
<Logo className="my-custom-class" size="md" />
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Logo size |
| `iconOnly` | `boolean` | `false` | Whether to show only the Q icon |

### Size Mapping

**Full Logo (with text)**:
- `sm`: 80px width
- `md`: 100px width  
- `lg`: 120px width
- `xl`: 160px width

**Icon Only**:
- `sm`: 32px icon
- `md`: 40px icon
- `lg`: 48px icon
- `xl`: 64px icon

### Files

- **Full Logo**: `/public/qimma-logo.svg` - Complete logo with "Qimma" text
- **Icon Only**: `/public/qimma-icon.svg` - Q symbol only
- **Component**: `/src/components/ui/logo.tsx` - React component

### Colors

The logo uses the professional color palette:
- Primary: `#42865b` (Green)
- Secondary: `#3a4441` (Charcoal)

### Examples in the App

- **Homepage header**: Small full logo (`size="sm"`)
- **Dashboard sidebar expanded**: Small full logo (`size="sm"`)
- **Dashboard sidebar collapsed**: Icon only (`size="sm" iconOnly`) 
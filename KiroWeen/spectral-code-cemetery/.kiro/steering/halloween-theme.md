# Halloween Theme - Design System

## Overview
This document defines the complete design system for SPECTRAL. ALL UI components must strictly follow these guidelines to maintain consistency and the spooky Halloween theme throughout the application.

---

## Color Palette

### Primary Colors
```css
--color-primary-900: #0a0015;      /* Deep void black */
--color-primary-800: #1a0033;      /* Deep purple-black */
--color-primary-700: #2d0052;      /* Dark purple */
--color-primary-600: #4a0080;      /* Royal purple */
--color-primary-500: #7000ff;      /* Electric purple */
--color-primary-400: #9333ff;      /* Bright purple */
```

### Secondary Colors
```css
--color-secondary-900: #001a0d;    /* Deep forest */
--color-secondary-500: #00ff88;    /* Ghostly green */
--color-secondary-300: #66ffbb;    /* Light ghost green */
```

### Accent Colors
```css
--color-accent-blood: #ff0066;     /* Blood red */
--color-accent-bone: #e0e0ff;      /* Pale bone */
--color-accent-gold: #ffd700;      /* Haunted gold */
--color-accent-orange: #ff6600;    /* Pumpkin orange */
```

### Semantic Colors
```css
--color-healthy: #00ff88;          /* Active code */
--color-stale: #ffaa00;            /* Aging code */
--color-dead: #ff0066;             /* Dead code */
--color-ghost: rgba(255, 255, 255, 0.3); /* Ghost overlay */
```

### Background Colors
```css
--bg-primary: #0a0015;
--bg-secondary: #1a0033;
--bg-card: rgba(42, 0, 82, 0.6);
--bg-modal: rgba(10, 0, 21, 0.95);
--bg-fog: rgba(120, 0, 255, 0.05);
```

---

## Typography

### Font Families
```css
--font-header: 'Creepster', cursive;        /* Google Fonts - Spooky headers */
--font-body: 'Roboto', sans-serif;          /* Google Fonts - Body text */
--font-code: 'Roboto Mono', monospace;      /* Google Fonts - Code/technical */
--font-epitaph: 'Nosifer', cursive;         /* Google Fonts - Tombstone text */
--font-handwriting: 'Shadows Into Light', cursive; /* Google Fonts - Notes */
```

**Current Implementation:**
- Headers: `font-spooky` (Creepster)
- Body: `font-mono` (Fira Code)

### Font Sizes
```css
--text-xs: 0.75rem;     /* 12px */
--text-sm: 0.875rem;    /* 14px */
--text-base: 1rem;      /* 16px */
--text-lg: 1.125rem;    /* 18px */
--text-xl: 1.25rem;     /* 20px */
--text-2xl: 1.5rem;     /* 24px */
--text-3xl: 1.875rem;   /* 30px */
--text-4xl: 2.25rem;    /* 36px */
--text-5xl: 3rem;       /* 48px */
```

### Font Weights
```css
--font-thin: 100;
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
--font-black: 900;
```

---

## Spacing System
```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
```

---

## Border Radius
```css
--radius-sm: 0.25rem;   /* 4px */
--radius-md: 0.5rem;    /* 8px */
--radius-lg: 0.75rem;   /* 12px */
--radius-xl: 1rem;      /* 16px */
--radius-2xl: 1.5rem;   /* 24px */
--radius-full: 9999px;  /* Fully rounded */
```

---

## Shadows
```css
--shadow-sm: 0 1px 2px rgba(112, 0, 255, 0.3);
--shadow-md: 0 4px 6px rgba(112, 0, 255, 0.4);
--shadow-lg: 0 10px 15px rgba(112, 0, 255, 0.5);
--shadow-xl: 0 20px 25px rgba(112, 0, 255, 0.6);
--shadow-glow: 0 0 20px rgba(112, 0, 255, 0.8);
--shadow-blood: 0 0 30px rgba(255, 0, 102, 0.6);
--shadow-ghost: 0 0 40px rgba(0, 255, 136, 0.5);
```

---

## Animation System

### Timing Functions
```css
--ease-standard: cubic-bezier(0.4, 0.0, 0.2, 1);
--ease-decelerate: cubic-bezier(0.0, 0.0, 0.2, 1);
--ease-accelerate: cubic-bezier(0.4, 0.0, 1, 1);
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
--ease-spooky: cubic-bezier(0.6, -0.28, 0.735, 0.045);
```

### Duration
```css
--duration-fast: 150ms;
--duration-normal: 300ms;
--duration-slow: 500ms;
--duration-slower: 800ms;
--duration-slowest: 1200ms;
```

### Keyframe Animations

#### Float Animation (for ghosts)
```css
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}
```

**Framer Motion Implementation:**
```javascript
animate={{ 
  y: [0, -20, 0],
  transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' }
}}
```

#### Pulse Glow
```css
@keyframes pulseGlow {
  0%, 100% { box-shadow: 0 0 10px var(--color-primary-500); }
  50% { box-shadow: 0 0 30px var(--color-primary-400); }
}
```

**Framer Motion Implementation:**
```javascript
animate={{ 
  scale: [1, 1.1, 1],
  opacity: [0.8, 1, 0.8],
  transition: { duration: 3, repeat: Infinity }
}}
```

#### Fade In Ghost
```css
@keyframes fadeInGhost {
  from { 
    opacity: 0; 
    transform: scale(0.8) translateY(20px); 
  }
  to { 
    opacity: 0.6; 
    transform: scale(1) translateY(0); 
  }
}
```

#### Flicker
```css
@keyframes flicker {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
  75% { opacity: 0.9; }
}
```

#### Blood Drip
```css
@keyframes bloodDrip {
  0% { transform: translateY(-10px); opacity: 0; }
  50% { opacity: 1; }
  100% { transform: translateY(100vh); opacity: 0; }
}
```

---

## Component Patterns

### Tombstone Component Style
```css
.tombstone {
  background: linear-gradient(135deg, #2d2d40 0%, #1a1a2e 100%);
  border: 2px solid var(--color-accent-bone);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  transition: all var(--duration-normal) var(--ease-standard);
}

.tombstone:hover {
  transform: translateY(-8px) scale(1.05);
  box-shadow: var(--shadow-glow);
  border-color: var(--color-primary-400);
}
```

**TailwindCSS Implementation:**
```javascript
className="bg-gradient-to-b from-gray-700 to-gray-900 
  border-4 border-tombstone-gray rounded-t-full rounded-b-lg 
  shadow-lg hover:shadow-xl transition-all duration-300 
  hover:scale-105 hover:-translate-y-2"
```

### Ghost Button Style
```css
.ghost-button {
  background: var(--bg-card);
  color: var(--color-accent-bone);
  border: 1px solid var(--color-secondary-500);
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-md);
  font-family: var(--font-body);
  font-weight: var(--font-semibold);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all var(--duration-normal) var(--ease-standard);
}

.ghost-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(0, 255, 136, 0.3), transparent);
  transition: left var(--duration-slow) var(--ease-standard);
}

.ghost-button:hover::before {
  left: 100%;
}

.ghost-button:hover {
  border-color: var(--color-secondary-500);
  box-shadow: var(--shadow-ghost);
  transform: translateY(-2px);
}
```

### Modal/Card Style
```css
.spooky-card {
  background: var(--bg-card);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(112, 0, 255, 0.3);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  box-shadow: var(--shadow-xl);
}
```

**TailwindCSS Implementation:**
```javascript
className="bg-purple-900/30 backdrop-blur-sm rounded-lg p-8 
  border-2 border-cemetery-purple shadow-2xl"
```

### Input Field Style
```css
.haunted-input {
  background: rgba(10, 0, 21, 0.8);
  border: 1px solid var(--color-primary-600);
  color: var(--color-accent-bone);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-md);
  font-family: var(--font-code);
  transition: all var(--duration-normal) var(--ease-standard);
}

.haunted-input:focus {
  outline: none;
  border-color: var(--color-primary-400);
  box-shadow: 0 0 0 3px rgba(112, 0, 255, 0.3);
}

.haunted-input::placeholder {
  color: rgba(224, 224, 255, 0.5);
  font-style: italic;
}
```

**TailwindCSS Implementation:**
```javascript
className="w-full px-4 py-4 bg-cemetery-dark border-2 border-cemetery-purple 
  rounded-lg text-ghost-white placeholder-gray-500 
  focus:outline-none focus:border-cemetery-green 
  transition-colors font-mono"
```

---

## Icon Usage

**Library:** lucide-react

**Icon Mapping:**
- `Ghost` - Deleted code, contributors, spirits
- `Skull` - Dead code, tombstones, warnings
- `Sparkles` - AI features, magic, enhancements
- `Clock` - Time travel, history, timeline
- `Code` - File references, code blocks
- `Zap` - Resurrection feature, power actions
- `Moon` - Night theme, header decoration
- `Cloud` - Fog effects, atmosphere
- `GitBranch` - Repository, Git operations
- `Users` - Contributors, team
- `Activity` - Churn rate, activity metrics
- `Calendar` - Dates, timestamps
- `FileCode` - File types, code files
- `Loader2` - Loading states (with spin)
- `CheckCircle` - Success states
- `XCircle` - Error states
- `ArrowLeft` - Navigation back

---

## Sound Effects

### Audio Files Location
`frontend/public/assets/sounds/`

### Sound Mapping
- **Hover tombstone:** `whoosh.mp3` (150ms, subtle)
- **Click:** `ethereal-ding.mp3` (300ms)
- **Error:** `bell-toll.mp3` (800ms, ominous)
- **Success:** `magic-spell.mp3` (500ms, triumphant)
- **Background:** `wind-ambience.mp3` (looped, 10% volume)

### Implementation
```javascript
const playSound = (soundName) => {
  const audio = new Audio(`/assets/sounds/${soundName}.mp3`)
  audio.volume = 0.3
  audio.play().catch(err => console.log('Audio play failed:', err))
}
```

---

## Component Naming Convention

**ALL components must follow this naming pattern:**

### Buttons
- `GhostButton` - Primary action buttons
- `SpellButton` - AI/magic action buttons
- `TombButton` - Tombstone-related actions
- `SpectralButton` - Generic themed button

### Cards
- `SpectralCard` - Generic card container
- `TombstoneCard` - File display cards
- `EpitaphCard` - Epitaph display
- `GraveyardCard` - Cemetery section cards

### Modals
- `HauntedModal` - Generic modal
- `CryptModal` - Detail/info modals
- `SpellModal` - AI feature modals
- `FileDetailModal` - File information (current)

### Inputs
- `HauntedInput` - Text inputs
- `SpookyTextarea` - Multi-line inputs
- `GhostSelect` - Dropdown selects
- `CursedCheckbox` - Checkboxes

### Containers
- `GraveyardContainer` - Main layout wrapper
- `CemeteryLayout` - Cemetery grid layout
- `TombstoneGrid` - Tombstone arrangement
- `GhostLayer` - Floating ghost container

### Animations
- `FloatAnimation` - Floating effect
- `FadeGhost` - Ghost fade in/out
- `PulseGlow` - Pulsing glow effect
- `RiseFromGround` - Tombstone entry

---

## Accessibility Requirements

### Focus States
- All interactive elements must have visible focus states
- Focus ring: `ring-2 ring-cemetery-purple ring-offset-2 ring-offset-cemetery-dark`
- Purple glow on focus: `focus:shadow-[0_0_0_3px_rgba(112,0,255,0.3)]`

### Color Contrast
- Minimum contrast ratio: **4.5:1** for normal text
- Minimum contrast ratio: **3:1** for large text (18px+)
- Test all color combinations

### Motion Preferences
```javascript
// Respect prefers-reduced-motion
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Conditional animation
animate={prefersReducedMotion ? {} : { y: [0, -20, 0] }}
```

### ARIA Labels
```javascript
// Icon-only buttons
<button aria-label="Close modal">
  <X className="w-6 h-6" />
</button>

// Status announcements
<div role="status" aria-live="polite">
  Analysis complete!
</div>
```

### Keyboard Navigation
- All interactive elements must be keyboard accessible
- Tab order must be logical
- Escape key closes modals
- Enter/Space activates buttons

### Screen Reader Support
- Meaningful alt text for images
- ARIA labels for dynamic content
- Status announcements for async operations
- Semantic HTML elements

---

## Responsive Breakpoints

```css
--breakpoint-sm: 640px;   /* Mobile */
--breakpoint-md: 768px;   /* Tablet */
--breakpoint-lg: 1024px;  /* Desktop */
--breakpoint-xl: 1280px;  /* Large Desktop */
--breakpoint-2xl: 1536px; /* Extra Large */
```

**TailwindCSS Usage:**
```javascript
className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6"
```

---

## Z-Index Scale

```css
--z-base: 0;
--z-dropdown: 1000;
--z-sticky: 1020;
--z-fixed: 1030;
--z-modal-backdrop: 1040;
--z-modal: 1050;
--z-popover: 1060;
--z-tooltip: 1070;
```

**Usage:**
- Base content: `z-0`
- Floating ghosts: `z-10`
- Sticky header: `z-20`
- Modals: `z-50`
- Tooltips: `z-[1070]`

---

## Vocabulary Guidelines

### Use These Terms:
- "Summon" instead of "load"
- "Haunted" instead of "problematic"
- "Ghost" instead of "inactive user"
- "Tombstone" instead of "file card"
- "Cemetery" instead of "grid"
- "Epitaph" instead of "description"
- "Spirits" instead of "contributors"
- "Cursed" instead of "broken"
- "Resurrection" instead of "restore"
- "Spell" instead of "action"

### Avoid These Terms:
- "Delete" (use "Banish")
- "Error" (use "The spirits are restless")
- "Loading" (use "Summoning")
- "Empty" (use "Abandoned")
- "Success" (use "Spell cast successfully")

---

## Performance Guidelines

### Animation Performance
- Use `transform` and `opacity` for animations (GPU accelerated)
- Avoid animating `width`, `height`, `top`, `left`
- Use `will-change` sparingly
- Target 60 FPS for all animations

### Image Optimization
- Use WebP format with fallbacks
- Lazy load images below the fold
- Provide width/height to prevent layout shift

### Code Splitting
- Lazy load heavy components (Cemetery, Modals)
- Use React.lazy() and Suspense
- Split by route when applicable

---

## IMPORTANT RULES

1. **Every component** must follow this design system
2. **No deviations** unless explicitly requested
3. **Maintain consistency** across all UI elements
4. **Test accessibility** for every new component
5. **Use semantic HTML** whenever possible
6. **Follow naming conventions** strictly
7. **Respect motion preferences** in all animations
8. **Maintain color contrast** ratios
9. **Document any new patterns** added to this system
10. **Keep the Halloween theme** in all user-facing text

---

## Quick Reference

### Most Common Classes
```javascript
// Card
"bg-purple-900/30 backdrop-blur-sm rounded-lg p-8 border-2 border-cemetery-purple shadow-2xl"

// Button
"bg-cemetery-purple hover:bg-purple-700 text-white font-bold py-4 px-6 rounded-lg transition-all transform hover:scale-105"

// Input
"w-full px-4 py-4 bg-cemetery-dark border-2 border-cemetery-purple rounded-lg text-ghost-white focus:outline-none focus:border-cemetery-green"

// Tombstone
"bg-gradient-to-b from-gray-700 to-gray-900 border-4 rounded-t-full rounded-b-lg shadow-lg hover:shadow-xl transition-all"

// Ghost
"bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-full border-2 border-blue-300/50 shadow-lg shadow-blue-500/50"
```

---

This design system ensures SPECTRAL maintains a consistent, accessible, and spooky Halloween theme throughout the entire application. 🎃👻

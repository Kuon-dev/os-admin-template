# Developer Guide - Using the New Design System

Quick reference for implementing the redesigned minimalistic UI across the application.

## 🚀 Quick Start

### 1. Import Animation Utilities
```typescript
import {
  buttonBase,
  spring,
  slideUp,
  notFoundHeading
} from "@/lib/animations";

import {
  spacing,
  componentSpacing,
  spacingPatterns
} from "@/lib/spacing-system";
```

### 2. Use Enhanced Components
```tsx
import { ButtonAnimated } from "@/components/ui/button-animated";
import { InputAnimated } from "@/components/ui/input-animated";
import { SearchAnimated } from "@/components/ui/search-animated";
import { AnimatedTableRow } from "@/components/ui/table-row-animated";
```

---

## 📦 Component Usage Examples

### ButtonAnimated
```tsx
// Basic usage
<ButtonAnimated variant="default" size="lg">
  Click Me
</ButtonAnimated>

// Icon button (automatically uses smaller scale animation)
<ButtonAnimated variant="ghost" size="icon-lg" isIcon>
  <Icon className="w-6 h-6" />
</ButtonAnimated>

// Disabled state (no animation)
<ButtonAnimated disabled>
  Disabled Button
</ButtonAnimated>
```

**Props**:
- `isIcon`: Set to true for icon buttons (uses smaller scale animation)
- `variant`: "default", "outline", "secondary", "ghost", "destructive", "link"
- `size`: "default", "sm", "lg", "icon", "icon-sm", "icon-lg"

---

### InputAnimated
```tsx
// Basic usage
<InputAnimated
  placeholder="Enter text..."
  onChange={(e) => setValue(e.target.value)}
/>

// With error state
<InputAnimated
  placeholder="Email"
  error={!isValidEmail}
  onChange={(e) => setEmail(e.target.value)}
/>
```

**Props**:
- `error`: Shows error state and animated error indicator
- All standard input props supported

---

### SearchAnimated
```tsx
// Basic search with result count feedback
<SearchAnimated
  placeholder="Search products..."
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  onClear={() => setSearchQuery("")}
  resultCount={results.length}
  showKeyboardHint={true}
/>

// With loading state
<SearchAnimated
  placeholder="Searching..."
  isLoading={true}
/>
```

**Props**:
- `resultCount`: Shows the number of results found
- `showKeyboardHint`: Display "⌘K" keyboard shortcut hint
- `isLoading`: Show loading spinner
- `onClear`: Callback when clear button is clicked

---

### AnimatedTableRow
```tsx
// In table body mapping
<TableBody>
  {rows.map((row, index) => (
    <AnimatedTableRow
      key={row.id}
      isSelected={selectedIds.includes(row.id)}
      isHoverable={true}
      index={index}
    >
      {/* Table cells */}
    </AnimatedTableRow>
  ))}
</TableBody>
```

**Props**:
- `isSelected`: Highlight with primary color background
- `isHoverable`: Enable hover state animations
- `index`: For staggered entrance animation (auto-calculates delay)

---

## 🎨 Animation Patterns

### Page Entrance Animations
```tsx
import { slideUp, spring } from "@/lib/animations";
import { motion } from "motion/react";

// Staggered content entrance
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ ...spring.snappy, delay: 0.1 }}
>
  Content
</motion.div>

// Using preset variants
<motion.div
  initial={slideUp.initial}
  animate={slideUp.animate}
  exit={slideUp.exit}
  transition={{ ...spring.snappy }}
>
  Content
</motion.div>
```

### Button Press Feedback
```tsx
import { motion } from "motion/react";
import { buttonBase, spring } from "@/lib/animations";

<motion.button
  initial="rest"
  whileHover="hover"
  whileTap="tap"
  variants={buttonBase}
  transition={spring.snappy}
>
  Press Me
</motion.button>
```

### Modal/Dialog Animation
```tsx
import { modal, spring } from "@/lib/animations";

<motion.div
  {...modal}
  transition={spring.snappy}
>
  Modal content
</motion.div>
```

### Loading State Animation
```tsx
<motion.div
  animate={{ rotate: 360 }}
  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
  className="w-4 h-4 border-2 border-primary/20 border-t-primary rounded-full"
/>
```

### Staggered List Animation
```tsx
import { staggerContainer, staggerItem } from "@/lib/animations";
import { motion } from "motion/react";

<motion.ul
  variants={staggerContainer}
  initial="initial"
  animate="animate"
>
  {items.map((item, index) => (
    <motion.li key={item.id} variants={staggerItem}>
      {item.name}
    </motion.li>
  ))}
</motion.ul>
```

---

## 📐 Spacing Guidelines

### Page Layout
```tsx
<div className="p-10 space-y-8">  {/* page-margin + section-gap */}
  <header className="pb-6 border-b">
    <h1 className="text-4xl font-bold">Page Title</h1>
    <p className="mt-2 text-muted-foreground">Subtitle</p>
  </header>

  <section className="space-y-4">
    <h2 className="text-2xl font-semibold">Section</h2>
    <p>Content</p>
  </section>
</div>
```

### Component Grouping
```tsx
// Group related elements with consistent spacing
<div className="space-y-2">  {/* 8px gap - tight grouping */}
  <label>Label</label>
  <input placeholder="Field" />
</div>

<div className="gap-3 flex">  {/* 12px gap - form actions */}
  <button>Cancel</button>
  <button>Submit</button>
</div>
```

### Card Layout
```tsx
<div className="p-4 rounded-lg border gap-2 flex flex-col">  {/* Standard card */}
  <h3 className="font-semibold">Card Title</h3>
  <p className="text-sm text-muted-foreground">Content</p>
</div>
```

### Table Cells
```tsx
<TableCell className="px-4 py-3">  {/* 12px 16px padding */}
  Content
</TableCell>
```

---

## ⌨️ Keyboard Shortcuts & Hints

### Display Keyboard Hints
```tsx
{/* Show keyboard shortcut hint */}
<kbd className="px-2 py-1 rounded border border-border bg-muted text-foreground text-xs font-mono">
  ⌘K
</kbd>

{/* For Windows users, use Ctrl */}
<kbd>
  {navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}K
</kbd>
```

### Implement Keyboard Shortcuts
```tsx
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    // ⌘/Ctrl + K - Focus search
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      searchInputRef.current?.focus();
    }

    // ⌘/Ctrl + N - New item
    if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
      e.preventDefault();
      openCreateDialog();
    }

    // Escape - Close dialog
    if (e.key === 'Escape') {
      closeDialog();
    }
  };

  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, []);
```

---

## 🎯 Common Implementation Patterns

### Page with Header + Search + Table
```tsx
"use client";

import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { ButtonAnimated } from "@/components/ui/button-animated";
import { SearchAnimated } from "@/components/ui/search-animated";
import { AnimatedTableRow } from "@/components/ui/table-row-animated";
import { slideUp, spring } from "@/lib/animations";

export default function DataPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState([...]);

  const filteredData = useMemo(() => {
    return data.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [data, searchQuery]);

  return (
    <div className="space-y-8 p-10 max-w-5xl mx-auto">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="pb-6 border-b"
      >
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold">Data Management</h1>
            <p className="text-muted-foreground mt-2">Manage your data here</p>
          </div>
          <ButtonAnimated variant="default" size="lg">
            + New Item
          </ButtonAnimated>
        </div>
      </motion.header>

      {/* Search */}
      <motion.div
        initial={slideUp.initial}
        animate={slideUp.animate}
        transition={{ ...spring.snappy, delay: 0.1 }}
      >
        <SearchAnimated
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onClear={() => setSearchQuery("")}
          resultCount={filteredData.length}
        />
      </motion.div>

      {/* Table */}
      <motion.div
        initial={slideUp.initial}
        animate={slideUp.animate}
        transition={{ ...spring.snappy, delay: 0.2 }}
      >
        <table className="w-full border rounded-lg overflow-hidden">
          <thead>
            <tr className="border-b bg-muted/30">
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <AnimatedTableRow key={item.id} index={index}>
                <td className="px-4 py-3">{item.name}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 rounded-full bg-primary/10 text-sm">
                    {item.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <ButtonAnimated variant="ghost" size="sm">
                    Edit
                  </ButtonAnimated>
                </td>
              </AnimatedTableRow>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}
```

---

## ✅ Checklist: Implementing Components

When updating a page to use the new design system:

- [ ] Replace buttons with `ButtonAnimated`
- [ ] Replace inputs with `InputAnimated` or `SearchAnimated`
- [ ] Replace table rows with `AnimatedTableRow`
- [ ] Add page entrance animations using `motion` + spring presets
- [ ] Use consistent spacing (`p-10`, `space-y-8`, etc.)
- [ ] Add keyboard shortcuts where appropriate
- [ ] Display keyboard hints (`<kbd>` elements)
- [ ] Test animations in different browsers
- [ ] Test keyboard navigation
- [ ] Test with screen readers
- [ ] Check responsive design on mobile

---

## 🧪 Testing

### Visual Testing
```bash
# Start development server
npm run dev

# Check animations smoothness in Chrome DevTools:
# 1. Open DevTools
# 2. Go to Rendering tab
# 3. Enable "Paint flashing" to see repaints
# 4. Check FPS meter
```

### Keyboard Navigation Testing
- Tab through all interactive elements
- Verify focus visible (should show ring)
- Test Enter/Space on buttons
- Test Escape to close dialogs
- Test custom keyboard shortcuts

### Accessibility Testing
```bash
# Test with axe DevTools
# Test with screen reader (VoiceOver on Mac)
# Verify color contrast (WebAIM checker)
```

---

## 📊 Performance Tips

1. **Memoize animated components**
   ```tsx
   const MyComponent = React.memo(({ data }) => (...));
   ```

2. **Use `layout="position"` for list animations**
   ```tsx
   <motion.div layout="position">
     Content
   </motion.div>
   ```

3. **Lazy load off-screen content**
   ```tsx
   import { AnimationOnScroll } from "@/components/animation-on-scroll";
   ```

4. **Reduce animation complexity for low-end devices**
   ```tsx
   const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
   ```

---

## 🐛 Troubleshooting

### Animation not playing
- Check if `motion` is imported from `"motion/react"`
- Verify animation variants are correctly formatted
- Check for conflicting CSS transitions

### Spring animation feels off
- Adjust `stiffness` (higher = faster)
- Adjust `damping` (higher = less bouncy)
- Use `spring.snappy` for most interactions

### Spacing looks inconsistent
- Reference `spacing-system.ts` for correct values
- Use Tailwind classes (p-4, gap-2, etc.)
- Use `space-y-` and `space-x-` for grouped elements

### Keyboard shortcuts not working
- Ensure event listener is properly attached
- Check for conflicting shortcuts
- Test both Mac (⌘) and Windows (Ctrl)

---

## 📚 Additional Resources

- **Design System**: `DESIGN_SYSTEM.md`
- **Animations**: `lib/animations.ts`
- **Spacing**: `lib/spacing-system.ts`
- **Components**: `components/ui/`
- **404 Example**: `app/not-found.tsx`
- **Motion Docs**: https://motion.dev

---

**Last Updated**: October 30, 2025

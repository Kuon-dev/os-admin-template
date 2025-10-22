# French Bakery Landing Page Redesign Plan

**Project:** Bakery Web Application
**Objective:** Transform the bland Next.js template into an elegant, user-friendly French bakery experience
**Design Principles:** French aesthetic, MacOS-like spacing, 4-point grid system, performant animations

---

## STEP 1: User Interaction & Flow Analysis

### Primary User Goals

1. **Browse** - Discover fresh, daily baked goods
2. **Select** - View product details (name, price, description, allergens)
3. **Order** - Add to cart and checkout
4. **Locate** - Find store hours, location, contact
5. **Explore** - Learn about bakery story, specialties

### User Journey Map

```
Landing → Browse Categories → Product Details → Add to Cart → Checkout
       ↘ Daily Specials → Quick Order
       ↘ About/Story → Contact/Location
```

### Key Interactions

- **Hover**: Product cards lift with shadow, reveal "Quick View" button
- **Click**: Product opens in modal/drawer with details
- **Scroll**: Parallax hero, sticky navigation appears
- **Add to Cart**: Spring animation on cart badge, toast notification
- **Filter**: Smooth category transitions with fade
- **Mobile**: Swipe gestures for product carousel

---

## STEP 2: Component Requirements & Changes

### New Components to Create

#### 1. ProductCard
Enhanced card component with:
- Image with aspect ratio control
- Overlay gradient on hover
- Quick add button with icon
- Price badge
- "New" or "Special" tag
- Tooltips for dietary info

#### 2. Hero
French bakery hero section with:
- Full-width image with parallax
- Centered CTA buttons
- Animated headline (staggered text)
- Daily special banner overlay

#### 3. FloatingCart
Sticky cart button with:
- Badge with item count (spring animation)
- Click opens drawer
- Subtle pulse when items added

#### 4. CategoryFilter
Tab-based navigation with:
- Smooth underline indicator
- Icons + labels
- Responsive (horizontal scroll on mobile)

#### 5. ProductModal
Detailed view drawer with:
- Large image gallery
- Description, ingredients, allergens
- Quantity selector
- Add to cart action
- Close with backdrop click or ESC

#### 6. DailySpecial
Time-sensitive banner with:
- Countdown timer
- Animated entrance
- Dismissible

#### 7. StorySection
About section with:
- Split layout (image + text)
- Parallax scroll effects
- Quote/testimonial

#### 8. LocationCard
Store info with:
- Map embed or link
- Hours with "Open Now" indicator
- Contact buttons (call, directions)

### Existing Components to Enhance

- **Button**: Add loading states, icon variants
- **Card**: Add hover effects, image overlays
- **Badge**: Add animation variants
- **Separator**: Style for French aesthetic
- **Drawer**: Customize for cart and product details
- **Tooltip**: Add for dietary icons

---

## STEP 3: Design System Implementation

### A. Color Palette (French Bakery Inspired)

```css
/* Light Mode - Warm French Bakery */
--color-cream: oklch(0.97 0.01 85);        /* Soft cream background */
--color-warmBeige: oklch(0.92 0.02 80);    /* Warm beige */
--color-flour: oklch(0.95 0.01 90);        /* Flour white */
--color-croissant: oklch(0.75 0.08 70);    /* Golden croissant */
--color-espresso: oklch(0.25 0.02 50);     /* Dark brown */
--color-butter: oklch(0.85 0.06 85);       /* Butter yellow */
--color-raspberry: oklch(0.65 0.15 15);    /* Accent - raspberry */
--color-sage: oklch(0.70 0.05 140);        /* Subtle green */

/* Typography */
--font-display: 'Playfair Display', serif;  /* Elegant headings */
--font-body: 'Inter', sans-serif;           /* Clean body text */
```

### B. Spacing System (4-point Grid)

```css
/* MacOS-inspired spacing */
--space-1: 4px;   /* Tight spacing */
--space-2: 8px;   /* Small gaps */
--space-3: 12px;  /* Compact */
--space-4: 16px;  /* Default */
--space-5: 20px;  /* Comfortable */
--space-6: 24px;  /* Spacious */
--space-8: 32px;  /* Large */
--space-10: 40px; /* Extra large */
--space-12: 48px; /* Section gaps */
--space-16: 64px; /* Major sections */
--space-20: 80px; /* Hero padding */
```

### C. Typography Scale

```css
/* Type system */
--text-xs: 0.75rem;    /* 12px - Labels */
--text-sm: 0.875rem;   /* 14px - Body small */
--text-base: 1rem;     /* 16px - Body */
--text-lg: 1.125rem;   /* 18px - Lead */
--text-xl: 1.25rem;    /* 20px - H4 */
--text-2xl: 1.5rem;    /* 24px - H3 */
--text-3xl: 2rem;      /* 32px - H2 */
--text-4xl: 2.5rem;    /* 40px - H1 */
--text-5xl: 3rem;      /* 48px - Display */
```

### D. Animation Principles (Motion.dev / Framer Motion)

#### Configuration

```javascript
// Easing presets
const ease = {
  smooth: [0.25, 0.1, 0.25, 1],      // Smooth transitions
  bounce: [0.34, 1.56, 0.64, 1],     // Playful bounce
  entrance: [0, 0.55, 0.45, 1],      // Content entrance
  exit: [0.55, 0, 1, 0.45],          // Content exit
};

// Spring configs
const spring = {
  gentle: { stiffness: 120, damping: 14 },  // Subtle
  bouncy: { stiffness: 300, damping: 20 },  // Energetic
  snappy: { stiffness: 400, damping: 30 },  // Quick
};
```

#### Animation Usage

1. **Page Load**: Staggered fade-in (100ms delay between items)
2. **Product Cards**:
   - Hover: Scale 1.02, lift shadow, 200ms ease
   - Click: Scale 0.98 → 1, spring feedback
3. **Cart Badge**: Spring animation on count change
4. **Category Filter**: Sliding underline with smooth ease
5. **Modal/Drawer**: Slide + fade entrance/exit
6. **Scroll**: Parallax on hero (transform: translateY)
7. **Loading**: Skeleton shimmer + fade-in when ready
8. **Buttons**: Press scale (0.95), color shift on hover

---

## STEP 4: Layout Structure

### Landing Page Sections

```
┌─────────────────────────────────────┐
│ Navigation (sticky after scroll)     │
├─────────────────────────────────────┤
│                                      │
│      Hero Section (parallax)         │
│   [Large image of fresh croissants]  │
│        "Freshly Baked Daily"         │
│      [Order Now] [View Menu]         │
│                                      │
├─────────────────────────────────────┤
│ Daily Special Banner (dismissible)   │
├─────────────────────────────────────┤
│ Category Filter (Breads, Pastries..) │
├─────────────────────────────────────┤
│                                      │
│    Featured Products Grid            │
│   [Card] [Card] [Card] [Card]        │
│   [Card] [Card] [Card] [Card]        │
│                                      │
├─────────────────────────────────────┤
│ Story Section (split layout)         │
│  [Image]  │  "Our artisan bakers..." │
├─────────────────────────────────────┤
│ Location & Hours                     │
├─────────────────────────────────────┤
│ Footer (contact, social, hours)      │
└─────────────────────────────────────┘

[Floating Cart Button] (bottom-right)
```

### Responsive Breakpoints

```css
/* Mobile First */
sm: 640px   /* Small tablets */
md: 768px   /* Tablets */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
2xl: 1536px /* Extra large */

/* Grid Columns */
mobile: 1 column
tablet: 2 columns
desktop: 3-4 columns
```

---

## STEP 5: Detailed Implementation Tasks

### Phase 1: Foundation (Design System)

- [ ] Install Framer Motion: `npm install framer-motion`
- [ ] Install Google Fonts: Add Playfair Display + Inter to layout
- [ ] Update `app/globals.css` with French bakery color palette
- [ ] Create spacing utilities in Tailwind config
- [ ] Create `lib/animations.ts` with animation constants
- [ ] Create `lib/constants.ts` for categories and mock products

### Phase 2: Core Components

- [ ] Create `components/landing/ProductCard.tsx` with hover effects
- [ ] Create `components/landing/Hero.tsx` with parallax
- [ ] Create `components/landing/FloatingCart.tsx` with badge animation
- [ ] Create `components/landing/CategoryFilter.tsx` with sliding indicator
- [ ] Create `components/landing/ProductModal.tsx` drawer
- [ ] Create `components/landing/DailySpecial.tsx` banner
- [ ] Create `components/landing/StorySection.tsx`
- [ ] Create `components/landing/LocationCard.tsx`
- [ ] Enhance existing `components/ui/button.tsx` with variants
- [ ] Enhance existing `components/ui/badge.tsx` with animations

### Phase 3: Layout Components

- [ ] Create `components/layout/Navigation.tsx` (with scroll trigger for sticky)
- [ ] Create `components/layout/Footer.tsx`
- [ ] Build Hero section with CTA buttons
- [ ] Build Category Filter integration
- [ ] Build Featured Products Grid (responsive: 1/2/3/4 columns)
- [ ] Build Story/About section
- [ ] Build Location & Hours card

### Phase 4: Main Page Assembly

- [ ] Update `app/page.tsx` with new landing page structure
- [ ] Integrate all landing components
- [ ] Set up product data flow
- [ ] Implement cart state management
- [ ] Connect all interactive elements

### Phase 5: Animations & Interactions

- [ ] Implement page load stagger animation
- [ ] Add product card hover/click animations
- [ ] Add cart badge spring animation
- [ ] Add scroll-triggered parallax
- [ ] Add modal entrance/exit animations
- [ ] Add skeleton loaders
- [ ] Add button micro-interactions
- [ ] Add toast notifications for cart actions

### Phase 6: UX Enhancements

- [ ] Add tooltips to dietary icons
- [ ] Add loading states for all async actions
- [ ] Add empty states (no products, empty cart)
- [ ] Add error boundaries
- [ ] Implement keyboard navigation
- [ ] Add ARIA labels and focus management
- [ ] Add visual feedback for all interactions

### Phase 7: Responsive & Polish

- [ ] Mobile optimization (touch gestures, larger touch targets)
- [ ] Tablet breakpoint adjustments
- [ ] Desktop large screen optimization
- [ ] Performance optimization (image lazy loading, code splitting)
- [ ] Accessibility audit (contrast, screen reader, keyboard)
- [ ] Animation performance (reduce motion preference)
- [ ] Cross-browser testing

### Phase 8: Assets & Content

- [ ] Add bakery product images to `public/images/`
- [ ] Add bakery logo
- [ ] Add hero background images
- [ ] Write product descriptions
- [ ] Write bakery story content
- [ ] Add dietary/allergen icons

---

## STEP 6: File Structure

```
bakery/
├── .claude/
│   └── redesign-plan.md (this file)
├── app/
│   ├── page.tsx (redesigned landing page)
│   ├── layout.tsx (add fonts)
│   └── globals.css (French bakery theme)
├── components/
│   ├── landing/
│   │   ├── Hero.tsx
│   │   ├── ProductCard.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── CategoryFilter.tsx
│   │   ├── DailySpecial.tsx
│   │   ├── StorySection.tsx
│   │   ├── LocationCard.tsx
│   │   └── FloatingCart.tsx
│   ├── layout/
│   │   ├── Navigation.tsx
│   │   └── Footer.tsx
│   └── ui/ (enhanced existing shadcn components)
├── lib/
│   ├── animations.ts (motion configs)
│   ├── constants.ts (categories, products)
│   └── utils.ts (existing)
├── hooks/
│   ├── use-cart.ts (cart state management)
│   └── use-scroll.ts (scroll detection)
├── types/
│   └── product.ts (TypeScript types)
└── public/
    └── images/
        ├── hero/
        ├── products/
        └── icons/
```

---

## Key Design Principles Applied

✅ **4-Point Grid System**: All spacing uses 4px multiples
✅ **MacOS-like Spaciousness**: Generous padding, clear hierarchy
✅ **Minimalist**: Clean, uncluttered, focused on products
✅ **User-Friendly**: Tooltips, feedback, clear CTAs
✅ **Performant Animations**: GPU-accelerated, interruptible
✅ **Accessible**: ARIA labels, keyboard nav, reduced motion
✅ **French Aesthetic**: Warm colors, elegant typography, refined details

---

## Animation Performance Checklist

- [ ] Use `transform` and `opacity` only (GPU-accelerated)
- [ ] Avoid animating `width`, `height`, `top`, `left`
- [ ] Use `will-change` sparingly
- [ ] Respect `prefers-reduced-motion`
- [ ] Keep animations under 300ms for UI feedback
- [ ] Use `layout` animations for position changes
- [ ] Test on low-end devices

---

## Accessibility Checklist

- [ ] Color contrast meets WCAG AA (4.5:1 for text)
- [ ] All interactive elements keyboard accessible
- [ ] Focus indicators visible on all focusable elements
- [ ] ARIA labels on icon buttons
- [ ] Alt text on all images
- [ ] Form inputs have associated labels
- [ ] Modal/drawer traps focus when open
- [ ] Skip links for keyboard users
- [ ] Screen reader tested

---

## Next Steps

1. Review and approve this plan
2. Begin Phase 1: Foundation setup
3. Iterate component by component
4. Test continuously during development
5. Gather feedback and refine

---

**Status:** Planning Complete - Ready for Implementation
**Last Updated:** 2025-10-09

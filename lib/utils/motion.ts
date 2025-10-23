/**
 * Motion Utilities
 *
 * Reusable animation variants and configs for Motion.dev
 * All animations respect prefers-reduced-motion and are interruptable
 */

import { Transition } from 'motion/react';

// Check if user prefers reduced motion
export const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Spring configurations following Motion.dev best practices
export const spring = {
  // Gentle spring for smooth, natural movements
  gentle: {
    type: 'spring' as const,
    stiffness: 120,
    damping: 14,
    mass: 0.5,
  },
  // Bouncy spring for playful interactions
  bouncy: {
    type: 'spring' as const,
    stiffness: 300,
    damping: 20,
    mass: 0.8,
  },
  // Snappy spring for quick responses
  snappy: {
    type: 'spring' as const,
    stiffness: 400,
    damping: 30,
    mass: 0.5,
  },
  // Smooth spring for calm transitions
  smooth: {
    type: 'spring' as const,
    stiffness: 100,
    damping: 20,
    mass: 1,
  },
} as const;

// Easing configurations
export const easing = {
  // Ease out for entrances
  easeOut: [0.0, 0.0, 0.2, 1],
  // Ease in for exits
  easeIn: [0.4, 0.0, 1, 1],
  // Ease in-out for transforms
  easeInOut: [0.4, 0.0, 0.2, 1],
  // Sharp for quick transitions
  sharp: [0.4, 0.0, 0.6, 1],
} as const;

// Duration constants (in seconds)
export const duration = {
  fast: 0.15,
  normal: 0.25,
  slow: 0.35,
  slower: 0.5,
} as const;

/**
 * Fade In Animation
 * Subtle opacity fade for gentle entrances
 */
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: {
    duration: prefersReducedMotion() ? 0 : duration.normal,
    ease: easing.easeOut,
  } as Transition,
};

/**
 * Slide Up Animation
 * Slides content up while fading in
 */
export const slideUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: prefersReducedMotion() ? { duration: 0 } : spring.gentle,
};

/**
 * Slide Down Animation
 * Slides content down while fading in (for dropdowns, tooltips)
 */
export const slideDown = {
  initial: { opacity: 0, y: -10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: prefersReducedMotion() ? { duration: 0 } : spring.snappy,
};

/**
 * Slide Left Animation
 * Slides content from right to left (for page transitions)
 */
export const slideLeft = {
  initial: { opacity: 0, x: 100 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -100 },
  transition: prefersReducedMotion() ? { duration: 0 } : spring.smooth,
};

/**
 * Slide Right Animation
 * Slides content from left to right (for page transitions)
 */
export const slideRight = {
  initial: { opacity: 0, x: -100 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 100 },
  transition: prefersReducedMotion() ? { duration: 0 } : spring.smooth,
};

/**
 * Scale Animation
 * Scales content up while fading in (for modals, dialogs)
 */
export const scale = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  transition: prefersReducedMotion() ? { duration: 0 } : spring.gentle,
};

/**
 * Pop Animation
 * Bouncy scale effect for attention-grabbing elements
 */
export const pop = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 },
  transition: prefersReducedMotion() ? { duration: 0 } : spring.bouncy,
};

/**
 * Shake Animation
 * Horizontal shake for errors or warnings
 */
export const shake = {
  initial: { x: 0 },
  animate: {
    x: [0, -10, 10, -10, 10, -5, 5, 0],
    transition: {
      duration: prefersReducedMotion() ? 0 : 0.5,
      ease: easing.easeInOut,
    },
  },
};

/**
 * Stagger Children Configuration
 * For animating lists with delays between items
 */
export const staggerChildren = (delayMs: number = 50) => ({
  animate: {
    transition: {
      staggerChildren: prefersReducedMotion() ? 0 : delayMs / 1000,
      delayChildren: prefersReducedMotion() ? 0 : 0.05,
    },
  },
});

/**
 * List Item Animation
 * For items in staggered lists
 */
export const listItem = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: prefersReducedMotion() ? { duration: 0 } : spring.gentle,
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: prefersReducedMotion() ? 0 : duration.fast,
      ease: easing.easeIn,
    },
  },
};

/**
 * Hover Lift Animation
 * Subtle lift effect on hover
 */
export const hoverLift = {
  rest: { y: 0, scale: 1 },
  hover: {
    y: -2,
    scale: 1.01,
    transition: {
      duration: prefersReducedMotion() ? 0 : duration.fast,
      ease: easing.easeOut,
    },
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: prefersReducedMotion() ? 0 : 0.1,
      ease: easing.easeInOut,
    },
  },
};

/**
 * Skeleton Shimmer Animation
 * For loading states
 */
export const shimmer = {
  animate: {
    backgroundPosition: prefersReducedMotion() ? '0% 0%' : ['200% 0%', '-200% 0%'],
    transition: {
      duration: prefersReducedMotion() ? 0 : 2,
      ease: 'linear',
      repeat: Infinity,
    },
  },
};

/**
 * Drag Animation
 * For draggable elements
 */
export const drag = {
  whileDrag: {
    scale: 1.05,
    opacity: 0.8,
    zIndex: 1000,
    cursor: 'grabbing',
    transition: prefersReducedMotion() ? { duration: 0 } : spring.snappy,
  },
};

/**
 * Tooltip Animation
 * Quick fade in with slight delay
 */
export const tooltip = {
  initial: { opacity: 0, scale: 0.95 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: prefersReducedMotion() ? 0 : duration.fast,
      delay: prefersReducedMotion() ? 0 : 0.15,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: prefersReducedMotion() ? 0 : 0.1,
    },
  },
};

/**
 * Badge Pulse Animation
 * Subtle pulse for notification badges
 */
export const badgePulse = {
  animate: {
    scale: [1, 1.1, 1],
    transition: {
      duration: prefersReducedMotion() ? 0 : 0.6,
      repeat: 2,
      ease: easing.easeInOut,
    },
  },
};

/**
 * Collapse Animation
 * For accordion-style collapsible content
 */
export const collapse = {
  initial: { height: 0, opacity: 0 },
  animate: {
    height: 'auto',
    opacity: 1,
    transition: prefersReducedMotion() ? { duration: 0 } : spring.smooth,
  },
  exit: {
    height: 0,
    opacity: 0,
    transition: {
      duration: prefersReducedMotion() ? 0 : duration.normal,
      ease: easing.easeIn,
    },
  },
};

/**
 * Card Entrance Animation
 * For shift cards and similar elements
 */
export const cardEntrance = {
  initial: { opacity: 0, y: 20, scale: 0.95 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: prefersReducedMotion() ? { duration: 0 } : spring.gentle,
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.95,
    transition: {
      duration: prefersReducedMotion() ? 0 : duration.normal,
      ease: easing.easeIn,
    },
  },
};

/**
 * Success Animation
 * Bouncy entrance for success messages
 */
export const success = {
  initial: { opacity: 0, scale: 0.5 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: prefersReducedMotion() ? { duration: 0 } : spring.bouncy,
  },
};

/**
 * Layout Shift Animation
 * Smooth layout transitions
 */
export const layoutShift = {
  layout: true,
  transition: prefersReducedMotion() ? { duration: 0 } : spring.smooth,
};

/**
 * Focus Ring Animation
 * For keyboard navigation focus indicators
 */
export const focusRing = {
  whileFocus: {
    outlineWidth: 2,
    outlineOffset: 2,
    transition: {
      duration: prefersReducedMotion() ? 0 : 0.1,
    },
  },
};

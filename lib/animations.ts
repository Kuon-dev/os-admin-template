// Animation constants for motion.dev
// macOS-inspired animation system with accessibility considerations

// Easing presets - smooth, not jarring
export const ease = {
  smooth: [0.25, 0.1, 0.25, 1] as const,      // Smooth transitions
  bounce: [0.34, 1.56, 0.64, 1] as const,     // Playful bounce
  entrance: [0, 0.55, 0.45, 1] as const,      // Content entrance
  exit: [0.55, 0, 1, 0.45] as const,          // Content exit
  macOS: [0.25, 0.46, 0.45, 0.94] as const,   // Apple's cubic bezier
};

// Spring configurations - feel natural and responsive
export const spring = {
  gentle: { type: 'spring' as const, stiffness: 120, damping: 14 },  // Subtle
  snappy: { type: 'spring' as const, stiffness: 300, damping: 25 },  // Quick responsive
  bouncy: { type: 'spring' as const, stiffness: 300, damping: 20 },  // Energetic
  stiff: { type: 'spring' as const, stiffness: 400, damping: 30 },   // Very quick
};

// Common animation variants - page/modal level
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const slideUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export const slideDown = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
};

export const slideInLeft = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

export const slideInRight = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

export const scaleDown = {
  initial: { opacity: 0, scale: 1.05 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 1.05 },
};

// Stagger animation configs for lists/grids
export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

export const staggerItem = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

// Card and component interactions
export const cardHover = {
  rest: { scale: 1, y: 0 },
  hover: { scale: 1.02, y: -2 },
  tap: { scale: 0.98 },
  transition: { type: 'spring', stiffness: 300, damping: 25 },
};

// Button/Interactive element animations
export const buttonBase = {
  rest: { scale: 1 },
  hover: { scale: 1.02 },
  tap: { scale: 0.95 },
  transition: { type: 'spring', stiffness: 400, damping: 30 },
};

// Icon button (smaller scale)
export const iconButton = {
  rest: { scale: 1 },
  hover: { scale: 1.1 },
  tap: { scale: 0.9 },
  transition: { type: 'spring', stiffness: 400, damping: 30 },
};

// Drawer/Modal animations
export const drawer = {
  initial: { x: '100%', opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: '100%', opacity: 0 },
  transition: { type: 'spring', stiffness: 300, damping: 30 },
};

export const modal = {
  initial: { scale: 0.95, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.95, opacity: 0 },
  transition: { type: 'spring', stiffness: 300, damping: 25 },
};

export const modalBackdrop = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.15 },
};

// Input focus animation
export const inputFocus = {
  initial: { borderColor: 'transparent' },
  animate: { borderColor: '#fd5b3a' }, // Primary color
  transition: { duration: 0.2 },
};

// Success/Error animations
export const successBounce = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.8, opacity: 0 },
  transition: { type: 'spring', stiffness: 400, damping: 25 },
};

export const errorShake = {
  animate: {
    x: [0, -5, 5, -5, 5, 0],
    transition: { duration: 0.4, ease: 'easeInOut' },
  },
};

// Badge/Notification animations
export const badgeBounce = {
  type: 'spring',
  stiffness: 300,
  damping: 20,
};

export const badgePulse = {
  animate: {
    scale: [1, 1.1, 1],
    transition: { duration: 2, repeat: Infinity },
  },
};

// Table row interactions
export const rowHover = {
  rest: { backgroundColor: 'transparent' },
  hover: { backgroundColor: 'var(--component-item-hover)' },
  transition: { duration: 0.15 },
};

export const rowSelect = {
  initial: { backgroundColor: 'transparent' },
  animate: { backgroundColor: 'var(--component-item-active)' },
  transition: { duration: 0.2 },
};

// Search/Filter results animation
export const searchResult = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.2 },
};

// Tooltip animation
export const tooltip = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
  transition: { duration: 0.15 },
};

// Transition durations (ms) - kept short for responsiveness
export const duration = {
  instant: 100,
  fast: 150,
  normal: 200,
  slow: 300,
  slower: 400,
  slowest: 500,
};

// Parallax scroll multipliers
export const parallax = {
  subtle: 0.2,   // For gentle parallax effects
  medium: 0.5,   // For noticeable parallax
  strong: 0.8,   // For dramatic parallax
};

// Viewport-aware animation (for lazy loading, intersection)
export const viewportInView = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '0px 0px -100px 0px' },
  transition: { type: 'spring', stiffness: 200, damping: 25 },
};

// 404 Page specific animations
export const notFoundNumber = {
  initial: { opacity: 0, scale: 0.5 },
  animate: { opacity: 0.08, scale: 1 },
  transition: { type: 'spring', stiffness: 100, damping: 20, delay: 0.1 },
};

export const notFoundHeading = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  transition: { type: 'spring', stiffness: 300, damping: 25, delay: 0.2 },
};

export const notFoundContent = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { type: 'spring', stiffness: 250, damping: 25, delay: 0.3 },
};

export const notFoundButtons = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { type: 'spring', stiffness: 250, damping: 25, delay: 0.4 },
};

// Illustration animation for 404
export const illustrationFloat = {
  animate: {
    y: [0, -8, 0],
    transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
  },
};

export const illustrationRotate = {
  animate: {
    rotate: [0, 5, -5, 0],
    transition: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
  },
};

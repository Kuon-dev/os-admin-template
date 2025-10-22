// Animation constants for motion.dev

// Easing presets
export const ease = {
  smooth: [0.25, 0.1, 0.25, 1] as const,      // Smooth transitions
  bounce: [0.34, 1.56, 0.64, 1] as const,     // Playful bounce
  entrance: [0, 0.55, 0.45, 1] as const,      // Content entrance
  exit: [0.55, 0, 1, 0.45] as const,          // Content exit
};

// Spring configurations
export const spring = {
  gentle: { stiffness: 120, damping: 14 },  // Subtle
  bouncy: { stiffness: 300, damping: 20 },  // Energetic
  snappy: { stiffness: 400, damping: 30 },  // Quick
};

// Common animation variants
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

export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

// Stagger animation configs
export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

// Product card hover animation
export const cardHover = {
  rest: { scale: 1, y: 0 },
  hover: { scale: 1.02, y: -4 },
  tap: { scale: 0.98 },
};

// Button press animation
export const buttonPress = {
  rest: { scale: 1 },
  hover: { scale: 1.02 },
  tap: { scale: 0.95 },
};

// Drawer/Modal animations
export const drawer = {
  initial: { x: '100%', opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: '100%', opacity: 0 },
};

export const modal = {
  initial: { scale: 0.95, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.95, opacity: 0 },
};

// Badge spring animation
export const badgeBounce = {
  type: "spring",
  ...spring.bouncy,
};

// Transition durations (ms)
export const duration = {
  fast: 150,
  normal: 200,
  slow: 300,
  slower: 400,
};

// Parallax scroll multipliers
export const parallax = {
  subtle: 0.2,   // For gentle parallax effects
  medium: 0.5,   // For noticeable parallax
  strong: 0.8,   // For dramatic parallax
};

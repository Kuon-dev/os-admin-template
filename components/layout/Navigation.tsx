'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { useScroll } from '@/hooks/use-scroll';
import { bakeryInfo } from '@/lib/constants';
import { slideDown } from '@/lib/animations';

interface NavigationProps {
  alwaysVisible?: boolean;
}

export function Navigation({ alwaysVisible = false }: NavigationProps) {
  const { isScrolled } = useScroll(100);
  const shouldShow = alwaysVisible || isScrolled;

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.nav
          variants={slideDown}
          initial="initial"
          animate="animate"
          exit="exit"
          className="fixed top-0 left-0 right-0 z-40 bg-flour/95 backdrop-blur-md shadow-lg border-b border-border"
        >
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link href="/" className="font-display text-xl font-bold text-foreground hover:opacity-80 transition-opacity">
                {bakeryInfo.name}
              </Link>

              {/* Nav Links - Desktop */}
              <div className="hidden md:flex items-center gap-8">
                <Link
                  href="/"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Home
                </Link>
                <Link
                  href="/menu"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Menu
                </Link>
                <Link
                  href="/about"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  About
                </Link>
                <Link
                  href="/contact"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contact
                </Link>
                <Link href="/cart">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2 bg-croissant text-espresso rounded-full font-semibold text-sm hover:shadow-lg transition-shadow"
                  >
                    Order Now
                  </motion.button>
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <button className="md:hidden p-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              </button>
            </div>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}

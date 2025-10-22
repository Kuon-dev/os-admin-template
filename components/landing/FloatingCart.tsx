'use client';

import { motion, AnimatePresence } from 'motion/react';
import { badgeBounce, buttonPress } from '@/lib/animations';
import { Cart } from '@/types/product';

interface FloatingCartProps {
  cart: Cart;
  onClick?: () => void;
}

export function FloatingCart({ cart, onClick }: FloatingCartProps) {
  const hasItems = cart.itemCount > 0;

  return (
    <motion.button
      variants={buttonPress}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-6 py-4 bg-croissant text-espresso rounded-full shadow-2xl hover:shadow-3xl transition-shadow"
    >
      {/* Cart Icon */}
      <div className="relative">
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
            d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
          />
        </svg>

        {/* Badge with count */}
        <AnimatePresence mode="wait">
          {hasItems && (
            <motion.div
              key={cart.itemCount}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={badgeBounce}
              className="absolute -top-2 -right-2 min-w-[20px] h-5 flex items-center justify-center px-1.5 bg-raspberry text-flour text-xs font-bold rounded-full"
            >
              {cart.itemCount > 9 ? '9+' : cart.itemCount}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Total */}
      {hasItems && (
        <motion.span
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: 'auto' }}
          exit={{ opacity: 0, width: 0 }}
          className="font-semibold text-lg whitespace-nowrap"
        >
          ${cart.total.toFixed(2)}
        </motion.span>
      )}
    </motion.button>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DailySpecial as DailySpecialType } from '@/types/product';
import { slideDown } from '@/lib/animations';

interface DailySpecialProps {
  special: DailySpecialType;
}

export function DailySpecial({ special }: DailySpecialProps) {
  const [timeLeft, setTimeLeft] = useState('');
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const end = special.endsAt.getTime();
      const distance = end - now;

      if (distance < 0) {
        return 'Expired';
      }

      const hours = Math.floor(distance / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

      return `${hours}h ${minutes}m`;
    };

    setTimeLeft(calculateTimeLeft());

    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [special.endsAt]);

  if (isDismissed) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        variants={slideDown}
        initial="initial"
        animate="animate"
        exit="exit"
        className="bg-gradient-to-r from-raspberry to-accent text-accent-foreground"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
              <span className="text-2xl">⭐</span>
              <div className="flex-1">
                <p className="font-semibold text-lg">
                  Today's Special: {special.product.name}
                </p>
                <p className="text-sm opacity-90">{special.description}</p>
              </div>
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-flour/20 backdrop-blur-sm rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-sm font-medium">{timeLeft} left</span>
              </div>
            </div>

            <button
              onClick={() => setIsDismissed(true)}
              className="p-2 hover:bg-flour/20 rounded-full transition-colors"
              aria-label="Dismiss"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

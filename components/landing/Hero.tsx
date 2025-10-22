'use client';

import { motion } from 'motion/react';
import { useParallax } from '@/hooks/use-scroll';
import { slideUp, staggerContainer, duration } from '@/lib/animations';
import { bakeryInfo } from '@/lib/constants';

interface HeroProps {
  onOrderNow?: () => void;
  onViewMenu?: () => void;
}

export function Hero({ onOrderNow, onViewMenu }: HeroProps) {
  const parallaxOffset = useParallax(0.5);

  return (
    <section className="relative h-[600px] md:h-[700px] overflow-hidden bg-espresso">
      {/* Background Image with Parallax */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1600&q=80)',
          y: parallaxOffset,
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />
      </motion.div>

      {/* Content */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4"
      >
        {/* Bakery Name */}
        <motion.div variants={slideUp} className="mb-4">
          <h1 className="font-display text-5xl md:text-7xl font-bold text-flour mb-2">
            {bakeryInfo.name}
          </h1>
        </motion.div>

        {/* Tagline */}
        <motion.p
          variants={slideUp}
          className="text-xl md:text-2xl text-cream mb-8 max-w-2xl"
        >
          {bakeryInfo.tagline}
        </motion.p>

        {/* Description */}
        <motion.p
          variants={slideUp}
          className="text-base md:text-lg text-warm-beige mb-12 max-w-xl"
        >
          Authentic French pastries and breads crafted with traditional techniques and the finest ingredients
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={slideUp}
          className="flex flex-col sm:flex-row gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: duration.fast / 1000 }}
            onClick={onOrderNow}
            className="px-8 py-4 bg-croissant text-espresso rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transition-shadow"
          >
            Order Now
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: duration.fast / 1000 }}
            onClick={onViewMenu}
            className="px-8 py-4 bg-flour/10 backdrop-blur-sm text-flour border-2 border-flour rounded-full font-semibold text-lg hover:bg-flour/20 transition-colors"
          >
            View Menu
          </motion.button>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{
            opacity: [0.3, 1, 0.3],
            y: [0, 10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-flour/50 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-2 bg-flour/70 rounded-full" />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

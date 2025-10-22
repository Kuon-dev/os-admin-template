'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { ChefHat, ArrowRight } from 'lucide-react';
import { ease, spring } from '@/lib/animations';

export function StoryTeaser() {
  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: ease.entrance }}
          className="max-w-4xl mx-auto text-center space-y-6"
        >
          {/* Icon Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, ...spring.bouncy }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-croissant/10 text-croissant font-medium text-sm"
          >
            <ChefHat className="w-4 h-4" />
            <span>Traditional French Bakery Since 1993</span>
          </motion.div>

          {/* Heading */}
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Crafted with Passion, Served with Pride
          </h2>

          {/* Brief Description */}
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            For over 30 years, our family bakery has been bringing authentic French tradition to your table.
            Every morning before dawn, our artisan bakers craft each loaf and pastry using time-honored techniques.
          </p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.5, ease: ease.entrance }}
          >
            <Link href="/about">
              <motion.button
                whileHover={{ scale: 1.05, transition: spring.snappy }}
                whileTap={{ scale: 0.95 }}
                className="group inline-flex items-center gap-2 px-6 py-3 bg-croissant text-espresso font-semibold rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200"
              >
                <span>Discover Our Story</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import { slideUp, staggerContainer, ease, spring } from '@/lib/animations';
import { bakeryInfo } from '@/lib/constants';
import { Award, ChefHat, Clock, Sparkles } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

export function StorySection() {
  const [imageHovered, setImageHovered] = useState(false);

  const highlights = [
    { icon: Clock, label: 'Since 1993', value: '30+ Years' },
    { icon: Award, label: 'Quality', value: 'Award-Winning' },
    { icon: ChefHat, label: 'Traditional', value: 'French Recipes' },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-flour to-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 right-[10%] w-96 h-96 bg-croissant/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-100px' }}
          className="grid lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto"
        >
          {/* Image Side */}
          <motion.div
            variants={slideUp}
            className="relative order-2 lg:order-1"
            onHoverStart={() => setImageHovered(true)}
            onHoverEnd={() => setImageHovered(false)}
          >
            {/* Main image */}
            <motion.div
              className="relative h-[400px] md:h-[560px] rounded-2xl overflow-hidden shadow-2xl"
              whileHover={{ y: -8, transition: spring.gentle }}
            >
              <motion.div
                animate={{
                  scale: imageHovered ? 1.05 : 1,
                }}
                transition={{ duration: 0.6, ease: ease.smooth }}
                className="absolute inset-0"
              >
                <Image
                  src="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80"
                  alt="Artisan baker at work"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  unoptimized
                />
              </motion.div>

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-espresso/40 via-transparent to-transparent" />

              {/* Floating badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, ...spring.bouncy }}
                className="absolute bottom-8 right-8 bg-croissant text-espresso px-6 py-4 rounded-2xl shadow-xl backdrop-blur-sm"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-5 h-5" />
                  <span className="font-bold text-2xl">30+</span>
                </div>
                <div className="text-sm font-semibold">Years of Excellence</div>
              </motion.div>
            </motion.div>

            {/* Decorative element */}
            <motion.div
              className="absolute -bottom-6 -left-6 w-32 h-32 bg-croissant/20 rounded-full blur-2xl -z-10"
              animate={{
                scale: imageHovered ? 1.2 : 1,
                opacity: imageHovered ? 0.3 : 0.2,
              }}
              transition={{ duration: 0.4 }}
            />
          </motion.div>

          {/* Content Side */}
          <motion.div variants={slideUp} className="space-y-8 order-1 lg:order-2">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, ...spring.gentle }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-croissant/10 text-croissant font-medium text-sm"
            >
              <ChefHat className="w-4 h-4" />
              <span>Traditional French Bakery</span>
            </motion.div>

            {/* Title */}
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              Our Story
            </h2>

            {/* Description */}
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              {bakeryInfo.story}
            </p>

            {/* Quote */}
            <motion.blockquote
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6, ease: ease.entrance }}
              className="relative border-l-4 border-croissant pl-6 py-4"
            >
              <p className="italic text-foreground font-medium text-lg">
                "Baking is not just our craft—it's our passion. Every loaf, every pastry is made with love and dedication to the time-honored French traditions."
              </p>
              <div className="absolute -left-1 top-0 w-2 h-2 bg-croissant rounded-full" />
              <div className="absolute -left-1 bottom-0 w-2 h-2 bg-croissant rounded-full" />
            </motion.blockquote>

            {/* Highlights Grid */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              {highlights.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + index * 0.1, duration: 0.5, ease: ease.entrance }}
                  whileHover={{ y: -4, transition: spring.snappy }}
                  className="text-center p-4 rounded-xl bg-muted/50 border border-border/50 cursor-default"
                >
                  <item.icon className="w-6 h-6 text-croissant mx-auto mb-2" />
                  <div className="font-bold text-sm mb-1">{item.value}</div>
                  <div className="text-xs text-muted-foreground">{item.label}</div>
                </motion.div>
              ))}
            </div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.5, ease: ease.entrance }}
            >
              <Link href="/about">
                <motion.button
                  whileHover={{ scale: 1.02, transition: spring.snappy }}
                  whileTap={{ scale: 0.98 }}
                  className="group inline-flex items-center gap-2 px-6 py-3 bg-croissant text-espresso font-semibold rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200"
                >
                  <span>Learn More About Us</span>
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: ease.smooth }}
                  >
                    →
                  </motion.span>
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

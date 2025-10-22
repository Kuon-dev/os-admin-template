'use client';

import { motion } from 'motion/react';
import { Star, Quote } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { ease, spring } from '@/lib/animations';
import { useState } from 'react';

interface Testimonial {
  id: string;
  name: string;
  rating: number;
  text: string;
  date: string;
  verified: boolean;
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah M.',
    rating: 5,
    text: "The croissants here are absolutely divine! They're flaky, buttery, and taste just like the ones I had in Paris. Best bakery in town!",
    date: '2 days ago',
    verified: true,
  },
  {
    id: '2',
    name: 'Michael Chen',
    rating: 5,
    text: 'Their sourdough is incredible. You can tell they use traditional methods and quality ingredients. Worth every penny!',
    date: '1 week ago',
    verified: true,
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    rating: 5,
    text: 'I come here every Sunday morning for their fresh baguettes. The staff is friendly and the atmosphere is warm and inviting.',
    date: '3 days ago',
    verified: true,
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: ease.entrance }}
          className="text-center mb-12"
        >
          {/* Rating Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, ...spring.bouncy }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-croissant/10 text-croissant font-semibold text-sm mb-4"
          >
            <Star className="w-4 h-4 fill-croissant" />
            <span>4.9 out of 5 stars</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">500+ reviews</span>
          </motion.div>

          <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">
            Loved by Our Community
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Don't just take our word for it—hear what our customers say
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} />
          ))}
        </div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6, ease: ease.entrance }}
          className="mt-12 flex flex-wrap justify-center items-center gap-8 text-sm text-muted-foreground"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-croissant rounded-full" />
            <span>Award-Winning Bakery</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-croissant rounded-full" />
            <span>Certified French Artisan</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-croissant rounded-full" />
            <span>100% Fresh Daily</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function TestimonialCard({ testimonial, index }: { testimonial: Testimonial; index: number }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: ease.entrance,
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <motion.div
        whileHover={{ y: -6, transition: spring.gentle }}
        className="h-full"
      >
        <Card className="p-6 h-full flex flex-col relative overflow-hidden transition-shadow duration-300 hover:shadow-lg">
          {/* Quote Icon */}
          <motion.div
            animate={{
              scale: isHovered ? 1.1 : 1,
              rotate: isHovered ? -5 : 0,
            }}
            transition={{ duration: 0.3 }}
            className="absolute top-4 right-4 text-croissant/10"
          >
            <Quote className="w-12 h-12" />
          </motion.div>

          {/* Stars */}
          <div className="flex gap-1 mb-3 relative z-10">
            {Array.from({ length: testimonial.rating }).map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-croissant text-croissant" />
            ))}
          </div>

          {/* Review Text */}
          <p className="text-foreground leading-relaxed mb-4 flex-1 relative z-10">
            "{testimonial.text}"
          </p>

          {/* Author Info */}
          <div className="flex items-center justify-between relative z-10">
            <div>
              <div className="font-semibold text-sm flex items-center gap-2">
                {testimonial.name}
                {testimonial.verified && (
                  <span className="inline-flex items-center text-xs text-croissant">
                    ✓ Verified
                  </span>
                )}
              </div>
              <div className="text-xs text-muted-foreground">{testimonial.date}</div>
            </div>
          </div>

          {/* Hover Effect Border */}
          <motion.div
            className="absolute inset-0 border-2 border-croissant/0 rounded-lg pointer-events-none"
            animate={{
              borderColor: isHovered ? 'rgba(217, 164, 65, 0.3)' : 'rgba(217, 164, 65, 0)',
            }}
            transition={{ duration: 0.3 }}
          />
        </Card>
      </motion.div>
    </motion.div>
  );
}

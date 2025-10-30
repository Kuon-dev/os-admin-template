"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, ArrowRight } from "lucide-react";
import {
  notFoundNumber,
  notFoundHeading,
  notFoundContent,
  notFoundButtons,
  illustrationFloat,
} from "@/lib/animations";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Subtle background elements */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary/3 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative z-10 w-full max-w-2xl"
      >
        <div className="text-center space-y-8">
          {/* Geometric Illustration */}
          <motion.div
            className="flex justify-center mb-4"
            {...illustrationFloat}
          >
            <div className="relative w-32 h-32 flex items-center justify-center">
              {/* Concentric circles background */}
              <svg
                viewBox="0 0 120 120"
                className="absolute w-full h-full text-primary/10"
              >
                <circle cx="60" cy="60" r="55" fill="none" stroke="currentColor" strokeWidth="2" />
                <circle cx="60" cy="60" r="40" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="60" cy="60" r="25" fill="none" stroke="currentColor" strokeWidth="1" />
              </svg>

              {/* 404 Number */}
              <motion.h1
                className="text-7xl font-black select-none tracking-tight"
                style={{ textShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
                {...notFoundNumber}
              >
                <span className="text-primary/15">4</span>
                <span className="text-primary/12">0</span>
                <span className="text-primary/15">4</span>
              </motion.h1>
            </div>
          </motion.div>

          {/* Heading */}
          <motion.div className="space-y-2" {...notFoundHeading}>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Page Not Found
            </h2>
            <p className="text-sm text-muted-foreground/80 font-medium">
              Lost in the digital universe
            </p>
          </motion.div>

          {/* Description */}
          <motion.div className="space-y-4" {...notFoundContent}>
            <p className="text-base text-muted-foreground/90 leading-relaxed max-w-lg mx-auto">
              The page you're looking for either doesn't exist, has been moved, or is temporarily unavailable.
              Let's help you find your way back.
            </p>

            {/* Quick navigation hints */}
            <div className="flex flex-wrap gap-2 justify-center text-xs text-muted-foreground/70">
              <span className="px-3 py-1.5 rounded-full bg-muted/50 border border-border">
                Check the URL
              </span>
              <span className="px-3 py-1.5 rounded-full bg-muted/50 border border-border">
                or go back
              </span>
              <span className="px-3 py-1.5 rounded-full bg-muted/50 border border-border">
                or return home
              </span>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-4"
            {...notFoundButtons}
          >
            <Button
              asChild
              size="lg"
              className="min-w-48 h-11 px-6 text-base font-medium"
            >
              <Link href="/app" className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                <span>Go to Dashboard</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={() => router.back()}
              className="min-w-48 h-11 px-6 text-base font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span>Go Back</span>
            </Button>
          </motion.div>

          {/* Keyboard shortcut hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-xs text-muted-foreground/60 pt-6 border-t border-border/50"
          >
            <p>Press <kbd className="px-2 py-1 rounded border border-border bg-muted text-foreground text-xs font-mono">H</kbd> for home or <kbd className="px-2 py-1 rounded border border-border bg-muted text-foreground text-xs font-mono">Esc</kbd> to go back</p>
          </motion.div>
        </div>
      </motion.div>

      {/* Keyboard shortcut handler */}
      <script dangerouslySetInnerHTML={{
        __html: `
          document.addEventListener('keydown', (e) => {
            if (e.key === 'h' || e.key === 'H') {
              window.location.href = '/app';
            }
            if (e.key === 'Escape') {
              window.history.back();
            }
          });
        `
      }} />
    </div>
  );
}

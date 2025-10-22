"use client";

import * as React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface SegmentedControlOption {
  value: string;
  label: string;
  icon?: LucideIcon;
}

interface SegmentedControlProps {
  options: SegmentedControlOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function SegmentedControl({
  options,
  value,
  onChange,
  className,
}: SegmentedControlProps) {
  const [hoveredValue, setHoveredValue] = React.useState<string | null>(null);

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-lg bg-muted p-1",
        className
      )}
      role="tablist"
    >
      {options.map((option) => {
        const isActive = value === option.value;
        const isHovered = hoveredValue === option.value;
        const Icon = option.icon;

        return (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            onMouseEnter={() => setHoveredValue(option.value)}
            onMouseLeave={() => setHoveredValue(null)}
            className={cn(
              "relative flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              isActive
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
            role="tab"
            aria-selected={isActive}
          >
            {/* Animated background indicator */}
            {isActive && (
              <motion.div
                layoutId="segmented-control-indicator"
                className="absolute inset-0 rounded-md bg-background shadow-sm"
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                }}
              />
            )}

            {/* Hover effect */}
            {isHovered && !isActive && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 rounded-md bg-background/50"
                transition={{ duration: 0.15 }}
              />
            )}

            {/* Content */}
            <span className="relative z-10 flex items-center gap-2">
              {Icon && <Icon className="h-4 w-4" />}
              {option.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

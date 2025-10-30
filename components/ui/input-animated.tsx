"use client";

import * as React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface InputAnimatedProps
  extends React.ComponentProps<"input"> {
  error?: boolean;
}

const InputAnimated = React.forwardRef<HTMLInputElement, InputAnimatedProps>(
  ({ className, type, error, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);

    return (
      <motion.div
        className="relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <input
          ref={ref}
          type={type}
          data-slot="input"
          className={cn(
            "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            isFocused && "border-primary/50 ring-primary/20 ring-[3px]",
            error && "border-destructive ring-destructive/20 ring-[3px]",
            !isFocused && !error && "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
            className
          )}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          {...props}
        />

        {/* Animated focus indicator line */}
        <motion.div
          className="absolute bottom-0 left-0 h-0.5 bg-primary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: isFocused ? "100%" : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        />

        {/* Error indicator */}
        {error && (
          <motion.div
            className="absolute -bottom-1.5 left-0 text-destructive text-xs font-medium"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            ✕ Invalid input
          </motion.div>
        )}
      </motion.div>
    );
  }
);

InputAnimated.displayName = "InputAnimated";

export { InputAnimated };

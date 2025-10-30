"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

interface SearchAnimatedProps extends React.ComponentProps<"input"> {
  onClear?: () => void;
  showKeyboardHint?: boolean;
  resultCount?: number;
  isLoading?: boolean;
}

const SearchAnimated = React.forwardRef<HTMLInputElement, SearchAnimatedProps>(
  (
    {
      className,
      value,
      onChange,
      onClear,
      showKeyboardHint = true,
      resultCount,
      isLoading = false,
      placeholder = "Search...",
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const hasValue = value && value.toString().length > 0;

    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative w-full"
      >
        <div className="relative group">
          {/* Search icon */}
          <motion.div
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            animate={{ scale: isFocused ? 1.1 : 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <Search className="w-4 h-4" />
          </motion.div>

          {/* Input field */}
          <input
            ref={ref}
            type="text"
            value={value}
            onChange={onChange}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            placeholder={placeholder}
            data-slot="search"
            className={cn(
              "w-full h-9 pl-10 pr-3 py-1 text-base rounded-md border border-input bg-background transition-all outline-none",
              "placeholder:text-muted-foreground",
              "dark:bg-input/30 shadow-xs",
              isFocused && "border-primary/50 ring-primary/20 ring-[3px]",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "focus-visible:border-primary/50 focus-visible:ring-primary/20 focus-visible:ring-[3px]",
              className
            )}
            {...props}
          />

          {/* Clear button with animation */}
          <AnimatePresence>
            {hasValue && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                className="absolute right-2 top-1/2 -translate-y-1/2"
              >
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="h-6 w-6"
                  onClick={() => {
                    onChange?.({
                      target: { value: "" },
                    } as React.ChangeEvent<HTMLInputElement>);
                    onClear?.();
                  }}
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Focus border animation */}
          <motion.div
            className="absolute bottom-0 left-0 h-0.5 bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: isFocused ? "100%" : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          />

          {/* Loading indicator */}
          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute right-2 top-1/2 -translate-y-1/2"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-primary/20 border-t-primary rounded-full"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Keyboard hint */}
        <AnimatePresence>
          {showKeyboardHint && !isFocused && !hasValue && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="absolute right-3 top-1/2 -translate-y-1/2 hidden lg:flex items-center gap-1 pointer-events-none"
            >
              <kbd className="px-2 py-1 rounded border border-border bg-muted text-foreground text-xs font-mono">
                ⌘K
              </kbd>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Result count feedback */}
        <AnimatePresence>
          {isFocused && resultCount !== undefined && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 mt-2 text-xs text-muted-foreground"
            >
              {resultCount === 0 ? (
                <span>No results found</span>
              ) : (
                <span>{resultCount} result{resultCount !== 1 ? "s" : ""} found</span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }
);

SearchAnimated.displayName = "SearchAnimated";

export { SearchAnimated };

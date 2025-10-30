"use client";

import * as React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface AnimatedTableRowProps
  extends React.HTMLAttributes<HTMLTableRowElement> {
  isSelected?: boolean;
  isHoverable?: boolean;
  index?: number;
}

const AnimatedTableRow = React.forwardRef<
  HTMLTableRowElement,
  AnimatedTableRowProps
>(({ className, isSelected = false, isHoverable = true, index = 0, children, ...props }, ref) => {
  const [isHovering, setIsHovering] = React.useState(false);

  return (
    <motion.tr
      ref={ref}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{
        duration: 0.2,
        delay: index ? index * 0.02 : 0,
      }}
      onHoverStart={() => isHoverable && setIsHovering(true)}
      onHoverEnd={() => setIsHovering(false)}
      className={cn(
        "border-b transition-colors",
        isSelected
          ? "bg-primary/5 border-primary/20"
          : isHovering && isHoverable
            ? "bg-accent/50"
            : "hover:bg-muted/30",
        className
      )}
      {...props}
    >
      {children}
    </motion.tr>
  );
});

AnimatedTableRow.displayName = "AnimatedTableRow";

export { AnimatedTableRow };

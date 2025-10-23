'use client';

import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ActionButtonProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  variant?: 'default' | 'outline' | 'ghost';
  tooltip?: string;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export function ActionButton({
  icon: Icon,
  label,
  onClick,
  variant = 'outline',
  tooltip,
  disabled,
  loading,
  className,
}: ActionButtonProps) {
  const buttonContent = (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      <Button
        variant={variant}
        size="lg"
        onClick={onClick}
        disabled={disabled || loading}
        className={cn(
          'group relative h-14 w-full justify-start gap-3 overflow-hidden font-semibold',
          className
        )}
      >
        {/* Ripple effect background */}
        <motion.div
          className="absolute inset-0 bg-primary/10"
          initial={{ scale: 0, opacity: 0 }}
          whileHover={{ scale: 2, opacity: 1 }}
          transition={{ duration: 0.6 }}
        />

        {/* Icon with rotation on hover */}
        <motion.div
          className={cn(
            'flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20',
            loading && 'animate-pulse'
          )}
          whileHover={{ rotate: loading ? 0 : 5 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <Icon className="h-4 w-4 text-primary" />
        </motion.div>

        {/* Label */}
        <span className="relative">{label}</span>

        {/* Loading spinner */}
        {loading && (
          <motion.div
            className="absolute right-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <div className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent" />
          </motion.div>
        )}

        {/* Hover shine effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 0.6 }}
        />
      </Button>
    </motion.div>
  );

  if (tooltip) {
    return (
      <TooltipProvider delayDuration={150}>
        <Tooltip>
          <TooltipTrigger asChild>{buttonContent}</TooltipTrigger>
          <TooltipContent side="right">
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return buttonContent;
}

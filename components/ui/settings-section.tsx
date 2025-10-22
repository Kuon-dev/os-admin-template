"use client";

import * as React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface SettingsSectionProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function SettingsSection({
  title,
  description,
  icon: Icon,
  children,
  className,
  delay = 0,
}: SettingsSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        delay,
      }}
      className={cn("space-y-4", className)}
    >
      {/* Section Header */}
      <div className="flex items-start gap-3">
        {Icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        )}
        <div className="flex-1 space-y-1">
          <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </div>

      {/* Section Content */}
      <div className="ml-[52px]">{children}</div>
    </motion.section>
  );
}

interface SettingsGroupProps {
  children: React.ReactNode;
  className?: string;
}

export function SettingsGroup({ children, className }: SettingsGroupProps) {
  return (
    <div className={cn("rounded-lg border bg-card p-6 shadow-sm", className)}>
      {children}
    </div>
  );
}

interface SettingsItemProps {
  label: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function SettingsItem({
  label,
  description,
  children,
  className,
}: SettingsItemProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-8 py-3 first:pt-0 last:pb-0",
        className
      )}
    >
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium leading-none">{label}</p>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="flex items-center">{children}</div>
    </div>
  );
}

"use client";

import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StockBadgeProps {
  stock: number;
  className?: string;
}

export function StockBadge({ stock, className }: StockBadgeProps) {
  const t = useTranslations("products.stockStatus");

  const getStockStatus = () => {
    if (stock === 0) {
      return {
        label: t("outOfStock"),
        variant: "destructive" as const,
        color: "bg-red-500/10 text-red-700 dark:text-red-400",
      };
    } else if (stock <= 20) {
      return {
        label: t("lowStock"),
        variant: "secondary" as const,
        color: "bg-orange-500/10 text-orange-700 dark:text-orange-400",
      };
    } else {
      return {
        label: t("inStock"),
        variant: "secondary" as const,
        color: "bg-green-500/10 text-green-700 dark:text-green-400",
      };
    }
  };

  const status = getStockStatus();

  return (
    <Badge
      variant={status.variant}
      className={cn(status.color, "font-medium", className)}
    >
      {status.label} ({stock})
    </Badge>
  );
}

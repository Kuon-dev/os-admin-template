'use client';

import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export interface TableColumn {
  key: string;
  label: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: any) => React.ReactNode;
}

interface DataTableProps {
  columns: TableColumn[];
  data: any[];
  maxRows?: number;
  striped?: boolean;
}

export function DataTable({
  columns,
  data,
  maxRows = 10,
  striped = true,
}: DataTableProps) {
  const displayData = data.slice(0, maxRows);

  return (
    <div className="overflow-hidden rounded-lg border">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    'px-4 py-3 text-xs font-semibold uppercase tracking-wider',
                    column.align === 'center' && 'text-center',
                    column.align === 'right' && 'text-right',
                    (!column.align || column.align === 'left') && 'text-left'
                  )}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayData.map((row, rowIndex) => (
              <motion.tr
                key={row.id || rowIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: rowIndex * 0.03,
                  ease: [0.4, 0, 0.2, 1],
                }}
                className={cn(
                  'border-b transition-colors hover:bg-muted/30',
                  striped && rowIndex % 2 === 1 && 'bg-muted/10'
                )}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={cn(
                      'px-4 py-3 text-sm',
                      column.align === 'center' && 'text-center',
                      column.align === 'right' && 'text-right',
                      (!column.align || column.align === 'left') && 'text-left'
                    )}
                  >
                    {column.render
                      ? column.render(row[column.key], row)
                      : row[column.key]}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Helper function to render status badges
export function renderStatusBadge(
  status: string,
  variant?: 'success' | 'warning' | 'error' | 'info'
) {
  const variantMap = {
    success: 'default',
    warning: 'secondary',
    error: 'destructive',
    info: 'outline',
  } as const;

  return (
    <Badge variant={variantMap[variant || 'info']} className="font-medium">
      {status}
    </Badge>
  );
}

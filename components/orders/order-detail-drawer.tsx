'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import {
  Package,
  User,
  Mail,
  Calendar,
  CreditCard,
  Truck,
  FileText,
  Edit,
} from 'lucide-react';
import type { Order } from '@/types/order';
import {
  ORDER_STATUS_CONFIG,
  PAYMENT_STATUS_CONFIG,
  PRIORITY_CONFIG,
} from '@/lib/mock-data/orders';

interface OrderDetailDrawerProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (order: Order) => void;
}

export function OrderDetailDrawer({
  order,
  open,
  onOpenChange,
  onEdit,
}: OrderDetailDrawerProps) {
  if (!order) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto p-0">
        {/* Header */}
        <SheetHeader className="p-4 pb-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                <Package className="h-4 w-4 text-primary" />
              </div>
              <div>
                <SheetTitle className="text-base">{order.orderNumber}</SheetTitle>
                <SheetDescription className="text-xs">
                  {formatDate(order.createdAt)} at {formatTime(order.createdAt)}
                </SheetDescription>
              </div>
            </div>
            <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => onEdit(order)}>
              <Edit className="mr-1.5 h-3.5 w-3.5" />
              Edit
            </Button>
          </div>
        </SheetHeader>

        <div className="p-4 space-y-4">
          {/* Status Badges */}
          <div className="flex flex-wrap gap-1.5">
            <Badge
              variant="secondary"
              className={`text-xs ${ORDER_STATUS_CONFIG[order.status].color}`}
            >
              {ORDER_STATUS_CONFIG[order.status].label}
            </Badge>
            <Badge
              variant="secondary"
              className={`text-xs ${PAYMENT_STATUS_CONFIG[order.paymentStatus].color}`}
            >
              {PAYMENT_STATUS_CONFIG[order.paymentStatus].label}
            </Badge>
            <Badge
              variant="secondary"
              className={`text-xs ${PRIORITY_CONFIG[order.priority].color}`}
            >
              {PRIORITY_CONFIG[order.priority].label}
            </Badge>
          </div>

          <Separator />

          {/* Customer Info */}
          <div>
            <h4 className="mb-3 text-sm font-semibold">Customer</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-sm">{order.customerName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{order.customerEmail}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Addresses */}
          <div className="grid gap-4 grid-cols-2">
            <div>
              <h4 className="mb-2 text-sm font-semibold flex items-center gap-1.5">
                <Truck className="h-3.5 w-3.5" />
                Shipping
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">{order.shippingAddress}</p>
            </div>
            <div>
              <h4 className="mb-2 text-sm font-semibold flex items-center gap-1.5">
                <CreditCard className="h-3.5 w-3.5" />
                Billing
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">{order.billingAddress}</p>
            </div>
          </div>

          {order.expectedDelivery && (
            <>
              <Separator />
              <div className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Expected Delivery</p>
                  <p className="text-sm font-medium">{formatDate(order.expectedDelivery)}</p>
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Order Items */}
          <div>
            <h4 className="mb-3 text-sm font-semibold">
              Items ({order.itemCount})
            </h4>
            <div className="space-y-2">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-md border p-2.5"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{item.productName}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatCurrency(item.unitPrice)} × {item.quantity}
                    </p>
                  </div>
                  <span className="text-sm font-semibold ml-3">{formatCurrency(item.total)}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Order Summary */}
          <div>
            <h4 className="mb-3 text-sm font-semibold">Summary</h4>
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax</span>
                <span>{formatCurrency(order.taxAmount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span>
                  {order.shippingCost === 0 ? 'Free' : formatCurrency(order.shippingCost)}
                </span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount</span>
                  <span>-{formatCurrency(order.discount)}</span>
                </div>
              )}
              <Separator className="my-2" />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <>
              <Separator />
              <div>
                <h4 className="mb-2 text-sm font-semibold flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5" />
                  Notes
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{order.notes}</p>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

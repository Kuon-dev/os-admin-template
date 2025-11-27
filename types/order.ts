// Order status types
export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'returned';

// Payment status types
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

// Order priority types
export type OrderPriority = 'low' | 'normal' | 'high' | 'urgent';

// Order item interface
export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

// Main Order interface
export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  itemCount: number;
  subtotal: number;
  taxAmount: number;
  shippingCost: number;
  discount: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  priority: OrderPriority;
  shippingAddress: string;
  billingAddress: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  expectedDelivery?: string;
}

// Order filter options
export interface OrderFilters {
  search: string;
  status: OrderStatus | 'all';
  paymentStatus: PaymentStatus | 'all';
  priority: OrderPriority | 'all';
  dateFrom?: string;
  dateTo?: string;
}

// Order sort options
export interface OrderSort {
  field: keyof Order;
  direction: 'asc' | 'desc';
}

// Order statistics
export interface OrderStats {
  total: number;
  pending: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
  totalRevenue: number;
  averageOrderValue: number;
}

// Form data for creating/editing orders
export interface OrderFormData {
  customerName: string;
  customerEmail: string;
  items: Omit<OrderItem, 'id'>[];
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  priority: OrderPriority;
  shippingAddress: string;
  billingAddress: string;
  shippingCost: number;
  discount: number;
  notes?: string;
}

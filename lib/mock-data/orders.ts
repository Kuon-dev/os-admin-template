import type { Order, OrderStats } from '@/types/order';

// Generate mock orders
export const MOCK_ORDERS: Order[] = [
  {
    id: 'ord-001',
    orderNumber: 'ORD-2024-001',
    customerId: 'cust-001',
    customerName: 'John Smith',
    customerEmail: 'john.smith@email.com',
    items: [
      { id: 'item-1', productId: 'prod-1', productName: 'Wireless Headphones', quantity: 2, unitPrice: 149.99, total: 299.98 },
      { id: 'item-2', productId: 'prod-2', productName: 'Phone Case', quantity: 1, unitPrice: 29.99, total: 29.99 },
    ],
    itemCount: 3,
    subtotal: 329.97,
    taxAmount: 33.00,
    shippingCost: 9.99,
    discount: 0,
    total: 372.96,
    status: 'delivered',
    paymentStatus: 'paid',
    priority: 'normal',
    shippingAddress: '123 Main St, New York, NY 10001',
    billingAddress: '123 Main St, New York, NY 10001',
    createdAt: '2024-11-20T10:30:00Z',
    updatedAt: '2024-11-25T14:20:00Z',
    expectedDelivery: '2024-11-25',
  },
  {
    id: 'ord-002',
    orderNumber: 'ORD-2024-002',
    customerId: 'cust-002',
    customerName: 'Sarah Johnson',
    customerEmail: 'sarah.j@email.com',
    items: [
      { id: 'item-3', productId: 'prod-3', productName: 'Laptop Stand', quantity: 1, unitPrice: 79.99, total: 79.99 },
    ],
    itemCount: 1,
    subtotal: 79.99,
    taxAmount: 8.00,
    shippingCost: 5.99,
    discount: 10,
    total: 83.98,
    status: 'shipped',
    paymentStatus: 'paid',
    priority: 'high',
    shippingAddress: '456 Oak Ave, Los Angeles, CA 90001',
    billingAddress: '456 Oak Ave, Los Angeles, CA 90001',
    createdAt: '2024-11-22T09:15:00Z',
    updatedAt: '2024-11-24T11:45:00Z',
    expectedDelivery: '2024-11-28',
  },
  {
    id: 'ord-003',
    orderNumber: 'ORD-2024-003',
    customerId: 'cust-003',
    customerName: 'Michael Brown',
    customerEmail: 'michael.b@email.com',
    items: [
      { id: 'item-4', productId: 'prod-4', productName: 'Mechanical Keyboard', quantity: 1, unitPrice: 159.99, total: 159.99 },
      { id: 'item-5', productId: 'prod-5', productName: 'Mouse Pad XL', quantity: 1, unitPrice: 24.99, total: 24.99 },
      { id: 'item-6', productId: 'prod-6', productName: 'USB Hub', quantity: 2, unitPrice: 34.99, total: 69.98 },
    ],
    itemCount: 4,
    subtotal: 254.96,
    taxAmount: 25.50,
    shippingCost: 0,
    discount: 25,
    total: 255.46,
    status: 'processing',
    paymentStatus: 'paid',
    priority: 'normal',
    shippingAddress: '789 Pine Rd, Chicago, IL 60601',
    billingAddress: '789 Pine Rd, Chicago, IL 60601',
    createdAt: '2024-11-24T14:20:00Z',
    updatedAt: '2024-11-24T16:30:00Z',
    expectedDelivery: '2024-11-30',
  },
  {
    id: 'ord-004',
    orderNumber: 'ORD-2024-004',
    customerId: 'cust-004',
    customerName: 'Emily Davis',
    customerEmail: 'emily.d@email.com',
    items: [
      { id: 'item-7', productId: 'prod-7', productName: '4K Monitor', quantity: 1, unitPrice: 449.99, total: 449.99 },
    ],
    itemCount: 1,
    subtotal: 449.99,
    taxAmount: 45.00,
    shippingCost: 0,
    discount: 0,
    total: 494.99,
    status: 'pending',
    paymentStatus: 'pending',
    priority: 'urgent',
    shippingAddress: '321 Elm St, Houston, TX 77001',
    billingAddress: '321 Elm St, Houston, TX 77001',
    notes: 'Customer requested expedited shipping',
    createdAt: '2024-11-26T08:00:00Z',
    updatedAt: '2024-11-26T08:00:00Z',
    expectedDelivery: '2024-12-02',
  },
  {
    id: 'ord-005',
    orderNumber: 'ORD-2024-005',
    customerId: 'cust-005',
    customerName: 'David Wilson',
    customerEmail: 'david.w@email.com',
    items: [
      { id: 'item-8', productId: 'prod-8', productName: 'Webcam HD', quantity: 1, unitPrice: 89.99, total: 89.99 },
      { id: 'item-9', productId: 'prod-9', productName: 'Ring Light', quantity: 1, unitPrice: 49.99, total: 49.99 },
    ],
    itemCount: 2,
    subtotal: 139.98,
    taxAmount: 14.00,
    shippingCost: 7.99,
    discount: 0,
    total: 161.97,
    status: 'confirmed',
    paymentStatus: 'paid',
    priority: 'normal',
    shippingAddress: '654 Maple Dr, Phoenix, AZ 85001',
    billingAddress: '654 Maple Dr, Phoenix, AZ 85001',
    createdAt: '2024-11-25T16:45:00Z',
    updatedAt: '2024-11-25T17:00:00Z',
    expectedDelivery: '2024-12-01',
  },
  {
    id: 'ord-006',
    orderNumber: 'ORD-2024-006',
    customerId: 'cust-006',
    customerName: 'Jennifer Martinez',
    customerEmail: 'jennifer.m@email.com',
    items: [
      { id: 'item-10', productId: 'prod-10', productName: 'Bluetooth Speaker', quantity: 1, unitPrice: 129.99, total: 129.99 },
    ],
    itemCount: 1,
    subtotal: 129.99,
    taxAmount: 13.00,
    shippingCost: 5.99,
    discount: 15,
    total: 133.98,
    status: 'cancelled',
    paymentStatus: 'refunded',
    priority: 'low',
    shippingAddress: '987 Cedar Ln, Philadelphia, PA 19101',
    billingAddress: '987 Cedar Ln, Philadelphia, PA 19101',
    notes: 'Customer requested cancellation',
    createdAt: '2024-11-21T11:30:00Z',
    updatedAt: '2024-11-22T09:15:00Z',
  },
  {
    id: 'ord-007',
    orderNumber: 'ORD-2024-007',
    customerId: 'cust-007',
    customerName: 'Robert Taylor',
    customerEmail: 'robert.t@email.com',
    items: [
      { id: 'item-11', productId: 'prod-11', productName: 'Gaming Mouse', quantity: 1, unitPrice: 79.99, total: 79.99 },
      { id: 'item-12', productId: 'prod-12', productName: 'Mouse Bungee', quantity: 1, unitPrice: 19.99, total: 19.99 },
    ],
    itemCount: 2,
    subtotal: 99.98,
    taxAmount: 10.00,
    shippingCost: 4.99,
    discount: 0,
    total: 114.97,
    status: 'delivered',
    paymentStatus: 'paid',
    priority: 'normal',
    shippingAddress: '147 Birch Ave, San Antonio, TX 78201',
    billingAddress: '147 Birch Ave, San Antonio, TX 78201',
    createdAt: '2024-11-18T13:00:00Z',
    updatedAt: '2024-11-23T10:30:00Z',
    expectedDelivery: '2024-11-23',
  },
  {
    id: 'ord-008',
    orderNumber: 'ORD-2024-008',
    customerId: 'cust-008',
    customerName: 'Lisa Anderson',
    customerEmail: 'lisa.a@email.com',
    items: [
      { id: 'item-13', productId: 'prod-13', productName: 'Desk Organizer', quantity: 2, unitPrice: 34.99, total: 69.98 },
      { id: 'item-14', productId: 'prod-14', productName: 'Cable Management Kit', quantity: 1, unitPrice: 24.99, total: 24.99 },
      { id: 'item-15', productId: 'prod-15', productName: 'Monitor Arm', quantity: 1, unitPrice: 119.99, total: 119.99 },
    ],
    itemCount: 4,
    subtotal: 214.96,
    taxAmount: 21.50,
    shippingCost: 0,
    discount: 20,
    total: 216.46,
    status: 'shipped',
    paymentStatus: 'paid',
    priority: 'high',
    shippingAddress: '258 Walnut St, San Diego, CA 92101',
    billingAddress: '258 Walnut St, San Diego, CA 92101',
    createdAt: '2024-11-23T10:00:00Z',
    updatedAt: '2024-11-25T08:30:00Z',
    expectedDelivery: '2024-11-29',
  },
  {
    id: 'ord-009',
    orderNumber: 'ORD-2024-009',
    customerId: 'cust-009',
    customerName: 'Christopher Lee',
    customerEmail: 'chris.l@email.com',
    items: [
      { id: 'item-16', productId: 'prod-16', productName: 'Ergonomic Chair', quantity: 1, unitPrice: 399.99, total: 399.99 },
    ],
    itemCount: 1,
    subtotal: 399.99,
    taxAmount: 40.00,
    shippingCost: 29.99,
    discount: 50,
    total: 419.98,
    status: 'processing',
    paymentStatus: 'paid',
    priority: 'normal',
    shippingAddress: '369 Spruce Way, Dallas, TX 75201',
    billingAddress: '369 Spruce Way, Dallas, TX 75201',
    createdAt: '2024-11-24T15:30:00Z',
    updatedAt: '2024-11-25T09:00:00Z',
    expectedDelivery: '2024-12-05',
  },
  {
    id: 'ord-010',
    orderNumber: 'ORD-2024-010',
    customerId: 'cust-010',
    customerName: 'Amanda White',
    customerEmail: 'amanda.w@email.com',
    items: [
      { id: 'item-17', productId: 'prod-17', productName: 'Wireless Charger', quantity: 2, unitPrice: 39.99, total: 79.98 },
      { id: 'item-18', productId: 'prod-18', productName: 'Power Bank', quantity: 1, unitPrice: 59.99, total: 59.99 },
    ],
    itemCount: 3,
    subtotal: 139.97,
    taxAmount: 14.00,
    shippingCost: 5.99,
    discount: 0,
    total: 159.96,
    status: 'pending',
    paymentStatus: 'pending',
    priority: 'normal',
    shippingAddress: '741 Oak Blvd, San Jose, CA 95101',
    billingAddress: '741 Oak Blvd, San Jose, CA 95101',
    createdAt: '2024-11-26T11:00:00Z',
    updatedAt: '2024-11-26T11:00:00Z',
    expectedDelivery: '2024-12-03',
  },
  {
    id: 'ord-011',
    orderNumber: 'ORD-2024-011',
    customerId: 'cust-011',
    customerName: 'Kevin Harris',
    customerEmail: 'kevin.h@email.com',
    items: [
      { id: 'item-19', productId: 'prod-19', productName: 'Noise Cancelling Earbuds', quantity: 1, unitPrice: 199.99, total: 199.99 },
    ],
    itemCount: 1,
    subtotal: 199.99,
    taxAmount: 20.00,
    shippingCost: 0,
    discount: 0,
    total: 219.99,
    status: 'returned',
    paymentStatus: 'refunded',
    priority: 'low',
    shippingAddress: '852 Pine St, Austin, TX 73301',
    billingAddress: '852 Pine St, Austin, TX 73301',
    notes: 'Defective product - customer returned',
    createdAt: '2024-11-15T09:00:00Z',
    updatedAt: '2024-11-20T16:00:00Z',
  },
  {
    id: 'ord-012',
    orderNumber: 'ORD-2024-012',
    customerId: 'cust-012',
    customerName: 'Michelle Clark',
    customerEmail: 'michelle.c@email.com',
    items: [
      { id: 'item-20', productId: 'prod-20', productName: 'Smart Watch', quantity: 1, unitPrice: 299.99, total: 299.99 },
      { id: 'item-21', productId: 'prod-21', productName: 'Watch Band Set', quantity: 1, unitPrice: 29.99, total: 29.99 },
    ],
    itemCount: 2,
    subtotal: 329.98,
    taxAmount: 33.00,
    shippingCost: 0,
    discount: 30,
    total: 332.98,
    status: 'delivered',
    paymentStatus: 'paid',
    priority: 'high',
    shippingAddress: '963 Elm Ct, Jacksonville, FL 32099',
    billingAddress: '963 Elm Ct, Jacksonville, FL 32099',
    createdAt: '2024-11-19T14:00:00Z',
    updatedAt: '2024-11-24T12:00:00Z',
    expectedDelivery: '2024-11-24',
  },
];

// Calculate order statistics
export function calculateOrderStats(orders: Order[]): OrderStats {
  const stats: OrderStats = {
    total: orders.length,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
  };

  orders.forEach((order) => {
    switch (order.status) {
      case 'pending':
        stats.pending++;
        break;
      case 'confirmed':
      case 'processing':
        stats.processing++;
        break;
      case 'shipped':
        stats.shipped++;
        break;
      case 'delivered':
        stats.delivered++;
        break;
      case 'cancelled':
      case 'returned':
        stats.cancelled++;
        break;
    }

    // Only count revenue for non-cancelled/returned orders
    if (order.status !== 'cancelled' && order.status !== 'returned') {
      stats.totalRevenue += order.total;
    }
  });

  stats.averageOrderValue =
    stats.total > 0 ? stats.totalRevenue / (stats.total - stats.cancelled) : 0;

  return stats;
}

// Status color mapping
export const ORDER_STATUS_CONFIG = {
  pending: { label: 'Pending', color: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400' },
  confirmed: { label: 'Confirmed', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
  processing: { label: 'Processing', color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400' },
  shipped: { label: 'Shipped', color: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400' },
  delivered: { label: 'Delivered', color: 'bg-green-500/10 text-green-600 dark:text-green-400' },
  cancelled: { label: 'Cancelled', color: 'bg-red-500/10 text-red-600 dark:text-red-400' },
  returned: { label: 'Returned', color: 'bg-orange-500/10 text-orange-600 dark:text-orange-400' },
} as const;

export const PAYMENT_STATUS_CONFIG = {
  pending: { label: 'Pending', color: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400' },
  paid: { label: 'Paid', color: 'bg-green-500/10 text-green-600 dark:text-green-400' },
  failed: { label: 'Failed', color: 'bg-red-500/10 text-red-600 dark:text-red-400' },
  refunded: { label: 'Refunded', color: 'bg-gray-500/10 text-gray-600 dark:text-gray-400' },
} as const;

export const PRIORITY_CONFIG = {
  low: { label: 'Low', color: 'bg-gray-500/10 text-gray-600 dark:text-gray-400' },
  normal: { label: 'Normal', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
  high: { label: 'High', color: 'bg-orange-500/10 text-orange-600 dark:text-orange-400' },
  urgent: { label: 'Urgent', color: 'bg-red-500/10 text-red-600 dark:text-red-400' },
} as const;

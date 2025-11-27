import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Order, OrderFilters, OrderSort, OrderFormData, OrderStatus } from '@/types/order';
import { MOCK_ORDERS } from '@/lib/mock-data/orders';

interface OrderStore {
  orders: Order[];
  filters: OrderFilters;
  sort: OrderSort;
  selectedOrderIds: string[];
  isLoading: boolean;
  actions: {
    // Fetch orders
    fetchOrders: () => Promise<void>;

    // CRUD operations
    createOrder: (orderData: OrderFormData) => Promise<Order>;
    updateOrder: (id: string, orderData: Partial<Order>) => Promise<Order>;
    updateOrderStatus: (id: string, status: OrderStatus) => Promise<Order>;
    deleteOrder: (id: string) => Promise<void>;
    deleteOrders: (ids: string[]) => Promise<void>;

    // Filters and sorting
    setFilters: (filters: Partial<OrderFilters>) => void;
    setSort: (sort: OrderSort) => void;
    resetFilters: () => void;

    // Selection
    toggleOrderSelection: (id: string) => void;
    selectAllOrders: () => void;
    clearSelection: () => void;

    // Utility
    refreshOrders: () => Promise<void>;
  };
}

const defaultFilters: OrderFilters = {
  search: '',
  status: 'all',
  paymentStatus: 'all',
  priority: 'all',
};

const defaultSort: OrderSort = {
  field: 'createdAt',
  direction: 'desc',
};

// Helper to generate order number
function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `ORD-${year}-${random}`;
}

export const useOrderStore = create<OrderStore>()(
  devtools(
    (set, get) => ({
      orders: [],
      filters: defaultFilters,
      sort: defaultSort,
      selectedOrderIds: [],
      isLoading: false,

      actions: {
        // Fetch all orders (mock implementation)
        fetchOrders: async () => {
          set({ isLoading: true });
          try {
            // Simulate API delay
            await new Promise((resolve) => setTimeout(resolve, 500));
            set({ orders: MOCK_ORDERS, isLoading: false });
          } catch (error) {
            console.error('Error fetching orders:', error);
            set({ isLoading: false });
          }
        },

        // Create a new order
        createOrder: async (orderData) => {
          // Calculate totals
          const subtotal = orderData.items.reduce((sum, item) => sum + item.total, 0);
          const taxAmount = subtotal * 0.1; // 10% tax
          const total = subtotal + taxAmount + orderData.shippingCost - orderData.discount;

          const newOrder: Order = {
            id: crypto.randomUUID(),
            orderNumber: generateOrderNumber(),
            customerId: crypto.randomUUID(),
            customerName: orderData.customerName,
            customerEmail: orderData.customerEmail,
            items: orderData.items.map((item) => ({ ...item, id: crypto.randomUUID() })),
            itemCount: orderData.items.reduce((sum, item) => sum + item.quantity, 0),
            subtotal,
            taxAmount,
            shippingCost: orderData.shippingCost,
            discount: orderData.discount,
            total,
            status: orderData.status,
            paymentStatus: orderData.paymentStatus,
            priority: orderData.priority,
            shippingAddress: orderData.shippingAddress,
            billingAddress: orderData.billingAddress,
            notes: orderData.notes,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          set((state) => ({
            orders: [newOrder, ...state.orders],
          }));

          return newOrder;
        },

        // Update an existing order
        updateOrder: async (id, orderData) => {
          const existingOrder = get().orders.find((o) => o.id === id);
          if (!existingOrder) throw new Error('Order not found');

          const updatedOrder: Order = {
            ...existingOrder,
            ...orderData,
            updatedAt: new Date().toISOString(),
          };

          set((state) => ({
            orders: state.orders.map((order) =>
              order.id === id ? updatedOrder : order
            ),
          }));

          return updatedOrder;
        },

        // Update order status only
        updateOrderStatus: async (id, status) => {
          return get().actions.updateOrder(id, { status });
        },

        // Delete a single order
        deleteOrder: async (id) => {
          set((state) => ({
            orders: state.orders.filter((order) => order.id !== id),
            selectedOrderIds: state.selectedOrderIds.filter((oid) => oid !== id),
          }));
        },

        // Delete multiple orders
        deleteOrders: async (ids) => {
          set((state) => ({
            orders: state.orders.filter((order) => !ids.includes(order.id)),
            selectedOrderIds: [],
          }));
        },

        // Set filters
        setFilters: (newFilters) => {
          set((state) => ({
            filters: { ...state.filters, ...newFilters },
          }));
        },

        // Set sort
        setSort: (sort) => {
          set({ sort });
        },

        // Reset filters to default
        resetFilters: () => {
          set({ filters: defaultFilters });
        },

        // Toggle order selection
        toggleOrderSelection: (id) => {
          set((state) => ({
            selectedOrderIds: state.selectedOrderIds.includes(id)
              ? state.selectedOrderIds.filter((oid) => oid !== id)
              : [...state.selectedOrderIds, id],
          }));
        },

        // Select all visible orders
        selectAllOrders: () => {
          set((state) => ({
            selectedOrderIds: state.orders.map((order) => order.id),
          }));
        },

        // Clear selection
        clearSelection: () => {
          set({ selectedOrderIds: [] });
        },

        // Refresh orders
        refreshOrders: async () => {
          await get().actions.fetchOrders();
        },
      },
    }),
    { name: 'OrderStore' }
  )
);

// Selector hooks for better performance
export const useOrders = () => useOrderStore((state) => state.orders);
export const useOrderFilters = () => useOrderStore((state) => state.filters);
export const useOrderSort = () => useOrderStore((state) => state.sort);
export const useSelectedOrderIds = () => useOrderStore((state) => state.selectedOrderIds);
export const useOrderActions = () => useOrderStore((state) => state.actions);
export const useIsLoadingOrders = () => useOrderStore((state) => state.isLoading);

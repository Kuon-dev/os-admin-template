'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Plus, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  useOrders,
  useOrderFilters,
  useOrderSort,
  useSelectedOrderIds,
  useOrderActions,
  useIsLoadingOrders,
} from '@/stores/order-store';
import {
  OrdersStats,
  OrdersFilters,
  OrdersTable,
  OrderDetailDrawer,
} from '@/components/orders';
import type { Order } from '@/types/order';
import { toast } from 'sonner';

export default function OrdersPage() {
  const orders = useOrders();
  const filters = useOrderFilters();
  const sort = useOrderSort();
  const selectedIds = useSelectedOrderIds();
  const isLoading = useIsLoadingOrders();
  const {
    fetchOrders,
    setFilters,
    setSort,
    resetFilters,
    toggleOrderSelection,
    selectAllOrders,
    clearSelection,
    deleteOrder,
    deleteOrders,
  } = useOrderActions();

  const [viewOrder, setViewOrder] = useState<Order | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Fetch orders on mount
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Filter and sort orders
  const filteredOrders = useMemo(() => {
    let result = [...orders];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (order) =>
          order.orderNumber.toLowerCase().includes(searchLower) ||
          order.customerName.toLowerCase().includes(searchLower) ||
          order.customerEmail.toLowerCase().includes(searchLower)
      );
    }

    // Apply status filter
    if (filters.status !== 'all') {
      result = result.filter((order) => order.status === filters.status);
    }

    // Apply payment status filter
    if (filters.paymentStatus !== 'all') {
      result = result.filter((order) => order.paymentStatus === filters.paymentStatus);
    }

    // Apply priority filter
    if (filters.priority !== 'all') {
      result = result.filter((order) => order.priority === filters.priority);
    }

    // Apply sorting
    result.sort((a, b) => {
      const aValue = a[sort.field];
      const bValue = b[sort.field];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sort.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sort.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });

    return result;
  }, [orders, filters, sort]);

  const handleView = (order: Order) => {
    setViewOrder(order);
    setDrawerOpen(true);
  };

  const handleEdit = (order: Order) => {
    toast.info(`Edit order ${order.orderNumber} - Coming soon`);
    setDrawerOpen(false);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteOrder(id);
      toast.success('Order deleted successfully');
    } catch {
      toast.error('Failed to delete order');
    }
  };

  const handleDeleteSelected = async () => {
    try {
      await deleteOrders(selectedIds);
      toast.success(`${selectedIds.length} orders deleted successfully`);
    } catch {
      toast.error('Failed to delete orders');
    }
  };

  const handleExport = () => {
    const csv = [
      'Order Number,Customer,Email,Items,Total,Status,Payment,Priority,Date',
      ...filteredOrders.map((order) =>
        [
          order.orderNumber,
          order.customerName,
          order.customerEmail,
          order.itemCount,
          order.total,
          order.status,
          order.paymentStatus,
          order.priority,
          order.createdAt,
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'orders.csv';
    a.click();
    toast.success('Orders exported successfully');
  };

  if (isLoading) {
    return (
      <div className="flex h-[600px] items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-4 text-sm text-muted-foreground">Loading orders...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="mx-auto max-w-5xl"
    >
      {/* Header */}
      <div className="flex flex-col gap-3 pb-4 mb-6 border-b border-border md:flex-row md:items-start md:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-sm text-muted-foreground">
            Manage customer orders and shipments
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button size="sm" onClick={() => toast.info('New order form - Coming soon')}>
            <Plus className="mr-2 h-4 w-4" />
            New Order
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6">
        <OrdersStats orders={orders} />
      </div>

      {/* Filters */}
      <div className="mb-6">
        <OrdersFilters
          filters={filters}
          onFiltersChange={setFilters}
          onReset={resetFilters}
          resultCount={filteredOrders.length}
        />
      </div>

      {/* Table */}
      <div className="pb-6">
        <OrdersTable
          orders={filteredOrders}
          selectedIds={selectedIds}
          sort={sort}
          onToggleSelect={toggleOrderSelection}
          onSelectAll={selectAllOrders}
          onClearSelection={clearSelection}
          onSortChange={setSort}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onDeleteSelected={handleDeleteSelected}
        />
      </div>

      {/* Detail Drawer */}
      <OrderDetailDrawer
        order={viewOrder}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onEdit={handleEdit}
      />
    </motion.div>
  );
}

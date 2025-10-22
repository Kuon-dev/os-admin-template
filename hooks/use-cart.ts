'use client';

import { useState, useCallback, useMemo } from 'react';
import { Product, CartItem, Cart } from '@/types/product';

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  // Add item to cart
  const addItem = useCallback((product: Product, quantity: number = 1) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.product.id === product.id
      );

      if (existingItem) {
        return currentItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [...currentItems, { product, quantity }];
    });
  }, []);

  // Remove item from cart
  const removeItem = useCallback((productId: string) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.product.id !== productId)
    );
  }, []);

  // Update item quantity
  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  }, [removeItem]);

  // Clear entire cart
  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  // Calculate cart totals
  const cart: Cart = useMemo(() => {
    const total = items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return {
      items,
      total,
      itemCount,
    };
  }, [items]);

  // Check if product is in cart
  const isInCart = useCallback(
    (productId: string) => {
      return items.some((item) => item.product.id === productId);
    },
    [items]
  );

  // Get quantity of specific product in cart
  const getQuantity = useCallback(
    (productId: string) => {
      const item = items.find((item) => item.product.id === productId);
      return item?.quantity || 0;
    },
    [items]
  );

  return {
    cart,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    isInCart,
    getQuantity,
  };
}

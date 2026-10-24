import { useState, useEffect } from 'react';
import { CartItem } from './order-types';

const CART_STORAGE_KEY = 'yuzersef_cart_v1';

// Sanitize items: ensure numeric price and prevent huge data URLs from exceeding localStorage quota
export function sanitizeCartItem(item: CartItem): CartItem {
  const cleanPrice = typeof item.price === 'number' ? item.price : parsePriceToNumber(item.price || 0);
  let cleanCustomization = item.customization;
  if (cleanCustomization?.previewUrl && cleanCustomization.previewUrl.length > 25000) {
    cleanCustomization = {
      ...cleanCustomization,
      previewUrl: undefined, // remove oversized base64 to avoid quota error
    };
  }
  return {
    ...item,
    price: isNaN(cleanPrice) || cleanPrice < 0 ? 0 : cleanPrice,
    quantity: isNaN(item.quantity) || item.quantity < 1 ? 1 : item.quantity,
    customization: cleanCustomization,
  };
}

// Read items from localStorage
export function getCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(CART_STORAGE_KEY);
    if (!data) return [];
    const list = JSON.parse(data);
    if (!Array.isArray(list)) return [];
    return list.map(sanitizeCartItem);
  } catch (e) {
    console.error('Error loading cart from storage', e);
    return [];
  }
}

// Save items and dispatch update event
export function saveCart(items: CartItem[]): void {
  if (typeof window === 'undefined') return;
  const cleanItems = items.map(sanitizeCartItem);
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cleanItems));
    window.dispatchEvent(new CustomEvent('yuzersef-cart-updated', { detail: cleanItems }));
  } catch (e) {
    console.warn('Quota issue saving cart, dropping previews and retrying...', e);
    try {
      const stripped = cleanItems.map((ci) => ({
        ...ci,
        customization: ci.customization
          ? { ...ci.customization, previewUrl: undefined }
          : undefined,
      }));
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(stripped));
      window.dispatchEvent(new CustomEvent('yuzersef-cart-updated', { detail: stripped }));
    } catch (e2) {
      console.error('Could not save cart to localStorage', e2);
    }
  }
}

// Helper: parse price string or number to clean number
export function parsePriceToNumber(price: string | number): number {
  if (typeof price === 'number') return price;
  const num = parseFloat(price.replace(/[^0-9.]/g, ''));
  return isNaN(num) ? 0 : num;
}

// Add item to cart
export function addToCart(
  item: Omit<CartItem, 'id'> & { id?: string }
): CartItem {
  const current = getCart();

  // Check if identical standard item exists
  const isCustom = item.customization?.hasCustomDesign;
  const existingIndex = isCustom
    ? -1 // Custom items with unique mockups get separate cart entries
    : current.findIndex(
        (ci) =>
          ci.productId === item.productId &&
          ci.selectedColor?.id === item.selectedColor?.id &&
          ci.selectedSize === item.selectedSize
      );

  let updatedItem: CartItem;

  if (existingIndex > -1) {
    const existing = current[existingIndex];
    updatedItem = {
      ...existing,
      quantity: existing.quantity + (item.quantity || 1),
    };
    current[existingIndex] = updatedItem;
  } else {
    updatedItem = {
      ...item,
      id: item.id || `cart-${item.productId}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      quantity: item.quantity || 1,
      price: typeof item.price === 'number' ? item.price : parsePriceToNumber(item.price || 0),
    };
    current.push(updatedItem);
  }

  saveCart(current);
  return updatedItem;
}

// Update quantity
export function updateQuantity(id: string, delta: number): void {
  const current = getCart();
  const index = current.findIndex((item) => item.id === id);
  if (index === -1) return;

  const newQty = current[index].quantity + delta;
  if (newQty <= 0) {
    current.splice(index, 1);
  } else {
    current[index] = { ...current[index], quantity: newQty };
  }

  saveCart(current);
}

// Set exact quantity
export function setExactQuantity(id: string, quantity: number): void {
  const current = getCart();
  const index = current.findIndex((item) => item.id === id);
  if (index === -1) return;

  if (quantity <= 0) {
    current.splice(index, 1);
  } else {
    current[index] = { ...current[index], quantity };
  }

  saveCart(current);
}

// Remove single item
export function removeFromCart(id: string): void {
  const current = getCart();
  const filtered = current.filter((item) => item.id !== id);
  saveCart(filtered);
}

// Clear all items
export function clearCart(): void {
  saveCart([]);
}

// Calculate total item count
export function getCartCount(items?: CartItem[]): number {
  const list = items || getCart();
  return list.reduce((total, item) => total + (item.quantity || 1), 0);
}

// Calculate subtotal
export function getCartSubtotal(items?: CartItem[]): number {
  const list = items || getCart();
  return list.reduce((total, item) => total + (item.price || 0) * (item.quantity || 1), 0);
}

// React Hook for dynamic live cart state
export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setItems(getCart());
    setLoading(false);

    const handleUpdate = () => {
      setItems(getCart());
    };

    window.addEventListener('yuzersef-cart-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('yuzersef-cart-updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const totalCount = getCartCount(items);
  const subtotal = getCartSubtotal(items);

  return {
    items,
    loading,
    totalCount,
    subtotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    setExactQuantity,
    clearCart,
  };
}

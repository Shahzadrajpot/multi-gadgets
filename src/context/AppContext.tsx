import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { CartItem, Category, GlobalDiscount } from '../types';
import { fetchActiveCategories } from '../services/categoryService';
import { fetchActiveGlobalDiscount } from '../services/discountService';
import { fetchStoreSettings } from '../services/storeService';
import { mapCategory, mapGlobalDiscount } from '../utils/transform';
import { calculateFinalPrice } from '../utils/discount';
import { mockCategories } from '../data/mockData';

const CART_STORAGE_KEY = 'multi_gadgets_cart';

interface AppContextType {
  cart: CartItem[];
  categories: Category[];
  globalDiscount: GlobalDiscount | null;
  storeSettings: {
    storeName: string;
    whatsappNumber: string;
    deliveryCharges: number;
    codEnabled: boolean;
  };
  loading: boolean;
  error: string | null;
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string, size: string) => void;
  updateCartQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  refreshData: () => Promise<void>;
}

const defaultSettings = {
  storeName: 'Multi Gadgets',
  whatsappNumber: '923001234567',
  deliveryCharges: 200,
  codEnabled: true,
};

const AppContext = createContext<AppContextType | null>(null);

function loadCartFromStorage(): CartItem[] {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored) as CartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveCartToStorage(cart: CartItem[]) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch {
    // ignore
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(loadCartFromStorage);
  const [categories, setCategories] = useState<Category[]>([]);
  const [globalDiscount, setGlobalDiscount] = useState<GlobalDiscount | null>(null);
  const [storeSettings, setStoreSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [cats, discount, settings] = await Promise.all([
        fetchActiveCategories(),
        fetchActiveGlobalDiscount(),
        fetchStoreSettings(),
      ]);
      setCategories(cats.map(mapCategory));
      setGlobalDiscount(discount ? mapGlobalDiscount(discount) : null);
      setStoreSettings({
        storeName: settings.store_name,
        whatsappNumber: settings.whatsapp_number,
        deliveryCharges: settings.delivery_charges,
        codEnabled: settings.cod_enabled,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load store data';
      setError(`Failed to fetch data: ${message}. Using demo data.`);
      // Fallback to mock data with clear error messaging
      setCategories(mockCategories);
      setGlobalDiscount(null);
      setStoreSettings(defaultSettings);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  useEffect(() => {
    saveCartToStorage(cart);
  }, [cart]);

  const addToCart = useCallback((item: CartItem) => {
    setCart((prev) => {
      const existing = prev.find(
        (i) => i.product.id === item.product.id && i.size === item.size
      );
      let next: CartItem[];
      if (existing) {
        next = prev.map((i) =>
          i.product.id === item.product.id && i.size === item.size
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      } else {
        next = [...prev, item];
      }
      return next;
    });
  }, []);

  const removeFromCart = useCallback((productId: string, size: string) => {
    setCart((prev) => prev.filter((i) => !(i.product.id === productId && i.size === size)));
  }, []);

  const updateCartQuantity = useCallback((productId: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }
    setCart((prev) =>
      prev.map((i) =>
        i.product.id === productId && i.size === size ? { ...i, quantity } : i
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => setCart([]), []);

  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  const cartTotal = cart.reduce((sum, i) => {
    const productDiscount = i.product.discount
      ? { discount_type: i.product.discount.type, discount_value: i.product.discount.value }
      : null;
    const { finalPrice } = calculateFinalPrice(
      i.product.basePrice,
      productDiscount,
      globalDiscount,
      i.product.categoryId
    );
    return sum + finalPrice * i.quantity;
  }, 0);

  return (
    <AppContext.Provider
      value={{
        cart,
        categories,
        globalDiscount,
        storeSettings,
        loading,
        error,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartCount,
        cartTotal,
        refreshData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}

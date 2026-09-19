import {
  Product,
  Order,
  User,
  Review,
  Promotion,
  InventoryItem,
  PaymentRecord,
  SavTicket,
  ShippingZone,
  StoreSettings,
} from '../types';

const TOKEN_KEY = 'nicaise_auth_token';
const USER_KEY = 'nicaise_auth_user';

export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthSession(token: string, user: User) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAuthSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getStoredUser(): User | null {
  const item = localStorage.getItem(USER_KEY);
  if (!item) return null;
  try {
    return JSON.parse(item);
  } catch {
    return null;
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || data.message || 'Une erreur est survenue.');
  }

  return data;
}

export const api = {
  // Auth
  auth: {
    login: async (credentials: { email: string; password: string }) => {
      const data = await request<{ message: string; token: string; user: User }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      setAuthSession(data.token, data.user);
      return data;
    },
    register: async (userData: { email: string; password: string; firstName: string; lastName: string; phone?: string }) => {
      const data = await request<{ message: string; token: string; user: User }>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
      setAuthSession(data.token, data.user);
      return data;
    },
    me: async () => {
      const data = await request<{ user: User }>('/api/auth/me');
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      return data.user;
    },
    updateProfile: async (profile: { firstName?: string; lastName?: string; phone?: string }) => {
      const data = await request<{ message: string; user: User }>('/api/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(profile),
      });
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      return data.user;
    },
    resetPasswordRequest: async (email: string) => {
      return request<{ message: string }>('/api/auth/reset-password-request', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
    },
    logout: () => {
      clearAuthSession();
    },
  },

  // Products
  products: {
    getAll: async (params?: Record<string, string | number | boolean>) => {
      const query = params ? '?' + new URLSearchParams(params as any).toString() : '';
      const data = await request<{ products: Product[]; total: number }>(`/api/products${query}`);
      return data.products;
    },
    getById: async (id: string) => {
      const data = await request<{ product: Product }>(`/api/products/${id}`);
      return data.product;
    },
    create: async (product: Partial<Product>) => {
      const data = await request<{ message: string; product: Product }>('/api/products', {
        method: 'POST',
        body: JSON.stringify(product),
      });
      return data.product;
    },
    update: async (id: string, product: Partial<Product>) => {
      const data = await request<{ message: string; product: Product }>(`/api/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(product),
      });
      return data.product;
    },
    delete: async (id: string) => {
      return request<{ message: string }>(`/api/products/${id}`, {
        method: 'DELETE',
      });
    },
    togglePublish: async (id: string) => {
      const data = await request<{ message: string; product: Product }>(`/api/products/${id}/publish`, {
        method: 'PATCH',
      });
      return data.product;
    },
  },

  // Cart stock check
  cart: {
    verifyStock: async (items: { productId: string; quantity: number }[]) => {
      return request<{ valid: boolean; details: any[] }>('/api/cart/verify', {
        method: 'POST',
        body: JSON.stringify({ items }),
      });
    },
  },

  // Orders
  orders: {
    create: async (orderData: any) => {
      return request<{ message: string; order: Order; payment: PaymentRecord }>('/api/orders', {
        method: 'POST',
        body: JSON.stringify(orderData),
      });
    },
    getAll: async () => {
      const data = await request<{ orders: Order[] }>('/api/orders');
      return data.orders;
    },
    getByOrderNumber: async (orderNumber: string) => {
      const data = await request<{ order: Order }>(`/api/orders/${orderNumber}`);
      return data.order;
    },
    updateStatus: async (id: string, status: string, paymentStatus?: string) => {
      return request<{ message: string; order: Order }>(`/api/orders/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status, paymentStatus }),
      });
    },
  },

  // Payments
  payments: {
    process: async (paymentData: { orderNumber: string; paymentMethod: string; momoPhone?: string }) => {
      return request<{
        success: boolean;
        status: string;
        transactionRef: string;
        message: string;
        payment: PaymentRecord;
        order: Order;
      }>('/api/payments/process', {
        method: 'POST',
        body: JSON.stringify(paymentData),
      });
    },
    getAllAdmin: async () => {
      const data = await request<{ payments: PaymentRecord[] }>('/api/admin/payments');
      return data.payments;
    },
  },

  // Promotions
  promotions: {
    validate: async (code: string, amount: number) => {
      return request<{ valid: boolean; promo: Promotion; discount: number; message: string }>('/api/promotions/validate', {
        method: 'POST',
        body: JSON.stringify({ code, amount }),
      });
    },
    getAll: async () => {
      const data = await request<{ promotions: Promotion[] }>('/api/admin/promotions');
      return data.promotions;
    },
    create: async (promo: Partial<Promotion>) => {
      return request<{ message: string; promotion: Promotion }>('/api/admin/promotions', {
        method: 'POST',
        body: JSON.stringify(promo),
      });
    },
    delete: async (id: string) => {
      return request<{ message: string }>(`/api/admin/promotions/${id}`, {
        method: 'DELETE',
      });
    },
  },

  // Reviews
  reviews: {
    getByProduct: async (productId: string) => {
      const data = await request<{ reviews: Review[] }>(`/api/reviews/product/${productId}`);
      return data.reviews;
    },
    submit: async (reviewData: { productId: string; rating: number; comment: string; userName?: string; userEmail?: string }) => {
      return request<{ message: string; review: Review }>('/api/reviews', {
        method: 'POST',
        body: JSON.stringify(reviewData),
      });
    },
    getAllAdmin: async () => {
      const data = await request<{ reviews: Review[] }>('/api/admin/reviews');
      return data.reviews;
    },
    moderate: async (id: string, isApproved: boolean) => {
      return request<{ message: string; review: Review }>(`/api/admin/reviews/${id}/moderate`, {
        method: 'PUT',
        body: JSON.stringify({ isApproved }),
      });
    },
    delete: async (id: string) => {
      return request<{ message: string }>(`/api/admin/reviews/${id}`, {
        method: 'DELETE',
      });
    },
  },

  // SAV
  sav: {
    createTicket: async (ticketData: any) => {
      return request<{ message: string; ticket: SavTicket }>('/api/sav', {
        method: 'POST',
        body: JSON.stringify(ticketData),
      });
    },
    getAll: async () => {
      const data = await request<{ tickets: SavTicket[] }>('/api/sav');
      return data.tickets;
    },
    track: async (ticketNumber: string) => {
      const data = await request<{ ticket: SavTicket }>(`/api/sav/track/${ticketNumber}`);
      return data.ticket;
    },
    updateTicket: async (id: string, updateData: { status?: string; notes?: string }) => {
      return request<{ message: string; ticket: SavTicket }>(`/api/admin/sav/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updateData),
      });
    },
  },

  // Inventory
  inventory: {
    getAll: async () => {
      const data = await request<{ inventory: InventoryItem[] }>('/api/admin/inventory');
      return data.inventory;
    },
    update: async (productId: string, data: { stock?: number; alertThreshold?: number }) => {
      return request<{ message: string; item: InventoryItem }>(`/api/admin/inventory/${productId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },
  },

  // Shipping
  shipping: {
    getZones: async () => {
      const data = await request<{ zones: ShippingZone[] }>('/api/shipping-zones');
      return data.zones;
    },
    updateZone: async (id: string, data: Partial<ShippingZone>) => {
      return request<{ message: string; zone: ShippingZone }>(`/api/admin/shipping-zones/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },
  },

  // Admin
  admin: {
    getStats: async () => {
      return request<{
        kpis: {
          totalRevenue: number;
          totalOrders: number;
          totalClients: number;
          averageBasket: number;
          totalWatchesSold: number;
          totalStockAvailable: number;
          lowStockCount: number;
          outOfStockCount: number;
        };
        salesTimeline: { period: string; revenue: number; orders: number }[];
        topSelling: { product: Product; count: number; totalRevenue: number }[];
      }>('/api/admin/stats');
    },
    getUsers: async () => {
      const data = await request<{ users: User[] }>('/api/admin/users');
      return data.users;
    },
    getEmailLogs: async () => {
      const data = await request<{ emailLogs: any[] }>('/api/admin/email-logs');
      return data.emailLogs;
    },
  },

  // Settings
  settings: {
    get: async () => {
      const data = await request<{ settings: StoreSettings }>('/api/settings');
      return data.settings;
    },
    update: async (newSettings: Partial<StoreSettings>) => {
      const data = await request<{ message: string; settings: StoreSettings }>('/api/admin/settings', {
        method: 'PUT',
        body: JSON.stringify(newSettings),
      });
      return data.settings;
    },
  },
};

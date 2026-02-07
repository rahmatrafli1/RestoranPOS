// API Base URL
export const API_BASE_URL = '/api';

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  CASHIER: 'cashier',
  WAITER: 'waiter',
  CHEF: 'chef',
};

// Order Types
export const ORDER_TYPES = {
  DINE_IN: 'dine_in',
  TAKEAWAY: 'takeaway',
  DELIVERY: 'delivery',
};

// Order Status
export const ORDER_STATUS = {
  PENDING: 'pending',
  PREPARING: 'preparing',
  READY: 'ready',
  SERVED: 'served',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

// Order Item Status
export const ORDER_ITEM_STATUS = {
  PENDING: 'pending',
  PREPARING: 'preparing',
  READY: 'ready',
};

// Payment Methods
export const PAYMENT_METHODS = {
  CASH: 'cash',
  CARD: 'card',
  E_WALLET: 'e-wallet',
  BANK_TRANSFER: 'bank-transfer',
};

// Table Status
export const TABLE_STATUS = {
  AVAILABLE: 'available',
  OCCUPIED: 'occupied',
  RESERVED: 'reserved',
  MAINTENANCE: 'maintenance',
};

// Table Locations
export const TABLE_LOCATIONS = {
  INDOOR: 'indoor',
  OUTDOOR: 'outdoor',
  VIP: 'vip',
};

// Status Colors
export const STATUS_COLORS = {
  pending: 'warning',
  preparing: 'primary',
  ready: 'success',
  served: 'success',
  completed: 'secondary',
  cancelled: 'danger',
  available: 'success',
  occupied: 'danger',
  reserved: 'warning',
  maintenance: 'secondary',
};

// Status Labels
export const STATUS_LABELS = {
  pending: 'Pending',
  preparing: 'Preparing',
  ready: 'Ready',
  served: 'Served',
  completed: 'Completed',
  cancelled: 'Cancelled',
  dine_in: 'Dine In',
  takeaway: 'Takeaway',
  delivery: 'Delivery',
  cash: 'Cash',
  card: 'Card',
  'e-wallet': 'E-Wallet',
  'bank-transfer': 'Bank Transfer',
  available: 'Available',
  occupied: 'Occupied',
  reserved: 'Reserved',
  maintenance: 'Maintenance',
  indoor: 'Indoor',
  outdoor: 'Outdoor',
  vip: 'VIP',
};
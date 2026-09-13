export type UserRole = 'student' | 'staff' | 'manager' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  studentId?: string;
  employeeId?: string;
  phone?: string;
  role: UserRole;
  walletBalance: number;
  avatar?: string;
}

export type FoodCategory =
  | 'Breakfast'
  | 'Pakistani Food'
  | 'Fast Food'
  | 'Snacks'
  | 'Beverages'
  | 'Desserts';

export type AvailabilityStatus = 'AVAILABLE' | 'LOW STOCK' | 'SOLD OUT';

export interface FoodItem {
  id: string;
  name: string;
  category: FoodCategory;
  description: string;
  price: number; // in PKR
  prepTime: string; // e.g. "10-15 mins"
  stock: number;
  availability: AvailabilityStatus;
  image: string;
  isPopular?: boolean;
  calories?: number;
}

export interface CartItem {
  foodItem: FoodItem;
  quantity: number;
}

export interface PickupSlot {
  id: string;
  timeWindow: string; // e.g. "12:00 PM – 12:15 PM"
  shortLabel: string; // "12:00 – 12:15"
  startTime: string; // "12:00"
  currentOrders: number;
  maxCapacity: number;
  isClosed?: boolean;
}

export type OrderStatus =
  | 'ORDER RECEIVED'
  | 'PREPARING'
  | 'READY FOR PICKUP'
  | 'COMPLETED'
  | 'CANCELLED';

export type PaymentMethod = 'CASH AT CAFETERIA' | 'UNIVERSITY WALLET';

export type PaymentStatus = 'UNPAID / PAY AT CAFETERIA' | 'PAID';

export interface OrderItem {
  foodId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: FoodCategory;
}

export interface Order {
  id: string; // e.g. "BU-1024"
  tokenNumber: number;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentPhone?: string;
  items: OrderItem[];
  subtotal: number;
  total: number;
  pickupSlotId: string;
  pickupSlotTime: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  cancelledReason?: string;
  notes?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  type: 'order' | 'wallet' | 'system';
  orderId?: string;
}

export interface SalesStatistics {
  totalOrdersToday: number;
  completedOrders: number;
  cancelledOrders: number;
  totalSales: number;
  rushHourOrders: number;
  cashPayments: number;
  walletPayments: number;
}

export interface SystemSettings {
  announcement: string;
  isAnnouncementActive: boolean;
  cafeteriaOpenTime: string;
  cafeteriaCloseTime: string;
  lunchRushStart: string;
  lunchRushEnd: string;
}

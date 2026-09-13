import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  User,
  UserRole,
  FoodItem,
  CartItem,
  PickupSlot,
  Order,
  OrderStatus,
  PaymentMethod,
  Notification,
  SystemSettings,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_FOOD_ITEMS,
  INITIAL_PICKUP_SLOTS,
  INITIAL_ORDERS,
  INITIAL_NOTIFICATIONS,
} from '../data/initialData';

interface AppContextType {
  currentUser: User | null;
  currentRoute: string;
  routeParams: { orderId?: string; foodId?: string };
  navigateTo: (route: string, params?: { orderId?: string; foodId?: string }) => void;
  login: (emailOrId: string, password: string) => { success: boolean; error?: string; role?: UserRole };
  quickLoginAs: (role: UserRole) => void;
  register: (data: {
    fullName: string;
    studentId: string;
    email: string;
    phone: string;
    password: string;
  }) => { success: boolean; error?: string };
  logout: () => void;
  
  // Wallet
  addFundsToWallet: (amount: number) => void;
  isWalletModalOpen: boolean;
  setIsWalletModalOpen: (isOpen: boolean) => void;
  
  // Users & Administration
  users: User[];
  updateUserRole: (userId: string, newRole: UserRole) => void;

  // System Settings
  systemSettings: SystemSettings;
  updateSystemSettings: (newSettings: Partial<SystemSettings>) => void;
  
  // Menu
  foodItems: FoodItem[];
  addFoodItem: (item: Omit<FoodItem, 'id'>) => void;
  updateFoodItem: (id: string, updates: Partial<FoodItem>) => void;
  updateFoodItemImage: (id: string, newImageUrl: string) => void;
  resetMenuImagesToDefault: () => void;
  deleteFoodItem: (id: string) => void;
  toggleItemSoldOut: (id: string, isSoldOut: boolean) => void;
  
  // Cart
  cart: CartItem[];
  addToCart: (food: FoodItem, quantity?: number) => { success: boolean; message?: string };
  updateCartQuantity: (foodId: string, delta: number) => void;
  removeFromCart: (foodId: string) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;

  // Pickup Slots
  pickupSlots: PickupSlot[];
  updateSlotCapacity: (slotId: string, newCapacity: number) => void;
  toggleSlotClosed: (slotId: string) => void;
  togglePickupSlotClosed: (slotId: string) => void;
  getNearestAvailableSlot: (preferredSlotId?: string) => PickupSlot | null;

  // Orders
  orders: Order[];
  activeOrder: Order | null;
  placeOrder: (orderInput: {
    pickupSlotId: string;
    paymentMethod: PaymentMethod;
    notes?: string;
  }) => Promise<{ success: boolean; orderId?: string; error?: string }>;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  cancelOrder: (orderId: string, reason?: string) => void;
  
  // Notifications
  notifications: Notification[];
  unreadNotificationCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  addNotification: (title: string, message: string, type: 'order' | 'wallet' | 'system', orderId?: string) => void;

  // Food modal
  selectedFoodForModal: FoodItem | null;
  setSelectedFoodForModal: (food: FoodItem | null) => void;
}

const DEFAULT_SYSTEM_SETTINGS: SystemSettings = {
  announcement: 'Lunch rush pre-orders are open! Avoid cafeteria queues by reserving your 15-min pickup slot in advance.',
  isAnnouncementActive: true,
  cafeteriaOpenTime: '08:00 AM',
  cafeteriaCloseTime: '05:00 PM',
  lunchRushStart: '12:00 PM',
  lunchRushEnd: '02:30 PM',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load from LocalStorage or Fallback
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('bu_current_user');
    return saved ? JSON.parse(saved) : INITIAL_USERS[0]; // default logged in as student for seamless first view
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('bu_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [systemSettings, setSystemSettings] = useState<SystemSettings>(() => {
    try {
      const saved = localStorage.getItem('bu_system_settings');
      if (saved) {
        return { ...DEFAULT_SYSTEM_SETTINGS, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_SYSTEM_SETTINGS;
  });

  const [isWalletModalOpen, setIsWalletModalOpen] = useState<boolean>(false);

  const [foodItems, setFoodItems] = useState<FoodItem[]>(() => {
    try {
      const savedV3 = localStorage.getItem('bu_food_items_v3');
      if (savedV3) return JSON.parse(savedV3);

      const olderSaved =
        localStorage.getItem('bu_food_items_v2') || localStorage.getItem('bu_food_items');
      if (olderSaved) {
        const parsed: FoodItem[] = JSON.parse(olderSaved);
        // Automatically migrate standard menu items to authentic high-definition Pakistani cafeteria pictures
        const updated = parsed.map((item) => {
          const matchingInit = INITIAL_FOOD_ITEMS.find((init) => init.id === item.id);
          if (matchingInit) {
            const outdatedUrls = [
              'photo-1626074353765-517a681e40be', // old inaccurate halwa puri
              'photo-1525351484163-7529414344d8', // old western breakfast
              'photo-1589301760014-d929f3979dbc', // old gulab jamun
              'photo-1576092768241-dec231879fc3', // old tea
              'photo-1544787219-7f47ccb76574', // older tea
              'photo-1548839140-29a749e1bc4e', // old mineral water
            ];
            const isOutdated = outdatedUrls.some((outdated) => item.image.includes(outdated));
            if (
              isOutdated ||
              ['food-8', 'food-12', 'food-13', 'food-14', 'food-16'].includes(item.id)
            ) {
              return {
                ...item,
                image: matchingInit.image,
              };
            }
          }
          return item;
        });
        localStorage.setItem('bu_food_items_v3', JSON.stringify(updated));
        return updated;
      }
    } catch (e) {
      console.error('Error loading food items from storage:', e);
    }
    return INITIAL_FOOD_ITEMS;
  });

  const [pickupSlots, setPickupSlots] = useState<PickupSlot[]>(() => {
    const saved = localStorage.getItem('bu_pickup_slots');
    return saved ? JSON.parse(saved) : INITIAL_PICKUP_SLOTS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('bu_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('bu_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('bu_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // Navigation State with history support
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash && hash.startsWith('/')) {
      return hash.split('?')[0];
    }
    return '/';
  });

  const [routeParams, setRouteParams] = useState<{ orderId?: string; foodId?: string }>({});
  const [selectedFoodForModal, setSelectedFoodForModal] = useState<FoodItem | null>(null);

  // Sync to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('bu_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('bu_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('bu_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('bu_food_items', JSON.stringify(foodItems));
    localStorage.setItem('bu_food_items_v3', JSON.stringify(foodItems));
  }, [foodItems]);

  useEffect(() => {
    localStorage.setItem('bu_pickup_slots', JSON.stringify(pickupSlots));
  }, [pickupSlots]);

  useEffect(() => {
    localStorage.setItem('bu_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('bu_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('bu_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('bu_system_settings', JSON.stringify(systemSettings));
  }, [systemSettings]);

  // Sync route to hash
  const navigateTo = useCallback((route: string, params?: { orderId?: string; foodId?: string }) => {
    setCurrentRoute(route);
    if (params) {
      setRouteParams(params);
    } else {
      setRouteParams({});
    }
    window.location.hash = route;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Listen for back/forward
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && hash.startsWith('/')) {
        setCurrentRoute(hash.split('?')[0]);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Cart Calculations
  const cartTotal = cart.reduce((sum, item) => sum + item.foodItem.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Add Notification
  const addNotification = useCallback((
    title: string,
    message: string,
    type: 'order' | 'wallet' | 'system',
    orderId?: string
  ) => {
    if (!currentUser) return;
    const newNotif: Notification = {
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userId: currentUser.id,
      title,
      message,
      read: false,
      createdAt: new Date().toISOString(),
      type,
      orderId,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  }, [currentUser]);

  // Login
  const login = useCallback((emailOrId: string, password: string) => {
    const cleaned = emailOrId.trim().toLowerCase();
    const user = users.find(
      (u) =>
        (u.email.toLowerCase() === cleaned || (u.studentId && u.studentId.toLowerCase() === cleaned))
    );

    if (!user) {
      return { success: false, error: 'No account found with this Bahria University Email or Student ID.' };
    }

    // Passwords for demo: student123, staff123, manager123, admin123
    const expectedPw = `${user.role}123`;
    if (password !== expectedPw && password !== 'password123' && password !== 'student123') {
      return { success: false, error: 'Incorrect password. For demo, use: ' + expectedPw };
    }

    setCurrentUser(user);
    // Redirect based on role as required
    switch (user.role) {
      case 'student':
        navigateTo('/student/dashboard');
        break;
      case 'staff':
        navigateTo('/staff/dashboard');
        break;
      case 'manager':
        navigateTo('/manager/dashboard');
        break;
      case 'admin':
        navigateTo('/admin/dashboard');
        break;
      default:
        navigateTo('/');
    }

    return { success: true, role: user.role };
  }, [users, navigateTo]);

  // Quick switch for demo testing
  const quickLoginAs = useCallback((role: UserRole) => {
    const user = users.find((u) => u.role === role);
    if (user) {
      setCurrentUser(user);
      switch (role) {
        case 'student':
          navigateTo('/student/dashboard');
          break;
        case 'staff':
          navigateTo('/staff/dashboard');
          break;
        case 'manager':
          navigateTo('/manager/dashboard');
          break;
        case 'admin':
          navigateTo('/admin/dashboard');
          break;
      }
    }
  }, [users, navigateTo]);

  // Register
  const register = useCallback((data: {
    fullName: string;
    studentId: string;
    email: string;
    phone: string;
    password: string;
  }) => {
    // Validation
    if (!data.fullName.trim()) return { success: false, error: 'Full name is required.' };
    if (!data.studentId.trim()) return { success: false, error: 'Student ID is required.' };
    if (!data.email.trim()) return { success: false, error: 'University email is required.' };
    if (!data.email.toLowerCase().includes('@')) return { success: false, error: 'Please enter a valid email address.' };
    if (!data.email.toLowerCase().endsWith('bahria.edu.pk')) {
      return { success: false, error: 'Please use your official Bahria University email (ending in @bahria.edu.pk).' };
    }
    if (!data.phone.trim()) return { success: false, error: 'Phone number is required.' };
    if (data.password.length < 6) return { success: false, error: 'Password must be at least 6 characters.' };

    const existing = users.find(
      (u) => u.email.toLowerCase() === data.email.toLowerCase() || (u.studentId && u.studentId === data.studentId)
    );
    if (existing) {
      return { success: false, error: 'An account with this email or student ID already exists.' };
    }

    const newUser: User = {
      id: `user-student-${Date.now()}`,
      name: data.fullName.trim(),
      email: data.email.trim(),
      studentId: data.studentId.trim(),
      phone: data.phone.trim(),
      role: 'student',
      walletBalance: 1000, // Initial bonus welcome balance for testing!
    };

    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    navigateTo('/student/dashboard');

    return { success: true };
  }, [users, navigateTo]);

  // Logout
  const logout = useCallback(() => {
    setCurrentUser(null);
    localStorage.removeItem('bu_current_user');
    navigateTo('/login');
  }, [navigateTo]);

  // Update System Settings
  const updateSystemSettings = useCallback((newSettings: Partial<SystemSettings>) => {
    setSystemSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  // Update User Role (Admin feature)
  const updateUserRole = useCallback((userId: string, newRole: UserRole) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
    if (currentUser && currentUser.id === userId) {
      setCurrentUser((prev) => (prev ? { ...prev, role: newRole } : null));
    }
  }, [currentUser]);

  // Wallet Simulation top-up
  const addFundsToWallet = useCallback((amount: number) => {
    if (!currentUser) return;
    const newBal = (currentUser.walletBalance || 0) + amount;
    const updated = { ...currentUser, walletBalance: newBal };
    setCurrentUser(updated);
    setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updated : u)));
    addNotification(
      'Wallet Top-Up Successful',
      `Rs. ${amount.toLocaleString()} has been added to your University Wallet. New Balance: Rs. ${newBal.toLocaleString()}.`,
      'wallet'
    );
  }, [currentUser, addNotification]);

  // Cart operations
  const addToCart = useCallback((food: FoodItem, quantity: number = 1): { success: boolean; message?: string } => {
    // Check if food is SOLD OUT
    if (food.availability === 'SOLD OUT' || food.stock <= 0) {
      return { success: false, message: `${food.name} is currently sold out and cannot be added.` };
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.foodItem.id === food.id);
      if (existing) {
        const newQty = existing.quantity + quantity;
        if (newQty > food.stock) {
          return prev; // cannot exceed stock
        }
        return prev.map((item) =>
          item.foodItem.id === food.id ? { ...item, quantity: newQty } : item
        );
      } else {
        return [...prev, { foodItem: food, quantity: Math.min(quantity, food.stock) }];
      }
    });

    return { success: true, message: `${food.name} added to your tray!` };
  }, []);

  const updateCartQuantity = useCallback((foodId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.foodItem.id === foodId) {
            const updated = item.quantity + delta;
            if (updated <= 0) return null;
            if (updated > item.foodItem.stock) return item; // stock limit
            return { ...item, quantity: updated };
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  }, []);

  const removeFromCart = useCallback((foodId: string) => {
    setCart((prev) => prev.filter((item) => item.foodItem.id !== foodId));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  // Menu Management
  const addFoodItem = useCallback((item: Omit<FoodItem, 'id'>) => {
    const newItem: FoodItem = {
      ...item,
      id: `food-${Date.now()}`,
    };
    setFoodItems((prev) => [newItem, ...prev]);
  }, []);

  const updateFoodItem = useCallback((id: string, updates: Partial<FoodItem>) => {
    setFoodItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = { ...item, ...updates };
          // auto update availability based on stock if stock changed
          if (updates.stock !== undefined) {
            if (updates.stock <= 0) {
              updated.availability = 'SOLD OUT';
            } else if (updates.stock <= 5 && updated.availability !== 'SOLD OUT') {
              updated.availability = 'LOW STOCK';
            } else if (updated.availability === 'SOLD OUT' && updates.stock > 0) {
              updated.availability = 'AVAILABLE';
            }
          }
          return updated;
        }
        return item;
      })
    );

    // Also update any item currently in cart
    setCart((prev) =>
      prev
        .map((cartItem) => {
          if (cartItem.foodItem.id === id) {
            const updatedFood = { ...cartItem.foodItem, ...updates };
            if (updatedFood.availability === 'SOLD OUT') {
              return null; // remove sold out from cart
            }
            return { ...cartItem, foodItem: updatedFood };
          }
          return cartItem;
        })
        .filter(Boolean) as CartItem[]
    );
  }, []);

  const deleteFoodItem = useCallback((id: string) => {
    setFoodItems((prev) => prev.filter((item) => item.id !== id));
    setCart((prev) => prev.filter((item) => item.foodItem.id !== id));
  }, []);

  const toggleItemSoldOut = useCallback((id: string, isSoldOut: boolean) => {
    updateFoodItem(id, {
      availability: isSoldOut ? 'SOLD OUT' : 'AVAILABLE',
      stock: isSoldOut ? 0 : 20,
    });
  }, [updateFoodItem]);

  const updateFoodItemImage = useCallback((id: string, newImageUrl: string) => {
    updateFoodItem(id, { image: newImageUrl });
  }, [updateFoodItem]);

  const resetMenuImagesToDefault = useCallback(() => {
    setFoodItems((prev) => {
      const updated = prev.map((item) => {
        const matchingInit = INITIAL_FOOD_ITEMS.find((init) => init.id === item.id);
        if (matchingInit) {
          return { ...item, image: matchingInit.image };
        }
        return item;
      });
      localStorage.setItem('bu_food_items_v3', JSON.stringify(updated));
      localStorage.setItem('bu_food_items', JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Pickup Slots
  const updateSlotCapacity = useCallback((slotId: string, newCapacity: number) => {
    setPickupSlots((prev) =>
      prev.map((slot) => (slot.id === slotId ? { ...slot, maxCapacity: newCapacity } : slot))
    );
  }, []);

  const toggleSlotClosed = useCallback((slotId: string) => {
    setPickupSlots((prev) =>
      prev.map((slot) => (slot.id === slotId ? { ...slot, isClosed: !slot.isClosed } : slot))
    );
  }, []);

  const getNearestAvailableSlot = useCallback((preferredSlotId?: string): PickupSlot | null => {
    // Find slots that are neither closed nor full
    const available = pickupSlots.filter(
      (s) => !s.isClosed && s.currentOrders < s.maxCapacity
    );
    if (available.length === 0) return null;

    if (!preferredSlotId) return available[0];

    // Find nearest slot by index
    const currentIndex = pickupSlots.findIndex((s) => s.id === preferredSlotId);
    if (currentIndex === -1) return available[0];

    // search after then before
    for (let i = currentIndex + 1; i < pickupSlots.length; i++) {
      if (!pickupSlots[i].isClosed && pickupSlots[i].currentOrders < pickupSlots[i].maxCapacity) {
        return pickupSlots[i];
      }
    }
    for (let i = currentIndex - 1; i >= 0; i--) {
      if (!pickupSlots[i].isClosed && pickupSlots[i].currentOrders < pickupSlots[i].maxCapacity) {
        return pickupSlots[i];
      }
    }

    return available[0];
  }, [pickupSlots]);

  // Order Placement
  const placeOrder = useCallback(
    async (orderInput: {
      pickupSlotId: string;
      paymentMethod: PaymentMethod;
      notes?: string;
    }): Promise<{ success: boolean; orderId?: string; error?: string }> => {
      if (!currentUser) {
        return { success: false, error: 'Please log in as a student to place an order.' };
      }
      if (cart.length === 0) {
        return { success: false, error: 'Your cart is empty. Please add food before placing an order.' };
      }

      // Check slot capacity
      const slot = pickupSlots.find((s) => s.id === orderInput.pickupSlotId);
      if (!slot || slot.isClosed || slot.currentOrders >= slot.maxCapacity) {
        const nearest = getNearestAvailableSlot(orderInput.pickupSlotId);
        const nearestMsg = nearest ? `Nearest available slot: ${nearest.timeWindow}.` : 'No pickup slots available.';
        return {
          success: false,
          error: `This pickup slot is full. Please select another available time. ${nearestMsg}`,
        };
      }

      // Check stock for all items
      for (const cartItem of cart) {
        const currentItem = foodItems.find((f) => f.id === cartItem.foodItem.id);
        if (!currentItem || currentItem.availability === 'SOLD OUT' || currentItem.stock < cartItem.quantity) {
          return {
            success: false,
            error: `Sorry, ${cartItem.foodItem.name} has insufficient stock or is sold out. Please adjust your tray.`,
          };
        }
      }

      const totalAmount = cartTotal;

      // Check wallet balance if payment is wallet
      if (orderInput.paymentMethod === 'UNIVERSITY WALLET') {
        if (currentUser.walletBalance < totalAmount) {
          return {
            success: false,
            error: `Insufficient wallet balance. You have Rs. ${currentUser.walletBalance.toLocaleString()}, but order requires Rs. ${totalAmount.toLocaleString()}. You can pay with Cash at Cafeteria or top up your wallet.`,
          };
        }
      }

      // Simulate a realistic processing delay (to allow duplicate prevention verification)
      await new Promise((resolve) => setTimeout(resolve, 600));

      // Generate unique Order ID e.g. BU-1025
      const randomIdNum = 1024 + orders.length + Math.floor(Math.random() * 5);
      const orderId = `BU-${randomIdNum}`;
      const tokenNumber = randomIdNum % 100;

      // Handle payment deduction if wallet
      let paymentStatus: Order['paymentStatus'] = 'UNPAID / PAY AT CAFETERIA';
      if (orderInput.paymentMethod === 'UNIVERSITY WALLET') {
        const remainingBalance = currentUser.walletBalance - totalAmount;
        const updatedUser = { ...currentUser, walletBalance: remainingBalance };
        setCurrentUser(updatedUser);
        setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updatedUser : u)));
        paymentStatus = 'PAID';
      }

      // Decrease stock for each item
      setFoodItems((prev) =>
        prev.map((item) => {
          const bought = cart.find((c) => c.foodItem.id === item.id);
          if (bought) {
            const newStock = Math.max(0, item.stock - bought.quantity);
            const newAvailability = newStock === 0 ? 'SOLD OUT' : newStock <= 5 ? 'LOW STOCK' : 'AVAILABLE';
            return {
              ...item,
              stock: newStock,
              availability: newAvailability,
            };
          }
          return item;
        })
      );

      // Increase slot count
      setPickupSlots((prev) =>
        prev.map((s) =>
          s.id === orderInput.pickupSlotId
            ? { ...s, currentOrders: s.currentOrders + 1 }
            : s
        )
      );

      const newOrder: Order = {
        id: orderId,
        tokenNumber,
        studentId: currentUser.studentId || currentUser.id,
        studentName: currentUser.name,
        studentEmail: currentUser.email,
        studentPhone: currentUser.phone,
        items: cart.map((c) => ({
          foodId: c.foodItem.id,
          name: c.foodItem.name,
          price: c.foodItem.price,
          quantity: c.quantity,
          image: c.foodItem.image,
          category: c.foodItem.category,
        })),
        subtotal: totalAmount,
        total: totalAmount,
        pickupSlotId: slot.id,
        pickupSlotTime: slot.timeWindow,
        paymentMethod: orderInput.paymentMethod,
        paymentStatus,
        status: 'ORDER RECEIVED',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        notes: orderInput.notes,
      };

      setOrders((prev) => [newOrder, ...prev]);
      clearCart();

      // Send notifications
      addNotification(
        `Order Confirmed (${orderId})`,
        `Your pre-order ${orderId} has been placed for pickup at ${slot.timeWindow}. Token #${tokenNumber}.`,
        'order',
        orderId
      );

      if (orderInput.paymentMethod === 'UNIVERSITY WALLET') {
        addNotification(
          'Wallet Payment Successful',
          `Rs. ${totalAmount.toLocaleString()} deducted for order ${orderId}. Remaining balance: Rs. ${(currentUser.walletBalance - totalAmount).toLocaleString()}.`,
          'wallet',
          orderId
        );
      }

      return { success: true, orderId };
    },
    [currentUser, cart, pickupSlots, foodItems, cartTotal, orders.length, getNearestAvailableSlot, clearCart, addNotification]
  );

  // Update order status (Staff / Manager / Admin)
  const updateOrderStatus = useCallback((orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const updated = {
            ...ord,
            status: newStatus,
            updatedAt: new Date().toISOString(),
            ...(newStatus === 'COMPLETED' ? { completedAt: new Date().toISOString() } : {}),
          };
          return updated;
        }
        return ord;
      })
    );

    // Notify student about the status update
    const targetOrder = orders.find((o) => o.id === orderId);
    if (targetOrder) {
      let msg = '';
      if (newStatus === 'PREPARING') {
        msg = `Your order ${orderId} is now being prepared in the kitchen.`;
      } else if (newStatus === 'READY FOR PICKUP') {
        msg = `Your order ${orderId} is READY FOR PICKUP at Counter #1! Show token #${targetOrder.tokenNumber}.`;
      } else if (newStatus === 'COMPLETED') {
        msg = `Your order ${orderId} has been collected. Enjoy your meal!`;
      }
      if (msg) {
        addNotification(`Order Status: ${newStatus}`, msg, 'order', orderId);
      }
    }
  }, [orders, addNotification]);

  // Cancel order
  const cancelOrder = useCallback((orderId: string, reason?: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            status: 'CANCELLED',
            cancelledReason: reason || 'Cancelled by cafeteria staff',
            updatedAt: new Date().toISOString(),
          };
        }
        return ord;
      })
    );

    // If order was paid by wallet, refund student!
    const targetOrder = orders.find((o) => o.id === orderId);
    if (targetOrder && targetOrder.paymentStatus === 'PAID') {
      setUsers((prev) =>
        prev.map((u) => {
          if (u.email === targetOrder.studentEmail || (u.studentId && u.studentId === targetOrder.studentId)) {
            return { ...u, walletBalance: u.walletBalance + targetOrder.total };
          }
          return u;
        })
      );
      if (currentUser && (currentUser.email === targetOrder.studentEmail || currentUser.studentId === targetOrder.studentId)) {
        setCurrentUser((prev) => prev ? { ...prev, walletBalance: prev.walletBalance + targetOrder.total } : null);
      }
      addNotification(
        `Order ${orderId} Cancelled & Refunded`,
        `Your order ${orderId} was cancelled. Rs. ${targetOrder.total.toLocaleString()} has been refunded to your wallet.`,
        'wallet',
        orderId
      );
    } else {
      addNotification(
        `Order ${orderId} Cancelled`,
        `Your order ${orderId} has been cancelled. Reason: ${reason || 'Cafeteria update'}`,
        'order',
        orderId
      );
    }
  }, [orders, currentUser, addNotification]);

  // Notification helpers
  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  const markNotificationAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const activeOrder = routeParams.orderId
    ? orders.find((o) => o.id === routeParams.orderId) || orders[0] || null
    : orders[0] || null;

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentRoute,
        routeParams,
        navigateTo,
        login,
        quickLoginAs,
        register,
        logout,
        addFundsToWallet,
        isWalletModalOpen,
        setIsWalletModalOpen,
        users,
        updateUserRole,
        systemSettings,
        updateSystemSettings,
        foodItems,
        addFoodItem,
        updateFoodItem,
        updateFoodItemImage,
        resetMenuImagesToDefault,
        deleteFoodItem,
        toggleItemSoldOut,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartTotal,
        cartCount,
        pickupSlots,
        updateSlotCapacity,
        toggleSlotClosed,
        togglePickupSlotClosed: toggleSlotClosed,
        getNearestAvailableSlot,
        orders,
        activeOrder,
        placeOrder,
        updateOrderStatus,
        cancelOrder,
        notifications,
        unreadNotificationCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        addNotification,
        selectedFoodForModal,
        setSelectedFoodForModal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

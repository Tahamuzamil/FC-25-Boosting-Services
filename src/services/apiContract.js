/**
 * ASP.NET Core Web API Client & SQL Server Integration
 * Dual-Mode: Communicates with live ASP.NET Core backend (port 5268)
 * and provides robust local-state fallback for offline / static Vercel environments.
 */

import { SAMPLE_ORDERS } from '../data/mockData';

const BASE_API_URL = ''; // Relative URL handled by Vite proxy to localhost:5268

export const API_ENDPOINTS = {
  // Orders
  CREATE_ORDER: '/api/orders',
  TRACK_ORDER: (ref) => `/api/orders/track/${encodeURIComponent(ref)}`,
  USER_ORDERS: (userId) => `/api/orders/user/${encodeURIComponent(userId)}`,
  ORDER_MESSAGES: (orderId) => `/api/orders/${encodeURIComponent(orderId)}/messages`,

  // Admin
  ADMIN_ORDERS: '/api/admin/orders',
  ADMIN_ANALYTICS: '/api/admin/analytics',
  ADMIN_ASSIGN_BOOSTER: (orderId) => `/api/admin/orders/${encodeURIComponent(orderId)}/assign`,
  ADMIN_APPROVE_ORDER: (orderId) => `/api/admin/orders/${encodeURIComponent(orderId)}/approve`,
  ADMIN_UPDATE_STATUS: (orderId) => `/api/admin/orders/${encodeURIComponent(orderId)}/status`,
  ADMIN_ORDER_AUDIT: (orderId) => `/api/admin/orders/${encodeURIComponent(orderId)}/audit`,
  ADMIN_BOOSTERS: '/api/admin/boosters',

  // Player / Pro Booster
  PLAYER_AVAILABLE_ORDERS: '/api/player/available-orders',
  PLAYER_MY_ORDERS: (playerId) => `/api/player/my-orders/${encodeURIComponent(playerId)}`,
  PLAYER_CLAIM: '/api/player/claim',
  PLAYER_UPDATE_PROGRESS: '/api/player/update-progress',
  PLAYER_COMPLETE: '/api/player/complete',
  PLAYER_EARNINGS: (playerId) => `/api/player/earnings/${encodeURIComponent(playerId)}`,
};

export const apiClient = {
  /**
   * Track order by reference code or Order ID
   */
  async trackOrder(orderId) {
    if (!orderId) return null;
    const cleanId = orderId.trim();

    try {
      const response = await fetch(API_ENDPOINTS.TRACK_ORDER(cleanId));
      if (response.ok) {
        const live = await response.json();
        return {
          id: live.orderNumber,
          serviceName: live.serviceName,
          platform: live.platform,
          status: live.status,
          price: live.price,
          contactMethod: live.contactMethod,
          paymentStatus: live.paymentStatus,
          currentScore: live.currentScore || 'Booster in queue',
          progress: live.progressPercentage ?? 0,
          boosterName: live.boosterNickname || (live.boosterAssigned ? 'Assigned Pro' : 'Awaiting Assignment'),
          boosterVpn: live.boosterVpnLocation || 'Residential VPN (Protected)',
          orderDate: live.createdAt?.substring(0, 10) || new Date().toISOString().substring(0, 10),
          completedAt: live.completedAt,
          matchLogs: live.matchLogs || [],
          proofs: live.proofs || [],
          history: (live.statusHistory || []).map((h) => ({
            status: h.status,
            date: h.date?.substring(0, 16).replace('T', ' '),
            notes: h.note,
          })),
        };
      }
    } catch {
      // Backend unreachable; gracefully fallback to local cache
    }

    // LocalStorage / mock fallback
    const localOrders = JSON.parse(localStorage.getItem('fc_orders') || '[]');
    const found = localOrders.find(
      (o) => (o.id || o.orderNumber || '').toLowerCase() === cleanId.toLowerCase()
    );
    if (found) return found;

    return SAMPLE_ORDERS.find(
      (o) => (o.id || o.orderNumber || '').toLowerCase() === cleanId.toLowerCase()
    ) || null;
  },

  /**
   * Create an order in SQL Server database via C# API
   */
  async createOrder(orderPayload) {
    const orderRef = orderPayload.id || `FC-ORD-${Math.floor(10000 + Math.random() * 90000)}`;

    const dto = {
      orderNumber: orderRef,
      userId: orderPayload.userId || 'guest',
      customerName: orderPayload.customerName || 'Valued Customer',
      customerEmail: orderPayload.customerEmail || 'customer@fcboosting.com',
      gamerTag: orderPayload.gamerTag || 'Pending Tag',
      serviceId: orderPayload.serviceId || 'fc-custom-service',
      serviceName: orderPayload.serviceName || 'FC 25 Boosting Package',
      platform: (orderPayload.platform || 'PS5').toUpperCase(),
      contactMethod: orderPayload.contactMethod || 'WhatsApp',
      paymentMethod: orderPayload.paymentMethod || 'Card',
      price: Number(orderPayload.price) || 49.99,
      credentials: orderPayload.loginMethod ? `${orderPayload.loginMethod} credentials verified` : 'Secured via SSL',
      requirements: {
        Details: orderPayload.details || 'Standard High-Priority Fulfillment',
      },
    };

    let serverSuccess = false;
    try {
      const response = await fetch(API_ENDPOINTS.CREATE_ORDER, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto),
      });

      if (response.ok) {
        serverSuccess = true;
      }
    } catch {
      // Offline or proxy not running; fallback to client state
    }

    // Create client representation
    const fullOrder = {
      id: orderRef,
      orderNumber: orderRef,
      ...orderPayload,
      price: Number(orderPayload.price),
      status: 'Pending',
      progress: 0,
      currentScore: 'Awaiting Booster Assignment',
      boosterName: 'Pro Kaiser (Top 100 Global)',
      boosterVpn: 'Matching Residential Regional Subnet',
      orderDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
      persistedToDb: serverSuccess,
      history: [
        {
          status: 'Pending',
          date: new Date().toISOString().replace('T', ' ').substring(0, 16),
          notes: `Order created via ${dto.contactMethod}.`,
        },
      ],
    };

    const existingOrders = JSON.parse(localStorage.getItem('fc_orders') || '[]');
    const updated = [fullOrder, ...existingOrders];
    localStorage.setItem('fc_orders', JSON.stringify(updated));

    return fullOrder;
  },

  /**
   * Fetch all orders for Admin Portal
   */
  async fetchAdminOrders(status = 'All', contactMethod = 'All', search = '') {
    try {
      const params = new URLSearchParams();
      if (status && status !== 'All') params.append('status', status);
      if (contactMethod && contactMethod !== 'All') params.append('contactMethod', contactMethod);
      if (search) params.append('search', search);

      const res = await fetch(`${API_ENDPOINTS.ADMIN_ORDERS}?${params.toString()}`);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    return null;
  },

  /**
   * Fetch Admin Analytics summary KPIs & audit events
   */
  async fetchAdminAnalytics() {
    try {
      const res = await fetch(API_ENDPOINTS.ADMIN_ANALYTICS);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }
    return null;
  },

  /**
   * Admin assigns booster to an order
   */
  async adminAssignBooster(orderId, playerId, notes = '') {
    try {
      const res = await fetch(API_ENDPOINTS.ADMIN_ASSIGN_BOOSTER(orderId), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId, notes }),
      });
      return await res.json();
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  /**
   * Admin approves completed order & verifies proof
   */
  async adminApproveOrder(orderId, remarks = 'Approved by Admin') {
    try {
      const res = await fetch(API_ENDPOINTS.ADMIN_APPROVE_ORDER(orderId), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ remarks }),
      });
      return await res.json();
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  /**
   * Admin updates status
   */
  async adminUpdateStatus(orderId, newStatus, notes = '') {
    try {
      const res = await fetch(API_ENDPOINTS.ADMIN_UPDATE_STATUS(orderId), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newStatus, notes }),
      });
      return await res.json();
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  /**
   * Fetch order audit trail
   */
  async fetchOrderAudit(orderId) {
    try {
      const res = await fetch(API_ENDPOINTS.ADMIN_ORDER_AUDIT(orderId));
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    return [];
  },

  /**
   * Fetch available orders for pro boosters
   */
  async fetchAvailableOrders() {
    try {
      const res = await fetch(API_ENDPOINTS.PLAYER_AVAILABLE_ORDERS);
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    return [];
  },

  /**
   * Pro booster claims an order
   */
  async boosterClaimOrder(orderId, playerId, vpnLocation) {
    try {
      const res = await fetch(API_ENDPOINTS.PLAYER_CLAIM, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, playerId, vpnLocation }),
      });
      return await res.json();
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  /**
   * Booster logs match progress
   */
  async boosterUpdateProgress(payload) {
    try {
      const res = await fetch(API_ENDPOINTS.PLAYER_UPDATE_PROGRESS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      return await res.json();
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  /**
   * Booster completes order with proof
   */
  async boosterCompleteOrder(payload) {
    try {
      const res = await fetch(API_ENDPOINTS.PLAYER_COMPLETE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      return await res.json();
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  /**
   * Fetch Booster earnings
   */
  async fetchBoosterEarnings(playerId) {
    try {
      const res = await fetch(API_ENDPOINTS.PLAYER_EARNINGS(playerId));
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    return null;
  },

  /**
   * Fetch list of boosters
   */
  async fetchBoosters() {
    try {
      const res = await fetch(API_ENDPOINTS.ADMIN_BOOSTERS);
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    return [];
  },
};

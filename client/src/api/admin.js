import { apiFetch } from './client.js';

// Products
export const fetchProducts = async (params = {}) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      searchParams.append(key, value);
    }
  });
  const query = searchParams.toString();
  return apiFetch(`/admin/products${query ? `?${query}` : ''}`);
};

export const createProduct = async (payload) =>
  apiFetch('/admin/products', { method: 'POST', body: payload });

export const getProduct = async (id) => apiFetch(`/admin/products/${id}`);

export const updateProduct = async (id, payload) =>
  apiFetch(`/admin/products/${id}`, { method: 'PUT', body: payload });

export const patchProduct = async (id, payload) =>
  apiFetch(`/admin/products/${id}`, { method: 'PATCH', body: payload });

export const deleteProduct = async (id) => apiFetch(`/admin/products/${id}`, { method: 'DELETE' });

// Orders
export const fetchOrders = async (params = {}) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) searchParams.append(key, value);
  });
  const query = searchParams.toString();
  return apiFetch(`/admin/orders${query ? `?${query}` : ''}`);
};

export const getOrder = async (id) => apiFetch(`/admin/orders/${id}`);

export const updateOrderStatus = async (id, orderStatus) =>
  apiFetch(`/admin/orders/${id}`, { method: 'PATCH', body: { orderStatus } });

// Analytics
export const fetchSummary = async () => apiFetch('/admin/analytics/summary');
export const fetchSalesByDay = async (days = 7) => apiFetch(`/admin/analytics/sales-by-day?days=${days}`);
export const fetchTopProducts = async (limit = 5) => apiFetch(`/admin/analytics/top-products?limit=${limit}`);

import { Category, FoodItem, ActiveOrder, Combo } from '../types';

// const API_BASE_URL = 'https://api.backend.mudcup.sasalemsuperservice.com/api';
const API_BASE_URL = 'https://subdued-periscope-canopy.ngrok-free.dev/api';

const getHeaders = (isFormData = false) => {
  const headers: Record<string, string> = {};
  
  if (API_BASE_URL.includes('ngrok')) {
    headers['ngrok-skip-browser-warning'] = 'true';
  }

  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  const match = document.cookie.match(new RegExp('(^| )Device-Fingerprint=([^;]+)'));
  if (match) {
    headers['X-Device-Fingerprint'] = match[2];
  }
  return headers;
};

export const fetchCategories = async (): Promise<Category[]> => {
  const response = await fetch(`${API_BASE_URL}/categories/`, { headers: getHeaders() });
  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }
  return response.json();
};

export const fetchFoodItems = async (): Promise<FoodItem[]> => {
  const response = await fetch(`${API_BASE_URL}/food-items/`, { headers: getHeaders() });
  if (!response.ok) {
    throw new Error('Failed to fetch food items');
  }
  return response.json();
};

export const fetchCombos = async (): Promise<Combo[]> => {
  const response = await fetch(`${API_BASE_URL}/combos/`, { headers: getHeaders() });
  if (!response.ok) {
    throw new Error('Failed to fetch combos');
  }
  return response.json();
};

export const createOrder = async (orderData: Partial<ActiveOrder>): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/orders/`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(orderData),
  });
  if (!response.ok) {
    throw new Error('Failed to create order');
  }
  return response.json();
};

export const fetchActiveOrders = async (): Promise<ActiveOrder[]> => {
  const response = await fetch(`${API_BASE_URL}/orders/active/`, { headers: getHeaders() });
  if (!response.ok) {
    throw new Error('Failed to fetch active orders');
  }
  const data = await response.json();
  return data.map((order: any) => ({
    ...order,
    placedAt: new Date(order.placedAt),
  }));
};

export const fetchMyOrders = async (): Promise<ActiveOrder[]> => {
  const response = await fetch(`${API_BASE_URL}/orders/my-orders/`, { headers: getHeaders() });
  if (!response.ok) {
    throw new Error('Failed to fetch my orders');
  }
  const data = await response.json();
  return data.map((order: any) => ({
    ...order,
    placedAt: new Date(order.placedAt),
  }));
};

export const markOrderPaid = async (orderId: string): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/orders/${orderId}/paid/`, {
    method: 'PATCH',
    headers: getHeaders(),
  });
  if (!response.ok) {
    throw new Error('Failed to mark order as paid');
  }
  return response.json();
};

export const createCategory = async (formData: FormData): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/categories/`, {
    method: 'POST',
    headers: getHeaders(true),
    body: formData,
  });
  if (!response.ok) throw new Error('Failed to create category');
  return response.json();
};

export const deleteCategory = async (categoryId: string): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/categories/${categoryId}/`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error('Failed to delete category');
  return response;
};

export const fetchCategoryFoodItems = async (categoryId: string): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/categories/${categoryId}/food-items/`, { headers: getHeaders() });
  if (!response.ok) throw new Error('Failed to fetch category food items');
  return response.json();
};

export const createFoodItem = async (formData: FormData): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/food-items/`, {
    method: 'POST',
    headers: getHeaders(true),
    body: formData,
  });
  if (!response.ok) throw new Error('Failed to create food item');
  return response.json();
};

export const deleteFoodItem = async (itemId: string): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/food-items/${itemId}/`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error('Failed to delete food item');
  return response;
};

export const createCombo = async (formData: FormData): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/combos/`, {
    method: 'POST',
    headers: getHeaders(true),
    body: formData,
  });
  if (!response.ok) throw new Error('Failed to create combo');
  return response.json();
};

export const deleteCombo = async (comboId: string): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/combos/${comboId}/`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error('Failed to delete combo');
  return response;
};

export const fetchMetrics = async (): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/metrics/`, { headers: getHeaders() });
  if (!response.ok) throw new Error('Failed to fetch metrics');
  return response.json();
};

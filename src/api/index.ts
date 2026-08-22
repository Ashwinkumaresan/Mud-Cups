import { Category, FoodItem, ActiveOrder, Combo, Banner } from '../types';
import { getCookie } from '../utils/cookies';
// const API_BASE_URL = `http://${window.location.hostname}:8000/api`;
const API_BASE_URL = 'https://api.backend.mudcup.sasalemsuperservice.com/api';

const apiFetch = async (url: string, options: RequestInit = {}) => {
  return fetch(url, {
    ...options,
    credentials: 'include',
  });
};

const getHeaders = (isFormData = false) => {
  const headers: Record<string, string> = {};
  
  if (API_BASE_URL.includes('ngrok')) {
    headers['ngrok-skip-browser-warning'] = 'true';
  }

  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  
  const token = getCookie('mudcups_token');
  if (token) {
    headers['Authorization'] = `Token ${token}`;
  }
  
  return headers;
};

export const fetchBanners = async (): Promise<Banner[]> => {
  const response = await apiFetch(`${API_BASE_URL}/food/banners/`, { headers: getHeaders() });
  if (!response.ok) {
    throw new Error('Failed to fetch banners');
  }
  const data = await response.json();
  return data.results || data;
};

export const fetchCategories = async (): Promise<Category[]> => {
  const response = await apiFetch(`${API_BASE_URL}/food/categories/`, { headers: getHeaders() });
  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }
  const data = await response.json();
  const results = data.results || data;
  return results.map((item: any) => ({
    ...item,
    id: item.id ? item.id.toString() : '',
    image: item.image_url || item.image || '',
    itemCount: typeof item.food_count === 'number' ? item.food_count : (item.itemCount || 0),
  }));
};

export const fetchFoodItems = async (): Promise<FoodItem[]> => {
  const response = await apiFetch(`${API_BASE_URL}/food/foods/`, { headers: getHeaders() });
  if (!response.ok) {
    throw new Error('Failed to fetch food items');
  }
  const data = await response.json();
  const results = data.results || data;
  return results.map((item: any) => ({
    ...item,
    price: (item.discount_price && Number(item.discount_price) > 0) ? Number(item.discount_price) : Number(item.price),
    originalPrice: (item.discount_price && Number(item.discount_price) > 0) ? Number(item.price) : undefined,
    image: item.image_url || item.image,
  }));
};

export const fetchOffers = async (): Promise<FoodItem[]> => {
  const response = await apiFetch(`${API_BASE_URL}/food/foods/offers/`, { headers: getHeaders() });
  if (!response.ok) {
    throw new Error('Failed to fetch offers');
  }
  const data = await response.json();
  const results = data.results || data;
  return results.map((item: any) => ({
    ...item,
    price: item.discount_price ? Number(item.discount_price) : Number(item.price),
    originalPrice: item.discount_price ? Number(item.price) : undefined,
    image: item.image_url || item.image,
    category: 'Offers'
  }));
};

export const fetchCombos = async (): Promise<Combo[]> => {
  const response = await apiFetch(`${API_BASE_URL}/food/combos/`, { headers: getHeaders() });
  if (!response.ok) {
    throw new Error('Failed to fetch combos');
  }
  const data = await response.json();
  const results = data.results || data;
  return results.map((item: any) => ({
    ...item,
    price: item.combo_reduced_price ? Number(item.combo_reduced_price) : 0,
    originalPrice: item.original_total ? Number(item.original_total) : undefined,
    image: item.image_url,
    category: 'Combos'
  }));
};

export const fetchComboDetail = async (id: string | number): Promise<any> => {
  const response = await apiFetch(`${API_BASE_URL}/food/combos/${id}/`, { headers: getHeaders() });
  if (!response.ok) {
    throw new Error('Failed to fetch combo detail');
  }
  const data = await response.json();
  return {
    ...data,
    price: data.combo_reduced_price ? Number(data.combo_reduced_price) : 0,
    originalPrice: data.original_total ? Number(data.original_total) : undefined,
    image: data.image_url,
    category: 'Combos'
  };
};

export const createOrder = async (orderData: Partial<ActiveOrder>): Promise<any> => {
  const response = await apiFetch(`${API_BASE_URL}/food/orders/`, {
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
  const response = await apiFetch(`${API_BASE_URL}/food/orders/active/`, { headers: getHeaders() });
  if (!response.ok) {
    throw new Error('Failed to fetch active orders');
  }
  const data = await response.json();
  return data.map((order: any) => ({
    ...order,
    totalAmount: parseFloat(order.totalAmount),
    finalAmount: parseFloat(order.finalAmount),
    placedAt: new Date(order.placedAt),
  }));
};

export const fetchMyOrders = async (): Promise<ActiveOrder[]> => {
  const response = await apiFetch(`${API_BASE_URL}/food/orders/my-orders/`, { headers: getHeaders() });
  if (!response.ok) {
    throw new Error('Failed to fetch my orders');
  }
  const data = await response.json();
  return data.map((order: any) => ({
    ...order,
    totalAmount: parseFloat(order.totalAmount),
    finalAmount: parseFloat(order.finalAmount),
    placedAt: new Date(order.placedAt),
  }));
};

export const markOrderPaid = async (orderId: string): Promise<any> => {
  const response = await apiFetch(`${API_BASE_URL}/food/orders/${orderId}/paid/`, {
    method: 'POST',
    headers: getHeaders(),
  });
  if (!response.ok) {
    throw new Error('Failed to mark order as paid');
  }
  return response.json();
};

export const createCategory = async (formData: FormData): Promise<any> => {
  const response = await apiFetch(`${API_BASE_URL}/food/categories/`, {
    method: 'POST',
    headers: getHeaders(true),
    body: formData,
  });
  if (!response.ok) throw new Error('Failed to create category');
  return response.json();
};

export const deleteCategory = async (categoryId: string): Promise<any> => {
  const response = await apiFetch(`${API_BASE_URL}/food/categories/${categoryId}/`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error('Failed to delete category');
  return response;
};

export const fetchCategoryFoodItems = async (categoryId: string): Promise<any> => {
  const response = await apiFetch(`${API_BASE_URL}/food/categories/${categoryId}/foods/`, { headers: getHeaders() });
  if (!response.ok) throw new Error('Failed to fetch category food items');
  const data = await response.json();
  const results = data.results || data;
  return results.map((item: any) => ({
    ...item,
    price: (item.discount_price && Number(item.discount_price) > 0) ? Number(item.discount_price) : Number(item.price),
    originalPrice: (item.discount_price && Number(item.discount_price) > 0) ? Number(item.price) : undefined,
    image: item.image_url || item.image,
  }));
};

export const createFoodItem = async (formData: FormData): Promise<any> => {
  const response = await apiFetch(`${API_BASE_URL}/food/foods/`, {
    method: 'POST',
    headers: getHeaders(true),
    body: formData,
  });
  if (!response.ok) {
    let errorMsg = 'Failed to create food item';
    try {
      const errData = await response.json();
      errorMsg = JSON.stringify(errData);
    } catch (e) {}
    throw new Error(errorMsg);
  }
  return response.json();
};

export const updateFoodItem = async (itemId: string, data: any): Promise<any> => {
  const isFormData = data instanceof FormData;
  const response = await apiFetch(`${API_BASE_URL}/food/foods/${itemId}/`, {
    method: 'PATCH',
    headers: getHeaders(isFormData),
    body: isFormData ? data : JSON.stringify(data),
  });
  if (!response.ok) {
    let errorMsg = 'Failed to update food item';
    try {
      const errData = await response.json();
      errorMsg = JSON.stringify(errData);
    } catch (e) {}
    throw new Error(errorMsg);
  }
  return response.json();
};

export const deleteFoodItem = async (itemId: string): Promise<any> => {
  const response = await apiFetch(`${API_BASE_URL}/food/foods/${itemId}/`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error('Failed to delete food item');
  return response;
};

export const createCombo = async (formData: FormData): Promise<any> => {
  const response = await apiFetch(`${API_BASE_URL}/food/combos/`, {
    method: 'POST',
    headers: getHeaders(true),
    body: formData,
  });
  if (!response.ok) {
    let errorMsg = 'Failed to create combo';
    try {
      const errData = await response.json();
      errorMsg = JSON.stringify(errData);
    } catch (e) {}
    throw new Error(errorMsg);
  }
  return response.json();
};

export const deleteCombo = async (comboId: string): Promise<any> => {
  const response = await apiFetch(`${API_BASE_URL}/food/combos/${comboId}/`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  if (!response.ok) {
    let errorMsg = 'Failed to delete combo';
    try {
      const errData = await response.json();
      errorMsg = JSON.stringify(errData);
    } catch (e) {}
    throw new Error(errorMsg);
  }
  return response;
};

export const fetchMetrics = async () => {
  const response = await apiFetch(`${API_BASE_URL}/metrics/`, { headers: getHeaders() });
  if (!response.ok) {
    throw new Error('Failed to fetch metrics');
  }
  return response.json();
};

// Auth
export const signupUser = async (data: any) => {
  const response = await apiFetch(`${API_BASE_URL}/auth/signup/`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to signup');
  }
  return response.json();
};

export const loginUser = async (data: any) => {
  const response = await apiFetch(`${API_BASE_URL}/user/login/`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to login');
  }
  return response.json();
};

export const fetchMe = async () => {
  const response = await apiFetch(`${API_BASE_URL}/user/me/`, { headers: getHeaders() });
  if (!response.ok) {
    throw new Error('Failed to fetch user');
  }
  return response.json();
};

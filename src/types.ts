export interface Banner {
  id: string | number;
  title: string;
  tag: string;
  image: string;
  image_url?: string;
  show: boolean;
}

export interface FoodItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  isVeg: boolean;
  image: string;
}

export interface HeroDeal {
  id: string;
  title: string;
  dealTag: string;
  price: number;
  originalPrice?: number;
  image: string;
  linkedItemId: string;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  itemCount: number;
}

export interface Combo {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  isVeg: boolean;
  image: string;
  items: { id: string; name: string }[];
}

export interface CartItem {
  item: FoodItem;
  quantity: number;
  totalPrice: number;
}

export interface FilterState {
  searchQuery: string;
  selectedCategory: string | null;
  vegOnly: boolean;
  sortBy: 'relevance' | 'priceLow' | 'priceHigh';
  priceRange: [number, number];
}

export interface UserAddress {
  id: string;
  type: 'Home' | 'Work' | 'Other';
  street: string;
  city: string;
  isDefault?: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  addresses: UserAddress[];
  favorites: string[];
}

export interface ActiveOrder {
  orderId: string;
  customerName: string;
  tableNumber: string;
  items: CartItem[];
  totalAmount: number;
  finalAmount: number;
  placedAt: Date;
}

export type ActiveTab = 'explore' | 'offers' | 'cuisines' | 'favorites';

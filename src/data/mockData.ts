import { Category, FoodItem, HeroDeal, UserProfile } from '../types';

export const CATEGORIES: Category[] = [
  { id: 'cat-0', name: 'Offers', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=100', itemCount: 3 },
  { id: 'cat-1', name: 'Roll', image: 'https://images.unsplash.com/photo-1549488344-c79ab6182103?w=100', itemCount: 10 },
  { id: 'cat-2', name: 'Bread Omelette', image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=100', itemCount: 10 },
  { id: 'cat-3', name: 'Snacks', image: 'https://images.unsplash.com/photo-1596560548464-f010549b84d7?w=100', itemCount: 10 },
  { id: 'cat-4', name: 'Juice', image: 'https://images.unsplash.com/photo-1600271886742-f049cd451b66?w=100', itemCount: 10 },
  { id: 'cat-5', name: 'Combos', image: 'https://images.unsplash.com/photo-1528736235302-52922df5c122?w=100', itemCount: 10 },
  { id: 'cat-6', name: 'Sandwiches', image: 'https://images.unsplash.com/photo-1528736235302-52922df5c122?w=100', itemCount: 10 },
  { id: 'cat-7', name: 'Fries Fashion', image: 'https://images.unsplash.com/photo-1576107229528-66258cc440a4?w=100', itemCount: 10 },
  { id: 'cat-8', name: 'Milk Shakes', image: 'https://images.unsplash.com/photo-1572490122747-3968b75bb8ef?w=100', itemCount: 10 },
];

export const FOOD_ITEMS: FoodItem[] = [
  // Offers
  { id: 'o1', name: 'Special Burger Offer', category: 'Offers', price: 99, originalPrice: 149, isVeg: false, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500' },
  { id: 'o2', name: 'Pizza Combo Deal', category: 'Offers', price: 199, originalPrice: 299, isVeg: true, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=500' },
  { id: 'o3', name: 'Family Snack Pack', category: 'Offers', price: 249, originalPrice: 350, isVeg: true, image: 'https://images.unsplash.com/photo-1576107229528-66258cc440a4?auto=format&fit=crop&w=500' },
  
  // Roll
  { id: 'r1', name: 'Veg Roll', category: 'Roll', price: 69, isVeg: true, image: 'https://images.unsplash.com/photo-1549488344-c79ab6182103?auto=format&fit=crop&w=500' },
  { id: 'r2', name: 'Egg Roll', category: 'Roll', price: 79, isVeg: false, image: 'https://images.unsplash.com/photo-1549488344-c79ab6182103?auto=format&fit=crop&w=500' },
  
  // Bread Omelette
  { id: 'bo1', name: 'Plain Bread Omelette', category: 'Bread Omelette', price: 59, isVeg: false, image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=500' },
  { id: 'bo2', name: 'Mixed Veg Bread Omelette', category: 'Bread Omelette', price: 69, isVeg: false, image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=500' },
  { id: 'bo3', name: 'Spacial Bread Omelette', category: 'Bread Omelette', price: 79, isVeg: false, image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=500' },
  
  // Snacks
  { id: 'sn1', name: 'Valaka Baji', category: 'Snacks', price: 20, isVeg: true, image: 'https://images.unsplash.com/photo-1596560548464-f010549b84d7?auto=format&fit=crop&w=500' },
  { id: 'sn2', name: 'Molaga Baji', category: 'Snacks', price: 20, isVeg: true, image: 'https://images.unsplash.com/photo-1596560548464-f010549b84d7?auto=format&fit=crop&w=500' },
  { id: 'sn3', name: 'Ulunthu Vadai', category: 'Snacks', price: 20, isVeg: true, image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=500' },
  { id: 'sn4', name: 'Paruppu Vadai', category: 'Snacks', price: 20, isVeg: true, image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=500' },
  
  // Juice
  { id: 'j1', name: 'Masckline', category: 'Juice', price: 40, isVeg: true, image: 'https://images.unsplash.com/photo-1600271886742-f049cd451b66?auto=format&fit=crop&w=500' },
  { id: 'j2', name: 'Watermelon', category: 'Juice', price: 40, isVeg: true, image: 'https://images.unsplash.com/photo-1587883012610-e3df17d41270?auto=format&fit=crop&w=500' },
  { id: 'j3', name: 'Mosambi', category: 'Juice', price: 40, isVeg: true, image: 'https://images.unsplash.com/photo-1600271886742-f049cd451b66?auto=format&fit=crop&w=500' },
  { id: 'j4', name: 'Pomegranate', category: 'Juice', price: 50, isVeg: true, image: 'https://images.unsplash.com/photo-1600271886742-f049cd451b66?auto=format&fit=crop&w=500' },
  { id: 'j5', name: 'Apple', category: 'Juice', price: 50, isVeg: true, image: 'https://images.unsplash.com/photo-1600271886742-f049cd451b66?auto=format&fit=crop&w=500' },
  { id: 'j6', name: 'Orange', category: 'Juice', price: 50, isVeg: true, image: 'https://images.unsplash.com/photo-1600271886742-f049cd451b66?auto=format&fit=crop&w=500' },
  
  // Combos
  { id: 'c1', name: 'Combo - 1 (Sandwich, French Fry, Lemon Juice)', category: 'Combos', price: 169, originalPrice: 198, isVeg: true, image: 'https://images.unsplash.com/photo-1528736235302-52922df5c122?auto=format&fit=crop&w=500' },
  { id: 'c2', name: 'Combo - II (Veg Nuggets, Veg Roll, Blue Mojito)', category: 'Combos', price: 169, originalPrice: 208, isVeg: true, image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&w=500' },
  { id: 'c3', name: 'Combo - III (Bun Nuttela, Corn Maggi, Cold Coffee)', category: 'Combos', price: 169, originalPrice: 197, isVeg: true, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=500' },
  
  // Sandwiches
  { id: 'sw1', name: 'Veg Sandwich', category: 'Sandwiches', price: 59, isVeg: true, image: 'https://images.unsplash.com/photo-1528736235302-52922df5c122?auto=format&fit=crop&w=500' },
  { id: 'sw2', name: 'Corn Peri Peri Sandwich', category: 'Sandwiches', price: 69, isVeg: true, image: 'https://images.unsplash.com/photo-1528736235302-52922df5c122?auto=format&fit=crop&w=500' },
  { id: 'sw3', name: 'Corn Peri Peri Cheese Sandwich', category: 'Sandwiches', price: 79, isVeg: true, image: 'https://images.unsplash.com/photo-1528736235302-52922df5c122?auto=format&fit=crop&w=500' },
  { id: 'sw4', name: 'Peanut Nuetella Sandwich', category: 'Sandwiches', price: 89, isVeg: true, image: 'https://images.unsplash.com/photo-1528736235302-52922df5c122?auto=format&fit=crop&w=500' },
  
  // Fries Fashion
  { id: 'f1', name: 'Plain French Fries', category: 'Fries Fashion', price: 69, isVeg: true, image: 'https://images.unsplash.com/photo-1576107229528-66258cc440a4?auto=format&fit=crop&w=500' },
  { id: 'f2', name: 'Peri Peri Fries', category: 'Fries Fashion', price: 79, isVeg: true, image: 'https://images.unsplash.com/photo-1576107229528-66258cc440a4?auto=format&fit=crop&w=500' },
  { id: 'f3', name: 'Potato Bites', category: 'Fries Fashion', price: 89, isVeg: true, image: 'https://images.unsplash.com/photo-1576107229528-66258cc440a4?auto=format&fit=crop&w=500' },
  { id: 'f4', name: 'Veg Finger', category: 'Fries Fashion', price: 99, isVeg: true, image: 'https://images.unsplash.com/photo-1576107229528-66258cc440a4?auto=format&fit=crop&w=500' },
  
  // Milk Shakes
  { id: 'ms1', name: 'Butterscotch', category: 'Milk Shakes', price: 69, isVeg: true, image: 'https://images.unsplash.com/photo-1572490122747-3968b75bb8ef?auto=format&fit=crop&w=500' },
  { id: 'ms2', name: 'Kit Kat', category: 'Milk Shakes', price: 69, isVeg: true, image: 'https://images.unsplash.com/photo-1572490122747-3968b75bb8ef?auto=format&fit=crop&w=500' },
  { id: 'ms3', name: 'Orio', category: 'Milk Shakes', price: 69, isVeg: true, image: 'https://images.unsplash.com/photo-1572490122747-3968b75bb8ef?auto=format&fit=crop&w=500' },
  { id: 'ms4', name: 'Badam Milk sheke', category: 'Milk Shakes', price: 69, isVeg: true, image: 'https://images.unsplash.com/photo-1572490122747-3968b75bb8ef?auto=format&fit=crop&w=500' },
  { id: 'ms5', name: 'Mango Milkshake', category: 'Milk Shakes', price: 69, isVeg: true, image: 'https://images.unsplash.com/photo-1572490122747-3968b75bb8ef?auto=format&fit=crop&w=500' },
  { id: 'ms6', name: 'Chocolate', category: 'Milk Shakes', price: 79, isVeg: true, image: 'https://images.unsplash.com/photo-1572490122747-3968b75bb8ef?auto=format&fit=crop&w=500' },
  { id: 'ms7', name: 'Pista Milkshake', category: 'Milk Shakes', price: 79, isVeg: true, image: 'https://images.unsplash.com/photo-1572490122747-3968b75bb8ef?auto=format&fit=crop&w=500' }
];

export const HERO_DEALS: HeroDeal[] = [
  {
    id: 'hd-1',
    title: 'Combo - 1 (Sandwich, French Fry, Lemon Juice)',
    dealTag: 'DEAL OF THE DAY',
    price: 169,
    originalPrice: 198,
    image: 'https://images.unsplash.com/photo-1528736235302-52922df5c122?auto=format&fit=crop&w=500',
    linkedItemId: 'c1',
  },
  {
    id: 'hd-2',
    title: 'Combo - II (Veg Nuggets, Veg Roll, Blue Mojito)',
    dealTag: 'WEEKEND SPECIAL',
    price: 169,
    originalPrice: 208,
    image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&w=500',
    linkedItemId: 'c2',
  },
  {
    id: 'hd-3',
    title: 'Combo - III (Bun Nuttela, Corn Maggi, Cold Coffee)',
    dealTag: 'POPULAR',
    price: 169,
    originalPrice: 197,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=500',
    linkedItemId: 'c3',
  },
];

export const MOCK_USER: UserProfile = {
  name: 'Alex Johnson',
  email: 'alex@mudcups.com',
  phone: '+1 (555) 019-2834',
  addresses: [{
    id: 'a-1',
    type: 'Home',
    street: '123 Tech Boulevard',
    city: 'San Francisco',
    isDefault: true
  }],
  favorites: []
};

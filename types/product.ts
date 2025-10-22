// Product and category types for the bakery

export type Category =
  | 'breads'
  | 'pastries'
  | 'viennoiseries'
  | 'cakes'
  | 'specials'
  | 'all';

export type DietaryTag =
  | 'vegan'
  | 'vegetarian'
  | 'gluten-free'
  | 'dairy-free'
  | 'nut-free'
  | 'organic';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: Category;
  isNew?: boolean;
  isSpecial?: boolean;
  dietaryTags?: DietaryTag[];
  allergens?: string[];
  ingredients?: string[];
  limitedQuantity?: boolean;
  stockRemaining?: number;
  bakedToday?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}

export interface CategoryInfo {
  id: Category;
  name: string;
  icon?: string;
  description?: string;
}

export interface DailySpecial {
  id: string;
  product: Product;
  discount: number;
  endsAt: Date;
  description: string;
}

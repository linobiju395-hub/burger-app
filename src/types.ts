export interface MenuItem {
  id: string;
  name: string;
  tagline: string;
  priceAed: number;
  description: string;
  calories: string;
  heatLevel: number; // 0 to 3
  badges: string[];
  imageSlot: string; // e.g. /assets/menu/menu_1.webp
  ingredients: string[];
}

export interface LayerCallout {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  startProgress: number; // 0.0 - 1.0 scroll progress within pin
  endProgress: number;
  yOffsetPercent: number; // approximate canvas Y anchor
  side: 'left' | 'right';
}

export interface VapeStore {
  id: string;
  slug: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  rating: number;
  reviewCount: number;
  subRatings: {
    service: number;
    inventory: number;
    pricing: number;
  };
  isOpen: boolean;
  hours: {
    [key: string]: { open: string; close: string } | null;
  };
  coordinates: { lat: number; lng: number };
  brands: string[];
  featuredProducts: string[];
  imageUrl: string;
  description: string;
  hasCoupons: boolean;
}

export interface City {
  slug: string;
  name: string;
  state: string;
  storeCount: number;
  averageRating: number;
  imageUrl: string;
}

export const cities: City[] = [
  {
    slug: "los-angeles",
    name: "Los Angeles",
    state: "CA",
    storeCount: 342,
    averageRating: 4.2,
    imageUrl: "https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?w=800&q=80",
  },
  {
    slug: "new-york",
    name: "New York",
    state: "NY",
    storeCount: 456,
    averageRating: 4.1,
    imageUrl: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80",
  },
  {
    slug: "miami",
    name: "Miami",
    state: "FL",
    storeCount: 189,
    averageRating: 4.3,
    imageUrl: "https://images.unsplash.com/photo-1506966953602-c20cc11f75e3?w=800&q=80",
  },
  {
    slug: "chicago",
    name: "Chicago",
    state: "IL",
    storeCount: 234,
    averageRating: 4.0,
    imageUrl: "https://images.unsplash.com/photo-1494522855154-9297ac14b55f?w=800&q=80",
  },
  {
    slug: "houston",
    name: "Houston",
    state: "TX",
    storeCount: 198,
    averageRating: 4.2,
    imageUrl: "https://images.unsplash.com/photo-1530089711124-9ca31fb9e863?w=800&q=80",
  },
  {
    slug: "phoenix",
    name: "Phoenix",
    state: "AZ",
    storeCount: 145,
    averageRating: 4.1,
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
  },
  {
    slug: "denver",
    name: "Denver",
    state: "CO",
    storeCount: 167,
    averageRating: 4.4,
    imageUrl: "https://images.unsplash.com/photo-1619856699906-09e1f58c98b1?w=800&q=80",
  },
  {
    slug: "seattle",
    name: "Seattle",
    state: "WA",
    storeCount: 178,
    averageRating: 4.3,
    imageUrl: "https://images.unsplash.com/photo-1502175353174-a7a70e73b362?w=800&q=80",
  },
];

export const stores: VapeStore[] = [
  {
    id: "1",
    slug: "cloud-9-vape-lounge",
    name: "Cloud 9 Vape Lounge",
    address: "1234 Sunset Blvd",
    city: "Los Angeles",
    state: "CA",
    zipCode: "90028",
    phone: "(323) 555-0123",
    rating: 4.8,
    reviewCount: 234,
    subRatings: { service: 4.9, inventory: 4.7, pricing: 4.6 },
    isOpen: true,
    hours: {
      monday: { open: "10:00", close: "21:00" },
      tuesday: { open: "10:00", close: "21:00" },
      wednesday: { open: "10:00", close: "21:00" },
      thursday: { open: "10:00", close: "21:00" },
      friday: { open: "10:00", close: "22:00" },
      saturday: { open: "11:00", close: "22:00" },
      sunday: { open: "12:00", close: "18:00" },
    },
    coordinates: { lat: 34.0977, lng: -118.3285 },
    brands: ["Juul", "Puff Bar", "Vuse", "SMOK"],
    featuredProducts: ["Juul Pods Variety", "Puff Bar Plus", "SMOK Nord 4"],
    imageUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&q=80",
    description: "Premier vape lounge in Hollywood offering the widest selection of e-liquids and devices in LA.",
    hasCoupons: true,
  },
  {
    id: "2",
    slug: "vapor-paradise",
    name: "Vapor Paradise",
    address: "5678 Hollywood Ave",
    city: "Los Angeles",
    state: "CA",
    zipCode: "90046",
    phone: "(323) 555-0456",
    rating: 4.5,
    reviewCount: 189,
    subRatings: { service: 4.6, inventory: 4.5, pricing: 4.3 },
    isOpen: true,
    hours: {
      monday: { open: "09:00", close: "20:00" },
      tuesday: { open: "09:00", close: "20:00" },
      wednesday: { open: "09:00", close: "20:00" },
      thursday: { open: "09:00", close: "20:00" },
      friday: { open: "09:00", close: "21:00" },
      saturday: { open: "10:00", close: "21:00" },
      sunday: { open: "11:00", close: "17:00" },
    },
    coordinates: { lat: 34.1061, lng: -118.3467 },
    brands: ["NJOY", "blu", "Logic", "Vaporesso"],
    featuredProducts: ["NJOY ACE Pods", "Vaporesso XROS", "Logic Pro"],
    imageUrl: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=800&q=80",
    description: "Family-owned vape shop with expert staff and competitive prices on all major brands.",
    hasCoupons: false,
  },
  {
    id: "3",
    slug: "vape-city-dtla",
    name: "Vape City DTLA",
    address: "900 S Broadway",
    city: "Los Angeles",
    state: "CA",
    zipCode: "90015",
    phone: "(213) 555-0789",
    rating: 4.2,
    reviewCount: 156,
    subRatings: { service: 4.3, inventory: 4.4, pricing: 3.9 },
    isOpen: false,
    hours: {
      monday: { open: "10:00", close: "19:00" },
      tuesday: { open: "10:00", close: "19:00" },
      wednesday: { open: "10:00", close: "19:00" },
      thursday: { open: "10:00", close: "19:00" },
      friday: { open: "10:00", close: "20:00" },
      saturday: { open: "11:00", close: "20:00" },
      sunday: null,
    },
    coordinates: { lat: 34.0407, lng: -118.2558 },
    brands: ["GeekVape", "Voopoo", "Lost Vape", "Uwell"],
    featuredProducts: ["GeekVape Aegis", "Voopoo Drag 3", "Uwell Caliburn"],
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    description: "Downtown LA's go-to destination for advanced vaping devices and premium e-liquids.",
    hasCoupons: true,
  },
  {
    id: "4",
    slug: "the-vape-spot-santa-monica",
    name: "The Vape Spot",
    address: "456 Ocean Ave",
    city: "Los Angeles",
    state: "CA",
    zipCode: "90401",
    phone: "(310) 555-0234",
    rating: 4.7,
    reviewCount: 312,
    subRatings: { service: 4.8, inventory: 4.6, pricing: 4.7 },
    isOpen: true,
    hours: {
      monday: { open: "08:00", close: "22:00" },
      tuesday: { open: "08:00", close: "22:00" },
      wednesday: { open: "08:00", close: "22:00" },
      thursday: { open: "08:00", close: "22:00" },
      friday: { open: "08:00", close: "23:00" },
      saturday: { open: "09:00", close: "23:00" },
      sunday: { open: "10:00", close: "20:00" },
    },
    coordinates: { lat: 34.0195, lng: -118.4912 },
    brands: ["Juul", "SMOK", "Aspire", "Innokin"],
    featuredProducts: ["SMOK RPM 5", "Aspire Nautilus", "Innokin Kroma-R"],
    imageUrl: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=800&q=80",
    description: "Beachside vape shop with ocean views and the best selection of salt nic e-liquids.",
    hasCoupons: true,
  },
  {
    id: "5",
    slug: "elite-vapes-beverly-hills",
    name: "Elite Vapes Beverly Hills",
    address: "9876 Rodeo Dr",
    city: "Los Angeles",
    state: "CA",
    zipCode: "90210",
    phone: "(310) 555-0567",
    rating: 4.9,
    reviewCount: 87,
    subRatings: { service: 5.0, inventory: 4.8, pricing: 4.0 },
    isOpen: true,
    hours: {
      monday: { open: "11:00", close: "20:00" },
      tuesday: { open: "11:00", close: "20:00" },
      wednesday: { open: "11:00", close: "20:00" },
      thursday: { open: "11:00", close: "20:00" },
      friday: { open: "11:00", close: "21:00" },
      saturday: { open: "12:00", close: "21:00" },
      sunday: { open: "12:00", close: "18:00" },
    },
    coordinates: { lat: 34.0736, lng: -118.4004 },
    brands: ["Pax", "Firefly", "DaVinci", "Storz & Bickel"],
    featuredProducts: ["Pax Era Pro", "DaVinci IQ2", "Mighty+"],
    imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
    description: "Luxury vaporizer boutique featuring premium dry herb devices and concierge service.",
    hasCoupons: false,
  },
];

export const brands = [
  "Juul",
  "Puff Bar",
  "Vuse",
  "SMOK",
  "NJOY",
  "blu",
  "Vaporesso",
  "GeekVape",
  "Voopoo",
  "Lost Vape",
  "Uwell",
  "Aspire",
  "Innokin",
  "Pax",
];

export function getStoresByCity(citySlug: string): VapeStore[] {
  const cityName = cities.find(c => c.slug === citySlug)?.name;
  if (!cityName) return [];
  return stores.filter(s => s.city === cityName);
}

export function getStoreBySlug(citySlug: string, storeSlug: string): VapeStore | undefined {
  const cityStores = getStoresByCity(citySlug);
  return cityStores.find(s => s.slug === storeSlug);
}

export function getCityBySlug(citySlug: string): City | undefined {
  return cities.find(c => c.slug === citySlug);
}

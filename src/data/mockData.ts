import losAngelesImg from "@/assets/cities/los-angeles.jpg";
import newYorkImg from "@/assets/cities/new-york.jpg";
import miamiImg from "@/assets/cities/miami.jpg";
import chicagoImg from "@/assets/cities/chicago.jpg";
import houstonImg from "@/assets/cities/houston.jpg";
import phoenixImg from "@/assets/cities/phoenix.jpg";
import denverImg from "@/assets/cities/denver.jpg";
import seattleImg from "@/assets/cities/seattle.jpg";

export interface Review {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  date: string;
  content: string;
  serviceRating: number;
  inventoryRating: number;
  pricingRating: number;
}

export interface BrandItem {
  name: string;
  url?: string;
}

export interface ProductItem {
  name: string;
  url?: string;
}

export interface VapeStore {
  id: string;
  slug: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  facebook?: string;
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
  brands: BrandItem[];
  featuredProducts: ProductItem[];
  imageUrl: string;
  photos: string[];
  description: string;
  hasCoupons: boolean;
  isSponsored?: boolean;
  reviews: Review[];
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
    imageUrl: losAngelesImg,
  },
  {
    slug: "new-york",
    name: "New York",
    state: "NY",
    storeCount: 456,
    averageRating: 4.1,
    imageUrl: newYorkImg,
  },
  {
    slug: "miami",
    name: "Miami",
    state: "FL",
    storeCount: 189,
    averageRating: 4.3,
    imageUrl: miamiImg,
  },
  {
    slug: "chicago",
    name: "Chicago",
    state: "IL",
    storeCount: 234,
    averageRating: 4.0,
    imageUrl: chicagoImg,
  },
  {
    slug: "houston",
    name: "Houston",
    state: "TX",
    storeCount: 198,
    averageRating: 4.2,
    imageUrl: houstonImg,
  },
  {
    slug: "phoenix",
    name: "Phoenix",
    state: "AZ",
    storeCount: 145,
    averageRating: 4.1,
    imageUrl: phoenixImg,
  },
  {
    slug: "denver",
    name: "Denver",
    state: "CO",
    storeCount: 167,
    averageRating: 4.4,
    imageUrl: denverImg,
  },
  {
    slug: "seattle",
    name: "Seattle",
    state: "WA",
    storeCount: 178,
    averageRating: 4.3,
    imageUrl: seattleImg,
  },
];

const sampleReviews: Review[] = [
  {
    id: "r1",
    userName: "Mike T.",
    userAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80",
    rating: 5,
    date: "2024-01-15",
    content: "Best vape shop in LA! The staff is super knowledgeable and helped me find the perfect setup. Great selection of e-liquids too.",
    serviceRating: 5,
    inventoryRating: 5,
    pricingRating: 4,
  },
  {
    id: "r2",
    userName: "Sarah L.",
    userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
    rating: 4,
    date: "2024-01-10",
    content: "Good variety of products and friendly staff. Prices are a bit higher than online but the convenience and expertise make it worth it.",
    serviceRating: 5,
    inventoryRating: 4,
    pricingRating: 3,
  },
  {
    id: "r3",
    userName: "James K.",
    userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
    rating: 5,
    date: "2024-01-05",
    content: "Amazing experience! They have all the latest devices and the tasting bar for e-liquids is fantastic. Highly recommend!",
    serviceRating: 5,
    inventoryRating: 5,
    pricingRating: 5,
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
    facebook: "https://facebook.com/cloud9vapelounge",
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
    brands: [
      { name: "Juul", url: "https://juul.com" },
      { name: "Puff Bar", url: "https://puffbar.com" },
      { name: "Vuse" },
      { name: "SMOK", url: "https://smok.com" },
    ],
    featuredProducts: [
      { name: "Juul Pods Variety", url: "https://juul.com/pods" },
      { name: "Puff Bar Plus" },
      { name: "SMOK Nord 4", url: "https://smok.com/nord4" },
    ],
    imageUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&q=80",
    photos: [
      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&q=80",
      "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=800&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
      "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=800&q=80",
    ],
    description: "Premier vape lounge in Hollywood offering the widest selection of e-liquids and devices in LA.",
    hasCoupons: true,
    isSponsored: true,
    reviews: sampleReviews,
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
    brands: [
      { name: "NJOY" },
      { name: "blu" },
      { name: "Logic" },
      { name: "Vaporesso", url: "https://vaporesso.com" },
    ],
    featuredProducts: [
      { name: "NJOY ACE Pods" },
      { name: "Vaporesso XROS", url: "https://vaporesso.com/xros" },
      { name: "Logic Pro" },
    ],
    imageUrl: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=800&q=80",
    photos: [
      "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=800&q=80",
      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&q=80",
    ],
    description: "Family-owned vape shop with expert staff and competitive prices on all major brands.",
    hasCoupons: false,
    reviews: sampleReviews.slice(0, 2),
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
    facebook: "https://facebook.com/vapecitydtla",
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
    brands: [
      { name: "GeekVape", url: "https://geekvape.com" },
      { name: "Voopoo", url: "https://voopoo.com" },
      { name: "Lost Vape" },
      { name: "Uwell" },
    ],
    featuredProducts: [
      { name: "GeekVape Aegis", url: "https://geekvape.com/aegis" },
      { name: "Voopoo Drag 3" },
      { name: "Uwell Caliburn" },
    ],
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    photos: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
      "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=800&q=80",
    ],
    description: "Downtown LA's go-to destination for advanced vaping devices and premium e-liquids.",
    hasCoupons: true,
    reviews: sampleReviews,
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
    brands: [
      { name: "Juul" },
      { name: "SMOK" },
      { name: "Aspire" },
      { name: "Innokin" },
    ],
    featuredProducts: [
      { name: "SMOK RPM 5" },
      { name: "Aspire Nautilus" },
      { name: "Innokin Kroma-R" },
    ],
    imageUrl: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=800&q=80",
    photos: [
      "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=800&q=80",
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
    ],
    description: "Beachside vape shop with ocean views and the best selection of salt nic e-liquids.",
    hasCoupons: true,
    reviews: sampleReviews.slice(0, 2),
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
    facebook: "https://facebook.com/elitevapesbh",
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
    brands: [
      { name: "Pax", url: "https://pax.com" },
      { name: "Firefly" },
      { name: "DaVinci", url: "https://davincivaporizer.com" },
      { name: "Storz & Bickel" },
    ],
    featuredProducts: [
      { name: "Pax Era Pro", url: "https://pax.com/era-pro" },
      { name: "DaVinci IQ2" },
      { name: "Mighty+" },
    ],
    imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
    photos: [
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&q=80",
      "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=800&q=80",
    ],
    description: "Luxury vaporizer boutique featuring premium dry herb devices and concierge service.",
    hasCoupons: false,
    reviews: sampleReviews,
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
  const cityStores = stores.filter(s => s.city === cityName);
  // Sort: sponsored first, then by rating
  return cityStores.sort((a, b) => {
    if (a.isSponsored && !b.isSponsored) return -1;
    if (!a.isSponsored && b.isSponsored) return 1;
    return b.rating - a.rating;
  });
}

export function getStoreBySlug(citySlug: string, storeSlug: string): VapeStore | undefined {
  const cityStores = getStoresByCity(citySlug);
  return cityStores.find(s => s.slug === storeSlug);
}

export function getCityBySlug(citySlug: string): City | undefined {
  return cities.find(c => c.slug === citySlug);
}

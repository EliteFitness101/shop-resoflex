// Shared domain types — mirror planned Supabase schema.
// TODO: when Lovable Cloud is enabled, regenerate from DB.

export type Currency = "NGN" | "USD";

export interface User {
  id: string;
  email: string;
  fullName: string;
  tier: "recruit" | "operator" | "sovereign";
  referralCode: string;
  walletBalance: number; // NGN
  joinedAt: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  priceNGN: number;
  comparePriceNGN?: number;
  commissionPct: number;
  category: "supplement" | "gear" | "program" | "digital";
  badge?: string;
  imageGradient: string; // CSS gradient used as fallback
  imageUrl?: string | null; // admin-uploaded image (overrides gradient)
}

export interface MealPlan {
  id: string;
  name: string;
  region: string;
  calories: number;
  priceNGN: number;
  highlights: string[];
  gradient: string;
}

export interface Referral {
  id: string;
  email: string;
  joinedAt: string;
  earningsNGN: number;
  status: "active" | "pending";
}

export interface Order {
  id: string;
  reference: string;
  product: string;
  amountNGN: number;
  status: "paid" | "pending" | "failed";
  createdAt: string;
}

export interface Transaction {
  id: string;
  type: "commission" | "withdrawal" | "purchase";
  amountNGN: number;
  createdAt: string;
  note: string;
}

export interface TelemetryEvent {
  id: string;
  timestamp: string;
  level: "info" | "warn" | "threat";
  source: string;
  message: string;
}

export interface Workout {
  id: string;
  name: string;
  durationMin: number;
  intensity: "low" | "medium" | "high";
}

export interface User {
  id: string;
  name: string;
  phone: string;
  avatarUrl: string;
  isVerified: boolean;
  isPhoneVerified: boolean;
  rating: number;
  reviewCount: number;
  memberSince: string; // "January 2024"
  bio?: string;
}

export interface Ride {
  id: string;
  driverId: string;
  from: string;
  to: string;
  date: string;        // ISO date string "2026-05-10"
  departureTime: string; // "08:30"
  pricePerSeat: number;
  totalSeats: number;
  availableSeats: number;
  notes?: string;
  status: "active" | "full" | "completed" | "cancelled";
  createdAt: string;
}

export interface Booking {
  id: string;
  rideId: string;
  passengerId: string;
  status: "pending" | "confirmed" | "rejected" | "cancelled";
  createdAt: string;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  createdAt: string;
}

export interface Chat {
  id: string;
  participantIds: string[];
  rideId?: string;
  lastMessage?: Message;
  createdAt: string;
}

export interface Review {
  id: string;
  reviewerId: string;
  revieweeId: string;
  rideId: string;
  rating: number; // 1–5
  comment: string;
  createdAt: string;
}

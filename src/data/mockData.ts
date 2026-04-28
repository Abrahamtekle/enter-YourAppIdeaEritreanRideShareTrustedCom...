import type { User, Ride, Booking, Chat, Message, Review } from "@/types";

export const CANADIAN_CITIES = [
  "Calgary",
  "Edmonton",
  "Red Deer",
  "Lethbridge",
  "Medicine Hat",
  "Fort McMurray",
  "Vancouver",
  "Toronto",
  "Winnipeg",
  "Ottawa",
];

export const MOCK_USERS: User[] = [
  {
    id: "user-1",
    name: "Dawit Tesfaye",
    phone: "+1 (403) 555-0101",
    avatarUrl: "https://api.dicebear.com/7.x/thumbs/svg?seed=Dawit&backgroundColor=1B6B3A&shapeColor=C9920A",
    isVerified: true,
    isPhoneVerified: true,
    rating: 4.9,
    reviewCount: 47,
    memberSince: "January 2024",
    bio: "Reliable driver. Calgary to Edmonton every weekend. Welcome!",
  },
  {
    id: "user-2",
    name: "Miriam Haile",
    phone: "+1 (403) 555-0202",
    avatarUrl: "https://api.dicebear.com/7.x/thumbs/svg?seed=Miriam&backgroundColor=C9920A&shapeColor=1B6B3A",
    isVerified: true,
    isPhoneVerified: true,
    rating: 4.7,
    reviewCount: 23,
    memberSince: "March 2024",
    bio: "I drive Red Deer routes regularly. Clean car, good music.",
  },
  {
    id: "user-3",
    name: "Samuel Berhe",
    phone: "+1 (780) 555-0303",
    avatarUrl: "https://api.dicebear.com/7.x/thumbs/svg?seed=Samuel&backgroundColor=1B6B3A&shapeColor=ffffff",
    isVerified: false,
    isPhoneVerified: true,
    rating: 4.5,
    reviewCount: 12,
    memberSince: "June 2024",
    bio: "Student at U of A. Edmonton rides on weekends.",
  },
  {
    id: "user-4",
    name: "Hana Tekeste",
    phone: "+1 (403) 555-0404",
    avatarUrl: "https://api.dicebear.com/7.x/thumbs/svg?seed=Hana&backgroundColor=5E4100&shapeColor=FDF3D7",
    isVerified: true,
    isPhoneVerified: true,
    rating: 5.0,
    reviewCount: 8,
    memberSince: "August 2024",
    bio: "New to driving but very punctual and careful.",
  },
];

// The "logged-in" user for the demo
export const CURRENT_USER: User = {
  id: "user-me",
  name: "You (Demo User)",
  phone: "+1 (403) 555-0000",
  avatarUrl: "https://api.dicebear.com/7.x/thumbs/svg?seed=Demo&backgroundColor=0A2E19&shapeColor=C9920A",
  isVerified: false,
  isPhoneVerified: true,
  rating: 0,
  reviewCount: 0,
  memberSince: "April 2026",
};

export const MOCK_RIDES: Ride[] = [
  {
    id: "ride-1",
    driverId: "user-1",
    from: "Calgary",
    to: "Edmonton",
    date: "2026-05-03",
    departureTime: "08:00",
    pricePerSeat: 35,
    totalSeats: 3,
    availableSeats: 2,
    notes: "Stopping at Gasoline Alley (Red Deer) for 15 mins.",
    status: "active",
    createdAt: "2026-04-25T10:00:00Z",
  },
  {
    id: "ride-2",
    driverId: "user-2",
    from: "Calgary",
    to: "Red Deer",
    date: "2026-05-04",
    departureTime: "10:30",
    pricePerSeat: 20,
    totalSeats: 2,
    availableSeats: 1,
    notes: "Pickup from NE Calgary (Martindale area).",
    status: "active",
    createdAt: "2026-04-26T09:00:00Z",
  },
  {
    id: "ride-3",
    driverId: "user-3",
    from: "Edmonton",
    to: "Calgary",
    date: "2026-05-05",
    departureTime: "06:30",
    pricePerSeat: 35,
    totalSeats: 4,
    availableSeats: 3,
    notes: "Early morning ride. Bring your own snacks.",
    status: "active",
    createdAt: "2026-04-26T14:00:00Z",
  },
  {
    id: "ride-4",
    driverId: "user-4",
    from: "Calgary",
    to: "Edmonton",
    date: "2026-05-10",
    departureTime: "14:00",
    pricePerSeat: 30,
    totalSeats: 3,
    availableSeats: 3,
    notes: "Comfortable SUV. Music on the way!",
    status: "active",
    createdAt: "2026-04-27T08:00:00Z",
  },
  {
    id: "ride-5",
    driverId: "user-1",
    from: "Edmonton",
    to: "Calgary",
    date: "2026-05-12",
    departureTime: "07:00",
    pricePerSeat: 35,
    totalSeats: 3,
    availableSeats: 1,
    notes: "Return trip. Reliable as always.",
    status: "active",
    createdAt: "2026-04-27T09:00:00Z",
  },
];

const CHAT_ID_1 = "chat-1";
const CHAT_ID_2 = "chat-2";

export const MOCK_MESSAGES: Message[] = [
  {
    id: "msg-1",
    chatId: CHAT_ID_1,
    senderId: "user-1",
    text: "ሰላም! Pickup from Martindale Tim Hortons at 8am?",
    createdAt: "2026-04-27T09:00:00Z",
  },
  {
    id: "msg-2",
    chatId: CHAT_ID_1,
    senderId: "user-me",
    text: "Yes perfect, I'll be there. Thank you!",
    createdAt: "2026-04-27T09:05:00Z",
  },
  {
    id: "msg-3",
    chatId: CHAT_ID_1,
    senderId: "user-1",
    text: "Great. I'll be driving a black Toyota Camry. See you Saturday!",
    createdAt: "2026-04-27T09:10:00Z",
  },
  {
    id: "msg-4",
    chatId: CHAT_ID_2,
    senderId: "user-2",
    text: "Hi! Do you still need a ride to Red Deer on Sunday?",
    createdAt: "2026-04-26T15:00:00Z",
  },
  {
    id: "msg-5",
    chatId: CHAT_ID_2,
    senderId: "user-me",
    text: "Yes, I do! Is there still a seat available?",
    createdAt: "2026-04-26T15:30:00Z",
  },
];

export const MOCK_CHATS: Chat[] = [
  {
    id: CHAT_ID_1,
    participantIds: ["user-me", "user-1"],
    rideId: "ride-1",
    lastMessage: MOCK_MESSAGES[2],
    createdAt: "2026-04-27T09:00:00Z",
  },
  {
    id: CHAT_ID_2,
    participantIds: ["user-me", "user-2"],
    rideId: "ride-2",
    lastMessage: MOCK_MESSAGES[4],
    createdAt: "2026-04-26T15:00:00Z",
  },
];

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: "booking-1",
    rideId: "ride-1",
    passengerId: "user-me",
    status: "confirmed",
    createdAt: "2026-04-27T09:00:00Z",
  },
];

export const MOCK_REVIEWS: Review[] = [
  {
    id: "review-1",
    reviewerId: "user-2",
    revieweeId: "user-1",
    rideId: "ride-3",
    rating: 5,
    comment: "Excellent driver! Very punctual and friendly. Will ride again.",
    createdAt: "2026-04-20T12:00:00Z",
  },
  {
    id: "review-2",
    reviewerId: "user-3",
    revieweeId: "user-1",
    rideId: "ride-3",
    rating: 5,
    comment: "Safe driver, comfortable ride. Highly recommend to the community!",
    createdAt: "2026-04-15T10:00:00Z",
  },
  {
    id: "review-3",
    reviewerId: "user-1",
    revieweeId: "user-2",
    rideId: "ride-2",
    rating: 4,
    comment: "Good driver, nice car. On time.",
    createdAt: "2026-04-18T11:00:00Z",
  },
];

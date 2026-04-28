import React, { createContext, useContext, useState } from "react";
import type { User, Ride, Booking, Chat, Message } from "@/types";
import {
  CURRENT_USER,
  MOCK_RIDES,
  MOCK_BOOKINGS,
  MOCK_CHATS,
  MOCK_MESSAGES,
  MOCK_USERS,
} from "@/data/mockData";

interface AppContextType {
  currentUser: User;
  isLoggedIn: boolean;
  rides: Ride[];
  bookings: Booking[];
  chats: Chat[];
  messages: Message[];
  users: User[];
  login: (user: User) => void;
  logout: () => void;
  addRide: (ride: Ride) => void;
  requestBooking: (booking: Booking) => void;
  sendMessage: (message: Message) => void;
  getUserById: (id: string) => User | undefined;
  getRideById: (id: string) => Ride | undefined;
  getChatById: (id: string) => Chat | undefined;
  getMessagesForChat: (chatId: string) => Message[];
  searchRides: (from: string, to: string, date?: string) => Ride[];
  getMyPostedRides: () => Ride[];
  getMyBookedRides: () => Ride[];
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User>(CURRENT_USER);
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Demo: start logged in
  const [rides, setRides] = useState<Ride[]>(MOCK_RIDES);
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);
  const [chats] = useState<Chat[]>(MOCK_CHATS);
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [users] = useState<User[]>(MOCK_USERS);

  const login = (user: User) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
  };

  const logout = () => {
    setCurrentUser(CURRENT_USER);
    setIsLoggedIn(false);
  };

  const addRide = (ride: Ride) => {
    setRides((prev) => [ride, ...prev]);
  };

  const requestBooking = (booking: Booking) => {
    setBookings((prev) => [...prev, booking]);
  };

  const sendMessage = (message: Message) => {
    setMessages((prev) => [...prev, message]);
  };

  const getUserById = (id: string) => {
    if (id === currentUser.id) return currentUser;
    return users.find((u) => u.id === id);
  };

  const getRideById = (id: string) => rides.find((r) => r.id === id);

  const getChatById = (id: string) => chats.find((c) => c.id === id);

  const getMessagesForChat = (chatId: string) =>
    messages.filter((m) => m.chatId === chatId).sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

  const searchRides = (from: string, to: string, date?: string) => {
    return rides.filter((ride) => {
      const matchFrom = from ? ride.from.toLowerCase().includes(from.toLowerCase()) : true;
      const matchTo = to ? ride.to.toLowerCase().includes(to.toLowerCase()) : true;
      const matchDate = date ? ride.date === date : true;
      return matchFrom && matchTo && matchDate && ride.status === "active";
    });
  };

  const getMyPostedRides = () =>
    rides.filter((r) => r.driverId === currentUser.id);

  const getMyBookedRides = () => {
    const myBookingRideIds = bookings
      .filter((b) => b.passengerId === currentUser.id)
      .map((b) => b.rideId);
    return rides.filter((r) => myBookingRideIds.includes(r.id));
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        isLoggedIn,
        rides,
        bookings,
        chats,
        messages,
        users,
        login,
        logout,
        addRide,
        requestBooking,
        sendMessage,
        getUserById,
        getRideById,
        getChatById,
        getMessagesForChat,
        searchRides,
        getMyPostedRides,
        getMyBookedRides,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

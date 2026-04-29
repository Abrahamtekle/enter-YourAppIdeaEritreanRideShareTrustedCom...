import type { User, Ride } from "@/types";

export function mapProfile(p: Record<string, unknown>): User {
  const name = (p.name as string) || "User";
  return {
    id: p.id as string,
    name,
    phone: p.phone as string | undefined,
    avatarUrl:
      (p.avatar_url as string) ||
      `https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(name)}&backgroundColor=1B6B3A&shapeColor=C9920A`,
    isVerified: (p.is_verified as boolean) || false,
    isPhoneVerified: (p.is_phone_verified as boolean) || false,
    rating: parseFloat((p.rating as string) || "0"),
    reviewCount: (p.review_count as number) || 0,
    memberSince: new Date(p.created_at as string).toLocaleDateString("en-CA", {
      month: "long",
      year: "numeric",
    }),
    bio: p.bio as string | undefined,
  };
}

export function mapRide(r: Record<string, unknown>): Ride {
  return {
    id: r.id as string,
    driverId: r.driver_id as string,
    from: r.from_city as string,
    to: r.to_city as string,
    date: r.ride_date as string,
    departureTime: r.departure_time as string,
    pricePerSeat: parseFloat(r.price_per_seat as string),
    totalSeats: r.total_seats as number,
    availableSeats: r.available_seats as number,
    notes: r.notes as string | undefined,
    status: r.status as Ride["status"],
    createdAt: r.created_at as string,
  };
}

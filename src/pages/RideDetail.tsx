import { useParams, useNavigate } from "react-router-dom";
import { Calendar, Clock, MapPin, Users, MessageCircle, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AppShell } from "@/components/AppShell";
import { StarRating } from "@/components/StarRating";
import { VerifiedBadge, PhoneVerifiedBadge } from "@/components/VerifiedBadge";
import { useApp } from "@/context/AppContext";
import { supabase } from "@/integrations/supabase/client";
import { mapRide, mapProfile } from "@/lib/db";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import type { Ride, User, Review } from "@/types";

function formatDate(dateStr: string) {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-CA", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });
}

function InfoRow({
  icon: Icon, label, value, children,
}: {
  icon: React.FC<{ size?: number; className?: string }>;
  label: string; value?: React.ReactNode; children?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
        <Icon size={16} className="text-primary" />
      </div>
      <div className="flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <div className="text-sm font-medium text-foreground">{value ?? children}</div>
      </div>
    </div>
  );
}

export default function RideDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentUser, isLoggedIn } = useApp();

  const [ride, setRide] = useState<Ride | null>(null);
  const [driver, setDriver] = useState<User | null>(null);
  const [reviews, setReviews] = useState<(Review & { reviewer?: User })[]>([]);
  const [alreadyBooked, setAlreadyBooked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      const { data: rideData } = await supabase
        .from("rides")
        .select("*, profiles!driver_id(*)")
        .eq("id", id)
        .maybeSingle();

      if (rideData) {
        setRide(mapRide(rideData as Record<string, unknown>));
        setDriver(mapProfile((rideData as Record<string, unknown>).profiles as Record<string, unknown>));
      }

      if (currentUser) {
        const { data: bookingData } = await supabase
          .from("bookings")
          .select("id")
          .eq("ride_id", id)
          .eq("passenger_id", currentUser.id)
          .maybeSingle();
        setAlreadyBooked(!!bookingData);
      }

      const { data: reviewData } = await supabase
        .from("reviews")
        .select("*, profiles!reviewer_id(*)")
        .eq("reviewee_id", rideData?.driver_id as string);

      if (reviewData) {
        setReviews(reviewData.map((r) => ({
          id: r.id,
          reviewerId: r.reviewer_id,
          revieweeId: r.reviewee_id,
          rideId: r.ride_id,
          rating: r.rating,
          comment: r.comment || "",
          createdAt: r.created_at,
          reviewer: mapProfile((r as Record<string, unknown>).profiles as Record<string, unknown>),
        })));
      }

      setLoading(false);
    };
    fetchData();
  }, [id, currentUser]);

  const handleBook = async () => {
    if (!isLoggedIn) { navigate("/login"); return; }
    if (!ride || !currentUser) return;
    setBooking(true);

    const { error } = await supabase.from("bookings").insert({
      ride_id: ride.id,
      passenger_id: currentUser.id,
      status: "pending",
    });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setAlreadyBooked(true);
      toast({ title: "Booking request sent!", description: `Your request to join ${driver?.name}'s ride has been sent.` });
    }
    setBooking(false);
  };

  const handleChat = async () => {
    if (!isLoggedIn) { navigate("/login"); return; }
    if (!currentUser || !driver) return;

    // Find existing chat between these two users
    const { data: myChats } = await supabase
      .from("chat_participants")
      .select("chat_id")
      .eq("user_id", currentUser.id);

    const { data: driverChats } = await supabase
      .from("chat_participants")
      .select("chat_id")
      .eq("user_id", driver.id);

    const myChatIds = new Set(myChats?.map((c) => c.chat_id));
    const existingChatId = driverChats?.find((c) => myChatIds.has(c.chat_id))?.chat_id;

    if (existingChatId) {
      navigate(`/chat/${existingChatId}`);
      return;
    }

    // Create new chat
    const { data: newChat } = await supabase
      .from("chats")
      .insert({ ride_id: ride?.id })
      .select()
      .maybeSingle();

    if (newChat) {
      await supabase.from("chat_participants").insert([
        { chat_id: newChat.id, user_id: currentUser.id },
        { chat_id: newChat.id, user_id: driver.id },
      ]);
      navigate(`/chat/${newChat.id}`);
    }
  };

  if (loading) {
    return (
      <AppShell title="Ride Details" showBack>
        <div className="p-4 flex flex-col gap-4">
          {[1, 2, 3].map((i) => <div key={i} className="h-24 rounded-lg bg-muted shimmer" />)}
        </div>
      </AppShell>
    );
  }

  if (!ride || !driver) {
    return (
      <AppShell title="Ride Details" showBack>
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          Ride not found.
        </div>
      </AppShell>
    );
  }

  const isOwnRide = currentUser?.id === ride.driverId;

  return (
    <AppShell title="Ride Details" showBack>
      <div className="gradient-hero px-4 py-5">
        <div className="flex items-center gap-3">
          <div className="text-center">
            <p className="text-primary-foreground/70 text-xs font-medium uppercase tracking-wide">From</p>
            <p className="text-2xl font-bold text-primary-foreground">{ride.from}</p>
          </div>
          <ArrowRight size={24} className="text-accent shrink-0 mx-1" />
          <div className="text-center">
            <p className="text-primary-foreground/70 text-xs font-medium uppercase tracking-wide">To</p>
            <p className="text-2xl font-bold text-primary-foreground">{ride.to}</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-3xl font-bold text-accent">${ride.pricePerSeat}</p>
            <p className="text-primary-foreground/70 text-xs">per seat</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 flex flex-col gap-4">
        <div className="bg-card rounded-xl border border-border p-4 shadow-card">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">Trip Details</h3>
          <div className="flex flex-col gap-2.5">
            <InfoRow icon={Calendar} label="Date" value={formatDate(ride.date)} />
            <InfoRow icon={Clock} label="Departure" value={ride.departureTime} />
            <InfoRow icon={Users} label="Seats available"
              value={
                <span className={ride.availableSeats <= 1 ? "text-destructive font-semibold" : ""}>
                  {ride.availableSeats} of {ride.totalSeats} seats
                </span>
              }
            />
            <InfoRow icon={MapPin} label="Status">
              <Badge variant={ride.availableSeats > 0 ? "available" : "full"}>
                {ride.availableSeats > 0 ? "Available" : "Full"}
              </Badge>
            </InfoRow>
          </div>
          {ride.notes && (
            <div className="mt-3 pt-3 border-t border-border">
              <p className="text-xs font-medium text-muted-foreground mb-1">Driver Notes</p>
              <p className="text-sm text-foreground">{ride.notes}</p>
            </div>
          )}
        </div>

        <div className="bg-card rounded-xl border border-border p-4 shadow-card">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">Your Driver</h3>
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate(`/profile/${driver.id}`)}>
            <div className="relative shrink-0">
              <img src={driver.avatarUrl} alt={driver.name} className="w-16 h-16 rounded-full border-2 border-border" />
              {driver.isVerified && (
                <span className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-primary border-2 border-card flex items-center justify-center">
                  <CheckCircle2 size={11} className="text-primary-foreground" />
                </span>
              )}
            </div>
            <div className="flex-1">
              <p className="font-bold text-foreground">{driver.name}</p>
              {driver.reviewCount > 0
                ? <StarRating rating={driver.rating} showCount={driver.reviewCount} size="md" />
                : <span className="text-xs text-muted-foreground">New driver</span>}
              <div className="flex flex-wrap gap-1 mt-1.5">
                {driver.isVerified && <VerifiedBadge />}
                {driver.isPhoneVerified && <PhoneVerifiedBadge />}
              </div>
            </div>
          </div>
          {driver.bio && (
            <p className="mt-3 text-sm text-muted-foreground italic">&quot;{driver.bio}&quot;</p>
          )}
        </div>

        {reviews.length > 0 && (
          <div className="bg-card rounded-xl border border-border p-4 shadow-card">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">
              Reviews ({reviews.length})
            </h3>
            <div className="flex flex-col gap-3">
              {reviews.map((review) => (
                <div key={review.id} className="flex gap-3">
                  <img
                    src={review.reviewer?.avatarUrl ?? ""}
                    alt={review.reviewer?.name ?? ""}
                    className="w-8 h-8 rounded-full shrink-0 border border-border"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-foreground">
                        {review.reviewer?.name ?? "Community Member"}
                      </p>
                      <StarRating rating={review.rating} />
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">{review.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!isOwnRide && (
          <div className="flex flex-col gap-2 pt-2">
            {alreadyBooked ? (
              <div className="flex items-center justify-center gap-2 py-3 rounded-xl bg-[hsl(148_40%_94%)] border border-primary/30">
                <CheckCircle2 size={18} className="text-primary" />
                <p className="text-primary font-semibold">Booking Request Sent</p>
              </div>
            ) : ride.availableSeats > 0 ? (
              <Button onClick={handleBook} size="lg" className="w-full" disabled={booking}>
                <Users size={18} />
                {booking ? "Booking..." : "Book a Seat"}
              </Button>
            ) : (
              <Button disabled size="lg" className="w-full">Ride is Full</Button>
            )}
            <Button variant="outline" size="lg" className="w-full" onClick={handleChat}>
              <MessageCircle size={18} />
              Message Driver
            </Button>
          </div>
        )}
      </div>
    </AppShell>
  );
}

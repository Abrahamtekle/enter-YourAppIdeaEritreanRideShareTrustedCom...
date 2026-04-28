import { useParams, useNavigate } from "react-router-dom";
import { Calendar, Clock, MapPin, Users, MessageCircle, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AppShell } from "@/components/AppShell";
import { StarRating } from "@/components/StarRating";
import { VerifiedBadge, PhoneVerifiedBadge } from "@/components/VerifiedBadge";
import { useApp } from "@/context/AppContext";
import { MOCK_REVIEWS } from "@/data/mockData";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

function formatDate(dateStr: string) {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-CA", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function RideDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getRideById, getUserById, requestBooking, currentUser, bookings } = useApp();
  const [booked, setBooked] = useState(false);

  const ride = id ? getRideById(id) : undefined;
  const driver = ride ? getUserById(ride.driverId) : undefined;

  const alreadyBooked = bookings.some(
    (b) => b.rideId === id && b.passengerId === currentUser.id
  );

  const driverReviews = MOCK_REVIEWS.filter((r) => r.revieweeId === ride?.driverId);

  if (!ride || !driver) {
    return (
      <AppShell title="Ride Details" showBack>
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          Ride not found.
        </div>
      </AppShell>
    );
  }

  const handleBook = () => {
    requestBooking({
      id: `booking-${Date.now()}`,
      rideId: ride.id,
      passengerId: currentUser.id,
      status: "pending",
      createdAt: new Date().toISOString(),
    });
    setBooked(true);
    toast({
      title: "Booking request sent!",
      description: `Your request to join ${driver.name}'s ride has been sent.`,
    });
  };

  const handleChat = () => {
    navigate("/chat");
  };

  const isOwnRide = ride.driverId === currentUser.id;

  return (
    <AppShell title="Ride Details" showBack>
      {/* Route hero */}
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
        {/* Ride info card */}
        <div className="bg-card rounded-xl border border-border p-4 shadow-card">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">
            Trip Details
          </h3>
          <div className="flex flex-col gap-2.5">
            <InfoRow icon={Calendar} label="Date" value={formatDate(ride.date)} />
            <InfoRow icon={Clock} label="Departure" value={ride.departureTime} />
            <InfoRow
              icon={Users}
              label="Seats available"
              value={
                <span className={ride.availableSeats <= 1 ? "text-destructive font-semibold" : "text-foreground"}>
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

        {/* Driver card */}
        <div className="bg-card rounded-xl border border-border p-4 shadow-card">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">
            Your Driver
          </h3>
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate(`/profile/${driver.id}`)}
          >
            <div className="relative shrink-0">
              <img
                src={driver.avatarUrl}
                alt={driver.name}
                className="w-16 h-16 rounded-full border-2 border-border"
              />
              {driver.isVerified && (
                <span className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-primary border-2 border-card flex items-center justify-center">
                  <CheckCircle2 size={11} className="text-primary-foreground" />
                </span>
              )}
            </div>
            <div className="flex-1">
              <p className="font-bold text-foreground">{driver.name}</p>
              {driver.reviewCount > 0 ? (
                <StarRating rating={driver.rating} showCount={driver.reviewCount} size="md" />
              ) : (
                <span className="text-xs text-muted-foreground">New driver</span>
              )}
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

        {/* Reviews */}
        {driverReviews.length > 0 && (
          <div className="bg-card rounded-xl border border-border p-4 shadow-card">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">
              Reviews ({driverReviews.length})
            </h3>
            <div className="flex flex-col gap-3">
              {driverReviews.map((review) => {
                const reviewer = getUserById(review.reviewerId);
                return (
                  <div key={review.id} className="flex gap-3">
                    <img
                      src={reviewer?.avatarUrl ?? ""}
                      alt={reviewer?.name ?? "Reviewer"}
                      className="w-8 h-8 rounded-full shrink-0 border border-border"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-foreground">
                          {reviewer?.name ?? "Community Member"}
                        </p>
                        <StarRating rating={review.rating} />
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">{review.comment}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Action buttons */}
        {!isOwnRide && (
          <div className="flex flex-col gap-2 pt-2">
            {alreadyBooked || booked ? (
              <div className="flex items-center justify-center gap-2 py-3 rounded-xl bg-[hsl(148_40%_94%)] border border-primary/30">
                <CheckCircle2 size={18} className="text-primary" />
                <p className="text-primary font-semibold">Booking Request Sent</p>
              </div>
            ) : ride.availableSeats > 0 ? (
              <Button onClick={handleBook} size="lg" className="w-full">
                <Users size={18} />
                Book a Seat
              </Button>
            ) : (
              <Button disabled size="lg" className="w-full">
                Ride is Full
              </Button>
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

function InfoRow({
  icon: Icon,
  label,
  value,
  children,
}: {
  icon: React.FC<{ size?: number; className?: string }>;
  label: string;
  value?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
        <Icon size={16} className="text-primary" />
      </div>
      <div className="flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <div className="text-sm font-medium text-foreground">
          {value ?? children}
        </div>
      </div>
    </div>
  );
}

import { useNavigate } from "react-router-dom";
import { MapPin, Calendar, Users, ArrowRight, CheckCircle2 } from "lucide-react";
import type { Ride, User } from "@/types";
import { StarRating } from "./StarRating";
import { VerifiedBadge } from "./VerifiedBadge";
import { cn } from "@/lib/utils";

interface RideCardProps {
  ride: Ride;
  driver: User;
  className?: string;
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-CA", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function RideCard({ ride, driver, className }: RideCardProps) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/rides/${ride.id}`)}
      className={cn(
        "bg-card rounded-lg border border-border cursor-pointer group",
        "transition-all duration-150 hover:shadow-card-hover hover:-translate-y-0.5",
        "shadow-card animate-fade-up",
        className
      )}
    >
      {/* Driver row */}
      <div className="p-4 flex items-center gap-3">
        <div className="relative shrink-0">
          <img
            src={driver.avatarUrl}
            alt={driver.name}
            className="w-11 h-11 rounded-full object-cover border-2 border-border"
          />
          {driver.isVerified && (
            <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-primary border-2 border-card flex items-center justify-center">
              <CheckCircle2 size={9} className="text-primary-foreground" />
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-sm text-card-foreground truncate">{driver.name}</p>
          {driver.reviewCount > 0 ? (
            <StarRating rating={driver.rating} showCount={driver.reviewCount} />
          ) : (
            <span className="text-xs text-muted-foreground">New driver</span>
          )}
        </div>
        <div className="text-right shrink-0">
          <p className="text-xl font-bold text-primary">${ride.pricePerSeat}</p>
          <p className="text-xs text-muted-foreground">per seat</p>
        </div>
      </div>

      {/* Route row */}
      <div className="px-4 pb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-card-foreground">{ride.from}</span>
          <ArrowRight size={18} className="text-primary shrink-0" />
          <span className="text-lg font-bold text-card-foreground">{ride.to}</span>
        </div>
      </div>

      {/* Meta row */}
      <div className="px-4 pb-3 flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Calendar size={12} />
          {formatDate(ride.date)} · {ride.departureTime}
        </span>
        <span className="flex items-center gap-1">
          <Users size={12} />
          <span className={ride.availableSeats <= 1 ? "text-destructive font-medium" : ""}>
            {ride.availableSeats} seat{ride.availableSeats !== 1 ? "s" : ""} left
          </span>
        </span>
        <span className="flex items-center gap-1">
          <MapPin size={12} />
          {ride.availableSeats > 0 ? "Available" : "Full"}
        </span>
      </div>

      {/* Trust strip */}
      {driver.isVerified && (
        <div className="px-4 pb-3 pt-2 border-t border-border">
          <VerifiedBadge />
        </div>
      )}
    </div>
  );
}

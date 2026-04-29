import { useParams, useNavigate } from "react-router-dom";
import { Settings, MapPin, ArrowRight, Calendar, CheckCircle2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AppShell } from "@/components/AppShell";
import { StarRating } from "@/components/StarRating";
import { VerifiedBadge, PhoneVerifiedBadge } from "@/components/VerifiedBadge";
import { useApp } from "@/context/AppContext";
import { supabase } from "@/integrations/supabase/client";
import { mapProfile, mapRide } from "@/lib/db";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import type { User, Ride } from "@/types";

function formatDate(dateStr: string) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-CA", {
    month: "short", day: "numeric", year: "numeric",
  });
}

function MiniRideCard({ ride, onClick }: { ride: Ride; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-card rounded-xl border border-border p-3.5 text-left hover:shadow-card-hover transition-all shadow-card"
    >
      <div className="flex items-center gap-2">
        <span className="font-bold text-foreground">{ride.from}</span>
        <ArrowRight size={14} className="text-primary shrink-0" />
        <span className="font-bold text-foreground">{ride.to}</span>
        <div className="ml-auto">
          <Badge variant={ride.availableSeats > 0 ? "available" : "full"}>
            {ride.availableSeats > 0 ? "Active" : "Full"}
          </Badge>
        </div>
      </div>
      <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><Calendar size={11} />{formatDate(ride.date)}</span>
        <span className="flex items-center gap-1"><MapPin size={11} />${ride.pricePerSeat}/seat</span>
      </div>
    </button>
  );
}

export default function Profile() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { currentUser, isLoggedIn, logout } = useApp();
  const [tab, setTab] = useState<"posted" | "booked">("posted");
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [postedRides, setPostedRides] = useState<Ride[]>([]);
  const [bookedRides, setBookedRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);

  const isOwn = !id || id === currentUser?.id;
  const userId = isOwn ? currentUser?.id : id;

  useEffect(() => {
    if (!userId) { setLoading(false); return; }

    const fetchData = async () => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (profile) setProfileUser(mapProfile(profile as Record<string, unknown>));

      const { data: posted } = await supabase
        .from("rides")
        .select("*")
        .eq("driver_id", userId)
        .order("created_at", { ascending: false });

      if (posted) setPostedRides(posted.map((r) => mapRide(r as Record<string, unknown>)));

      if (isOwn) {
        const { data: bookings } = await supabase
          .from("bookings")
          .select("ride_id, rides(*)")
          .eq("passenger_id", userId);

        if (bookings) {
          setBookedRides(
            bookings
              .filter((b) => b.rides)
              .map((b) => mapRide(b.rides as Record<string, unknown>))
          );
        }
      }

      setLoading(false);
    };

    fetchData();
  }, [userId, isOwn]);

  const user = isOwn ? currentUser : profileUser;

  if (!isLoggedIn && isOwn) {
    return (
      <AppShell title="Profile">
        <div className="flex flex-col items-center justify-center py-20 gap-4 px-6 text-center">
          <p className="text-muted-foreground">Sign in to view your profile.</p>
          <Button onClick={() => navigate("/login")}>Sign In</Button>
        </div>
      </AppShell>
    );
  }

  if (loading) {
    return (
      <AppShell title="Profile" showBack={!isOwn}>
        <div className="p-4 flex flex-col gap-4">
          {[1, 2, 3].map((i) => <div key={i} className="h-24 rounded-lg bg-muted shimmer" />)}
        </div>
      </AppShell>
    );
  }

  if (!user) {
    return (
      <AppShell title="Profile" showBack>
        <div className="flex items-center justify-center py-20 text-muted-foreground">User not found.</div>
      </AppShell>
    );
  }

  return (
    <AppShell title={isOwn ? "My Profile" : user.name} showBack={!isOwn}>
      {/* Header */}
      <div className="gradient-hero px-4 pt-6 pb-10">
        <div className="flex items-start gap-4">
          <div className="relative shrink-0">
            <img src={user.avatarUrl} alt={user.name} className="w-20 h-20 rounded-full border-4 border-primary-foreground/30 object-cover" />
            {user.isVerified && (
              <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary border-2 border-primary-foreground flex items-center justify-center">
                <CheckCircle2 size={13} className="text-primary-foreground" />
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-primary-foreground">{user.name}</h2>
            {user.reviewCount > 0
              ? <div className="mt-1"><StarRating rating={user.rating} showCount={user.reviewCount} size="md" /></div>
              : <p className="text-primary-foreground/70 text-sm mt-1">No reviews yet</p>}
            <p className="text-primary-foreground/60 text-xs mt-1">Member since {user.memberSince}</p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {user.isVerified && <VerifiedBadge />}
              {user.isPhoneVerified && <PhoneVerifiedBadge />}
            </div>
          </div>
          {isOwn && (
            <button className="p-2 rounded-full hover:bg-primary-foreground/10 transition-colors text-primary-foreground/70">
              <Settings size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Info card */}
      <div className="-mt-5 mx-4 bg-card rounded-xl border border-border shadow-card p-4 mb-4">
        {user.bio && (
          <p className="text-sm text-muted-foreground italic mb-3 pb-3 border-b border-border">
            &quot;{user.bio}&quot;
          </p>
        )}
        <div className="flex gap-4 text-center">
          <div className="flex-1">
            <p className="text-2xl font-bold text-primary">{user.reviewCount}</p>
            <p className="text-xs text-muted-foreground">Reviews</p>
          </div>
          <div className="w-px bg-border" />
          <div className="flex-1">
            <p className="text-2xl font-bold text-primary">{postedRides.length}</p>
            <p className="text-xs text-muted-foreground">Rides Posted</p>
          </div>
          <div className="w-px bg-border" />
          <div className="flex-1">
            <p className="text-2xl font-bold text-primary">{bookedRides.length}</p>
            <p className="text-xs text-muted-foreground">Rides Taken</p>
          </div>
        </div>
      </div>

      {isOwn && (
        <div className="px-4 mb-4">
          <div className="flex rounded-lg border border-border overflow-hidden">
            {(["posted", "booked"] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={cn(
                  "flex-1 py-2.5 text-sm font-semibold transition-colors",
                  tab === t ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:bg-muted"
                )}>
                {t === "posted" ? "Posted Rides" : "Booked Rides"}
              </button>
            ))}
          </div>

          <div className="mt-3 flex flex-col gap-2">
            {tab === "posted" && (
              postedRides.length === 0
                ? <EmptyState message="You haven't posted any rides yet." action={() => navigate("/post-ride")} actionLabel="Post a Ride" />
                : postedRides.map((ride) => <MiniRideCard key={ride.id} ride={ride} onClick={() => navigate(`/rides/${ride.id}`)} />)
            )}
            {tab === "booked" && (
              bookedRides.length === 0
                ? <EmptyState message="You haven't booked any rides yet." action={() => navigate("/")} actionLabel="Find a Ride" />
                : bookedRides.map((ride) => <MiniRideCard key={ride.id} ride={ride} onClick={() => navigate(`/rides/${ride.id}`)} />)
            )}
          </div>
        </div>
      )}

      {isOwn && (
        <div className="px-4 pb-6">
          <Button variant="ghost" className="w-full text-muted-foreground"
            onClick={async () => { await logout(); navigate("/login"); }}>
            <LogOut size={16} />
            Sign Out
          </Button>
        </div>
      )}
    </AppShell>
  );
}

function EmptyState({ message, action, actionLabel }: { message: string; action: () => void; actionLabel: string }) {
  return (
    <div className="text-center py-8 flex flex-col items-center gap-3">
      <p className="text-sm text-muted-foreground">{message}</p>
      <Button variant="outline" size="sm" onClick={action}>{actionLabel}</Button>
    </div>
  );
}

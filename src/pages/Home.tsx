import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftRight, Search, MapPin, Star, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppShell } from "@/components/AppShell";
import { RideCard } from "@/components/RideCard";
import { supabase } from "@/integrations/supabase/client";
import { mapRide, mapProfile } from "@/lib/db";
import type { Ride, User } from "@/types";

const CANADIAN_CITIES = [
  "Calgary", "Edmonton", "Red Deer", "Lethbridge", "Medicine Hat",
  "Fort McMurray", "Vancouver", "Toronto", "Winnipeg", "Ottawa",
];

interface RideWithDriver { ride: Ride; driver: User }

export default function Home() {
  const navigate = useNavigate();
  const [from, setFrom] = useState("Calgary");
  const [to, setTo] = useState("Edmonton");
  const [date, setDate] = useState("");
  const [featured, setFeatured] = useState<RideWithDriver[]>([]);
  const [loadingRides, setLoadingRides] = useState(true);

  useEffect(() => {
    const fetchRides = async () => {
      const { data } = await supabase
        .from("rides")
        .select("*, profiles!driver_id(*)")
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(3);

      if (data) {
        const mapped = data.map((r) => ({
          ride: mapRide(r as Record<string, unknown>),
          driver: mapProfile((r as Record<string, unknown>).profiles as Record<string, unknown>),
        }));
        setFeatured(mapped);
      }
      setLoadingRides(false);
    };
    fetchRides();
  }, []);

  const handleSwap = () => { setFrom(to); setTo(from); };

  const handleSearch = () => {
    const params = new URLSearchParams({ from, to });
    if (date) params.set("date", date);
    navigate(`/rides?${params.toString()}`);
  };

  return (
    <AppShell>
      {/* Hero */}
      <div className="gradient-hero px-4 pt-6 pb-8">
        <p className="text-primary-foreground/70 text-sm font-medium mb-1 tracking-wide uppercase">
          Eritrean Community
        </p>
        <h2 className="text-3xl font-bold text-primary-foreground leading-tight mb-1">
          Ride Together.
        </h2>
        <h2 className="text-3xl font-bold text-accent leading-tight mb-6">
          Trust Together.
        </h2>

        {/* Search Card */}
        <div className="bg-card rounded-xl p-4 shadow-card-hover">
          <div className="flex flex-col gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">From</label>
              <div className="relative">
                <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" />
                <select
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 rounded-lg border border-border bg-background text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring appearance-none"
                >
                  {CANADIAN_CITIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleSwap}
                className="p-2 rounded-full bg-accent-subtle border border-trust-border hover:bg-accent/20 transition-colors"
              >
                <ArrowLeftRight size={16} className="text-accent-foreground" />
              </button>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">To</label>
              <div className="relative">
                <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" />
                <select
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 rounded-lg border border-border bg-background text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring appearance-none"
                >
                  {CANADIAN_CITIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Date (optional)</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <Button onClick={handleSearch} className="w-full mt-1" size="lg">
              <Search size={18} />
              Find Rides
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-card border-b border-border">
        <div className="flex divide-x divide-border">
          {[
            { icon: Users, label: "Riders", value: "200+" },
            { icon: MapPin, label: "Cities", value: "10" },
            { icon: Star, label: "Avg Rating", value: "4.8" },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex-1 flex flex-col items-center py-3 gap-0.5">
              <Icon size={16} className="text-primary" />
              <p className="text-lg font-bold text-foreground">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Featured rides */}
      <div className="px-4 pt-5 pb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-foreground">Available Rides</h3>
          <button
            onClick={() => navigate("/rides?from=Calgary&to=Edmonton")}
            className="text-sm text-primary font-semibold"
          >
            See all
          </button>
        </div>

        {loadingRides ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 rounded-lg bg-muted shimmer" />
            ))}
          </div>
        ) : featured.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground text-sm">
            No rides yet. Be the first to post one!
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {featured.map(({ ride, driver }) => (
              <RideCard key={ride.id} ride={ride} driver={driver} />
            ))}
          </div>
        )}
      </div>

      {/* Community CTA */}
      <div className="mx-4 mb-6 rounded-xl bg-accent-subtle border border-trust-border p-4">
        <p className="text-sm font-semibold text-trust-text mb-1">
          Trusted by the Eritrean Community
        </p>
        <p className="text-xs text-trust-text/80">
          All drivers are community members. We focus on safety, trust, and familiar faces.
        </p>
      </div>
    </AppShell>
  );
}

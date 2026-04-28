import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftRight, Search, MapPin, Star, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppShell } from "@/components/AppShell";
import { RideCard } from "@/components/RideCard";
import { useApp } from "@/context/AppContext";
import { CANADIAN_CITIES } from "@/data/mockData";

export default function Home() {
  const navigate = useNavigate();
  const { rides, getUserById } = useApp();
  const [from, setFrom] = useState("Calgary");
  const [to, setTo] = useState("Edmonton");
  const [date, setDate] = useState("");

  const handleSwap = () => {
    setFrom(to);
    setTo(from);
  };

  const handleSearch = () => {
    const params = new URLSearchParams({ from, to });
    if (date) params.set("date", date);
    navigate(`/rides?${params.toString()}`);
  };

  // Featured rides (first 3 active rides)
  const featuredRides = rides.filter((r) => r.status === "active").slice(0, 3);

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
            {/* From */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">From</label>
              <div className="relative">
                <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" />
                <select
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 rounded-lg border border-border bg-background text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring appearance-none"
                >
                  {CANADIAN_CITIES.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Swap button */}
            <div className="flex justify-center">
              <button
                onClick={handleSwap}
                className="p-2 rounded-full bg-accent-subtle border border-trust-border hover:bg-accent/20 transition-colors"
              >
                <ArrowLeftRight size={16} className="text-accent-foreground" />
              </button>
            </div>

            {/* To */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">To</label>
              <div className="relative">
                <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" />
                <select
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 rounded-lg border border-border bg-background text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring appearance-none"
                >
                  {CANADIAN_CITIES.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date */}
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

      {/* Stats strip */}
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
        <div className="flex flex-col gap-3">
          {featuredRides.map((ride) => {
            const driver = getUserById(ride.driverId);
            if (!driver) return null;
            return <RideCard key={ride.id} ride={ride} driver={driver} />;
          })}
        </div>
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

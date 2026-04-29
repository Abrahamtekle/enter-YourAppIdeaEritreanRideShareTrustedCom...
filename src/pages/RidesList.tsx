import { useSearchParams } from "react-router-dom";
import { ArrowRight, SearchX } from "lucide-react";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { RideCard } from "@/components/RideCard";
import { supabase } from "@/integrations/supabase/client";
import { mapRide, mapProfile } from "@/lib/db";
import type { Ride, User } from "@/types";

interface RideWithDriver { ride: Ride; driver: User }

export default function RidesList() {
  const [searchParams] = useSearchParams();
  const from = searchParams.get("from") ?? "";
  const to = searchParams.get("to") ?? "";
  const date = searchParams.get("date") ?? "";

  const [results, setResults] = useState<RideWithDriver[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRides = async () => {
      setLoading(true);
      let query = supabase
        .from("rides")
        .select("*, profiles!driver_id(*)")
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (from) query = query.ilike("from_city", `%${from}%`);
      if (to) query = query.ilike("to_city", `%${to}%`);
      if (date) query = query.eq("ride_date", date);

      const { data } = await query;
      if (data) {
        setResults(data.map((r) => ({
          ride: mapRide(r as Record<string, unknown>),
          driver: mapProfile((r as Record<string, unknown>).profiles as Record<string, unknown>),
        })));
      }
      setLoading(false);
    };
    fetchRides();
  }, [from, to, date]);

  const title = from && to ? `${from} → ${to}` : from ? `From ${from}` : to ? `To ${to}` : "All Rides";

  return (
    <AppShell title={title} showBack>
      <div className="px-4 pt-4 pb-2">
        {date && (
          <p className="text-xs text-muted-foreground mb-3">
            Date: {new Date(date + "T00:00:00").toLocaleDateString("en-CA", {
              weekday: "long", month: "long", day: "numeric",
            })}
          </p>
        )}
        {!loading && (
          <p className="text-sm font-medium text-foreground">
            {results.length} ride{results.length !== 1 ? "s" : ""} found
          </p>
        )}
      </div>

      <div className="px-4 pb-4 flex flex-col gap-3">
        {loading ? (
          [1, 2, 3].map((i) => <div key={i} className="h-32 rounded-lg bg-muted shimmer" />)
        ) : results.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <SearchX size={28} className="text-muted-foreground" />
            </div>
            <div>
              <p className="font-semibold text-foreground">No rides found</p>
              <p className="text-sm text-muted-foreground mt-1">
                Try different cities or check back later.
              </p>
            </div>
          </div>
        ) : (
          results.map(({ ride, driver }) => (
            <div key={ride.id} className="animate-fade-up">
              <RideCard ride={ride} driver={driver} />
            </div>
          ))
        )}
      </div>

      {results.length > 0 && (
        <p className="px-4 pb-6 text-xs text-center text-muted-foreground flex items-center justify-center gap-1">
          <ArrowRight size={12} />
          Tap any ride to view details and book
        </p>
      )}
    </AppShell>
  );
}

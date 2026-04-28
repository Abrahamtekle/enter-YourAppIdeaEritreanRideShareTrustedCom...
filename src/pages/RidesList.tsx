import { useSearchParams } from "react-router-dom";
import { ArrowRight, SearchX } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { RideCard } from "@/components/RideCard";
import { useApp } from "@/context/AppContext";

export default function RidesList() {
  const [searchParams] = useSearchParams();
  const from = searchParams.get("from") ?? "";
  const to = searchParams.get("to") ?? "";
  const date = searchParams.get("date") ?? "";
  const { searchRides, getUserById } = useApp();

  const results = searchRides(from, to, date || undefined);

  const title =
    from && to ? `${from} → ${to}` : from ? `From ${from}` : to ? `To ${to}` : "All Rides";

  return (
    <AppShell title={title} showBack>
      {/* Filter summary */}
      <div className="px-4 pt-4 pb-2">
        {date && (
          <p className="text-xs text-muted-foreground mb-3">
            Date: {new Date(date + "T00:00:00").toLocaleDateString("en-CA", {
              weekday: "long", month: "long", day: "numeric"
            })}
          </p>
        )}
        <p className="text-sm font-medium text-foreground">
          {results.length} ride{results.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {/* Results */}
      <div className="px-4 pb-4 flex flex-col gap-3">
        {results.length === 0 ? (
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
          results.map((ride) => {
            const driver = getUserById(ride.driverId);
            if (!driver) return null;
            return (
              <div key={ride.id} className="animate-fade-up">
                <RideCard ride={ride} driver={driver} />
              </div>
            );
          })
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

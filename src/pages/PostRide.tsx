import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Calendar, DollarSign, Users, CheckCircle2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppShell } from "@/components/AppShell";
import { useApp } from "@/context/AppContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const CANADIAN_CITIES = [
  "Calgary", "Edmonton", "Red Deer", "Lethbridge", "Medicine Hat",
  "Fort McMurray", "Vancouver", "Toronto", "Winnipeg", "Ottawa",
];

const STEPS = ["Route", "Schedule", "Details", "Review"];

export default function PostRide() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentUser, isLoggedIn } = useApp();

  const [step, setStep] = useState(0);
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    from: "Calgary",
    to: "Edmonton",
    date: "",
    departureTime: "08:00",
    pricePerSeat: 35,
    totalSeats: 3,
    notes: "",
  });

  const setField = <K extends keyof typeof form>(key: K, value: typeof form[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const handlePublish = async () => {
    if (!isLoggedIn || !currentUser) { navigate("/login"); return; }
    setLoading(true);

    const { error } = await supabase.from("rides").insert({
      driver_id: currentUser.id,
      from_city: form.from,
      to_city: form.to,
      ride_date: form.date,
      departure_time: form.departureTime,
      price_per_seat: form.pricePerSeat,
      total_seats: form.totalSeats,
      available_seats: form.totalSeats,
      notes: form.notes,
      status: "active",
    });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setPublished(true);
      toast({ title: "Ride posted!", description: "Your ride is now live." });
    }
    setLoading(false);
  };

  if (published) {
    return (
      <AppShell title="Post a Ride" showBack>
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center gap-5">
          <div className="w-20 h-20 rounded-full bg-[hsl(148_40%_94%)] border-2 border-primary flex items-center justify-center">
            <CheckCircle2 size={40} className="text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Ride Published!</h2>
            <p className="text-muted-foreground mt-2">
              Your ride from <strong>{form.from}</strong> to <strong>{form.to}</strong> is now live.
            </p>
          </div>
          <Button onClick={() => navigate("/")} className="w-full" size="lg">Back to Home</Button>
          <Button variant="outline" onClick={() => { setPublished(false); setStep(0); }} size="lg" className="w-full">
            Post Another Ride
          </Button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Post a Ride" showBack>
      {/* Step indicator */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center justify-between mb-1">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center">
              <div className={cn(
                "flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-all",
                i < step ? "bg-primary text-primary-foreground"
                  : i === step ? "bg-accent text-accent-foreground"
                  : "bg-muted text-muted-foreground"
              )}>
                {i < step ? <CheckCircle2 size={14} /> : i + 1}
              </div>
              {i < STEPS.length - 1 && (
                <div className={cn("h-0.5 mx-1 w-8", i < step ? "bg-primary" : "bg-border")} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-1">
          {STEPS.map((label, i) => (
            <span key={label} className={cn("text-[10px] font-medium", i === step ? "text-foreground" : "text-muted-foreground")}>
              {label}
            </span>
          ))}
        </div>
      </div>

      <div className="px-4 py-4">
        {step === 0 && (
          <div className="flex flex-col gap-4 animate-fade-up">
            <h2 className="text-xl font-bold text-foreground">Where are you going?</h2>
            <FormField label="From city" icon={MapPin}>
              <select value={form.from} onChange={(e) => setField("from", e.target.value)} className="form-select w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring appearance-none">
                {CANADIAN_CITIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </FormField>
            <div className="flex items-center justify-center">
              <ChevronRight size={20} className="text-muted-foreground rotate-90" />
            </div>
            <FormField label="To city" icon={MapPin}>
              <select value={form.to} onChange={(e) => setField("to", e.target.value)} className="form-select w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring appearance-none">
                {CANADIAN_CITIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </FormField>
          </div>
        )}

        {step === 1 && (
          <div className="flex flex-col gap-4 animate-fade-up">
            <h2 className="text-xl font-bold text-foreground">When are you leaving?</h2>
            <FormField label="Date" icon={Calendar}>
              <input type="date" value={form.date} onChange={(e) => setField("date", e.target.value)} className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </FormField>
            <FormField label="Departure time" icon={Calendar}>
              <input type="time" value={form.departureTime} onChange={(e) => setField("departureTime", e.target.value)} className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </FormField>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-4 animate-fade-up">
            <h2 className="text-xl font-bold text-foreground">Trip details</h2>
            <FormField label="Price per seat (CAD $)" icon={DollarSign}>
              <input type="number" min={1} max={200} value={form.pricePerSeat} onChange={(e) => setField("pricePerSeat", Number(e.target.value))} className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </FormField>
            <FormField label="Available seats" icon={Users}>
              <input type="number" min={1} max={8} value={form.totalSeats} onChange={(e) => setField("totalSeats", Number(e.target.value))} className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </FormField>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Notes for passengers (optional)</label>
              <textarea
                value={form.notes}
                onChange={(e) => setField("notes", e.target.value)}
                placeholder="e.g. Stopping at Red Deer, pickup location..."
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-4 animate-fade-up">
            <h2 className="text-xl font-bold text-foreground">Review & Publish</h2>
            <div className="bg-card rounded-xl border border-border p-4 flex flex-col gap-2 shadow-card">
              <ReviewRow label="From" value={form.from} />
              <ReviewRow label="To" value={form.to} />
              <ReviewRow label="Date" value={form.date || "—"} />
              <ReviewRow label="Time" value={form.departureTime} />
              <ReviewRow label="Price" value={`$${form.pricePerSeat} / seat`} />
              <ReviewRow label="Seats" value={String(form.totalSeats)} />
              {form.notes && <ReviewRow label="Notes" value={form.notes} />}
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex gap-3 mt-6">
          {step > 0 && (
            <Button variant="outline" onClick={() => setStep(step - 1)} className="flex-1">Back</Button>
          )}
          {step < STEPS.length - 1 ? (
            <Button
              onClick={() => setStep(step + 1)}
              className="flex-1"
              disabled={step === 1 && !form.date}
            >
              Next
            </Button>
          ) : (
            <Button onClick={handlePublish} className="flex-1" disabled={loading}>
              {loading ? "Publishing..." : "Publish Ride"}
            </Button>
          )}
        </div>
      </div>
    </AppShell>
  );
}

function FormField({ label, icon: Icon, children }: { label: string; icon: React.FC<{ size?: number; className?: string }>; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1 block">
        <Icon size={12} className="text-primary" />{label}
      </label>
      {children}
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}

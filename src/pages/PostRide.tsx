import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Calendar, DollarSign, Users, CheckCircle2, ArrowRight, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppShell } from "@/components/AppShell";
import { useApp } from "@/context/AppContext";
import { CANADIAN_CITIES } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import type { Ride } from "@/types";
import { cn } from "@/lib/utils";

const STEPS = ["Route", "Schedule", "Details", "Review"];

export default function PostRide() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addRide, currentUser } = useApp();

  const [step, setStep] = useState(0);
  const [published, setPublished] = useState(false);
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

  const handlePublish = () => {
    const ride: Ride = {
      id: `ride-${Date.now()}`,
      driverId: currentUser.id,
      from: form.from,
      to: form.to,
      date: form.date,
      departureTime: form.departureTime,
      pricePerSeat: form.pricePerSeat,
      totalSeats: form.totalSeats,
      availableSeats: form.totalSeats,
      notes: form.notes,
      status: "active",
      createdAt: new Date().toISOString(),
    };
    addRide(ride);
    setPublished(true);
    toast({ title: "Ride posted!", description: "Your ride is now live." });
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
          <Button onClick={() => navigate("/")} className="w-full" size="lg">
            Back to Home
          </Button>
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
              <div
                className={cn(
                  "flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-all",
                  i < step
                    ? "bg-primary text-primary-foreground"
                    : i === step
                    ? "bg-accent text-accent-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {i < step ? <CheckCircle2 size={14} /> : i + 1}
              </div>
              {i < STEPS.length - 1 && (
                <div className={cn("flex-1 h-0.5 mx-1 w-8", i < step ? "bg-primary" : "bg-border")} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-1">
          {STEPS.map((label, i) => (
            <span
              key={label}
              className={cn(
                "text-[10px] font-medium",
                i === step ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      <div className="px-4 py-4">
        {/* Step 0: Route */}
        {step === 0 && (
          <div className="flex flex-col gap-4 animate-fade-up">
            <h2 className="text-xl font-bold text-foreground">Where are you going?</h2>
            <Field label="From city" icon={MapPin}>
              <select
                value={form.from}
                onChange={(e) => setField("from", e.target.value)}
                className="form-select"
              >
                {CANADIAN_CITIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <div className="flex items-center justify-center">
              <ChevronRight size={20} className="text-muted-foreground rotate-90" />
            </div>
            <Field label="To city" icon={MapPin}>
              <select
                value={form.to}
                onChange={(e) => setField("to", e.target.value)}
                className="form-select"
              >
                {CANADIAN_CITIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>
          </div>
        )}

        {/* Step 1: Schedule */}
        {step === 1 && (
          <div className="flex flex-col gap-4 animate-fade-up">
            <h2 className="text-xl font-bold text-foreground">When are you leaving?</h2>
            <Field label="Date" icon={Calendar}>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setField("date", e.target.value)}
                className="form-input"
              />
            </Field>
            <Field label="Departure time" icon={Calendar}>
              <input
                type="time"
                value={form.departureTime}
                onChange={(e) => setField("departureTime", e.target.value)}
                className="form-input"
              />
            </Field>
          </div>
        )}

        {/* Step 2: Details */}
        {step === 2 && (
          <div className="flex flex-col gap-4 animate-fade-up">
            <h2 className="text-xl font-bold text-foreground">Trip details</h2>
            <Field label="Price per seat (CAD $)" icon={DollarSign}>
              <input
                type="number"
                min={1}
                max={200}
                value={form.pricePerSeat}
                onChange={(e) => setField("pricePerSeat", Number(e.target.value))}
                className="form-input"
              />
            </Field>
            <Field label="Available seats" icon={Users}>
              <input
                type="number"
                min={1}
                max={8}
                value={form.totalSeats}
                onChange={(e) => setField("totalSeats", Number(e.target.value))}
                className="form-input"
              />
            </Field>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                Notes for passengers (optional)
              </label>
              <textarea
                rows={3}
                value={form.notes}
                onChange={(e) => setField("notes", e.target.value)}
                placeholder="e.g., pickup location, rest stops, car type..."
                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
            </div>
          </div>
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <div className="flex flex-col gap-4 animate-fade-up">
            <h2 className="text-xl font-bold text-foreground">Review your ride</h2>
            <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
              <div className="gradient-hero px-4 py-4">
                <div className="flex items-center gap-3">
                  <span className="text-xl font-bold text-primary-foreground">{form.from}</span>
                  <ArrowRight size={20} className="text-accent" />
                  <span className="text-xl font-bold text-primary-foreground">{form.to}</span>
                  <span className="ml-auto text-2xl font-bold text-accent">${form.pricePerSeat}</span>
                </div>
              </div>
              <div className="px-4 py-4 flex flex-col gap-2">
                <ReviewRow label="Date" value={form.date ? new Date(form.date + "T00:00:00").toLocaleDateString("en-CA", { weekday: "short", month: "short", day: "numeric" }) : "—"} />
                <ReviewRow label="Departure" value={form.departureTime} />
                <ReviewRow label="Seats" value={`${form.totalSeats} seats available`} />
                {form.notes && <ReviewRow label="Notes" value={form.notes} />}
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-3 mt-6">
          {step > 0 && (
            <Button variant="outline" onClick={() => setStep((s) => s - 1)} className="flex-1">
              Back
            </Button>
          )}
          {step < 3 ? (
            <Button
              onClick={() => setStep((s) => s + 1)}
              className="flex-1"
              disabled={step === 1 && !form.date}
            >
              Continue
            </Button>
          ) : (
            <Button onClick={handlePublish} variant="accent" className="flex-1">
              <CheckCircle2 size={18} />
              Publish Ride
            </Button>
          )}
        </div>
      </div>
    </AppShell>
  );
}

function Field({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon: React.FC<{ size?: number; className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1.5 block">
        <Icon size={12} className="text-primary" />
        {label}
      </label>
      <div className="[&_select]:w-full [&_select]:px-4 [&_select]:py-3 [&_select]:rounded-lg [&_select]:border [&_select]:border-border [&_select]:bg-background [&_select]:text-foreground [&_select]:text-sm [&_select]:font-medium [&_select]:focus:outline-none [&_select]:focus:ring-2 [&_select]:focus:ring-ring [&_select]:appearance-none [&_input]:w-full [&_input]:px-4 [&_input]:py-3 [&_input]:rounded-lg [&_input]:border [&_input]:border-border [&_input]:bg-background [&_input]:text-foreground [&_input]:text-sm [&_input]:focus:outline-none [&_input]:focus:ring-2 [&_input]:focus:ring-ring">
        {children}
      </div>
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

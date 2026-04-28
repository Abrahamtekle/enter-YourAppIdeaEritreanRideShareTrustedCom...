import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Phone, ChevronLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";
import type { User as UserType } from "@/types";

export default function Signup() {
  const navigate = useNavigate();
  const { login } = useApp();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSignup = () => {
    if (!name.trim() || !phone.trim()) return;
    setLoading(true);

    setTimeout(() => {
      const newUser: UserType = {
        id: `user-${Date.now()}`,
        name: name.trim(),
        phone,
        avatarUrl: `https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(name)}&backgroundColor=1B6B3A&shapeColor=C9920A`,
        isVerified: false,
        isPhoneVerified: true,
        rating: 0,
        reviewCount: 0,
        memberSince: new Date().toLocaleDateString("en-CA", { month: "long", year: "numeric" }),
      };
      login(newUser);
      setDone(true);
      setLoading(false);
    }, 800);
  };

  if (done) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 gap-6 text-center">
        <div className="w-20 h-20 rounded-full bg-[hsl(148_40%_94%)] border-2 border-primary flex items-center justify-center">
          <CheckCircle2 size={40} className="text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">Welcome, {name}!</h2>
          <p className="text-muted-foreground mt-2 text-sm">
            Your account is ready. Start finding rides in your community.
          </p>
        </div>
        <Button size="lg" className="w-full" onClick={() => navigate("/")}>
          Find Rides
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="gradient-hero px-4 pt-10 pb-10 flex flex-col">
        <button
          onClick={() => navigate("/login")}
          className="self-start flex items-center gap-1 text-primary-foreground/70 hover:text-primary-foreground mb-4 text-sm"
        >
          <ChevronLeft size={16} />
          Back
        </button>
        <h1 className="text-2xl font-bold text-primary-foreground">Create Account</h1>
        <p className="text-primary-foreground/70 text-sm mt-1">
          Join the Eritrean ride community
        </p>
      </div>

      {/* Form */}
      <div className="flex-1 px-6 py-8 flex flex-col gap-5">
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1 block">
            <User size={12} className="text-primary" />
            Full name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Dawit Tesfaye"
            className="w-full px-4 py-3.5 rounded-lg border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1 block">
            <Phone size={12} className="text-primary" />
            Phone number
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1 (403) 555-0000"
            className="w-full px-4 py-3.5 rounded-lg border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="bg-accent-subtle border border-trust-border rounded-lg p-3">
          <p className="text-xs font-semibold text-trust-text mb-1">Community Verification</p>
          <p className="text-xs text-trust-text/80">
            Phone verification keeps our community safe. Verified members get a badge on their profile.
          </p>
        </div>

        <Button
          onClick={handleSignup}
          disabled={!name.trim() || !phone.trim() || loading}
          size="lg"
          className="w-full mt-2"
        >
          {loading ? "Creating account..." : "Create Account"}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          Already have an account?{" "}
          <button className="text-primary font-semibold" onClick={() => navigate("/login")}>
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}

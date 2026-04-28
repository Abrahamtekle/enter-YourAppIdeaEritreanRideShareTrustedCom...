import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Phone, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";
import { MOCK_USERS } from "@/data/mockData";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useApp();
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (!phone.trim()) {
      setError("Please enter your phone number.");
      return;
    }
    setLoading(true);
    setError("");

    // Demo: find user by phone or log in as demo user
    setTimeout(() => {
      const found = MOCK_USERS.find((u) =>
        u.phone.replace(/\D/g, "").endsWith(phone.replace(/\D/g, ""))
      );
      if (found) {
        login(found);
        navigate("/");
      } else {
        // Demo: just proceed as demo user
        navigate("/signup");
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero */}
      <div className="gradient-hero px-6 pt-16 pb-12 flex flex-col items-center text-center">
        <div className="w-20 h-20 rounded-2xl bg-primary-foreground/10 border border-primary-foreground/20 flex items-center justify-center mb-4">
          <Phone size={36} className="text-accent" />
        </div>
        <h1 className="text-3xl font-bold text-primary-foreground">HabeshaRide</h1>
        <p className="text-primary-foreground/70 mt-2 text-base">
          Trusted rides for the Eritrean community
        </p>
      </div>

      {/* Form */}
      <div className="flex-1 px-6 py-8 flex flex-col gap-5">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Welcome back</h2>
          <p className="text-muted-foreground text-sm mt-1">Sign in with your phone number</p>
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Phone number</label>
          <div className="relative">
            <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              placeholder="+1 (403) 555-0101"
              className="w-full pl-9 pr-4 py-3.5 rounded-lg border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          {error && <p className="text-xs text-destructive mt-1">{error}</p>}
        </div>

        <p className="text-xs text-muted-foreground">
          <strong>Demo:</strong> Try phone <code className="bg-muted px-1 rounded">555-0101</code> (Dawit) or any number to register.
        </p>

        <Button onClick={handleLogin} disabled={loading} size="lg" className="w-full">
          {loading ? "Signing in..." : "Continue"}
          {!loading && <ArrowRight size={18} />}
        </Button>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground">or</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <Button variant="outline" size="lg" className="w-full" onClick={() => navigate("/signup")}>
          Create new account
        </Button>

        <p className="text-xs text-center text-muted-foreground mt-2">
          By continuing, you agree to ride safely and respect the community.
        </p>
      </div>
    </div>
  );
}

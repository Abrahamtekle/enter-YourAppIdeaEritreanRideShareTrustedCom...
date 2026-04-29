import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppLogo } from "@/components/AppLogo";
import { supabase } from "@/integrations/supabase/client";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }
    setLoading(true);
    setError("");
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    if (err) {
      if (err.message.toLowerCase().includes("not confirmed") || err.message.toLowerCase().includes("email")) {
        setError("Please verify your email first. Check your inbox for the confirmation link.");
      } else {
        setError("Incorrect email or password.");
      }
    } else {
      navigate("/");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero */}
      <div className="gradient-hero px-6 pt-14 pb-12 flex flex-col items-center text-center">
        <div className="mb-4 rounded-full overflow-hidden shadow-lg border-4 border-primary-foreground/20">
          <AppLogo size={96} />
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
          <p className="text-muted-foreground text-sm mt-1">Sign in to your account</p>
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
            Email address
          </label>
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full pl-9 pr-4 py-3.5 rounded-lg border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Password</label>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              placeholder="••••••••"
              className="w-full pl-9 pr-4 py-3.5 rounded-lg border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          {error && <p className="text-xs text-destructive mt-1">{error}</p>}
        </div>

        <Button onClick={handleLogin} disabled={loading} size="lg" className="w-full">
          {loading ? "Signing in..." : "Sign In"}
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

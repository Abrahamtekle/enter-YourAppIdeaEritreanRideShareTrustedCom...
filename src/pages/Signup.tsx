import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Phone, Mail, Lock, ChevronLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

function Field({
  icon: Icon,
  label,
  required,
  children,
}: {
  icon: React.FC<{ size?: number; className?: string }>;
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1 block">
        <Icon size={12} className="text-primary" />
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      {children}
    </div>
  );
}

export default function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const handleSignup = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Please fill in name, email and password.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    setError("");

    const avatarUrl = `https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(name)}&backgroundColor=1B6B3A&shapeColor=C9920A`;

    const { error: err } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: { name, phone, avatar_url: avatarUrl },
      },
    });

    if (err) {
      setError(err.message);
      setLoading(false);
      return;
    }

    setDone(true);
    setLoading(false);
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

      <div className="flex-1 px-6 py-8 flex flex-col gap-5">
        <Field icon={User} label="Full name" required>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Dawit Tesfaye"
            className="w-full px-4 py-3.5 rounded-lg border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </Field>

        <Field icon={Mail} label="Email address" required>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-4 py-3.5 rounded-lg border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </Field>

        <Field icon={Phone} label="Phone number (optional)">
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1 (403) 555-0000"
            className="w-full px-4 py-3.5 rounded-lg border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </Field>

        <Field icon={Lock} label="Password" required>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSignup()}
            placeholder="At least 6 characters"
            className="w-full px-4 py-3.5 rounded-lg border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </Field>

        {error && <p className="text-xs text-destructive">{error}</p>}

        <div className="bg-accent-subtle border border-trust-border rounded-lg p-3">
          <p className="text-xs font-semibold text-trust-text mb-1">Community Verification</p>
          <p className="text-xs text-trust-text/80">
            Your profile helps build trust in our community.
          </p>
        </div>

        <Button
          onClick={handleSignup}
          disabled={!name.trim() || !email.trim() || !password.trim() || loading}
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

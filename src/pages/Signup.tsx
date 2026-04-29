import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { User, Phone, Mail, Lock, ChevronLeft, CheckCircle2, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

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
  const fileRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSignup = async () => {
    if (!name.trim() || !email.trim() || !phone.trim() || !password.trim()) {
      setError("Please fill in all required fields.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    setError("");

    // Use DiceBear as default avatar; real photo uploaded after email verification
    const defaultAvatarUrl = `https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(name)}&backgroundColor=1B6B3A&shapeColor=C9920A`;

    const { data, error: err } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: {
          name,
          phone,
          avatar_url: defaultAvatarUrl,
          has_pending_photo: !!avatarFile,
        },
      },
    });

    if (err) {
      setError(err.message);
      setLoading(false);
      return;
    }

    // If user is immediately confirmed (edge case), upload the photo
    if (data.session && avatarFile) {
      const filePath = `${data.user!.id}/avatar.${avatarFile.name.split(".").pop()}`;
      const { data: storageData } = await supabase.storage
        .from("avatars")
        .upload(filePath, avatarFile, { upsert: true });

      if (storageData) {
        const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(storageData.path);
        await supabase
          .from("profiles")
          .update({ avatar_url: urlData.publicUrl })
          .eq("id", data.user!.id);
      }
    }

    // Store avatar for upload after email verification
    if (avatarFile && avatarPreview) {
      sessionStorage.setItem("pending_avatar_preview", avatarPreview);
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
          <h2 className="text-2xl font-bold text-foreground">Check your email!</h2>
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
            We sent a verification link to{" "}
            <span className="font-semibold text-foreground">{email}</span>.
            <br />
            Click the link in the email to activate your account.
          </p>
        </div>
        <div className="bg-accent-subtle border border-trust-border rounded-xl p-4 text-left w-full">
          <p className="text-xs font-semibold text-trust-text mb-2">What to do next:</p>
          <ol className="text-xs text-trust-text/80 space-y-1 list-decimal list-inside">
            <li>Open your email app</li>
            <li>Find the email from HabeshaRide</li>
            <li>Click &quot;Confirm your email&quot;</li>
            <li>Come back and sign in</li>
          </ol>
        </div>
        <Button size="lg" className="w-full" onClick={() => navigate("/login")}>
          Go to Sign In
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

      <div className="flex-1 px-6 py-6 flex flex-col gap-5">
        {/* Photo picker */}
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={() => fileRef.current?.click()}
            className={cn(
              "relative w-24 h-24 rounded-full border-2 border-dashed overflow-hidden transition-all",
              avatarPreview ? "border-primary" : "border-border hover:border-primary/50"
            )}
          >
            {avatarPreview ? (
              <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-muted flex flex-col items-center justify-center gap-1">
                <Camera size={22} className="text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground">Add photo</span>
              </div>
            )}
            <div className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow">
              <Camera size={12} className="text-primary-foreground" />
            </div>
          </button>
          <p className="text-xs text-muted-foreground">
            {avatarPreview ? "Tap to change photo" : "Profile photo (optional)"}
          </p>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handlePhotoSelect}
          />
        </div>

        <Field icon={User} label="Full name" required>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Dawit Tesfaye"
            className="w-full px-4 py-3.5 rounded-lg border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </Field>

        <Field icon={Phone} label="Phone number" required>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1 (403) 555-0000"
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

        <Button
          onClick={handleSignup}
          disabled={!name.trim() || !email.trim() || !phone.trim() || !password.trim() || loading}
          size="lg"
          className="w-full mt-1"
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

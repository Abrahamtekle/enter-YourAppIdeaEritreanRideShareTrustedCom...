import { ShieldCheck, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

interface VerifiedBadgeProps {
  className?: string;
}

interface PhoneVerifiedBadgeProps {
  className?: string;
}

export function VerifiedBadge({ className }: VerifiedBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium",
        "bg-trust-bg border-trust-border text-trust-text",
        "border-l-2 border-l-primary",
        className
      )}
    >
      <ShieldCheck size={12} className="text-primary shrink-0" />
      Eritrean Community Verified
    </span>
  );
}

export function PhoneVerifiedBadge({ className }: PhoneVerifiedBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium",
        "bg-[hsl(148_40%_94%)] border-primary text-primary-hover",
        className
      )}
    >
      <Phone size={12} className="shrink-0" />
      Phone Verified
    </span>
  );
}

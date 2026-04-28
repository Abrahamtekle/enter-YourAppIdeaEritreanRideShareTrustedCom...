import { useNavigate, useLocation } from "react-router-dom";
import { MapPin, PlusCircle, MessageCircle, User } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Home", icon: MapPin, path: "/" },
  { label: "Post Ride", icon: PlusCircle, path: "/post-ride" },
  { label: "Chat", icon: MessageCircle, path: "/chat" },
  { label: "Profile", icon: User, path: "/profile" },
];

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-surface-brand shadow-nav">
      <div className="max-w-screen-sm mx-auto flex items-stretch h-16">
        {NAV_ITEMS.map(({ label, icon: Icon, path }) => {
          const isActive = location.pathname === path ||
            (path !== "/" && location.pathname.startsWith(path));

          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={cn(
                "flex-1 flex flex-col items-center justify-center gap-1 text-[11px] font-medium transition-all duration-150",
                "relative",
                isActive
                  ? "text-primary-foreground"
                  : "text-primary-foreground/50 hover:text-primary-foreground/80"
              )}
            >
              <Icon size={20} strokeWidth={isActive ? 2.2 : 1.8} />
              <span>{label}</span>
              {isActive && (
                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-accent" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

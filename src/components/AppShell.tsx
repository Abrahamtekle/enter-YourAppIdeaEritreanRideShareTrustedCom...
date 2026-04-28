import { useLocation, useNavigate } from "react-router-dom";
import { Bell, ArrowLeft } from "lucide-react";
import { BottomNav } from "./BottomNav";
import { cn } from "@/lib/utils";

const HIDE_NAV_PATHS = ["/login", "/signup"];
const HIDE_TOPBAR_PATHS = ["/login", "/signup"];

interface AppShellProps {
  children: React.ReactNode;
  title?: string;
  showBack?: boolean;
  headerClassName?: string;
}

export function AppShell({ children, title, showBack, headerClassName }: AppShellProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const hideNav = HIDE_NAV_PATHS.includes(location.pathname);
  const hideTopbar = HIDE_TOPBAR_PATHS.includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Top Bar */}
      {!hideTopbar && (
        <header
          className={cn(
            "sticky top-0 z-40 bg-surface-brand text-primary-foreground",
            "flex items-center px-4 h-14 shrink-0 gap-3",
            headerClassName
          )}
        >
          {showBack && (
            <button
              onClick={() => navigate(-1)}
              className="p-1 -ml-1 rounded-full hover:bg-primary-foreground/10 transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft size={22} />
            </button>
          )}
          <h1 className={cn("font-bold flex-1", title ? "text-lg" : "text-xl tracking-tight")}>
            {title ?? "HabeshaRide"}
          </h1>
          {!showBack && (
            <button
              className="p-2 rounded-full hover:bg-primary-foreground/10 transition-colors relative"
              aria-label="Notifications"
            >
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full" />
            </button>
          )}
        </header>
      )}

      {/* Content */}
      <main
        className={cn(
          "flex-1 overflow-y-auto",
          !hideNav && "pb-20"
        )}
      >
        {children}
      </main>

      {/* Bottom Nav */}
      {!hideNav && <BottomNav />}
    </div>
  );
}

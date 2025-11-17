import { Link, useLocation } from "react-router-dom";
import { Heart, MessageCircle, ShoppingBag, User, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useNotifications } from "@/hooks/use-notifications";

export default function BottomNav() {
  const location = useLocation();
  const { unreadCount } = useNotifications();

  const navItems = [
    { path: "/discover", icon: Heart, label: "Find a New Friend" },
    { path: "/ask-moms", icon: MessageCircle, label: "Ρώτα μαμά" },
    { path: "/daily-boost", icon: Sparkles, label: "Daily Boost" },
    { path: "/marketplace", icon: ShoppingBag, label: "Marketplace" },
    { path: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 px-2 py-2">
      <div className="max-w-screen-xl mx-auto flex justify-around items-center gap-1">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-2 py-2 rounded-full transition-all flex-1 relative",
                isActive
                  ? "bg-gradient-to-br from-primary/20 to-secondary/20 text-primary shadow-md scale-105"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/10"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive && "fill-primary")} />
              <span className="text-[10px] font-medium text-center leading-tight">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

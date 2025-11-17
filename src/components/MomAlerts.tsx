import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNotifications } from "@/hooks/use-notifications";
import { Bell } from "lucide-react";

export default function MomAlerts() {
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  const go = () => navigate("/notifications");

  return (
    <>
      {/* Top-right pastel bell */}
      <Button
        aria-label="Mom Alerts"
        onClick={go}
        variant="secondary"
        size="icon"
        className="fixed top-4 right-4 z-50 rounded-full bg-card border border-border shadow-md hover:shadow-lg hover-scale"
      >
        <div className="relative">
          <Bell className="w-5 h-5 text-foreground" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-[10px]"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </div>
      </Button>

      {/* Floating bottom-right bubble - only when there are alerts */}
      {unreadCount > 0 && (
        <button
          onClick={go}
          className="fixed bottom-24 right-4 z-50 rounded-full bg-secondary text-foreground border border-border shadow-lg px-4 py-3 flex items-center gap-2 animate-enter hover-scale"
        >
          <span className="text-xl">🌸</span>
          <span className="text-sm font-semibold">Mom Alerts 💞</span>
          <Badge variant="default" className="ml-1">{unreadCount}</Badge>
          <span className="ml-1">✨</span>
        </button>
      )}
    </>
  );
}

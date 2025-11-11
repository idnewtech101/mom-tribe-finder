import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import mascot from "@/assets/mascot.jpg";
import { cn } from "@/lib/utils";

export type MascotState = "happy" | "idle" | "searching";

interface MomsterMascotProps {
  state: MascotState;
  message: string;
  visible: boolean;
  showButton?: boolean;
  buttonText?: string;
  onButtonClick?: () => void;
  duration?: number;
  onHide?: () => void;
}

const getAnimationClass = (state: MascotState) => {
  switch (state) {
    case "happy":
      return "animate-bounce";
    case "searching":
      return "animate-pulse";
    case "idle":
    default:
      return "";
  }
};

const getEmoji = (state: MascotState) => {
  switch (state) {
    case "happy":
      return "💖";
    case "searching":
      return "🔍";
    case "idle":
    default:
      return "☕";
  }
};

export default function MomsterMascot({
  state,
  message,
  visible,
  showButton,
  buttonText,
  onButtonClick,
  duration = 2500,
  onHide,
}: MomsterMascotProps) {
  const [isShowing, setIsShowing] = useState(false);

  useEffect(() => {
    if (visible) {
      setIsShowing(true);
      
      if (duration > 0 && !showButton) {
        const timer = setTimeout(() => {
          setIsShowing(false);
          onHide?.();
        }, duration);
        
        return () => clearTimeout(timer);
      }
    } else {
      setIsShowing(false);
    }
  }, [visible, duration, showButton, onHide]);

  if (!isShowing) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm animate-fade-in">
      <Card className="max-w-md w-full p-6 bg-gradient-to-br from-primary/10 via-background to-secondary/20 border-2 border-primary/30 shadow-xl animate-scale-in">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="relative">
            <img
              src={mascot}
              alt="Momster Mascot"
              className={cn(
                "w-24 h-24 object-contain",
                getAnimationClass(state)
              )}
            />
            <span className="absolute -top-2 -right-2 text-3xl animate-bounce">
              {getEmoji(state)}
            </span>
          </div>
          
          <p className="text-lg font-medium text-foreground leading-relaxed">
            {message}
          </p>

          {showButton && buttonText && (
            <Button
              onClick={() => {
                setIsShowing(false);
                onButtonClick?.();
              }}
              className="w-full"
              size="lg"
            >
              {buttonText}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}

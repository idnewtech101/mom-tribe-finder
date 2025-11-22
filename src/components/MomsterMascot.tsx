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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-md animate-fade-in">
      <Card className="max-w-md w-full p-8 bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 border-4 border-pink-200 shadow-2xl rounded-3xl animate-[scale-in_0.3s_ease-out,bounce_0.5s_ease-out_0.3s]">
        <div className="flex flex-col items-center text-center space-y-4">
          {/* Multiple small mascots around the main one */}
          <div className="relative">
            {/* Floating mini mascots */}
            <div className="absolute -top-8 -left-8 animate-bounce" style={{ animationDelay: '0s' }}>
              <img src={mascot} alt="Mini Mascot" className="w-8 h-8 object-contain opacity-70" />
            </div>
            <div className="absolute -top-8 -right-8 animate-bounce" style={{ animationDelay: '0.2s' }}>
              <img src={mascot} alt="Mini Mascot" className="w-8 h-8 object-contain opacity-70" />
            </div>
            <div className="absolute -bottom-6 -left-8 animate-bounce" style={{ animationDelay: '0.4s' }}>
              <img src={mascot} alt="Mini Mascot" className="w-8 h-8 object-contain opacity-70" />
            </div>
            <div className="absolute -bottom-6 -right-8 animate-bounce" style={{ animationDelay: '0.6s' }}>
              <img src={mascot} alt="Mini Mascot" className="w-8 h-8 object-contain opacity-70" />
            </div>
            
            {/* Main mascot */}
            <img
              src={mascot}
              alt="Momster Mascot"
              className={cn(
                "w-24 h-24 object-contain drop-shadow-xl",
                getAnimationClass(state)
              )}
            />
            <span className="absolute -top-2 -right-2 text-4xl animate-bounce drop-shadow-lg">
              {getEmoji(state)}
            </span>
          </div>
          
          <p className="text-xl font-bold text-foreground leading-relaxed" style={{ fontFamily: "'Pacifico', cursive" }}>
            {message}
          </p>

          {showButton && buttonText && (
            <Button
              onClick={() => {
                setIsShowing(false);
                onButtonClick?.();
              }}
              className="w-full bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white font-bold shadow-lg hover:shadow-xl transition-all rounded-full"
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

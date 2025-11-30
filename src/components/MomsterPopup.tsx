import { Button } from "@/components/ui/button";
import mascot from "@/assets/mascot.jpg";

interface MomsterPopupProps {
  title: string;
  subtitle: string;
  bullets?: string[];
  buttonText: string;
  onButtonClick: () => void;
  visible: boolean;
}

export default function MomsterPopup({
  title,
  subtitle,
  bullets,
  buttonText,
  onButtonClick,
  visible,
}: MomsterPopupProps) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-[90%] max-w-[420px] flex flex-col items-center bg-white"
        style={{
          borderRadius: "16px",
          padding: "24px",
          boxShadow: "0 10px 40px rgba(192, 107, 142, 0.15), 0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        {/* Mascot top right */}
        <img
          src={mascot}
          alt="Momster Mascot"
          className="absolute animate-bounce"
          style={{
            top: "-20px",
            right: "-20px",
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            backgroundColor: "#F8E9EE",
            padding: "10px",
            boxShadow: "0 4px 16px rgba(192, 107, 142, 0.2)",
            transform: "rotate(5deg)",
            animationDuration: "2s",
          }}
        />

        {/* Title with emoji */}
        <h2
          className="text-center font-semibold mt-4 mb-3"
          style={{
            fontSize: "24px",
            color: "#C06B8E",
            fontFamily: "'Poppins', 'Segoe UI', system-ui, sans-serif",
            letterSpacing: "-0.01em",
          }}
        >
          {title} ✨
        </h2>

        {/* Subtitle */}
        <p
          className="text-center mb-5"
          style={{
            fontSize: "16px",
            lineHeight: "1.5",
            color: "#7A4660",
            fontFamily: "'Poppins', 'Segoe UI', system-ui, sans-serif",
          }}
        >
          {subtitle}
        </p>

        {/* Optional Bullets */}
        {bullets && bullets.length > 0 && (
          <div
            className="mb-4 text-center whitespace-pre-line"
            style={{
              fontSize: "15px",
              color: "#7F4F5B",
            }}
          >
            {bullets.map((bullet, index) => (
              <div key={index} className="mb-1">
                {bullet}
              </div>
            ))}
          </div>
        )}

        {/* Button */}
        <Button
          onClick={onButtonClick}
          className="w-full transition-all hover:scale-[1.03] hover:shadow-lg"
          style={{
            padding: "16px",
            borderRadius: "12px",
            backgroundColor: "#E9C4D4",
            color: "#7A4660",
            fontSize: "16px",
            fontWeight: "600",
            border: "none",
            boxShadow: "0 4px 16px rgba(233, 196, 212, 0.4)",
            fontFamily: "'Poppins', 'Segoe UI', system-ui, sans-serif",
          }}
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
}

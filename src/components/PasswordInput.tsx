import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  showStrengthMeter?: boolean;
  value: string;
}

const getPasswordStrength = (password: string): { score: number; label: string; color: string } => {
  let score = 0;
  
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;

  if (score <= 1) return { score: 1, label: "Πολύ αδύναμος", color: "bg-destructive" };
  if (score === 2) return { score: 2, label: "Αδύναμος", color: "bg-orange-500" };
  if (score === 3) return { score: 3, label: "Μέτριος", color: "bg-yellow-500" };
  if (score === 4) return { score: 4, label: "Ισχυρός", color: "bg-green-500" };
  return { score: 5, label: "Πολύ ισχυρός", color: "bg-emerald-600" };
};

export default function PasswordInput({ 
  showStrengthMeter = false, 
  value, 
  className,
  ...props 
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const strength = getPasswordStrength(value);

  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          value={value}
          className={cn("pr-10", className)}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          tabIndex={-1}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>
      
      {showStrengthMeter && value.length > 0 && (
        <div className="space-y-1">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((level) => (
              <div
                key={level}
                className={cn(
                  "h-1.5 flex-1 rounded-full transition-all duration-300",
                  level <= strength.score ? strength.color : "bg-muted"
                )}
              />
            ))}
          </div>
          <p className={cn(
            "text-xs transition-colors",
            strength.score <= 2 ? "text-destructive" : 
            strength.score === 3 ? "text-yellow-600" : 
            "text-green-600"
          )}>
            {strength.label}
          </p>
        </div>
      )}
    </div>
  );
}

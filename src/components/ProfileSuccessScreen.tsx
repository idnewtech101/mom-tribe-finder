import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import mascot from '@/assets/mascot.jpg';
import ConfettiEffect from './ConfettiEffect';

interface ProfileSuccessScreenProps {
  visible: boolean;
  onContinue: () => void;
}

export const ProfileSuccessScreen = ({ visible, onContinue }: ProfileSuccessScreenProps) => {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (visible) {
      // Trigger confetti after a small delay for dramatic effect
      setTimeout(() => setShowConfetti(true), 300);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #F8E9EE, #F5E8F0)' }}>
      <ConfettiEffect trigger={showConfetti} />
      
      <Card className="w-full max-w-md p-8 space-y-6 bg-white/95 backdrop-blur-sm shadow-2xl rounded-3xl border-0 animate-scale-in">
        {/* Mascot with glow effect */}
        <div className="relative flex justify-center">
          <div className="absolute inset-0 flex justify-center items-center">
            <div className="w-32 h-32 bg-pink-300/30 rounded-full blur-xl animate-pulse" />
          </div>
          <img 
            src={mascot} 
            alt="Momster" 
            className="w-28 h-28 object-contain relative z-10 animate-bounce"
          />
        </div>

        {/* Success message */}
        <div className="text-center space-y-4">
          <div className="flex justify-center gap-2 text-2xl">
            <span className="animate-bounce" style={{ animationDelay: '0ms' }}>🎉</span>
            <span className="animate-bounce" style={{ animationDelay: '100ms' }}>✨</span>
            <span className="animate-bounce" style={{ animationDelay: '200ms' }}>💖</span>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-800" style={{ fontFamily: "'Pacifico', cursive" }}>
            Το προφίλ σου είναι έτοιμο!
          </h1>
          
          <p className="text-lg text-gray-600 leading-relaxed">
            Κάπου εκεί έξω μια μαμά ψάχνει ακριβώς εσένα 💖
          </p>

          <div className="pt-2">
            <p className="text-sm text-pink-500 font-medium">
              Ας ξεκινήσουμε να βρούμε τις πρώτες σου φιλίες!
            </p>
          </div>
        </div>

        {/* Continue button */}
        <Button 
          onClick={onContinue}
          className="w-full py-6 text-lg rounded-full bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 shadow-lg transition-all hover:scale-105"
        >
          Πάμε! 🌸
        </Button>

        {/* Decorative hearts */}
        <div className="absolute top-4 left-4 text-2xl animate-pulse opacity-40">💕</div>
        <div className="absolute top-4 right-4 text-2xl animate-pulse opacity-40" style={{ animationDelay: '500ms' }}>💕</div>
        <div className="absolute bottom-4 left-8 text-xl animate-pulse opacity-30" style={{ animationDelay: '300ms' }}>🌸</div>
        <div className="absolute bottom-4 right-8 text-xl animate-pulse opacity-30" style={{ animationDelay: '700ms' }}>🌸</div>
      </Card>
    </div>
  );
};

export default ProfileSuccessScreen;

import { useEffect } from 'react';
import confetti from 'canvas-confetti';

interface ConfettiEffectProps {
  trigger: boolean;
  onComplete?: () => void;
}

export const ConfettiEffect = ({ trigger, onComplete }: ConfettiEffectProps) => {
  useEffect(() => {
    if (trigger) {
      // Pastel, cute confetti - small and delicate
      const pastelColors = [
        '#FFB6C1', // Light pink
        '#FFD1DC', // Pale pink
        '#E6E6FA', // Lavender
        '#FFDAB9', // Peach
        '#B0E0E6', // Powder blue
        '#F0E68C', // Khaki
        '#DDA0DD', // Plum
        '#FFC0CB', // Pink
      ];

      // First burst - center
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6, x: 0.5 },
        colors: pastelColors,
        scalar: 0.8,
        gravity: 0.8,
        ticks: 150,
        shapes: ['circle', 'square'],
      });

      // Second burst - left side with delay
      setTimeout(() => {
        confetti({
          particleCount: 30,
          spread: 45,
          origin: { y: 0.65, x: 0.3 },
          colors: pastelColors,
          scalar: 0.6,
          gravity: 0.9,
          ticks: 120,
        });
      }, 100);

      // Third burst - right side with delay
      setTimeout(() => {
        confetti({
          particleCount: 30,
          spread: 45,
          origin: { y: 0.65, x: 0.7 },
          colors: pastelColors,
          scalar: 0.6,
          gravity: 0.9,
          ticks: 120,
        });
      }, 200);

      // Small heart emojis effect
      setTimeout(() => {
        confetti({
          particleCount: 15,
          spread: 70,
          origin: { y: 0.5, x: 0.5 },
          colors: ['#FF69B4', '#FFB6C1', '#FF1493'],
          scalar: 1,
          gravity: 0.5,
          ticks: 200,
          shapes: ['circle'],
        });
        
        onComplete?.();
      }, 300);
    }
  }, [trigger, onComplete]);

  return null;
};

export default ConfettiEffect;

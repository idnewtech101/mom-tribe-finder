import { useState, useCallback } from "react";
import { MascotState } from "@/components/MomsterMascot";

interface MascotConfig {
  state: MascotState;
  message: string;
  duration?: number;
  showButton?: boolean;
  buttonText?: string;
  onButtonClick?: () => void;
}

const welcomeMessages = [
  "Καλώς ήρθες στο Momster! 🌸\nΗ τέλεια κοινότητα για μαμάδες σαν κι εσένα.\nΠάμε να βρούμε το επόμενο match σου; ✨",
  "Welcome to Momster! 🌸\nΤhe perfect community for moms like you.\nLet's find your next match! ✨",
  "Yay! You're here mama! 💕\nReady to meet amazing moms? 🌸",
];

const matchMessages = [
  "🎉 Yay! You just made a new mom friend 💕",
  "🌸 You're a Momster Match! 👯‍♀️",
  "💫 A new friendship begins!",
];

const getRandomMessage = (messages: string[]) => {
  return messages[Math.floor(Math.random() * messages.length)];
};

export const useMascot = () => {
  const [mascotConfig, setMascotConfig] = useState<MascotConfig | null>(null);
  const [visible, setVisible] = useState(false);

  const showMascot = useCallback((config: MascotConfig) => {
    setMascotConfig(config);
    setVisible(true);
  }, []);

  const hideMascot = useCallback(() => {
    setVisible(false);
    setTimeout(() => setMascotConfig(null), 300);
  }, []);

  const showWelcome = useCallback(() => {
    showMascot({
      state: "happy",
      message: getRandomMessage(welcomeMessages),
      duration: 2000,
    });
  }, [showMascot]);

  const showMatch = useCallback((onStartChat?: () => void) => {
    showMascot({
      state: "happy",
      message: getRandomMessage(matchMessages),
      duration: 2500,
      showButton: true,
      buttonText: "Start Chat 💬",
      onButtonClick: onStartChat,
    });
  }, [showMascot]);

  const showEmptyFeed = useCallback(() => {
    showMascot({
      state: "idle",
      message: "No posts yet… but your coffee is still hot ☕💗",
      duration: 0,
    });
  }, [showMascot]);

  const showEmptyDiscover = useCallback(() => {
    showMascot({
      state: "searching",
      message: "No new moms nearby... yet! ☕ We'll find you more soon!",
      duration: 3000,
    });
  }, [showMascot]);

  const showEmptyMarketplace = useCallback(() => {
    showMascot({
      state: "idle",
      message: "No listings yet… maybe start by selling your old stroller? 😉",
      duration: 0,
    });
  }, [showMascot]);

  const showReportThanks = useCallback(() => {
    showMascot({
      state: "searching",
      message: "Thanks mama 💗 We'll check this profile soon.",
      duration: 2000,
    });
  }, [showMascot]);

  return {
    mascotConfig,
    visible,
    showMascot,
    hideMascot,
    showWelcome,
    showMatch,
    showEmptyFeed,
    showEmptyDiscover,
    showEmptyMarketplace,
    showReportThanks,
  };
};

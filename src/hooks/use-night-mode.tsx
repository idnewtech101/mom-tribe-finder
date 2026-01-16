import { useState, useEffect } from "react";

export const useNightMode = () => {
  const [isNightTime, setIsNightTime] = useState(false);

  useEffect(() => {
    const checkNightTime = () => {
      const now = new Date();
      const hour = now.getHours();
      // Night mode: 00:00 - 05:00
      setIsNightTime(hour >= 0 && hour < 5);
    };

    checkNightTime();
    
    // Check every minute
    const interval = setInterval(checkNightTime, 60000);
    
    return () => clearInterval(interval);
  }, []);

  return { isNightTime };
};

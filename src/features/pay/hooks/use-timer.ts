import { useEffect, useState } from "react";

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  // Format the minutes and seconds with leading zeros if needed
  const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
  const formattedSeconds =
    remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds;

  return `${formattedMinutes}:${formattedSeconds}`;
}

export const useTimer = (seconds?: number) => {
  const initialTime = seconds ?? 300;
  const [timeRemaining, setTimeRemaining] = useState(initialTime);

  useEffect(() => {
    const intervalId = setInterval(() => {
      // If time remaining is greater than 0, decrement it
      if (timeRemaining > 0) {
        setTimeRemaining((prevTime) => prevTime - 1);
      } else {
        // If time remaining is 0, clear the interval to stop the countdown
        clearInterval(intervalId);
      }
    }, 1000);

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [timeRemaining]);

  const resetTimer = () => {
    setTimeRemaining(initialTime);
  };

  return {
    timeRemaining: formatTime(timeRemaining),
    resetTimer,
    timeValue: timeRemaining,
  };
};

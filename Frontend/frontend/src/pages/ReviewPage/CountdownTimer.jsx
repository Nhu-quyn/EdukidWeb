import { useState, useEffect } from "react";

const CountdownTimer = ({ testime, onEnd }) => {
  const [timeLeft, setTimeLeft] = useState(testime * 60); // Chuyển phút thành giây

  useEffect(() => {
    if (timeLeft <= 0) {
      if (onEnd) onEnd(); // Gọi callback khi hết thời gian
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onEnd]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div
      className="fixed top-3 right-3 bg-red-500 text-white rounded-lg font-bold shadow-lg
                 text-6xl px-6 py-3 md:text-3xl md:px-4 md:py-2 lg:text-5xl xl:text-6xl"
    >
      ⏳ {formatTime(timeLeft)}
    </div>
  );
};

export default CountdownTimer;

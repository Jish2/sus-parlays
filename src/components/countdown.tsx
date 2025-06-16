"use client";

import { useEffect, useState } from "react";

export function Countdown() {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const pst = new Date(
        now.toLocaleString("en-US", { timeZone: "America/Los_Angeles" }),
      );
      const target = new Date(pst);
      target.setHours(10, 0, 0, 0);

      if (pst > target) {
        target.setDate(target.getDate() + 1);
      }

      const diff = target.getTime() - pst.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center gap-1 w-full">
      <p className="text-sm text-neutral-600 dark:text-neutral-400">
        voting ends in
      </p>
      <span className="text-3xl font-bold">{timeLeft}</span>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { getTimeRemaining, getNextLaunchTime } from "@/lib/utils";

export default function CountdownTimer() {
  const [timeRemaining, setTimeRemaining] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const nextLaunch = getNextLaunchTime();

    const updateTimer = () => {
      const remaining = getTimeRemaining(nextLaunch);
      setTimeRemaining(remaining);
    };

    // Initial update
    updateTimer();

    // Update every second
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2">
      <h3 className="text-lg font-medium">New launches in</h3>
      <div className="bg-amber-50 text-amber-800 px-3 py-1 rounded-md text-sm">
        {timeRemaining.hours} hours
      </div>
      <div className="bg-amber-50 text-amber-800 px-3 py-1 rounded-md text-sm">
        {timeRemaining.minutes} mins
      </div>
      <div className="bg-amber-50 text-amber-800 px-3 py-1 rounded-md text-sm">
        {timeRemaining.seconds} secs
      </div>
    </div>
  );
}

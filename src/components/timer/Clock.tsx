import React, { useState, useEffect } from "react";
import { getRemainingTimeUntilMsTimestamp } from "./utils/CountDownTimerUtils";

export default function Clock({ time }: { time: string }) {
  const defaultRemainingTime = {
    seconds: "00",
    minutes: "00",
    hours: "00",
    days: "00",
  };

  const date = new Date(time).getTime();
  const [remainingTime, setRemainingTime] = useState(defaultRemainingTime);

  function updateRemainingTime(countdown: any) {
    setRemainingTime(getRemainingTimeUntilMsTimestamp(countdown));
  }

  useEffect(() => {
    const intervalId = setInterval(async () => {
      await updateRemainingTime(date);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [date]);

  const isTimeCritical =
    remainingTime.days === "00" &&
    remainingTime.hours === "00" &&
    parseInt(remainingTime.minutes, 10) <= 30;

  return (
    <section>
      <div className="w-full select-none">
        <div
          className={`border-opacity-50 dark:border-dark-second rounded-xl border border-gray-300 p-4 ${
            isTimeCritical ? "text-rose-500" : ""
          }`}
        >
          <div className="flex flex-wrap items-center justify-center gap-2 text-center">
            <div className="w-1/5 min-w-[40px]">
              <p className="text-xl md:text-4xl">{remainingTime.days}</p>
              <small className="text-xs font-medium md:text-base">Days</small>
            </div>
            <div className="w-1/5 min-w-[40px]">
              <p className="text-xl md:text-4xl">{remainingTime.hours}</p>
              <small className="text-xs font-medium md:text-base">Hours</small>
            </div>
            <div className="w-1/5 min-w-[40px]">
              <p className="text-xl md:text-4xl">{remainingTime.minutes}</p>
              <small className="text-xs font-medium md:text-base">Minutes</small>
            </div>
            <div className="w-1/5 min-w-[40px]">
              <p className="text-xl md:text-4xl">{remainingTime.seconds}</p>
              <small className="text-xs font-medium md:text-base">Seconds</small>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

'use client';

import { useState, useEffect } from 'react';

const AnnouncementBar = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const targetDate = new Date('2025-07-01T00:00:00');

    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 bg-black text-white py-2 px-6 sm:px-8 lg:px-4 text-center z-[60]">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-sm">
        <span className="font-medium">
          ⚠️ Strona w budowie - start za:
        </span>
        <div className="flex items-center gap-2 font-mono">
          <span className="bg-white/10 px-2 py-1 rounded">
            {String(timeLeft.days).padStart(2, '0')}d
          </span>
          <span className="bg-white/10 px-2 py-1 rounded">
            {String(timeLeft.hours).padStart(2, '0')}h
          </span>
          <span className="bg-white/10 px-2 py-1 rounded">
            {String(timeLeft.minutes).padStart(2, '0')}m
          </span>
          <span className="bg-white/10 px-2 py-1 rounded">
            {String(timeLeft.seconds).padStart(2, '0')}s
          </span>
        </div>
        <span className="font-medium">
          Zapraszamy do rezerwowania! 🌲
        </span>
      </div>
    </div>
  );
};

export default AnnouncementBar; 
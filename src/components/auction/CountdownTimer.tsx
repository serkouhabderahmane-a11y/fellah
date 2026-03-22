'use client';

import { useState, useEffect } from 'react';

interface CountdownTimerProps {
  endTime: string;
  isRTL?: boolean;
  onEnd?: () => void;
}

export default function CountdownTimer({ endTime, isRTL = false, onEnd }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isEnded: false,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(endTime).getTime() - new Date().getTime();
      
      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isEnded: true });
        if (onEnd) onEnd();
        return;
      }
      
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        isEnded: false,
      });
    };
    
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    
    return () => clearInterval(timer);
  }, [endTime, onEnd]);

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  if (timeLeft.isEnded) {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg font-semibold">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {isRTL ? 'انتهت المزاد' : 'Enchère terminée'}
      </div>
    );
  }

  const timeUnits = [
    { value: timeLeft.days, label: isRTL ? 'يوم' : 'j' },
    { value: timeLeft.hours, label: isRTL ? 'ساعة' : 'h' },
    { value: timeLeft.minutes, label: isRTL ? 'دقيقة' : 'm' },
    { value: timeLeft.seconds, label: isRTL ? 'ثانية' : 's' },
  ];

  return (
    <div className="inline-flex items-center gap-1">
      {timeUnits.map((unit, index) => (
        <div key={unit.label} className="flex items-center">
          <div className="bg-gradient-to-br from-primary to-primary-light text-white rounded-lg px-3 py-2 text-center min-w-[50px]">
            <div className="text-xl font-bold">{formatNumber(unit.value)}</div>
            <div className="text-xs opacity-80">{unit.label}</div>
          </div>
          {index < timeUnits.length - 1 && (
            <span className={`text-primary font-bold mx-1 ${isRTL ? 'rotate-180' : ''}`}>:</span>
          )}
        </div>
      ))}
    </div>
  );
}

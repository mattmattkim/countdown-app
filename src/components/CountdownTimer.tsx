import React, { useState, useEffect } from 'react';
import { Event } from '../types';
import { calculateCountdown, isEventToday, getSmartTimeUnits } from '../utils/dateHelpers';
import { FlipClockPqina } from './FlipClockPqina';

interface CountdownTimerProps {
  event: Event;
  large?: boolean;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ event, large = false }) => {
  const [countdown, setCountdown] = useState(calculateCountdown(event.date));

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(calculateCountdown(event.date));
    }, 1000);

    return () => clearInterval(interval);
  }, [event.date]);

  return (
    <div className={`${large ? 'scale-110' : ''}`}>
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">{event.emoji}</div>
        <h2 className="text-xl text-gray-600">
          {countdown.isPast ? 'Time since' : 'Days til'}
        </h2>
        <h1 className="text-3xl font-medium text-gray-900 mt-1">{event.title}!</h1>
      </div>
      
      <div className="mb-4 flex justify-center" style={{ transform: 'scale(2)', transformOrigin: 'center' }}>
        <FlipClockPqina
          units={getSmartTimeUnits(countdown)}
          compact={false}
        />
      </div>
      
      {countdown.isPast && (
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            {isEventToday(event.date) ? '🎉 Today!' : 'and counting...'}
          </p>
        </div>
      )}
    </div>
  );
};
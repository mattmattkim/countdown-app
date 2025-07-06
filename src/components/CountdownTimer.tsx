import React, { useState, useEffect } from 'react';
import { Event } from '../types';
import { calculateCountdown, isEventToday } from '../utils/dateHelpers';
import { FlipClock } from './FlipClock';

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
      
      <div className="mb-4">
        <FlipClock
          years={countdown.years}
          months={countdown.months}
          days={countdown.days}
          hours={countdown.hours}
          minutes={countdown.minutes}
          seconds={countdown.seconds}
          compact={false}
        />
      </div>
      
      {/* Show years, months, days as badges */}
      <div className="flex justify-center flex-wrap gap-2">
        {countdown.years > 0 && (
          <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-600">
            {countdown.years} {countdown.years === 1 ? 'year' : 'years'}
          </span>
        )}
        {countdown.months > 0 && (
          <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-purple-100 text-purple-600">
            {countdown.months} {countdown.months === 1 ? 'month' : 'months'}
          </span>
        )}
        {countdown.days > 0 && (
          <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-600">
            {countdown.days} {countdown.days === 1 ? 'day' : 'days'}
          </span>
        )}
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
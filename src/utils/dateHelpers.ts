import { differenceInSeconds, format, isBefore, differenceInMonths, differenceInDays, differenceInHours, differenceInMinutes, intervalToDuration } from 'date-fns';
import { CountdownDisplay } from '../types';

export const calculateCountdown = (targetDate: Date): CountdownDisplay => {
  const now = new Date();
  const isPast = isBefore(targetDate, now);
  
  // Use intervalToDuration for accurate calculation
  const duration = intervalToDuration({
    start: isPast ? targetDate : now,
    end: isPast ? now : targetDate
  });

  return {
    years: duration.years || 0,
    months: duration.months || 0,
    days: duration.days || 0,
    hours: duration.hours || 0,
    minutes: duration.minutes || 0,
    seconds: duration.seconds || 0,
    isExpired: isPast,
    isPast
  };
};

export const formatEventDate = (date: Date): string => {
  return format(date, 'MMMM d, yyyy');
};

export const formatEventTime = (date: Date): string => {
  return format(date, 'h:mm a');
};

export const getDaysUntil = (date: Date): number => {
  const now = new Date();
  const diffInSeconds = differenceInSeconds(date, now);
  return Math.ceil(diffInSeconds / (24 * 60 * 60));
};

export const isEventToday = (date: Date): boolean => {
  const now = new Date();
  return (
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  );
};

export const isEventPast = (date: Date): boolean => {
  return isBefore(date, new Date());
};

export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

export interface TimeUnit {
  value: number;
  label: string;
}

export const getSmartTimeUnits = (countdown: ReturnType<typeof calculateCountdown>): TimeUnit[] => {
  const { years, months, days, hours, minutes, seconds, isPast } = countdown;
  
  // For past events, use the same logic but with "ago" context
  const units: TimeUnit[] = [];
  
  // Years away (>= 1 year): Show years, months, days
  if (years >= 1) {
    units.push({ value: years, label: years === 1 ? 'year' : 'years' });
    units.push({ value: months, label: months === 1 ? 'month' : 'months' });
    units.push({ value: days, label: days === 1 ? 'day' : 'days' });
  }
  // Months away (>= 1 month): Show months, days, hours
  else if (months >= 1) {
    units.push({ value: months, label: months === 1 ? 'month' : 'months' });
    units.push({ value: days, label: days === 1 ? 'day' : 'days' });
    units.push({ value: hours, label: hours === 1 ? 'hour' : 'hours' });
  }
  // Weeks/Days away (>= 1 day): Show days, hours, minutes
  else if (days >= 1) {
    units.push({ value: days, label: days === 1 ? 'day' : 'days' });
    units.push({ value: hours, label: hours === 1 ? 'hour' : 'hours' });
    units.push({ value: minutes, label: minutes === 1 ? 'minute' : 'minutes' });
  }
  // Hours away (< 1 day): Show hours, minutes, seconds
  else if (hours >= 1) {
    units.push({ value: hours, label: hours === 1 ? 'hour' : 'hours' });
    units.push({ value: minutes, label: minutes === 1 ? 'minute' : 'minutes' });
    units.push({ value: seconds, label: seconds === 1 ? 'second' : 'seconds' });
  }
  // Final countdown (< 1 hour): Show minutes, seconds
  else {
    units.push({ value: minutes, label: minutes === 1 ? 'minute' : 'minutes' });
    units.push({ value: seconds, label: seconds === 1 ? 'second' : 'seconds' });
  }
  
  return units;
};
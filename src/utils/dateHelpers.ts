import { differenceInSeconds, format, isBefore, differenceInMonths, differenceInDays, differenceInHours, differenceInMinutes } from 'date-fns';
import { CountdownDisplay } from '../types';

export const calculateCountdown = (targetDate: Date): CountdownDisplay => {
  const now = new Date();
  const isPast = isBefore(targetDate, now);
  
  const start = isPast ? targetDate : now;
  const end = isPast ? now : targetDate;
  
  // Calculate total difference in various units
  const totalDays = differenceInDays(end, start);
  const totalHours = differenceInHours(end, start);
  const totalMinutes = differenceInMinutes(end, start);
  const totalSeconds = differenceInSeconds(end, start);
  
  // Calculate years and remaining months
  const totalMonths = differenceInMonths(end, start);
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  
  // Calculate remaining days after accounting for complete months
  const startPlusYearsAndMonths = new Date(start);
  startPlusYearsAndMonths.setFullYear(startPlusYearsAndMonths.getFullYear() + years);
  startPlusYearsAndMonths.setMonth(startPlusYearsAndMonths.getMonth() + months);
  const days = differenceInDays(end, startPlusYearsAndMonths);
  
  // Calculate remaining time after accounting for days
  const startPlusAllDays = new Date(startPlusYearsAndMonths);
  startPlusAllDays.setDate(startPlusAllDays.getDate() + days);
  
  // Get the remaining hours, minutes, and seconds
  const remainingSeconds = differenceInSeconds(end, startPlusAllDays);
  const hours = Math.floor(remainingSeconds / 3600) % 24;
  const minutes = Math.floor((remainingSeconds % 3600) / 60);
  const seconds = remainingSeconds % 60;

  return {
    years,
    months,
    days,
    hours: Math.abs(hours),
    minutes: Math.abs(minutes),
    seconds: Math.abs(seconds),
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
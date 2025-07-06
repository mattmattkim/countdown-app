import { differenceInSeconds, format, isBefore, differenceInMonths, differenceInDays, differenceInHours, differenceInMinutes } from 'date-fns';
import { CountdownDisplay } from '../types';

export const calculateCountdown = (targetDate: Date): CountdownDisplay => {
  const now = new Date();
  const isPast = isBefore(targetDate, now);
  
  const start = isPast ? targetDate : now;
  const end = isPast ? now : targetDate;
  
  // Calculate the differences
  const totalMonths = differenceInMonths(end, start);
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  
  // For days, we need to get the remaining days after accounting for complete months
  const startPlusMonths = new Date(start);
  startPlusMonths.setMonth(startPlusMonths.getMonth() + totalMonths);
  const days = differenceInDays(end, startPlusMonths);
  
  // Calculate total seconds remaining after accounting for months and days
  const startPlusMonthsAndDays = new Date(startPlusMonths);
  startPlusMonthsAndDays.setDate(startPlusMonthsAndDays.getDate() + days);
  
  const totalSecondsRemaining = differenceInSeconds(end, startPlusMonthsAndDays);
  
  // Calculate hours, minutes, and seconds from the remaining time
  const hours = Math.floor(totalSecondsRemaining / 3600) % 24;
  const minutes = Math.floor((totalSecondsRemaining % 3600) / 60);
  const seconds = totalSecondsRemaining % 60;

  return {
    years,
    months,
    days,
    hours,
    minutes,
    seconds,
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
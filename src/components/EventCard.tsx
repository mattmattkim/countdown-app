import React, { useState, useEffect } from 'react';
import { Event } from '../types';
import { getDaysUntil, formatEventDate, isEventToday, isEventPast, calculateCountdown } from '../utils/dateHelpers';
import { MoreVertical, Trash2, Edit2, CheckCircle } from 'lucide-react';
import { FlipClockPqina } from './FlipClockPqina';

interface EventCardProps {
  event: Event;
  onClick: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onComplete?: () => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onClick, onEdit, onDelete, onComplete }) => {
  const daysUntil = getDaysUntil(event.date);
  const isToday = isEventToday(event.date);
  const isPast = isEventPast(event.date);
  const [showMenu, setShowMenu] = useState(false);
  const [countdown, setCountdown] = useState(calculateCountdown(event.date));

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(calculateCountdown(event.date));
    }, 1000);

    return () => clearInterval(interval);
  }, [event.date]);

  const getStatusBadge = () => {
    if (isToday) return { text: 'Today!', color: 'bg-green-100 text-green-600' };
    if (isPast) {
      const daysSince = Math.abs(daysUntil);
      if (daysSince === 1) return { text: 'Yesterday', color: 'bg-purple-100 text-purple-600' };
      if (daysSince < 30) return { text: `${daysSince} days ago`, color: 'bg-purple-100 text-purple-600' };
      if (daysSince < 365) return { text: `${Math.floor(daysSince / 30)} months ago`, color: 'bg-purple-100 text-purple-600' };
      return { text: `${Math.floor(daysSince / 365)} years ago`, color: 'bg-purple-100 text-purple-600' };
    }
    if (daysUntil === 1) return { text: 'Tomorrow', color: 'bg-blue-100 text-blue-600' };
    if (daysUntil <= 7) return { text: `${daysUntil} days`, color: 'bg-yellow-100 text-yellow-600' };
    if (daysUntil <= 30) return { text: `${daysUntil} days`, color: 'bg-blue-100 text-blue-600' };
    return null;
  };

  const statusBadge = getStatusBadge();

  return (
    <div className="relative">
      <div
        onClick={onClick}
        className={`bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-200 cursor-pointer transform hover:scale-[1.02] active:scale-[0.98] overflow-visible relative ${
          event.isCompleted ? 'opacity-75' : ''
        }`}
      >
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-3">
            <div className="text-4xl">{event.emoji}</div>
            <div>
              <h3 className="font-semibold text-lg text-gray-800">{event.title}</h3>
              <p className="text-sm text-gray-500 capitalize">{event.category}</p>
            </div>
          </div>
          
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <MoreVertical className="w-5 h-5 text-gray-400" />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg z-10 overflow-hidden">
                {onComplete && !event.isCompleted && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onComplete();
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2 text-green-600"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Mark Complete</span>
                  </button>
                )}
                {onEdit && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit();
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete();
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2 text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3 overflow-visible">
          <p className="text-sm text-gray-600">{formatEventDate(event.date)}</p>
          
          {/* Live countdown/countup display */}
          {!event.isCompleted && (
            <div className="py-4" style={{ transform: 'scale(1.2)', transformOrigin: 'center' }}>
              <FlipClockPqina
                hours={countdown.hours}
                minutes={countdown.minutes}
                seconds={countdown.seconds}
                compact={true}
              />
            </div>
          )}
          
          {event.isCompleted && (
            <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-600">
              ✓ Completed
            </span>
          )}
          
          {!event.isCompleted && (
            <div className="flex flex-wrap gap-2">
              {countdown.years > 0 && (
                <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-600">
                  {countdown.years} {countdown.years === 1 ? 'year' : 'years'}
                </span>
              )}
              {countdown.months > 0 && (
                <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-600">
                  {countdown.months} {countdown.months === 1 ? 'month' : 'months'}
                </span>
              )}
              {countdown.days > 0 && (
                <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-600">
                  {countdown.days} {countdown.days === 1 ? 'day' : 'days'}
                </span>
              )}
              {statusBadge && countdown.years === 0 && countdown.months === 0 && countdown.days === 0 && (
                <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${statusBadge.color}`}>
                  {statusBadge.text}
                </span>
              )}
            </div>
          )}
          
          {event.notes && (
            <p className="text-sm text-gray-500 line-clamp-2">{event.notes}</p>
          )}
        </div>

      </div>
    </div>
  );
};
import React, { useState } from 'react';
import { Event } from '../types';
import { EventCard } from './EventCard';
import { CountdownTimer } from './CountdownTimer';
import { ChevronLeft, Plus } from 'lucide-react';

interface EventsListProps {
  events: Event[];
  title: string;
  onAddEvent: () => void;
  onEditEvent: (event: Event) => void;
  onDeleteEvent: (id: string) => void;
  onCompleteEvent?: (id: string) => void;
}

export const EventsList: React.FC<EventsListProps> = ({ 
  events, 
  title, 
  onAddEvent, 
  onEditEvent, 
  onDeleteEvent,
  onCompleteEvent 
}) => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  if (selectedEvent) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 shadow-card max-w-2xl w-full animate-slide-up">
          <button
            onClick={() => setSelectedEvent(null)}
            className="mb-6 flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Back to Events</span>
          </button>
          
          <CountdownTimer event={selectedEvent} large />
          
          {selectedEvent.notes && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">{selectedEvent.notes}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">

        {events.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 shadow-card text-center">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No events yet
            </h3>
            <p className="text-gray-500 mb-6">
              Start by adding your first countdown event!
            </p>
            <button
              onClick={onAddEvent}
              className="bg-accent-blue text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors inline-flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Event</span>
            </button>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event, index) => {
                const prevEvent = index > 0 ? events[index - 1] : null;
                const showDivider = prevEvent && !prevEvent.isCompleted && event.isCompleted;
                
                return (
                  <React.Fragment key={event.id}>
                    {showDivider && (
                      <div className="col-span-full my-6">
                        <div className="flex items-center justify-center">
                          <div className="h-px bg-gray-300 flex-1"></div>
                          <span className="px-4 text-sm text-gray-500 font-medium">Completed Events</span>
                          <div className="h-px bg-gray-300 flex-1"></div>
                        </div>
                      </div>
                    )}
                    <EventCard
                      event={event}
                      onClick={() => setSelectedEvent(event)}
                      onEdit={() => onEditEvent(event)}
                      onDelete={() => onDeleteEvent(event.id)}
                      onComplete={onCompleteEvent ? () => onCompleteEvent(event.id) : undefined}
                    />
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        )}
      </div>
      
      {/* Floating add button */}
      <button
        onClick={onAddEvent}
        className="fixed bottom-24 right-8 bg-white text-gray-700 p-4 rounded-full hover:bg-gray-50 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95 border border-gray-200"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
};
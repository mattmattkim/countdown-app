import React, { useState } from 'react';
import { Event } from '../types';
import { EventCard } from './EventCard';
import { CountdownTimer } from './CountdownTimer';
import { ChevronLeft, Plus, Search } from 'lucide-react';

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
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <div className="bg-white rounded-3xl p-8 shadow-card mb-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
            <button
              onClick={onAddEvent}
              className="bg-accent-blue text-white p-3 rounded-full hover:bg-blue-600 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>
          
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-blue transition-all"
            />
          </div>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 shadow-card text-center">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {searchQuery ? 'No events found' : 'No events yet'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery 
                ? 'Try adjusting your search' 
                : 'Start by adding your first countdown event!'}
            </p>
            {!searchQuery && (
              <button
                onClick={onAddEvent}
                className="bg-accent-blue text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors inline-flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Add Event</span>
              </button>
            )}
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event, index) => {
                const prevEvent = index > 0 ? filteredEvents[index - 1] : null;
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
    </div>
  );
};
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Event, AppSettings } from '../types';
import { generateId } from '../utils/dateHelpers';

interface EventsContextType {
  events: Event[];
  activeEvents: Event[];
  completedEvents: Event[];
  allEventsSorted: Event[];
  settings: AppSettings;
  addEvent: (event: Omit<Event, 'id' | 'createdAt' | 'updatedAt' | 'isCompleted'>) => void;
  updateEvent: (id: string, updates: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  completeEvent: (id: string) => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
}

const EventsContext = createContext<EventsContextType | undefined>(undefined);

interface EventsProviderProps {
  children: ReactNode;
}

export const EventsProvider: React.FC<EventsProviderProps> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>(() => {
    const saved = localStorage.getItem('countdown-events');
    return saved ? JSON.parse(saved, (key, value) => {
      if (key === 'date' || key === 'createdAt' || key === 'updatedAt' || key === 'completedAt') {
        return value ? new Date(value) : value;
      }
      return value;
    }) : [];
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('countdown-settings');
    return saved ? JSON.parse(saved) : {
      selectedTheme: 'default',
      notificationsEnabled: true,
      soundEnabled: true
    };
  });

  useEffect(() => {
    localStorage.setItem('countdown-events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('countdown-settings', JSON.stringify(settings));
  }, [settings]);

  const activeEvents = events.filter(event => !event.isCompleted).sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const completedEvents = events.filter(event => event.isCompleted).sort((a, b) => 
    new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime()
  );

  const allEventsSorted = [...events].sort((a, b) => {
    // Completed events go to the bottom
    if (a.isCompleted && !b.isCompleted) return 1;
    if (!a.isCompleted && b.isCompleted) return -1;
    
    // For non-completed events, sort by date (closest first)
    if (!a.isCompleted && !b.isCompleted) {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    }
    
    // For completed events, sort by completion date (most recent first)
    return new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime();
  });

  const addEvent = (eventData: Omit<Event, 'id' | 'createdAt' | 'updatedAt' | 'isCompleted'>) => {
    const newEvent: Event = {
      ...eventData,
      id: generateId(),
      isCompleted: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setEvents(prev => [...prev, newEvent]);
  };

  const updateEvent = (id: string, updates: Partial<Event>) => {
    setEvents(prev => prev.map(event => 
      event.id === id 
        ? { ...event, ...updates, updatedAt: new Date() }
        : event
    ));
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(event => event.id !== id));
  };

  const completeEvent = (id: string) => {
    setEvents(prev => prev.map(event => 
      event.id === id 
        ? { 
            ...event, 
            isCompleted: true, 
            completedAt: new Date(),
            updatedAt: new Date()
          }
        : event
    ));
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <EventsContext.Provider value={{
      events,
      activeEvents,
      completedEvents,
      allEventsSorted,
      settings,
      addEvent,
      updateEvent,
      deleteEvent,
      completeEvent,
      updateSettings
    }}>
      {children}
    </EventsContext.Provider>
  );
};

export const useEvents = () => {
  const context = useContext(EventsContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventsProvider');
  }
  return context;
};
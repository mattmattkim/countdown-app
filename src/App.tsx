import React, { useState, useEffect } from 'react';
import { EventsProvider, useEvents } from './contexts/EventsContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Layout } from './components/Layout';
import { EventsList } from './components/EventsList';
import { AddEventModal } from './components/AddEventModal';
import { Settings } from './components/Settings';
import { PasswordProtect } from './components/PasswordProtect';
import { Event } from './types';
import { Calendar, Settings as SettingsIcon } from 'lucide-react';
import { checkAuth } from './utils/auth';

const AppContent: React.FC = () => {
  const { allEventsSorted, addEvent, updateEvent, deleteEvent, completeEvent } = useEvents();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [currentView, setCurrentView] = useState<'events' | 'settings'>('events');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    // Check if user has valid auth cookie
    const hasAuth = checkAuth();
    setIsAuthenticated(hasAuth);
    setIsCheckingAuth(false);
  }, []);

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setShowAddModal(true);
  };

  const handleSaveEvent = (eventData: Omit<Event, 'id' | 'createdAt' | 'updatedAt' | 'isCompleted'>) => {
    if (editingEvent) {
      updateEvent(editingEvent.id, eventData);
      setEditingEvent(null);
    } else {
      addEvent(eventData);
    }
    setShowAddModal(false);
  };

  const handleDeleteEvent = (id: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      deleteEvent(id);
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'events':
        return (
          <EventsList
            events={allEventsSorted}
            title="Our Countdown"
            onAddEvent={() => setShowAddModal(true)}
            onEditEvent={handleEditEvent}
            onDeleteEvent={handleDeleteEvent}
            onCompleteEvent={completeEvent}
          />
        );
      case 'settings':
        return <Settings onBack={() => setCurrentView('events')} />;
      default:
        return (
          <EventsList
            events={allEventsSorted}
            title="Our Countdown"
            onAddEvent={() => setShowAddModal(true)}
            onEditEvent={handleEditEvent}
            onDeleteEvent={handleDeleteEvent}
            onCompleteEvent={completeEvent}
          />
        );
    }
  };

  if (isCheckingAuth) {
    // Show loading state while checking authentication
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <PasswordProtect onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  return (
    <Layout>
      {renderContent()}
      
      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-around py-2">
            <button
              onClick={() => setCurrentView('events')}
              className={`p-3 rounded-lg transition-colors ${
                currentView === 'events' 
                  ? 'text-accent-blue bg-accent-blue bg-opacity-10' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Calendar className="w-6 h-6" />
            </button>
            <button
              onClick={() => setCurrentView('settings')}
              className={`p-3 rounded-lg transition-colors ${
                currentView === 'settings' 
                  ? 'text-accent-blue bg-accent-blue bg-opacity-10' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <SettingsIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      <AddEventModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditingEvent(null);
        }}
        onSave={handleSaveEvent}
        editingEvent={editingEvent}
      />
    </Layout>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <EventsProvider>
        <AppContent />
      </EventsProvider>
    </ErrorBoundary>
  );
}

export default App;
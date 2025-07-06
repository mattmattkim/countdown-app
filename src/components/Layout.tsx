import React from 'react';
import { useEvents } from '../contexts/EventsContext';
import { DEFAULT_THEMES } from '../types';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { settings } = useEvents();
  const theme = DEFAULT_THEMES.find(t => t.id === settings.selectedTheme) || DEFAULT_THEMES[0];

  return (
    <div 
      className="min-h-screen transition-all duration-500"
      style={{ background: theme.backgroundColor }}
    >
      {children}
    </div>
  );
};
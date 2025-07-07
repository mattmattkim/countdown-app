import React from 'react';
import { useEvents } from '../contexts/EventsContext';
import { DEFAULT_THEMES } from '../types';
import { ChevronLeft, Bell, Volume2, User, LogOut } from 'lucide-react';
import { clearAuth } from '../utils/auth';

interface SettingsProps {
  onBack: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ onBack }) => {
  const { settings, updateSettings } = useEvents();
  
  const handleLogout = () => {
    clearAuth();
    window.location.reload();
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl p-8 shadow-card animate-slide-up">
          <button
            onClick={onBack}
            className="mb-6 flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Settings</span>
          </button>

          <div className="space-y-6">
            {/* Theme Selection */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                <span>Choose Theme</span>
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {DEFAULT_THEMES.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => updateSettings({ selectedTheme: theme.id })}
                    className={`p-4 rounded-xl transition-all ${
                      settings.selectedTheme === theme.id
                        ? 'ring-2 ring-accent-blue shadow-lg scale-105'
                        : 'hover:shadow-md'
                    }`}
                    style={{ 
                      background: theme.backgroundColor,
                    }}
                  >
                    <div className="text-3xl mb-2">{theme.icon}</div>
                    <p className="text-sm font-medium text-gray-700">{theme.name}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Notification Settings */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Notifications</h3>
              <div className="space-y-3">
                <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Bell className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-700">Notify me</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.notificationsEnabled}
                    onChange={(e) => updateSettings({ notificationsEnabled: e.target.checked })}
                    className="w-5 h-5 text-accent-blue rounded focus:ring-accent-blue"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Volume2 className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-700">Sound effects</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.soundEnabled}
                    onChange={(e) => updateSettings({ soundEnabled: e.target.checked })}
                    className="w-5 h-5 text-accent-blue rounded focus:ring-accent-blue"
                  />
                </label>
              </div>
            </div>

            {/* User Profile */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Profile</h3>
              <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-accent-blue rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">You</p>
                  <p className="text-sm text-gray-500">Counting down together</p>
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <div className="border-t pt-6">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-2 p-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>

            {/* App Info */}
            <div className="border-t pt-6 text-center">
              <p className="text-sm text-gray-500">Countdown App v1.0.0</p>
              <p className="text-xs text-gray-400 mt-1">Made with ❤️ for you both</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
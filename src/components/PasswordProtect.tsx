import React, { useState } from 'react';
import { Lock } from 'lucide-react';

interface PasswordProtectProps {
  onAuthenticated: () => void;
}

export const PasswordProtect: React.FC<PasswordProtectProps> = ({ onAuthenticated }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check password from environment variable
    const correctPassword = process.env.REACT_APP_PASSWORD || 'defaultpassword';
    
    if (password === correctPassword) {
      // Set cookie that expires in 30 days
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30);
      document.cookie = `countdown_auth=true; expires=${expiryDate.toUTCString()}; path=/`;
      
      onAuthenticated();
    } else {
      setError(true);
      setTimeout(() => setError(false), 3000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-sky-300 to-sky-500">
      <div className="bg-white rounded-3xl p-8 shadow-2xl w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Lock className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Welcome to Our Countdown</h1>
          <p className="text-gray-600 mt-2">Enter the password to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className={`w-full px-4 py-3 rounded-lg border ${
                error ? 'border-red-300 bg-red-50' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
              autoFocus
            />
            {error && (
              <p className="text-red-500 text-sm mt-2">Incorrect password. Please try again.</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            Enter
          </button>
        </form>
      </div>
    </div>
  );
};
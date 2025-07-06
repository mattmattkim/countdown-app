import React, { useEffect, useRef, useState } from 'react';
import '@pqina/flip/dist/flip.min.css';
import { loadFlipLibrary } from '../utils/flipLoader';

interface FlipClockPqinaProps {
  hours: number;
  minutes: number;
  seconds: number;
  compact?: boolean;
}

export const FlipClockPqina: React.FC<FlipClockPqinaProps> = ({
  hours,
  minutes,
  seconds,
  compact = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const tickInstanceRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const initializationRef = useRef(false);

  const formatTimeString = (h: number, m: number, s: number): string => {
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const initializeFlipClock = React.useCallback(() => {
    try {
      if (containerRef.current && window.Tick) {
        // Create the flip clock HTML structure with proper data attributes
        const timeString = formatTimeString(hours, minutes, seconds);
        containerRef.current.innerHTML = `
          <div class="tick" data-value="${timeString}">
            <div data-repeat="true" aria-hidden="true">
              <span data-view="flip"></span>
            </div>
          </div>
        `;

        // Parse the DOM to initialize Tick
        const tickElements = window.Tick.DOM.parse(containerRef.current);
        
        if (tickElements && tickElements.length > 0) {
          tickInstanceRef.current = tickElements[0];
          console.log('Flip clock initialized:', tickInstanceRef.current);
        } else {
          console.error('Failed to initialize flip clock - no tick elements found');
        }
      }
    } catch (err) {
      console.error('Error in flip clock initialization:', err);
      setError('Failed to initialize flip clock');
    }
  }, [hours, minutes, seconds, compact]);

  useEffect(() => {
    // Prevent double initialization in React Strict Mode
    if (initializationRef.current) return;
    initializationRef.current = true;

    // Load the Flip library using singleton loader
    loadFlipLibrary()
      .then(() => {
        setIsLoaded(true);
        initializeFlipClock();
      })
      .catch((err) => {
        console.error('Failed to load Flip library:', err);
        setError('Failed to load animation library');
      });

    return () => {
      // Cleanup
      if (tickInstanceRef.current && tickInstanceRef.current.destroy) {
        tickInstanceRef.current.destroy();
        tickInstanceRef.current = null;
      }
    };
  }, [initializeFlipClock]);

  // Update values when props change
  useEffect(() => {
    try {
      if (isLoaded && tickInstanceRef.current) {
        const timeString = formatTimeString(hours, minutes, seconds);
        tickInstanceRef.current.value = timeString;
      }
    } catch (err) {
      console.error('Error updating flip clock values:', err);
    }
  }, [hours, minutes, seconds, isLoaded]);

  if (error) {
    // Fallback to simple display if library fails to load
    return (
      <div className="flex items-center justify-center gap-2">
        <div className="bg-gray-100 rounded-lg p-4">
          <span className="text-4xl font-mono">{hours.toString().padStart(2, '0')}</span>
        </div>
        <span className="text-3xl text-gray-300">:</span>
        <div className="bg-gray-100 rounded-lg p-4">
          <span className="text-4xl font-mono">{minutes.toString().padStart(2, '0')}</span>
        </div>
        <span className="text-3xl text-gray-300">:</span>
        <div className="bg-gray-100 rounded-lg p-4">
          <span className="text-4xl font-mono">{seconds.toString().padStart(2, '0')}</span>
        </div>
      </div>
    );
  }

  return <div ref={containerRef} className="flip-clock-container" />;
};
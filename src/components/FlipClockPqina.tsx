import React, { useEffect, useRef, useState } from 'react';
import '@pqina/flip/dist/flip.min.css';
import { loadFlipLibrary } from '../utils/flipLoader';
import { TimeUnit } from '../utils/dateHelpers';

interface FlipClockPqinaProps {
  units: TimeUnit[];
  compact?: boolean;
}

export const FlipClockPqina: React.FC<FlipClockPqinaProps> = ({
  units,
  compact = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const tickInstancesRef = useRef<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const initializationRef = useRef(false);

  const initializeFlipClock = React.useCallback(() => {
    try {
      if (containerRef.current && window.Tick) {
        // Clear any existing instances
        tickInstancesRef.current.forEach(instance => {
          if (instance && instance.destroy) {
            instance.destroy();
          }
        });
        tickInstancesRef.current = [];

        // Create the flip clock HTML structure with individual units
        const unitsHtml = units.map((unit, index) => `
          <div class="flip-unit">
            <div class="tick" data-value="${unit.value.toString().padStart(2, '0')}">
              <div data-repeat="true" aria-hidden="true">
                <span data-view="flip"></span>
              </div>
            </div>
            <div class="flip-unit-label">${unit.label}</div>
          </div>
        `).join('');

        containerRef.current.innerHTML = `
          <div class="flip-units-container">
            ${unitsHtml}
          </div>
        `;

        // Parse the DOM to initialize Tick instances
        const tickElements = window.Tick.DOM.parse(containerRef.current);
        
        if (tickElements && tickElements.length > 0) {
          tickInstancesRef.current = tickElements;
          console.log('Flip clock initialized with units:', units);
        } else {
          console.error('Failed to initialize flip clock - no tick elements found');
        }
      }
    } catch (err) {
      console.error('Error in flip clock initialization:', err);
      setError('Failed to initialize flip clock');
    }
  }, [units]);

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
      tickInstancesRef.current.forEach(instance => {
        if (instance && instance.destroy) {
          instance.destroy();
        }
      });
      tickInstancesRef.current = [];
    };
  }, [initializeFlipClock]);

  // Update values when units change
  useEffect(() => {
    try {
      if (isLoaded && tickInstancesRef.current.length === units.length) {
        units.forEach((unit, index) => {
          if (tickInstancesRef.current[index]) {
            tickInstancesRef.current[index].value = unit.value.toString().padStart(2, '0');
          }
        });
      } else if (isLoaded && tickInstancesRef.current.length !== units.length) {
        // If the number of units changed, reinitialize
        initializeFlipClock();
      }
    } catch (err) {
      console.error('Error updating flip clock values:', err);
    }
  }, [units, isLoaded, initializeFlipClock]);

  if (error) {
    // Fallback to simple display if library fails to load
    return (
      <div className="flex items-center justify-center gap-4">
        {units.map((unit, index) => (
          <div key={index} className="text-center">
            <div className="bg-gray-100 rounded-lg p-4">
              <span className="text-3xl font-mono">{unit.value.toString().padStart(2, '0')}</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">{unit.label}</div>
          </div>
        ))}
      </div>
    );
  }

  return <div ref={containerRef} className="flip-clock-container" />;
};
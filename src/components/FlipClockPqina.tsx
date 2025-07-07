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
  const instanceId = useRef(`flip-${Math.random().toString(36).substr(2, 9)}`);

  const initializeFlipClock = () => {
    try {
      if (containerRef.current && window.Tick && units.length > 0) {
        console.log('Initializing flip clock with units:', units);
        // Clear any existing instances
        tickInstancesRef.current.forEach(instance => {
          if (instance && instance.destroy) {
            instance.destroy();
          }
        });
        tickInstancesRef.current = [];

        // Clear the container first
        containerRef.current.innerHTML = '';
        
        // Create a unique container for this instance
        const uniqueContainer = document.createElement('div');
        uniqueContainer.className = 'flip-units-container';
        uniqueContainer.id = instanceId.current;
        
        // Create the flip clock HTML structure with individual units
        units.forEach((unit, index) => {
          const unitDiv = document.createElement('div');
          unitDiv.className = 'flip-unit';
          
          const tickDiv = document.createElement('div');
          tickDiv.className = 'tick';
          tickDiv.setAttribute('data-value', unit.value.toString().padStart(2, '0'));
          
          const repeatDiv = document.createElement('div');
          repeatDiv.setAttribute('data-repeat', 'true');
          repeatDiv.setAttribute('aria-hidden', 'true');
          
          const spanView = document.createElement('span');
          spanView.setAttribute('data-view', 'flip');
          
          repeatDiv.appendChild(spanView);
          tickDiv.appendChild(repeatDiv);
          
          const labelDiv = document.createElement('div');
          labelDiv.className = 'flip-unit-label';
          labelDiv.textContent = unit.label;
          
          unitDiv.appendChild(tickDiv);
          unitDiv.appendChild(labelDiv);
          uniqueContainer.appendChild(unitDiv);
        });
        
        containerRef.current.appendChild(uniqueContainer);
        
        // Parse the DOM to initialize Tick instances
        const tickElements = window.Tick.DOM.parse(uniqueContainer);
        
        if (tickElements && tickElements.length === units.length) {
          tickInstancesRef.current = tickElements;
          console.log('Flip clock initialized with units:', units);
          console.log('Parsed tick instances:', tickElements.length);
        } else {
          console.error(`Failed to initialize flip clock - expected ${units.length} units but got ${tickElements ? tickElements.length : 0}`);
        }
      }
    } catch (err) {
      console.error('Error in flip clock initialization:', err);
      setError('Failed to initialize flip clock');
    }
  };

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
  }, []);

  // Reinitialize when units change
  useEffect(() => {
    if (isLoaded && containerRef.current) {
      // Destroy existing instances
      tickInstancesRef.current.forEach(instance => {
        if (instance && instance.destroy) {
          instance.destroy();
        }
      });
      tickInstancesRef.current = [];
      
      // Reinitialize with new units
      initializeFlipClock();
    }
  }, [units, isLoaded]);

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
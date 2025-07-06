import React, { useState, useEffect } from 'react';

interface FlipUnitProps {
  value: number;
  label: string;
  max?: number;
}

const FlipUnit: React.FC<FlipUnitProps> = ({ value, label, max = 99 }) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [isFlipping, setIsFlipping] = useState(false);
  const [previousValue, setPreviousValue] = useState(value);

  useEffect(() => {
    if (value !== displayValue) {
      setPreviousValue(displayValue);
      setIsFlipping(true);
      setTimeout(() => {
        setDisplayValue(value);
        setIsFlipping(false);
      }, 300);
    }
  }, [value, displayValue]);

  const formatValue = (val: number) => val.toString().padStart(2, '0');

  return (
    <div className="text-center">
      <div className="relative w-20 h-24 md:w-24 md:h-28 mx-auto">
        <div className="absolute inset-0 bg-gray-100 rounded-lg shadow-inner overflow-hidden">
          {/* Static background value */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl md:text-5xl font-light text-gray-800">
              {formatValue(displayValue)}
            </span>
          </div>
          
          {/* Animated flipping value */}
          {isFlipping && (
            <div
              className="absolute inset-0 flex items-center justify-center animate-flip-down"
            >
              <span className="text-4xl md:text-5xl font-light text-gray-800">
                {formatValue(previousValue)}
              </span>
            </div>
          )}
          
          {/* Horizontal line in the middle */}
          <div className="absolute inset-x-0 top-1/2 h-px bg-gray-300 transform -translate-y-1/2" />
        </div>
      </div>
      <div className="mt-2 text-xs text-gray-400">{label}</div>
    </div>
  );
};

interface FlipClockProps {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  compact?: boolean;
}

export const FlipClock: React.FC<FlipClockProps> = ({
  years,
  months,
  days,
  hours,
  minutes,
  seconds,
  compact = false
}) => {
  // Always show only hours, minutes, seconds in the flip clock
  const unitSize = compact ? 'w-16 h-20' : 'w-20 h-24 md:w-24 md:h-28';
  const fontSize = compact ? 'text-2xl' : 'text-4xl md:text-5xl';
  const separatorSize = compact ? 'text-2xl' : 'text-3xl md:text-4xl';
  const marginBottom = compact ? 'mb-4' : 'mb-6';

  return (
    <div className="flex items-center justify-center gap-2 md:gap-3">
      <FlipUnit value={hours} label="Hours" />
      <span className={`${separatorSize} text-gray-300 ${marginBottom}`}>:</span>
      <FlipUnit value={minutes} label="Minutes" />
      <span className={`${separatorSize} text-gray-300 ${marginBottom}`}>:</span>
      <FlipUnit value={seconds} label="Seconds" />
    </div>
  );
};
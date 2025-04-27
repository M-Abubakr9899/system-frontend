import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  max: number;
  className?: string;
  showLabel?: boolean;
  glowing?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  value, 
  max, 
  className, 
  showLabel = false,
  glowing = true
}) => {
  const percentage = Math.min(Math.max(0, (value / max) * 100), 100);
  
  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="flex justify-between mb-1 text-xs">
          <span className="text-text-secondary">{value}</span>
          <span className="text-text-secondary">{max}</span>
        </div>
      )}
      <div className="w-full bg-background h-2 rounded-full overflow-hidden">
        <div 
          className={cn(
            "bg-primary h-full", 
            { "glow": glowing }
          )} 
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  );
};

export default ProgressBar;

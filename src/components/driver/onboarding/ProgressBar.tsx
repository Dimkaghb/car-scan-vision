import React from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps, className = '' }) => {
  const percentage = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className={`w-full max-w-md mx-auto mb-6 ${className}`}>
      {/* Progress Text */}
      <div className="text-center mb-3">
        <span className="text-xs font-normal text-muted-foreground">
          Шаг {currentStep} из {totalSteps} ({percentage}%)
        </span>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-muted rounded-full h-1.5">
        <div 
          className="bg-green-500 h-1.5 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;

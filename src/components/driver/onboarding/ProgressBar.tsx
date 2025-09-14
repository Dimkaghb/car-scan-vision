import React from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps, className = '' }) => {
  const percentage = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className={`w-full max-w-md mx-auto mb-8 ${className}`}>
      {/* Progress Text */}
      <div className="text-center mb-4">
        <span className="text-sm font-medium text-gray-600">
          Шаг {currentStep} из {totalSteps} ({percentage}%)
        </span>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-green-500 h-2 rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;

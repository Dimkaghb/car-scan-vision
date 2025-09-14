import React from 'react';
import carIconImage from '../assets/caricon.png';

interface CarIconProps {
  rotation?: number;
  size?: number;
  className?: string;
}

export const CarIcon: React.FC<CarIconProps> = ({ 
  rotation = 0, 
  size = 40, 
  className = '' 
}) => {
  return (
    <div 
      className={`car-icon ${className}`}
      style={{
        transform: `rotate(${rotation}deg)`,
        width: `${size}px`,
        height: `${size}px`,
        transformOrigin: 'center'
      }}
    >
      <img 
        src={carIconImage}
        alt="Car"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain'
        }}
      />
    </div>
  );
};

// Utility function to generate random rotation
export const getRandomRotation = (): number => {
  return Math.floor(Math.random() * 360);
};

// Utility function to generate random car count
export const getRandomCarCount = (): number => {
  return Math.floor(Math.random() * 3) + 2; // 2-4 cars
};
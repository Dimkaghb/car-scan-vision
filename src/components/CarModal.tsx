import React from 'react';

interface DriverInfo {
  name: string;
  rating: number;
}

interface CarInfo {
  model: string;
  year: number;
  condition: string;
}

interface CarModalProps {
  driverInfo: DriverInfo;
  carInfo: CarInfo;
  position: { x: number; y: number };
  isVisible: boolean;
}

const CarModal: React.FC<CarModalProps> = ({ driverInfo, carInfo, position, isVisible }) => {
  if (!isVisible) return null;

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={i} className="text-yellow-400">★</span>
      );
    }
    
    if (hasHalfStar) {
      stars.push(
        <span key="half" className="text-yellow-400">☆</span>
      );
    }
    
    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className="text-gray-300">☆</span>
      );
    }
    
    return stars;
  };

  return (
    <div
      className="absolute z-[2000] bg-white rounded-lg shadow-lg border border-gray-200 p-4 min-w-[250px] pointer-events-none"
      style={{
        left: `${position.x + 10}px`,
        top: `${position.y - 10}px`,
        transform: 'translateY(-100%)'
      }}
    >
      {/* Driver Information */}
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-gray-800 mb-1">Driver</h3>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-700">{driverInfo.name}</span>
          <div className="flex items-center ml-2">
            {renderStars(driverInfo.rating)}
            <span className="text-xs text-gray-500 ml-1">({driverInfo.rating})</span>
          </div>
        </div>
      </div>
      
      {/* Divider */}
      <div className="border-t border-gray-200 my-2"></div>
      
      {/* Car Information */}
      <div>
        <h3 className="text-sm font-semibold text-gray-800 mb-1">Vehicle</h3>
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-xs text-gray-600">Model:</span>
            <span className="text-xs text-gray-800">{carInfo.model}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs text-gray-600">Year:</span>
            <span className="text-xs text-gray-800">{carInfo.year}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs text-gray-600">Condition:</span>
            <span className={`text-xs font-medium ${
              carInfo.condition === 'Excellent' ? 'text-green-600' :
              carInfo.condition === 'Good' ? 'text-blue-600' :
              carInfo.condition === 'Fair' ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {carInfo.condition}
            </span>
          </div>
        </div>
      </div>
      
      {/* Arrow pointing to car */}
      <div 
        className="absolute w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white"
        style={{
          bottom: '-4px',
          left: '20px'
        }}
      ></div>
    </div>
  );
};

export default CarModal;
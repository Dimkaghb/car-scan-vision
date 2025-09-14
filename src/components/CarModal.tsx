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
    isExpanded?: boolean;
    onExpand?: () => void;
    onClose?: () => void;
}

const CarModal: React.FC<CarModalProps> = ({ 
    driverInfo, 
    carInfo, 
    position, 
    isVisible, 
    isExpanded = false, 
    onExpand, 
    onClose 
}) => {
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

  const handleModalClick = () => {
    if (!isExpanded && onExpand) {
      onExpand();
    }
  };

  return (
    <div
      data-modal="true"
      className={`absolute z-[2000] bg-white rounded-lg shadow-lg border border-gray-200 pointer-events-auto transition-all duration-300 ${
        isExpanded 
          ? 'p-6 min-w-[350px] cursor-default' 
          : 'p-3 min-w-[200px] cursor-pointer hover:shadow-xl'
      }`}
      style={{
                left: isExpanded ? '50%' : `${position.x + 2}px`,
                top: isExpanded ? '50%' : `${position.y - 2}px`,
                transform: isExpanded ? 'translate(-50%, -50%)' : 'translateY(-100%)'
            }}
      onClick={handleModalClick}
            onMouseEnter={() => {
                // Keep modal visible when hovering over it
            }}
            onMouseLeave={() => {
                // Let parent handle mouse leave
            }}
        >
      {/* Close button for expanded modal */}
      {isExpanded && onClose && (
        <button
          className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        >
          ×
        </button>
      )}
      
      {/* Arrow pointing to car (only for non-expanded) */}
      {!isExpanded && (
        <div 
          className="absolute left-0 top-1/2 transform -translate-x-2 -translate-y-1/2 w-0 h-0 border-t-8 border-b-8 border-r-8 border-transparent border-r-white"
        />
      )}
      
      {/* Driver Info */}
      <div className={isExpanded ? 'mb-2' : 'mb-3'}>
        <h3 className={`font-semibold text-gray-800 mb-1 ${isExpanded ? 'text-lg' : 'text-sm'}`}>Driver</h3>
        <div className="flex items-center justify-between">
          <p className={`text-gray-700 ${isExpanded ? 'text-base' : 'text-xs'}`}>{driverInfo.name}</p>
          <div className="flex items-center gap-1">
            <div className={isExpanded ? 'text-lg' : 'text-xs'}>
              {renderStars(driverInfo.rating)}
            </div>
            <span className={`text-gray-600 ml-1 ${isExpanded ? 'text-sm' : 'text-xs'}`}>({driverInfo.rating})</span>
          </div>
        </div>
        {isExpanded && (
          <div className="mt-1 text-sm text-gray-600">
            <p>Professional taxi driver with excellent service record.</p>
            <p>Available for immediate pickup.</p>
          </div>
        )}
      </div>
      
      {/* Car Info */}
      <div className={isExpanded ? 'mb-2' : ''}>
        <h3 className={`font-semibold text-gray-800 mb-1 ${isExpanded ? 'text-lg' : 'text-sm'}`}>Vehicle</h3>
        <p className={`text-gray-700 ${isExpanded ? 'text-base' : 'text-xs'}`}>{carInfo.year} {carInfo.model} • {carInfo.condition}</p>
        {isExpanded && (
          <div className="mt-1 text-sm text-gray-600">
            <p>Air conditioning, comfortable seating, clean interior.</p>
            <p>License plate: ABC-123</p>
            <div className="mt-2 flex gap-2">
              <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                Book Ride
              </button>
              <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors">
                Call Driver
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Car Image - only for expanded modal */}
      {isExpanded && (
        <div className="mt-3">
          <img 
            src="/src/assets/hero-car-inspection.jpg" 
            alt="Car inspection" 
            className="w-full h-32 object-cover rounded-lg"
          />
        </div>
      )}
      
      {/* Click hint for non-expanded modal */}
      {!isExpanded && (
        <div className="mt-2 text-xs text-gray-400 text-center">
          Click to expand
        </div>
      )}
    </div>
  );
};

export default CarModal;
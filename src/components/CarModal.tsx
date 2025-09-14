import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Phone, MessageCircle, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  const isMobile = useIsMobile();
  
  if (!isVisible) return null;

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star 
          key={i} 
          className={`${isMobile ? 'h-4 w-4' : 'h-3 w-3'} ${
            i < fullStars ? 'text-yellow-400 fill-current' : 'text-gray-300'
          }`}
        />
      );
    }
    
    return stars;
  };

  const handleModalClick = () => {
    if (!isExpanded && onExpand) {
      onExpand();
    }
  };

  // Mobile: Use bottom sheet style for expanded modal
  if (isMobile && isExpanded) {
    return (
      <div className="fixed inset-0 z-[2500] flex items-end">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        
        {/* Bottom Sheet */}
        <div 
          data-modal="true"
          className="relative w-full bg-white rounded-t-2xl shadow-2xl transform transition-transform duration-300 ease-out animate-in slide-in-from-bottom"
        >
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-10 h-1 bg-gray-300 rounded-full" />
          </div>
          
          {/* Content */}
          <div className="px-6 pb-8">
            {/* Close button */}
            <button
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
              onClick={onClose}
            >
              ×
            </button>
            
            {/* Driver Info */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {driverInfo.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800">{driverInfo.name}</h3>
                  <div className="flex items-center gap-2">
                    <div className="flex">{renderStars(driverInfo.rating)}</div>
                    <span className="text-gray-600 text-sm">({driverInfo.rating})</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-base">Professional taxi driver with excellent service record. Available for immediate pickup.</p>
            </div>
            
            {/* Car Info */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-2">Vehicle</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-800 font-medium text-lg">{carInfo.year} {carInfo.model}</p>
                <p className="text-gray-600">Condition: {carInfo.condition}</p>
                <p className="text-gray-600">License: ABC-123</p>
                <p className="text-gray-600 text-sm mt-2">Air conditioning, comfortable seating, clean interior</p>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="space-y-3">
              <Button className="w-full py-4 text-lg font-semibold bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white rounded-xl">
                Book This Ride
              </Button>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="py-3 text-base font-medium rounded-xl border-2">
                  <Phone className="h-5 w-5 mr-2" />
                  Call
                </Button>
                <Button variant="outline" className="py-3 text-base font-medium rounded-xl border-2">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Message
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Desktop and mobile hover modal
  return (
    <div
      data-modal="true"
      className={`absolute z-[2000] bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-gray-200 pointer-events-auto transition-all duration-300 ${
        isExpanded 
          ? 'p-6 min-w-[350px] cursor-default' 
          : `${isMobile ? 'p-4 min-w-[240px]' : 'p-3 min-w-[200px]'} cursor-pointer hover:shadow-2xl hover:scale-105`
      }`}
      style={{
        left: isExpanded ? '50%' : `${position.x + 2}px`,
        top: isExpanded ? '50%' : `${position.y - 2}px`,
        transform: isExpanded ? 'translate(-50%, -50%)' : 'translateY(-100%)'
      }}
      onClick={handleModalClick}
    >
      {/* Close button for expanded modal */}
      {isExpanded && onClose && (
        <button
          className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-colors"
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
          className="absolute left-0 top-1/2 transform -translate-x-2 -translate-y-1/2 w-0 h-0 border-t-8 border-b-8 border-r-8 border-transparent border-r-white/95"
        />
      )}
      
      {/* Driver Info */}
      <div className={isExpanded ? 'mb-4' : 'mb-3'}>
        <div className="flex items-center gap-2 mb-2">
          <div className={`${isMobile ? 'w-8 h-8' : 'w-6 h-6'} bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold ${isMobile ? 'text-sm' : 'text-xs'}`}>
            {driverInfo.name.charAt(0)}
          </div>
          <h3 className={`font-bold text-gray-800 ${isExpanded ? 'text-lg' : isMobile ? 'text-base' : 'text-sm'}`}>{driverInfo.name}</h3>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <div className="flex">{renderStars(driverInfo.rating)}</div>
            <span className={`text-gray-600 ml-1 ${isExpanded ? 'text-sm' : 'text-xs'}`}>({driverInfo.rating})</span>
          </div>
        </div>
        {isExpanded && (
          <div className="mt-2 text-sm text-gray-600">
            <p>Professional taxi driver with excellent service record.</p>
            <p>Available for immediate pickup.</p>
          </div>
        )}
      </div>
      
      {/* Car Info */}
      <div className={isExpanded ? 'mb-4' : ''}>
        <h3 className={`font-semibold text-gray-800 mb-1 ${isExpanded ? 'text-lg' : isMobile ? 'text-sm' : 'text-xs'}`}>Vehicle</h3>
        <p className={`text-gray-700 font-medium ${isExpanded ? 'text-base' : isMobile ? 'text-sm' : 'text-xs'}`}>{carInfo.year} {carInfo.model}</p>
        <p className={`text-gray-500 ${isExpanded ? 'text-sm' : 'text-xs'}`}>Condition: {carInfo.condition}</p>
        {isExpanded && (
          <div className="mt-3">
            <div className="bg-gray-50 rounded-lg p-3 mb-3">
              <p className="text-sm text-gray-600">Air conditioning, comfortable seating, clean interior.</p>
              <p className="text-sm text-gray-600">License plate: ABC-123</p>
            </div>
            <div className="flex gap-2">
              <Button className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white">
                Book Ride
              </Button>
              <Button variant="outline" className="flex-1">
                <Phone className="h-4 w-4 mr-1" />
                Call
              </Button>
            </div>
          </div>
        )}
      </div>
      
      {/* Click hint for non-expanded modal */}
      {!isExpanded && (
        <div className={`mt-2 ${isMobile ? 'text-xs' : 'text-[10px]'} text-gray-400 text-center font-medium`}>
          {isMobile ? 'Tap for details' : 'Click to expand'}
        </div>
      )}
    </div>
  );
};

export default CarModal;
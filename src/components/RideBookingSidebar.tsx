import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Navigation, User, Clock, Search } from 'lucide-react';

interface RideBookingSidebarProps {
  className?: string;
  onAddressSearch?: (pickup: string, destination: string) => void;
}

export const RideBookingSidebar = ({ className, onAddressSearch }: RideBookingSidebarProps) => {
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [selectedRide, setSelectedRide] = useState('uberx');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');

  const rideTypes: any[] = [];

  const handleSearch = async () => {
    if (!pickup.trim() || !destination.trim()) {
      setSearchError('Please enter both pickup and destination addresses');
      return;
    }

    setIsSearching(true);
    setSearchError('');
    
    try {
      if (onAddressSearch) {
        await onAddressSearch(pickup.trim(), destination.trim());
      }
    } catch (error) {
      setSearchError('Failed to find addresses. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className={`bg-white shadow-lg border-r border-gray-200 h-full flex flex-col ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Uber</h1>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              Поездки
            </Button>
            <Button variant="ghost" size="sm">
              <User className="h-4 w-4" />
              Действия
            </Button>
          </div>
        </div>
      </div>

      {/* Trip Planning */}
      <div className="p-4 space-y-4">
        <h2 className="text-lg font-semibold">Заказ поездок</h2>
        
        {/* Location Inputs */}
        <div className="space-y-3">
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Место посадки"
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              className="pl-10 py-3"
            />
          </div>
          
          <div className="relative">
            <Navigation className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Пункт назначения"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="pl-10 py-3"
            />
            <Button 
              variant="ghost" 
              size="sm" 
              className="absolute right-2 top-2 h-8 w-8 p-0"
            >
              +
            </Button>
          </div>
        </div>

        {/* Ride Options - Empty for now */}
        <div className="space-y-2">
          {/* Ride options will be populated dynamically */}
        </div>

        {/* Search Button */}
        <Button 
          className="w-full py-3 text-base font-medium" 
          onClick={handleSearch}
          disabled={isSearching}
        >
          <Search className="h-4 w-4 mr-2" />
          {isSearching ? 'Searching...' : 'Find Route'}
        </Button>

        {/* Error Message */}
        {searchError && (
          <div className="text-red-500 text-sm mt-2 p-2 bg-red-50 rounded">
            {searchError}
          </div>
        )}

        {/* For Me Toggle */}
        <div className="flex items-center justify-between py-2">
          <span className="text-sm">Для меня</span>
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              ▼
            </Button>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="mt-auto p-4 border-t border-gray-200">
        <div className="relative">
          <Input
            placeholder="Поиск"
            className="pl-4 py-2"
          />
        </div>
      </div>
    </div>
  );
};
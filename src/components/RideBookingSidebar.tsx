import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Navigation, User, Clock, Search, DollarSign, Car, X } from 'lucide-react';

interface RideBookingSidebarProps {
  className?: string;
  onAddressSearch?: (pickup: string, destination: string) => void;
  onRouteFound?: () => void;
  onFindTaxi?: () => void;
}

export const RideBookingSidebar = ({ className, onAddressSearch, onRouteFound, onFindTaxi }: RideBookingSidebarProps) => {
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [selectedRide, setSelectedRide] = useState('uberx');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [routeFound, setRouteFound] = useState(false);
  const [userPrice, setUserPrice] = useState('');
  const [suggestedPrice] = useState('1500'); // Static suggested price for demo
  const [showDriversList, setShowDriversList] = useState(false);
  const [isSearchingTaxi, setIsSearchingTaxi] = useState(false);

  const rideTypes: any[] = [];

  // Mock taxi drivers data
  const availableDrivers = [
    {
      id: 1,
      name: 'Алексей Петров',
      rating: 4.8,
      car: 'Toyota Camry 2020',
      price: '1400 ₸',
      eta: '3 мин',
      distance: '0.5 км'
    },
    {
      id: 2,
      name: 'Мария Иванова',
      rating: 4.9,
      car: 'Honda Civic 2019',
      price: '1500 ₸',
      eta: '5 мин',
      distance: '1.2 км'
    },
    {
      id: 3,
      name: 'Дмитрий Сидоров',
      rating: 4.7,
      car: 'Hyundai Elantra 2021',
      price: '1600 ₸',
      eta: '7 мин',
      distance: '2.1 км'
    }
  ];

  const handleSearch = async () => {
    if (!pickup.trim() || !destination.trim()) {
      setSearchError('Please enter both pickup and destination addresses');
      return;
    }

    setIsSearching(true);
    setSearchError('');
    setRouteFound(false);
    
    try {
      if (onAddressSearch) {
        await onAddressSearch(pickup.trim(), destination.trim());
        setRouteFound(true);
        if (onRouteFound) {
          onRouteFound();
        }
      }
    } catch (error) {
      setSearchError('Failed to find addresses. Please try again.');
      setRouteFound(false);
    } finally {
      setIsSearching(false);
    }
  };

  const handleFindTaxi = () => {
    // Handle taxi booking logic here
    console.log('Finding taxi with price:', userPrice || suggestedPrice);
    
    // Set searching state
    setIsSearchingTaxi(true);
    
    // Generate taxis on the map
    if (onFindTaxi) {
      onFindTaxi();
    }
    
    // Show drivers list automatically
    setShowDriversList(true);
  };

  const handleBackToInputs = () => {
    setRouteFound(false);
    setUserPrice('');
    setShowDriversList(false);
    setSearchError('');
    setIsSearchingTaxi(false);
    // Optionally clear pickup and destination if needed
    // setPickup('');
    // setDestination('');
  };

  return (
    <div className={`bg-white shadow-lg border-r border-gray-200 h-screen flex flex-col ${className}`}>
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
      <div className="p-4 space-y-4 flex-1 overflow-y-auto">
        <h2 className="text-lg font-semibold">Заказ поездок</h2>
        
        {/* Location Inputs or Route Display */}
        {!routeFound ? (
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
        ) : (
          <div className="bg-white border border-gray-200 p-3 rounded-lg relative mx-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToInputs}
              className="absolute top-2 right-2 h-6 w-6 p-0 hover:bg-gray-100 rounded-full z-10"
            >
              <X className="h-3 w-3 text-gray-400" />
            </Button>
            <div className="pr-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-black rounded-full flex-shrink-0"></div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs text-gray-500 uppercase tracking-wide">From</div>
                    <div className="font-medium text-black truncate">{pickup}</div>
                  </div>
                </div>
                <div className="flex items-center justify-center py-1">
                  <div className="flex items-center space-x-1">
                    <div className="h-px w-12 bg-gray-300"></div>
                    <div className="w-0 h-0 border-l-[4px] border-l-gray-400 border-t-[2px] border-t-transparent border-b-[2px] border-b-transparent"></div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-black rounded-full flex-shrink-0"></div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs text-gray-500 uppercase tracking-wide">To</div>
                    <div className="font-medium text-black truncate">{destination}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Ride Options - Empty for now */}
        <div className="space-y-2">
          {/* Ride options will be populated dynamically */}
        </div>

        {/* Search Button - Hide when route is found */}
        {!routeFound && (
          <Button 
            className="w-full py-3 text-base font-medium" 
            onClick={handleSearch}
            disabled={isSearching}
          >
            <Search className="h-4 w-4 mr-2" />
            {isSearching ? 'Searching...' : 'Find Route'}
          </Button>
        )}

        {/* Error Message */}
        {searchError && (
          <div className="text-red-500 text-sm mt-2 p-2 bg-red-50 rounded">
            {searchError}
          </div>
        )}

        {/* Price Input Section - Shows after route is found */}
        {routeFound && !isSearchingTaxi && (
          <div className="space-y-3 p-4 bg-gray-50 rounded-lg border">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Car className="h-4 w-4" />
              <span>Route Found!</span>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs text-gray-500 font-medium">
                Suggested Price: {suggestedPrice} ₸
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={`Your price (suggested: ${suggestedPrice} ₸)`}
                  value={userPrice}
                  onChange={(e) => setUserPrice(e.target.value)}
                  className="pl-10 py-3"
                  type="number"
                />
              </div>
            </div>
            
            <Button 
              className="w-full py-3 text-base font-medium bg-black hover:bg-gray-800 text-white" 
              onClick={handleFindTaxi}
              disabled={!userPrice && !suggestedPrice}
            >
              <Car className="h-4 w-4 mr-2" />
              Find Taxi
            </Button>
          </div>
        )}

        {/* Searching for Price Section - Shows when searching for taxi */}
        {routeFound && isSearchingTaxi && (
          <div className="space-y-3 p-4 bg-gray-50 rounded-lg border">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Car className="h-4 w-4 animate-pulse" />
              <span>Searching for price ({userPrice || suggestedPrice} ₸)</span>
            </div>
          </div>
        )}

        {/* For Me Toggle */}
        <div className="space-y-2">
          <div 
            className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-50 rounded px-2"
            onClick={() => setShowDriversList(!showDriversList)}
          >
            <span className="text-sm font-medium">Для меня</span>
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                {showDriversList ? '▲' : '▼'}
              </Button>
            </div>
          </div>
          
          {/* Taxi Drivers List */}
          {showDriversList && routeFound && (
            <div className="space-y-2 max-h-80 overflow-y-auto">
              <div className="text-xs text-gray-500 font-medium px-2 mb-2">
                Доступные водители ({availableDrivers.length})
              </div>
              {availableDrivers.map((driver) => (
                <Card key={driver.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-sm">{driver.name}</h4>
                          <span className="text-sm font-bold text-green-600">{driver.price}</span>
                        </div>
                        <div className="text-xs text-gray-500 mb-1">{driver.car}</div>
                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <div className="flex items-center space-x-1">
                            <span>★ {driver.rating}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span>{driver.eta}</span>
                            <span>•</span>
                            <span>{driver.distance}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
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
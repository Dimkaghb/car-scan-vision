
import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { RideBookingSidebar } from '@/components/RideBookingSidebar';
import { CarIcon, getRandomRotation, getRandomCarCount } from '@/components/CarIcon';
import CarModal from '@/components/CarModal';

// Fix for default markers in Leaflet with bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface AddressResult {
  lat: number;
  lon: number;
  display_name: string;
}

interface DriverInfo {
    name: string;
    rating: number;
}

interface CarInfo {
    model: string;
    year: number;
    condition: string;
}

interface RandomCar {
  id: string;
  lat: number;
  lon: number;
  rotation: number;
  driverInfo: DriverInfo;
  carInfo: CarInfo;
}

export const MainMap = () => {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const markersRef = useRef<L.Marker[]>([]);
    const routeRef = useRef<L.Polyline | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [routeFoundCallback, setRouteFoundCallback] = useState<(() => void) | null>(null);
    const [randomCars, setRandomCars] = useState<RandomCar[]>([]);
    const [hoveredCar, setHoveredCar] = useState<RandomCar | null>(null);
    const [modalPosition, setModalPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

    // Mock data generators
    const generateDriverInfo = (): DriverInfo => {
        const names = [
            'John Smith', 'Maria Garcia', 'Ahmed Hassan', 'Li Wei', 'Anna Petrov',
            'Carlos Rodriguez', 'Fatima Al-Zahra', 'David Johnson', 'Priya Sharma', 'Erik Larsson'
        ];
        return {
            name: names[Math.floor(Math.random() * names.length)],
            rating: Math.round((3.5 + Math.random() * 1.5) * 10) / 10 // 3.5 to 5.0
        };
    };

    const generateCarInfo = (): CarInfo => {
        const models = [
            'Toyota Camry', 'Honda Civic', 'Nissan Altima', 'Hyundai Elantra', 'Kia Forte',
            'Volkswagen Jetta', 'Chevrolet Malibu', 'Ford Fusion', 'Mazda 6', 'Subaru Legacy'
        ];
        const conditions = ['Excellent', 'Good', 'Fair'];
        const currentYear = new Date().getFullYear();
        
        return {
            model: models[Math.floor(Math.random() * models.length)],
            year: currentYear - Math.floor(Math.random() * 8), // 0-7 years old
            condition: conditions[Math.floor(Math.random() * conditions.length)]
        };
    };

    useEffect(() => {
        if (mapRef.current && !mapInstanceRef.current) {
            // Initialize the map with Almaty coordinates (similar to the Uber screenshot)
            const map = L.map(mapRef.current).setView([43.2220, 76.8512], 13);
            
            // Add OpenStreetMap tiles
            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(map);
            
            // Map is ready for dynamic markers
            
            mapInstanceRef.current = map;
        }
        
        // Cleanup function
        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, []);

    // Update car positions when map moves or zooms
    useEffect(() => {
        if (mapInstanceRef.current && randomCars.length > 0) {
            const updateCarPositions = () => {
                // Force re-render by updating state
                setRandomCars(prev => [...prev]);
            };

            const map = mapInstanceRef.current;
            map.on('move', updateCarPositions);
            map.on('zoom', updateCarPositions);

            return () => {
                map.off('move', updateCarPositions);
                map.off('zoom', updateCarPositions);
            };
        }
    }, [randomCars.length]);

    const geocodeAddress = async (address: string): Promise<AddressResult | null> => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
            );
            const data = await response.json();
            
            if (data && data.length > 0) {
                return {
                    lat: parseFloat(data[0].lat),
                    lon: parseFloat(data[0].lon),
                    display_name: data[0].display_name
                };
            }
            return null;
        } catch (error) {
            console.error('Geocoding error:', error);
            return null;
        }
    };

    const clearMarkersAndRoute = () => {
        // Clear existing markers
        markersRef.current.forEach(marker => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.removeLayer(marker);
            }
        });
        markersRef.current = [];

        // Clear existing route
        if (routeRef.current && mapInstanceRef.current) {
            mapInstanceRef.current.removeLayer(routeRef.current);
            routeRef.current = null;
        }

        // Clear existing random cars
        setRandomCars([]);
    };

    // Function to generate random cars around pickup location
    const generateRandomCars = (pickupLat: number, pickupLon: number) => {
        const carCount = getRandomCarCount();
        const cars: RandomCar[] = [];
        
        // Define common road directions (in degrees)
        const roadDirections = [0, 45, 90, 135, 180, 225, 270, 315]; // N, NE, E, SE, S, SW, W, NW
        
        for (let i = 0; i < carCount; i++) {
            // Generate position along simulated road network
            const roadDirection = roadDirections[Math.floor(Math.random() * roadDirections.length)];
            const roadAngle = (roadDirection * Math.PI) / 180;
            
            // Distance along the "road" (100m to 600m from center)
            const roadDistance = 100 + Math.random() * 500;
            
            // Small perpendicular offset to simulate different lanes (±20m)
            const laneOffset = (Math.random() - 0.5) * 40;
            const perpAngle = roadAngle + Math.PI / 2;
            
            // Calculate final position
            const totalLatOffset = 
                (roadDistance * Math.cos(roadAngle) + laneOffset * Math.cos(perpAngle)) / 111000;
            const totalLonOffset = 
                (roadDistance * Math.sin(roadAngle) + laneOffset * Math.sin(perpAngle)) / 
                (111000 * Math.cos(pickupLat * Math.PI / 180));
            
            // Car rotation should align with road direction (±15 degrees for realism)
            const carRotation = roadDirection + (Math.random() - 0.5) * 30;
            
            const car: RandomCar = {
                id: `car-${i}-${Date.now()}`,
                lat: pickupLat + totalLatOffset,
                lon: pickupLon + totalLonOffset,
                rotation: carRotation,
                driverInfo: generateDriverInfo(),
                carInfo: generateCarInfo()
            };
            
            cars.push(car);
        }
        
        setRandomCars(cars);
    };

    const addMarker = (lat: number, lon: number, title: string, isPickup: boolean = true) => {
        if (!mapInstanceRef.current) return;

        const icon = L.divIcon({
            html: `<div style="background-color: ${isPickup ? '#10b981' : '#ef4444'}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
            className: 'custom-marker',
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });

        const marker = L.marker([lat, lon], { icon })
            .addTo(mapInstanceRef.current)
            .bindPopup(`<b>${isPickup ? 'Pickup' : 'Destination'}</b><br>${title}`);
        
        markersRef.current.push(marker);
    };

    const getRoute = async (pickup: AddressResult, destination: AddressResult): Promise<L.LatLngExpression[]> => {
    try {
      // Using OSRM (Open Source Routing Machine) - free and no API key required
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${pickup.lon},${pickup.lat};${destination.lon},${destination.lat}?overview=full&geometries=geojson`
      );
      
      if (!response.ok) {
        throw new Error('Routing service unavailable');
      }
      
      const data = await response.json();
      
      if (data.routes && data.routes[0] && data.routes[0].geometry) {
        const coordinates = data.routes[0].geometry.coordinates;
        // Convert [lon, lat] to [lat, lon] for Leaflet
        return coordinates.map((coord: number[]) => [coord[1], coord[0]] as L.LatLngExpression);
      }
      
      throw new Error('No route found');
    } catch (error) {
      console.warn('Routing API failed, falling back to straight line:', error);
      // Fallback to straight line if routing fails
      return [
        [pickup.lat, pickup.lon],
        [destination.lat, destination.lon]
      ];
    }
  };

  const drawRoute = async (pickup: AddressResult, destination: AddressResult) => {
    if (!mapInstanceRef.current) return;

    try {
      // Get actual road route
      const routeCoordinates = await getRoute(pickup, destination);

      routeRef.current = L.polyline(routeCoordinates, {
        color: '#3b82f6',
        weight: 4,
        opacity: 0.7
      }).addTo(mapInstanceRef.current);

      // Fit map to show the route
      const group = new L.FeatureGroup([...markersRef.current, routeRef.current]);
      mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1));
    } catch (error) {
      console.error('Failed to draw route:', error);
    }
  };

    const handleAddressSearch = async (pickup: string, destination: string) => {
        setIsLoading(true);
        
        try {
            // Clear previous markers and route
            clearMarkersAndRoute();

            // Geocode both addresses
            const [pickupResult, destinationResult] = await Promise.all([
                geocodeAddress(pickup),
                geocodeAddress(destination)
            ]);

            if (!pickupResult) {
                throw new Error(`Pickup address "${pickup}" not found`);
            }

            if (!destinationResult) {
                throw new Error(`Destination address "${destination}" not found`);
            }

            // Add markers
      addMarker(pickupResult.lat, pickupResult.lon, pickupResult.display_name, true);
      addMarker(destinationResult.lat, destinationResult.lon, destinationResult.display_name, false);

      // Generate random cars around pickup location
      generateRandomCars(pickupResult.lat, pickupResult.lon);

      // Draw route
      await drawRoute(pickupResult, destinationResult);

        } catch (error) {
            console.error('Address search error:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-screen w-full">
            {/* Sidebar */}
            <div className="w-80 flex-shrink-0">
                <RideBookingSidebar 
                    className="h-full" 
                    onAddressSearch={handleAddressSearch}
                    onRouteFound={() => {
                        // Route found callback - can be used for additional logic
                        console.log('Route has been successfully found and displayed');
                    }}
                />
            </div>
            
            {/* Map container */}
            <div className="flex-1 relative">
                <div 
                    ref={mapRef} 
                    className="h-full w-full"
                />
                
                {/* Random Cars Overlay */}
                {randomCars.map((car) => {
                    if (!mapInstanceRef.current) return null;
                    
                    const point = mapInstanceRef.current.latLngToContainerPoint([car.lat, car.lon]);
                    
                    return (
                        <div
                            key={car.id}
                            className="absolute pointer-events-auto z-[1000] cursor-pointer"
                            style={{
                                left: `${point.x - 20}px`,
                                top: `${point.y - 20}px`,
                                transform: 'translate(-50%, -50%)'
                            }}
                            onMouseEnter={(e) => {
                                setHoveredCar(car);
                                setModalPosition({ x: point.x, y: point.y });
                            }}
                            onMouseLeave={() => {
                                setHoveredCar(null);
                            }}
                        >
                            <CarIcon rotation={car.rotation} size={40} />
                        </div>
                    );
                })}
                
                {/* Car Modal */}
                {hoveredCar && (
                    <CarModal
                        driverInfo={hoveredCar.driverInfo}
                        carInfo={hoveredCar.carInfo}
                        position={modalPosition}
                        isVisible={true}
                    />
                )}
                
                {/* Zoom controls */}
                <div className="absolute top-4 right-4 z-10 flex flex-col space-y-2">
                    <button 
                        className="bg-white shadow-lg rounded-lg w-10 h-10 flex items-center justify-center hover:bg-gray-50 border"
                        onClick={() => mapInstanceRef.current?.zoomIn()}
                    >
                        +
                    </button>
                    <button 
                        className="bg-white shadow-lg rounded-lg w-10 h-10 flex items-center justify-center hover:bg-gray-50 border"
                        onClick={() => mapInstanceRef.current?.zoomOut()}
                    >
                        −
                    </button>
                </div>
                
                {isLoading && (
                    <div className="absolute top-4 left-4 bg-white px-4 py-2 rounded-lg shadow-lg border z-[1000]">
                        <div className="flex items-center space-x-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                            <span className="text-sm font-medium">Searching addresses...</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
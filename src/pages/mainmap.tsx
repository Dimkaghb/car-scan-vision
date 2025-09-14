
import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { RideBookingSidebar } from '@/components/RideBookingSidebar';

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

export const MainMap = () => {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const markersRef = useRef<L.Marker[]>([]);
    const routeRef = useRef<L.Polyline | null>(null);
    const [isLoading, setIsLoading] = useState(false);

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
                />
            </div>
            
            {/* Map container */}
            <div className="flex-1 relative">
                <div 
                    ref={mapRef} 
                    className="h-full w-full"
                />
                
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
import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getDistance } from '../utils/locationService';
import { calculateFares } from '../utils/fareCalculator';
import FareComparison from './FareComparison';

interface Location {
  name: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface LocationSuggestion {
  display_name: string;
  lat: string;
  lon: string;
}

interface LocationFormProps {
  onSubmit: (pickup: Location, dropoff: Location) => void;
}

export default function LocationForm({ onSubmit }: LocationFormProps) {
  const [pickup, setPickup] = useState<Location | null>(null);
  const [dropoff, setDropoff] = useState<Location | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [fareEstimates, setFareEstimates] = useState<any>(null);
  const [pickupSuggestions, setPickupSuggestions] = useState<LocationSuggestion[]>([]);
  const [dropoffSuggestions, setDropoffSuggestions] = useState<LocationSuggestion[]>([]);
  const [showPickupSuggestions, setShowPickupSuggestions] = useState(false);
  const [showDropoffSuggestions, setShowDropoffSuggestions] = useState(false);
  
  const pickupRef = useRef<HTMLInputElement>(null);
  const dropoffRef = useRef<HTMLInputElement>(null);
  const pickupTimeoutRef = useRef<NodeJS.Timeout>();
  const dropoffTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    return () => {
      if (pickupTimeoutRef.current) clearTimeout(pickupTimeoutRef.current);
      if (dropoffTimeoutRef.current) clearTimeout(dropoffTimeoutRef.current);
    };
  }, []);

  const handleLocationSearch = async (input: string, isPickup: boolean) => {
    if (input.length < 3) {
      if (isPickup) {
        setPickupSuggestions([]);
        setShowPickupSuggestions(false);
      } else {
        setDropoffSuggestions([]);
        setShowDropoffSuggestions(false);
      }
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(input)}&limit=5`,
        {
          headers: {
            'User-Agent': 'EzySafar/1.0'
          }
        }
      );
      
      const data = await response.json();
      
      if (isPickup) {
        setPickupSuggestions(data);
        setShowPickupSuggestions(true);
      } else {
        setDropoffSuggestions(data);
        setShowDropoffSuggestions(true);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const handleInputChange = (value: string, isPickup: boolean) => {
    if (isPickup) {
      if (pickupTimeoutRef.current) clearTimeout(pickupTimeoutRef.current);
      pickupTimeoutRef.current = setTimeout(() => handleLocationSearch(value, true), 500);
    } else {
      if (dropoffTimeoutRef.current) clearTimeout(dropoffTimeoutRef.current);
      dropoffTimeoutRef.current = setTimeout(() => handleLocationSearch(value, false), 500);
    }
  };

  const handleSuggestionSelect = (suggestion: LocationSuggestion, isPickup: boolean) => {
    const location = {
      name: suggestion.display_name,
      coordinates: {
        lat: parseFloat(suggestion.lat),
        lng: parseFloat(suggestion.lon)
      }
    };

    if (isPickup) {
      setPickup(location);
      if (pickupRef.current) pickupRef.current.value = location.name;
      setShowPickupSuggestions(false);
    } else {
      setDropoff(location);
      if (dropoffRef.current) dropoffRef.current.value = location.name;
      setShowDropoffSuggestions(false);
    }

    toast.success(`${isPickup ? 'Pickup' : 'Drop-off'} location set!`);
  };
  
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }
    
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
            {
              headers: {
                'User-Agent': 'EzySafar/1.0'
              }
            }
          );
          const data = await response.json();
          
          if (data) {
            const location = {
              name: data.display_name,
              coordinates: { lat: latitude, lng: longitude }
            };
            setPickup(location);
            if (pickupRef.current) pickupRef.current.value = location.name;
            toast.success('Current location detected!');
          }
        } catch (error) {
          toast.error('Failed to get address from coordinates');
        }
        setIsLocating(false);
      },
      () => {
        toast.error('Unable to retrieve your location');
        setIsLocating(false);
      }
    );
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pickup || !dropoff) {
      toast.error('Please select both pickup and drop-off locations');
      return;
    }

    setIsCalculating(true);
    try {
      const distance = await getDistance(pickup.coordinates, dropoff.coordinates);
      const fares = calculateFares(distance);
      setFareEstimates({
        ...fares,
        pickup: pickup.name,
        dropoff: dropoff.name
      });
      onSubmit(pickup, dropoff);
      toast.success('Fare calculation completed!');
    } catch (error) {
      console.error('Fare calculation error:', error);
      toast.error('Failed to calculate fares. Please try again.');
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#14213D] rounded-xl shadow-lg p-6">
        <div className="grid grid-cols-1 gap-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Pickup Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  ref={pickupRef}
                  type="text"
                  required
                  placeholder="Enter pickup location"
                  className="pl-10 w-full rounded-lg bg-[#14213D] border border-gray-600 p-3 text-white transition-colors focus:border-[#FCA311] focus:ring-2 focus:ring-[#FCA311]/20"
                  onChange={(e) => handleInputChange(e.target.value, true)}
                  onFocus={() => setShowPickupSuggestions(true)}
                />
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#FCA311] hover:text-[#FCA311]/80"
                  disabled={isLocating}
                >
                  <Navigation className={`h-5 w-5 ${isLocating ? 'animate-spin' : ''}`} />
                </button>
                
                {showPickupSuggestions && pickupSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-[#14213D] rounded-md shadow-lg border border-gray-600">
                    {pickupSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        type="button"
                        className="w-full text-left px-4 py-2 text-white hover:bg-[#FCA311]/10 focus:outline-none focus:bg-[#FCA311]/10 truncate"
                        onClick={() => handleSuggestionSelect(suggestion, true)}
                      >
                        {suggestion.display_name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white mb-2">Drop-off Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  ref={dropoffRef}
                  type="text"
                  required
                  placeholder="Enter drop-off location"
                  className="pl-10 w-full rounded-lg bg-[#14213D] border border-gray-600 p-3 text-white transition-colors focus:border-[#FCA311] focus:ring-2 focus:ring-[#FCA311]/20"
                  onChange={(e) => handleInputChange(e.target.value, false)}
                  onFocus={() => setShowDropoffSuggestions(true)}
                />
                
                {showDropoffSuggestions && dropoffSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-[#14213D] rounded-md shadow-lg border border-gray-600">
                    {dropoffSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        type="button"
                        className="w-full text-left px-4 py-2 text-white hover:bg-[#FCA311]/10 focus:outline-none focus:bg-[#FCA311]/10 truncate"
                        onClick={() => handleSuggestionSelect(suggestion, false)}
                      >
                        {suggestion.display_name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <button
              type="submit"
              disabled={!pickup || !dropoff || isCalculating}
              className="w-full py-3 px-4 bg-[#FCA311] text-[#14213D] font-semibold rounded-lg hover:bg-[#FCA311]/90 transition-colors focus:ring-2 focus:ring-[#FCA311]/20 disabled:bg-gray-400 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
            >
              {isCalculating ? (
                <span className="flex items-center justify-center">
                  <Navigation className="animate-spin h-5 w-5 mr-2" />
                  Calculating Fares...
                </span>
              ) : (
                'Compare Fares'
              )}
            </button>
          </form>
        </div>
      </div>

      {fareEstimates && (
        <FareComparison
          fares={fareEstimates.allFares}
          cheapest={fareEstimates.cheapest}
          pickup={fareEstimates.pickup}
          dropoff={fareEstimates.dropoff}
        />
      )}
    </div>
  );
}
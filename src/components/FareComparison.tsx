import React from 'react';
import { Car, AlertCircle, ExternalLink } from 'lucide-react';
import type { FareResult } from '../utils/fareCalculator';
import { toast } from 'react-hot-toast';
import axios from 'axios';

interface FareComparisonProps {
  fares: FareResult[];
  cheapest: FareResult;
  pickup: string;
  dropoff: string;
}

export default function FareComparison({ fares, cheapest, pickup, dropoff }: FareComparisonProps) {
  const handleBooking = async (fullType: string, fareAmount: number) => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      toast.error('User not logged in');
      return;
    }

    // ✅ Extract only 'Uber' or 'Ola' for schema validation
    const platform = fullType.toLowerCase().includes('uber') ? 'Uber' : 'Ola';

    try {
      await axios.post('http://localhost:5000/api/users/search-history', {
        userId,
        pickupLocation: {
          name: pickup,
          coordinates: { lat: 0, lng: 0 } // optional: replace with real coordinates
        },
        dropoffLocation: {
          name: dropoff,
          coordinates: { lat: 0, lng: 0 }
        },
        selectedRide: platform,
        fareAmount
      });

      toast.success(`${platform} ride saved! Redirecting...`);
    } catch (err) {
      toast.error('Failed to save ride history');
      console.error(err);
    }

    // 🌐 Redirect to platform site
    const encodedPickup = encodeURIComponent(pickup);
    const encodedDropoff = encodeURIComponent(dropoff);

    if (platform === 'Uber') {
      const uberUrl = `https://m.uber.com/ul/?action=setPickup&pickup=${encodedPickup}&dropoff=${encodedDropoff}`;
      window.open(uberUrl, '_blank');
    } else {
      const olaUrl = `https://book.olacabs.com/?pickup=${encodedPickup}&dropoff=${encodedDropoff}`;
      window.open(olaUrl, '_blank');
    }
  };

  return (
    <div className="bg-[#14213D] rounded-xl shadow-lg p-6 mt-6">
      <h2 className="text-2xl font-bold text-white mb-6">Fare Comparison</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {fares.map((fare) => (
          <div
            key={fare.type}
            className={`relative rounded-lg p-6 ${
              fare === cheapest
                ? 'bg-[#FCA311]/10 border-2 border-[#FCA311]'
                : 'bg-gray-800 border border-gray-700'
            }`}
          >
            {fare === cheapest && (
              <div className="absolute -top-3 -right-3 bg-[#FCA311] text-[#14213D] px-3 py-1 rounded-full text-sm font-semibold">
                Best Deal
              </div>
            )}

            <div className="flex items-center mb-4">
              <Car className={`h-6 w-6 ${fare === cheapest ? 'text-[#FCA311]' : 'text-gray-300'}`} />
              <h3 className="text-lg font-semibold ml-2 text-white">{fare.type}</h3>
            </div>

            <div className="space-y-2">
              <p className="text-2xl font-bold text-white">₹{fare.fare}</p>
              <div className="text-sm text-gray-300">
                <p>Base fare: ₹{fare.breakdown.baseFare}</p>
                <p>Distance cost: ₹{fare.breakdown.distanceCost}</p>
              </div>
            </div>

            <button
              onClick={() => handleBooking(fare.type, fare.fare)}
              className={`mt-4 w-full py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 ${
                fare === cheapest
                  ? 'bg-[#FCA311] hover:bg-[#FCA311]/90 text-[#14213D]'
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
              }`}
            >
              <span>Book Now</span>
              <ExternalLink className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center text-sm text-gray-300">
        <AlertCircle className="h-4 w-4 mr-2" />
        <p>Fares are estimates and may vary based on traffic, weather, and other factors.</p>
      </div>
    </div>
  );
}

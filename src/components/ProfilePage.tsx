import React, { useEffect, useState } from 'react';
import { User, Clock, MapPin, Car } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

interface SearchHistory {
  pickupLocation: {
    name: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  dropoffLocation: {
    name: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  selectedRide: string;
  fareAmount: number;
  timestamp: string;
}

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  createdAt: string;
  searchHistory: SearchHistory[];
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/${userId}`);
      setProfile(response.data);
    } catch (error) {
      toast.error('Failed to fetch profile');
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#E5E5E5] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FCA311]"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#E5E5E5] flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600">Failed to load profile</p>
          <button
            onClick={fetchProfile}
            className="mt-4 px-4 py-2 bg-[#FCA311] text-[#14213D] rounded-lg hover:bg-[#FCA311]/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E5E5E5] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Information */}
        <div className="bg-[#14213D] rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="bg-[#FCA311]/10 p-4 rounded-full">
              <User className="h-8 w-8 text-[#FCA311]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                {profile.firstName} {profile.lastName}
              </h1>
              <p className="text-gray-300">{profile.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#14213D]/50 rounded-lg p-4 border border-gray-700">
              <p className="text-gray-300">Phone</p>
              <p className="text-white font-medium">{profile.phone}</p>
            </div>
            <div className="bg-[#14213D]/50 rounded-lg p-4 border border-gray-700">
              <p className="text-gray-300">Member Since</p>
              <p className="text-white font-medium">
                {new Date(profile.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Search History */}
        <div className="bg-[#14213D] rounded-xl shadow-lg p-8">
          <div className="flex items-center space-x-3 mb-6">
            <Clock className="h-6 w-6 text-[#FCA311]" />
            <h2 className="text-xl font-bold text-white">Search History</h2>
          </div>

          <div className="space-y-6">
            {profile.searchHistory.length === 0 ? (
              <p className="text-gray-300 text-center py-8">No search history yet</p>
            ) : (
              profile.searchHistory.map((search, index) => (
                <div
                  key={index}
                  className="bg-[#14213D]/50 rounded-lg p-6 border border-gray-700"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Car className="h-5 w-5 text-[#FCA311]" />
                      <span className="text-[#FCA311] font-medium">
                        {search.selectedRide}
                      </span>
                    </div>
                    <span className="text-gray-400 text-sm">
                      {new Date(search.timestamp).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <MapPin className="h-5 w-5 text-green-500 mt-1" />
                      <div>
                        <p className="text-gray-300 text-sm">Pickup</p>
                        <p className="text-white">{search.pickupLocation.name}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <MapPin className="h-5 w-5 text-red-500 mt-1" />
                      <div>
                        <p className="text-gray-300 text-sm">Drop-off</p>
                        <p className="text-white">{search.dropoffLocation.name}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-end">
                      <p className="text-[#FCA311] font-bold">
                        ₹{search.fareAmount}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

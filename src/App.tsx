import React, { useState } from 'react';
import { Loader2, Car, BanknoteIcon, TicketIcon, MapPin, Search, CreditCard, ArrowRight, Star, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPinIcon } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import LocationForm from './components/LocationForm';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';

interface Location {
  name: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const handleLocationSubmit = (pickup: Location, dropoff: Location) => {
    toast.promise(
      // Simulate API call
      new Promise(resolve => setTimeout(resolve, 2000)),
      {
        loading: 'Fetching fare estimates...',
        success: 'Fare estimates retrieved successfully!',
        error: 'Failed to fetch fare estimates',
      }
    );
    console.log('Locations selected:', { pickup, dropoff });
  };

  const handleAuthSuccess = (profile: UserProfile) => {
    setIsAuthModalOpen(false);
    setIsLoggedIn(true);
    setUserProfile(profile);
    toast.success('Successfully signed in!');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserProfile(null);
    toast.success('Successfully signed out!');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#E5E5E5] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-[#FCA311]" />
          <p className="mt-2 text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  if (isLoggedIn) {
    return (
      <>
        <Toaster position="top-right" />
        <Navbar 
          isLoggedIn={isLoggedIn}
          userProfile={userProfile || undefined}
          onLogout={handleLogout}
        />
        <div className="min-h-screen bg-[#E5E5E5] py-8">
          <div className="max-w-4xl mx-auto px-4">
            <div className="bg-[#14213D] rounded-lg shadow-lg p-6 mb-8">
              <h1 className="text-2xl font-bold text-white mb-4">
                Find the Best Ride
              </h1>
              <p className="text-gray-300">
                Compare fares between Uber and Ola to get the best deal for your journey.
              </p>
            </div>
            <LocationForm onSubmit={handleLocationSubmit} />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      <Navbar setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn} />
      <div 
        className="relative min-h-screen bg-cover bg-center"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=2070")',
        }}
      >
        <div className="absolute inset-0 bg-[#14213D] bg-opacity-90" />
        
        <div className="relative min-h-screen flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                Your Journey, <span className="text-[#FCA311]">Your Choice</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto">
                Compare prices across multiple ride-sharing platforms instantly. Save money and time with EzySafar's smart comparison engine.
              </p>
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="inline-block text-lg text-[#FCA311] hover:text-[#FCA311]/80 transition-colors underline decoration-2 underline-offset-4"
              >
                Sign up to start comparing rides →
              </button>
            </div>

            <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-[#14213D] bg-opacity-10 backdrop-blur-lg rounded-xl p-6 border border-white border-opacity-20">
                <div className="text-[#FCA311] text-4xl font-bold mb-4">100+</div>
                <h3 className="text-white text-xl font-semibold mb-2">Cities Covered</h3>
                <p className="text-gray-300">Find the best rides across major cities in India</p>
              </div>
              <div className="bg-[#14213D] bg-opacity-10 backdrop-blur-lg rounded-xl p-6 border border-white border-opacity-20">
                <div className="text-[#FCA311] text-4xl font-bold mb-4">50K+</div>
                <h3 className="text-white text-xl font-semibold mb-2">Daily Users</h3>
                <p className="text-gray-300">Join thousands of smart travelers saving money daily</p>
              </div>
              <div className="bg-[#14213D] bg-opacity-10 backdrop-blur-lg rounded-xl p-6 border border-white border-opacity-20">
                <div className="text-[#FCA311] text-4xl font-bold mb-4">₹2M+</div>
                <h3 className="text-white text-xl font-semibold mb-2">Savings Made</h3>
                <p className="text-gray-300">Total savings made by our users and counting</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#E5E5E5] py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Reliable transfers card */}
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-[#FCA311]/10 flex items-center justify-center mb-6 shadow-md">
                <Car className="w-10 h-10 text-[#FCA311]" />
              </div>
              <h3 className="text-xl font-bold text-[#14213D] mb-3">Reliable transfers</h3>
              <p className="text-gray-600">
                Experience hassle-free pre-booking for all your airport and outstation rides. Our reliable service ensures you reach your destination on time, every time.
              </p>
            </div>

            {/* Transparent pricing card */}
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-[#FCA311]/10 flex items-center justify-center mb-6 shadow-md">
                <BanknoteIcon className="w-10 h-10 text-[#FCA311]" />
              </div>
              <h3 className="text-xl font-bold text-[#14213D] mb-3">Transparent pricing</h3>
              <p className="text-gray-600">
                No hidden costs, no surprises. Get all-inclusive pricing upfront with a detailed breakdown of fares from different providers.
              </p>
            </div>

            {/* Free cancellation card */}
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-[#FCA311]/10 flex items-center justify-center mb-6 shadow-md">
                <TicketIcon className="w-10 h-10 text-[#FCA311]" />
              </div>
              <h3 className="text-xl font-bold text-[#14213D] mb-3">Free cancellation up to 24 hrs</h3>
              <p className="text-gray-600">
                Plans change? No worries! Cancel your booking up to 24 hours before the ride and get a full refund, no questions asked.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#E5E5E5] py-24 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#14213D] mb-4">How EzySafar Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get the best ride deals in just a few simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="relative flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-[#FCA311]/10 flex items-center justify-center mb-6">
                <MapPin className="w-8 h-8 text-[#FCA311]" />
              </div>
              <h3 className="text-lg font-bold text-[#14213D] mb-2">Enter Location</h3>
              <p className="text-gray-600">
                Input your pickup and drop-off locations for your journey
              </p>
              {/* Arrow for desktop */}
              <div className="hidden md:block absolute -right-8 top-16">
                <ArrowRight className="w-16 h-6 text-[#FCA311]" />
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-[#FCA311]/10 flex items-center justify-center mb-6">
                <Search className="w-8 h-8 text-[#FCA311]" />
              </div>
              <h3 className="text-lg font-bold text-[#14213D] mb-2">Compare Prices</h3>
              <p className="text-gray-600">
                View real-time prices from multiple ride providers
              </p>
              {/* Arrow for desktop */}
              <div className="hidden md:block absolute -right-8 top-16">
                <ArrowRight className="w-16 h-6 text-[#FCA311]" />
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-[#FCA311]/10 flex items-center justify-center mb-6">
                <Car className="w-8 h-8 text-[#FCA311]" />
              </div>
              <h3 className="text-lg font-bold text-[#14213D] mb-2">Choose Ride</h3>
              <p className="text-gray-600">
                Select the best option that suits your needs and budget
              </p>
              {/* Arrow for desktop */}
              <div className="hidden md:block absolute -right-8 top-16">
                <ArrowRight className="w-16 h-6 text-[#FCA311]" />
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-[#FCA311]/10 flex items-center justify-center mb-6">
                <CreditCard className="w-8 h-8 text-[#FCA311]" />
              </div>
              <h3 className="text-lg font-bold text-[#14213D] mb-2">Book & Pay</h3>
              <p className="text-gray-600">
                Complete your booking securely through your chosen platform
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Reviews Section */}
      <div className="bg-[#14213D] py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Top Reviews</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              See what our users have to say about their experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Review Card 1 */}
            <div className="bg-[#14213D] rounded-xl p-8 shadow-lg transform hover:-translate-y-1 transition-transform duration-300 border border-gray-800">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-[#FCA311] text-[#FCA311]" />
                ))}
              </div>
              <h3 className="font-bold text-white mt-4 mb-2">Jiten Sharma</h3>
              <h4 className="text-lg font-semibold text-[#FCA311] mb-3">Wonderful travel service</h4>
              <p className="text-gray-300 italic">
                "EzySafar made my airport transfer hassle-free. I saved ₹200 on my first ride by comparing prices. Highly recommended!"
              </p>
            </div>

            {/* Review Card 2 */}
            <div className="bg-[#14213D] rounded-xl p-8 shadow-lg transform hover:-translate-y-1 transition-transform duration-300 border border-gray-800">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-[#FCA311] text-[#FCA311]" />
                ))}
              </div>
              <h3 className="font-bold text-white mt-4 mb-2">Priya Patel</h3>
              <h4 className="text-lg font-semibold text-[#FCA311] mb-3">Best price comparison</h4>
              <p className="text-gray-300 italic">
                "I use EzySafar for all my daily commutes now. It's amazing how much you can save by comparing different ride options!"
              </p>
            </div>

            {/* Review Card 3 */}
            <div className="bg-[#14213D] rounded-xl p-8 shadow-lg transform hover:-translate-y-1 transition-transform duration-300 border border-gray-800">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-[#FCA311] text-[#FCA311]" />
                ))}
              </div>
              <h3 className="font-bold text-white mt-4 mb-2">Rahul Verma</h3>
              <h4 className="text-lg font-semibold text-[#FCA311] mb-3">Reliable and efficient</h4>
              <p className="text-gray-300 italic">
                "The price comparison is spot on, and the booking process is seamless. I've been using it for months now!"
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="bg-[#14213D] text-gray-300 border-t border-gray-800">
        {/* Main Footer */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Company Info */}
            <div>
              <div className="flex items-center space-x-2 text-white mb-6">
                <Car className="h-6 w-6" />
                <span className="text-xl font-bold">EzySafar</span>
              </div>
              <p className="text-gray-400 mb-6">
                Making your journey easier and more affordable with real-time ride comparison and booking services.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-[#FCA311] transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-[#FCA311] transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-[#FCA311] transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-[#FCA311] transition-colors">
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white text-lg font-semibold mb-6">Quick Links</h3>
              <ul className="space-y-4">
                <li>
                  <a href="#" className="text-gray-400 hover:text-[#FCA311] transition-colors">About Us</a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-[#FCA311] transition-colors">How It Works</a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-[#FCA311] transition-colors">FAQs</a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-[#FCA311] transition-colors">Blog</a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-[#FCA311] transition-colors">Careers</a>
                </li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-white text-lg font-semibold mb-6">Our Services</h3>
              <ul className="space-y-4">
                <li>
                  <a href="#" className="text-gray-400 hover:text-[#FCA311] transition-colors">Airport Transfers</a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-[#FCA311] transition-colors">City Rides</a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-[#FCA311] transition-colors">Outstation Trips</a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-[#FCA311] transition-colors">Corporate Services</a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-[#FCA311] transition-colors">Package Delivery</a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-white text-lg font-semibold mb-6">Contact Us</h3>
              <ul className="space-y-4">
                <li className="flex items-center space-x-3">
                  <MapPinIcon className="h-5 w-5 text-[#FCA311]" />
                  <span>123 Business Avenue, Mumbai, 400001</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-[#FCA311]" />
                  <span>+91 (800) 123-4567</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-[#FCA311]" />
                  <span>support@ezysafar.com</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="md:flex md:items-center md:justify-between">
              <div className="text-sm text-gray-400">
                © {new Date().getFullYear()} EzySafar. All rights reserved.
              </div>
              <div className="mt-4 md:mt-0">
                <ul className="flex space-x-6 text-sm">
                  <li>
                    <a href="#" className="text-gray-400 hover:text-[#FCA311] transition-colors">Privacy Policy</a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-[#FCA311] transition-colors">Terms of Service</a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-[#FCA311] transition-colors">Cookie Policy</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
}

export default App;
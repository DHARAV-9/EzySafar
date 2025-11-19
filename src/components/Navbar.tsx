import React, { useState } from 'react';
import { Car, UserCircle, LogOut } from 'lucide-react';
import AuthModal from './AuthModal';

interface NavbarProps {
  setIsLoggedIn?: (value: boolean) => void;
  isLoggedIn?: boolean;
  userProfile?: {
    firstName: string;
    lastName: string;
    email: string;
  };
  onLogout?: () => void;
}

export default function Navbar({ setIsLoggedIn, isLoggedIn, userProfile, onLogout }: NavbarProps) {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogoClick = () => {
    window.location.reload();
  };

  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false);
    if (setIsLoggedIn) {
      setIsLoggedIn(true);
    }
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    setShowProfileMenu(false);
  };

  return (
    <>
      <nav className="bg-[#14213D] shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={handleLogoClick}
                className="flex items-center space-x-2 text-[#FCA311] hover:text-[#FCA311]/80 transition-colors"
              >
                <Car className="h-6 w-6" />
                <span className="text-xl font-bold">EzySafar</span>
              </button>
            </div>
            
            <div className="flex items-center space-x-6">
              <a
                href="#about"
                className="text-gray-300 hover:text-white transition-colors font-medium"
              >
                About
              </a>
              {isLoggedIn ? (
                <div className="relative">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors font-medium"
                  >
                    <UserCircle className="h-6 w-6" />
                    <span>{userProfile?.firstName || 'Profile'}</span>
                  </button>
                  
                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-[#14213D] rounded-md shadow-lg py-1 z-10 border border-gray-700">
                      <div className="px-4 py-2 text-sm text-gray-300 border-b border-gray-700">
                        <p className="font-medium">{`${userProfile?.firstName} ${userProfile?.lastName}`}</p>
                        <p className="text-gray-400 text-xs mt-1">{userProfile?.email}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#FCA311]/10 flex items-center space-x-2"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="bg-[#FCA311] text-[#14213D] px-4 py-2 rounded-lg hover:bg-[#FCA311]/90 transition-colors font-medium"
                >
                  Sign Up
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
}
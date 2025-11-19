import React, { useState } from 'react';
import { X, Phone, Car, Mail, Lock, User } from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (profile: { firstName: string; lastName: string; email: string }) => void;
}

type AuthMethod = 'phone' | 'uber' | 'ola';

interface RegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [authMethod, setAuthMethod] = useState<AuthMethod | null>(null);
  const [registrationData, setRegistrationData] = useState<RegistrationData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
  });
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(false);

  const handlePlatformAuth = (platform: 'uber' | 'ola') => {
    setAuthMethod(platform);
    setShowRegistrationForm(true);
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registrationData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (!isLoginMode) {
      if (registrationData.password.length < 8) {
        toast.error('Password must be at least 8 characters long');
        return;
      }

      if (!/^\d{10}$/.test(registrationData.phone)) {
        toast.error('Please enter a valid 10-digit phone number');
        return;
      }
    }

    try {
      const endpoint = isLoginMode ? 'login' : 'register';
      const response = await axios.post(
        `http://localhost:5000/api/users/${endpoint}`,
        registrationData,
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );

      toast.success(isLoginMode ? 'Login successful' : 'Registration successful');
      localStorage.setItem('userId', response.data.userId);

      onSuccess({
        firstName: response.data.user.firstName,
        lastName: response.data.user.lastName,
        email: response.data.user.email,
      });

      resetForm();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Authentication failed';
      toast.error(message);
      console.error('❌ Auth error:', error);
    }
  };

  const resetForm = () => {
    setAuthMethod(null);
    setShowRegistrationForm(false);
    setIsLoginMode(false);
    setRegistrationData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-[#14213D] rounded-xl p-8 max-w-md w-full relative animate-fadeIn border border-gray-700">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-300 transition-colors"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white">
            {isLoginMode ? 'Login to Your Account' : showRegistrationForm ? `Sign up with ${authMethod?.toUpperCase()}` : 'Choose Login Method'}
          </h2>
          {(showRegistrationForm || isLoginMode) && (
            <p className="text-gray-300 mt-2">Enter your details below</p>
          )}
        </div>

        {!authMethod && !showRegistrationForm && !isLoginMode && (
          <div className="space-y-4">
            <button
              onClick={() => setAuthMethod('phone')}
              className="w-full p-4 border-2 border-gray-700 rounded-lg flex items-center justify-center space-x-3 hover:bg-[#FCA311]/10 transition-colors text-white"
            >
              <Phone className="h-6 w-6 text-[#FCA311]" />
              <span className="text-lg font-medium">Continue with Phone</span>
            </button>

            <button
              onClick={() => handlePlatformAuth('uber')}
              className="w-full p-4 bg-[#FCA311] text-[#14213D] rounded-lg flex items-center justify-center space-x-3 hover:bg-[#FCA311]/90 transition-colors"
            >
              <Car className="h-6 w-6" />
              <span className="text-lg font-medium">Continue with Uber</span>
            </button>

            <button
              onClick={() => handlePlatformAuth('ola')}
              className="w-full p-4 bg-transparent border-2 border-[#FCA311] text-[#FCA311] rounded-lg flex items-center justify-center space-x-3 hover:bg-[#FCA311]/10 transition-colors"
            >
              <Car className="h-6 w-6" />
              <span className="text-lg font-medium">Continue with Ola</span>
            </button>

            <div className="text-center pt-4">
              <button
                onClick={() => setIsLoginMode(true)}
                className="text-sm text-[#FCA311] hover:underline"
              >
                Already have an account? Login
              </button>
            </div>
          </div>
        )}

        {(showRegistrationForm || isLoginMode) && (
          <form onSubmit={handleAuthSubmit} className="space-y-6">
            {!isLoginMode && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">First Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      required
                      className="pl-10 w-full rounded-lg bg-[#14213D] border border-gray-700 p-2.5 text-white focus:border-[#FCA311] focus:ring-2 focus:ring-[#FCA311]/20"
                      value={registrationData.firstName}
                      onChange={(e) => setRegistrationData({ ...registrationData, firstName: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Last Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      required
                      className="pl-10 w-full rounded-lg bg-[#14213D] border border-gray-700 p-2.5 text-white focus:border-[#FCA311] focus:ring-2 focus:ring-[#FCA311]/20"
                      value={registrationData.lastName}
                      onChange={(e) => setRegistrationData({ ...registrationData, lastName: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="email"
                  required
                  className="pl-10 w-full rounded-lg bg-[#14213D] border border-gray-700 p-2.5 text-white focus:border-[#FCA311] focus:ring-2 focus:ring-[#FCA311]/20"
                  value={registrationData.email}
                  onChange={(e) => setRegistrationData({ ...registrationData, email: e.target.value })}
                />
              </div>
            </div>

            {!isLoginMode && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="tel"
                    required
                    pattern="[0-9]{10}"
                    placeholder="10-digit mobile number"
                    className="pl-10 w-full rounded-lg bg-[#14213D] border border-gray-700 p-2.5 text-white focus:border-[#FCA311] focus:ring-2 focus:ring-[#FCA311]/20"
                    value={registrationData.phone}
                    onChange={(e) => setRegistrationData({ ...registrationData, phone: e.target.value })}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="password"
                  required
                  minLength={8}
                  placeholder="Minimum 8 characters"
                  className="pl-10 w-full rounded-lg bg-[#14213D] border border-gray-700 p-2.5 text-white focus:border-[#FCA311] focus:ring-2 focus:ring-[#FCA311]/20"
                  value={registrationData.password}
                  onChange={(e) => setRegistrationData({ ...registrationData, password: e.target.value })}
                />
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                type="button"
                onClick={resetForm}
                className="w-full py-2.5 px-4 border-2 border-gray-700 rounded-lg text-gray-300 hover:bg-[#FCA311]/10 transition-colors focus:ring-2 focus:ring-[#FCA311]/20"
              >
                Back
              </button>
              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-[#FCA311] text-[#14213D] rounded-lg hover:bg-[#FCA311]/90 transition-colors focus:ring-2 focus:ring-[#FCA311]/20"
              >
                {isLoginMode ? 'Login' : 'Sign Up'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

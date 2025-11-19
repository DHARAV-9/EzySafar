import React, { useState } from 'react';
import { Phone, User, Mail, Lock, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

interface LoginFormProps {
  platform: 'uber' | 'ola' | null;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

export default function LoginForm({ platform, onClose, onSubmit }: LoginFormProps) {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/users/register`, formData, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });

      localStorage.setItem('userId', response.data.userId);
      toast.success('Registration successful');
      onSubmit(formData);
      onClose(); // Optionally close the modal on success
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-8 max-w-md w-full relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            Sign up with {platform}
          </h2>
          <p className="text-gray-600 mt-2">
            Enter your details to create an account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  required
                  name="firstName"
                  className="pl-10 w-full rounded-lg border border-gray-300 p-2.5 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  required
                  name="lastName"
                  className="pl-10 w-full rounded-lg border border-gray-300 p-2.5 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="email"
                required
                name="email"
                className="pl-10 w-full rounded-lg border border-gray-300 p-2.5 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="tel"
                required
                name="phone"
                pattern="[0-9]{10}"
                className="pl-10 w-full rounded-lg border border-gray-300 p-2.5 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="password"
                required
                name="password"
                minLength={8}
                className="pl-10 w-full rounded-lg border border-gray-300 p-2.5 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 px-4 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors focus:ring-2 focus:ring-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:ring-2 focus:ring-blue-200"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { useAuth } from './AuthContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function TopNavigation() {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-xl border-b border-gray-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href={isAuthenticated ? "/dashboard" : "/"} className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <span className="text-2xl">🎪</span>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-pink-400 to-red-400 rounded-full animate-pulse"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent group-hover:from-purple-600 group-hover:to-pink-600 transition-all duration-300">
                  Festify
                </span>
                <span className="text-xs text-gray-500 font-medium">Event Management</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Items */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-2">
              <Link 
                href="/" 
                className="relative text-gray-700 hover:text-indigo-600 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 hover:bg-indigo-50 group"
              >
                <span className="relative z-10">Home</span>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              </Link>
              <Link 
                href="/events" 
                className="relative text-gray-700 hover:text-indigo-600 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 hover:bg-indigo-50 group"
              >
                <span className="relative z-10">Events</span>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              </Link>
              <Link 
                href="/about" 
                className="relative text-gray-700 hover:text-indigo-600 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 hover:bg-indigo-50 group"
              >
                <span className="relative z-10">About</span>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              </Link>
              <Link 
                href="/contact" 
                className="relative text-gray-700 hover:text-indigo-600 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 hover:bg-indigo-50 group"
              >
                <span className="relative z-10">Contact</span>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              </Link>
            </div>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="hidden sm:flex items-center space-x-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl px-4 py-2 border border-indigo-100">
                  <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center shadow-md">
                    <span className="text-sm font-bold text-white">
                      {user?.name?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-800 text-sm font-semibold">
                      {user?.name}
                    </span>
                    <span className="text-gray-500 text-xs">
                      {user?.roles?.[0] || 'User'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105 transform"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-indigo-600 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 hover:bg-indigo-50"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105 transform shadow-md"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 p-2 rounded-xl transition-all duration-300"
              aria-label="Toggle mobile menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden transition-all duration-300 ease-in-out ${
        isMobileMenuOpen 
          ? 'max-h-96 opacity-100' 
          : 'max-h-0 opacity-0 overflow-hidden'
      }`}>
        <div className="px-4 pt-2 pb-3 space-y-1 bg-gradient-to-r from-indigo-50 to-purple-50 backdrop-blur-sm border-t border-indigo-100">
          <Link 
            href="/" 
            className="text-gray-700 hover:text-indigo-600 hover:bg-indigo-100 block px-4 py-3 rounded-xl text-base font-semibold transition-all duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link 
            href="/events" 
            className="text-gray-700 hover:text-indigo-600 hover:bg-indigo-100 block px-4 py-3 rounded-xl text-base font-semibold transition-all duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Events
          </Link>
          <Link 
            href="/about" 
            className="text-gray-700 hover:text-indigo-600 hover:bg-indigo-100 block px-4 py-3 rounded-xl text-base font-semibold transition-all duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            About
          </Link>
          <Link 
            href="/contact" 
            className="text-gray-700 hover:text-indigo-600 hover:bg-indigo-100 block px-4 py-3 rounded-xl text-base font-semibold transition-all duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Contact
          </Link>
          
          {/* Mobile auth section */}
          {!isAuthenticated && (
            <div className="pt-4 border-t border-indigo-200 space-y-2">
              <Link
                href="/login"
                className="text-gray-700 hover:text-indigo-600 hover:bg-indigo-100 block px-4 py-3 rounded-xl text-base font-semibold transition-all duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 block px-4 py-3 rounded-xl text-base font-semibold transition-all duration-300 text-center shadow-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

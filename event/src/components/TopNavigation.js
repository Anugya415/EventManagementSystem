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
    <nav className="bg-gradient-to-r from-blue-600 to-purple-700 shadow-lg border-b border-blue-500/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href={isAuthenticated ? "/dashboard" : "/"} className="flex items-center space-x-3 group">
              <div className="text-3xl transform group-hover:scale-110 transition-transform duration-200">🎪</div>
              <span className="text-2xl font-bold text-white group-hover:text-blue-200 transition-colors duration-200">
                Festify
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Items */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-1">
              <Link 
                href="/" 
                className="text-white/90 hover:text-white hover:bg-white/10 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-md"
              >
                Home
              </Link>
              <Link 
                href="/events" 
                className="text-white/90 hover:text-white hover:bg-white/10 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-md"
              >
                Events
              </Link>
              <Link 
                href="/about" 
                className="text-white/90 hover:text-white hover:bg-white/10 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-md"
              >
                About
              </Link>
              <Link 
                href="/contact" 
                className="text-white/90 hover:text-white hover:bg-white/10 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-md"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <div className="hidden sm:flex items-center space-x-2 bg-white/10 rounded-full px-3 py-1">
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-white">
                      {user?.name?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-white/90 text-sm font-medium">
                    {user?.name}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-md backdrop-blur-sm"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="text-white/90 hover:text-white hover:bg-white/10 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-md"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-md hover:scale-105 transform"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden text-white hover:bg-white/10 p-2 rounded-lg transition-colors duration-200"
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
        <div className="px-4 pt-2 pb-3 space-y-1 bg-white/10 backdrop-blur-sm border-t border-white/20">
          <Link 
            href="/" 
            className="text-white/90 hover:text-white hover:bg-white/10 block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link 
            href="/events" 
            className="text-white/90 hover:text-white hover:bg-white/10 block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Events
          </Link>
          <Link 
            href="/about" 
            className="text-white/90 hover:text-white hover:bg-white/10 block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            About
          </Link>
          <Link 
            href="/contact" 
            className="text-white/90 hover:text-white hover:bg-white/10 block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Contact
          </Link>
          
          {/* Mobile auth section */}
          {!isAuthenticated && (
            <div className="pt-4 border-t border-white/20 space-y-2">
              <Link
                href="/login"
                className="text-white/90 hover:text-white hover:bg-white/10 block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-white text-blue-600 hover:bg-blue-50 block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 text-center"
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

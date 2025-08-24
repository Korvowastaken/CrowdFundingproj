import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = ({ isAuthenticated, onLogout }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Registration', icon: '📝' },
    { path: '/home', label: 'Home', icon: '🏠' },
    { path: '/admin', label: 'Admin Dashboard', icon: '⚙️' }
  ];

  return (
    <nav className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center mr-3 shadow-lg">
                <span className="text-blue-600 font-bold text-lg">CF</span>
              </div>
              <h1 className="text-xl font-bold text-white">CrowdFunding Pro</h1>
            </div>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    location.pathname === item.path
                      ? 'bg-white bg-opacity-20 text-white shadow-lg'
                      : 'text-white hover:bg-white hover:bg-opacity-10 hover:text-white'
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {isAuthenticated && (
              <div className="flex items-center space-x-3">
                <div className="flex items-center bg-white bg-opacity-20 rounded-full px-3 py-1">
                  <svg className="h-4 w-4 text-white mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="text-white text-sm font-medium">Admin Mode</span>
                </div>
                <button
                  onClick={onLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile navigation */}
      <div className="sm:hidden">
        <div className="pt-2 pb-3 space-y-1 px-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                location.pathname === item.path
                  ? 'bg-white bg-opacity-20 text-white'
                  : 'text-white hover:bg-white hover:bg-opacity-10'
              }`}
            >
              <span className="mr-2">{item.icon}</span>
              {item.label}
            </Link>
          ))}
          {isAuthenticated && (
            <div className="pt-2 border-t border-white border-opacity-20">
              <div className="px-3 py-2 text-white text-sm opacity-75">
                Admin Mode Active
              </div>
              <button
                onClick={onLogout}
                className="w-full text-left px-3 py-2 text-red-200 hover:bg-red-500 hover:text-white rounded-md transition-all duration-200"
              >
                <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

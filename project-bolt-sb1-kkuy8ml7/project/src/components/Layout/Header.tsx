import React from 'react';
import { LogOut, Eye, FileText, Globe } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';

interface HeaderProps {
  currentView: 'dashboard' | 'layout';
  onViewChange: (view: 'dashboard' | 'layout') => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, onViewChange }) => {
  const { logout, phoneNumber } = useAuth();
  const { t, language, toggleLanguage } = useLanguage();

  return (
    <header className="bg-gray-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="flex items-center">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-red-600 rounded-full flex items-center justify-center mr-2 sm:mr-3">
                <FileText className="w-3 h-3 sm:w-5 sm:h-5" />
              </div>
              <h1 className="text-sm sm:text-xl font-bold hidden sm:block">
                {t('dashboard.title')}
              </h1>
              <h1 className="text-xs font-bold sm:hidden">
                Tent System
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-1 sm:space-x-3">
            {/* View Toggle */}
            <div className="flex bg-gray-800 rounded-lg p-0.5">
              <button
                onClick={() => onViewChange('dashboard')}
                className={`px-2 py-1.5 sm:px-3 sm:py-2 rounded-md text-xs font-medium transition-colors duration-200 ${
                  currentView === 'dashboard'
                    ? 'bg-red-600 text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <FileText className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                <span className="hidden sm:inline">Receipt</span>
                <span className="sm:hidden">Form</span>
              </button>
              <button
                onClick={() => onViewChange('layout')}
                className={`px-2 py-1.5 sm:px-3 sm:py-2 rounded-md text-xs font-medium transition-colors duration-200 ${
                  currentView === 'layout'
                    ? 'bg-red-600 text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <Eye className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                <span className="hidden sm:inline">Layout</span>
                <span className="sm:hidden">View</span>
              </button>
            </div>

            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 bg-gray-800 hover:bg-gray-700 text-white px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg transition-colors duration-200"
            >
              <Globe className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="text-xs font-medium">
                {language === 'en' ? 'AR' : 'EN'}
              </span>
            </button>

            {/* Phone Number - Hidden on small screens */}
            <div className="text-xs text-gray-300 hidden lg:block">
              {phoneNumber}
            </div>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="flex items-center space-x-1 bg-red-600 hover:bg-red-700 px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg transition-colors duration-200"
            >
              <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="text-xs font-medium hidden sm:inline">Out</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
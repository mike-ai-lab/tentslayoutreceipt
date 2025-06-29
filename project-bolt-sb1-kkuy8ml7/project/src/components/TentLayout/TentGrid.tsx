import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { useLanguage } from '../../contexts/LanguageContext';
import TentModal from './TentModal';
import QuickBookingModal from './QuickBookingModal';
import { Tent } from '../../types';

const TentGrid: React.FC = () => {
  const { tents } = useData();
  const { t } = useLanguage();
  const [selectedTent, setSelectedTent] = useState<Tent | null>(null);
  const [bookingTent, setBookingTent] = useState<Tent | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-500 hover:bg-green-600';
      case 'booked':
        return 'bg-red-500 hover:bg-red-600';
      case 'reserved':
        return 'bg-yellow-500 hover:bg-yellow-600';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available':
        return t('layout.available');
      case 'booked':
        return t('layout.booked');
      case 'reserved':
        return t('layout.reserved');
      default:
        return status;
    }
  };

  const handleTentClick = (tent: Tent) => {
    if (tent.status === 'available') {
      setBookingTent(tent);
    } else {
      setSelectedTent(tent);
    }
  };

  // Group tents by position
  const topTents = tents.filter(tent => tent.code.startsWith('T')).sort((a, b) => 
    parseInt(a.code.slice(1)) - parseInt(b.code.slice(1))
  );
  const bottomTents = tents.filter(tent => tent.code.startsWith('B')).sort((a, b) => 
    parseInt(a.code.slice(1)) - parseInt(b.code.slice(1))
  );
  const leftTents = tents.filter(tent => tent.code.startsWith('L')).sort((a, b) => 
    parseInt(a.code.slice(1)) - parseInt(b.code.slice(1))
  );
  const rightTents = tents.filter(tent => tent.code.startsWith('R')).sort((a, b) => 
    parseInt(a.code.slice(1)) - parseInt(b.code.slice(1))
  );

  const TentButton: React.FC<{ tent: Tent }> = ({ tent }) => (
    <button
      onClick={() => handleTentClick(tent)}
      className={`
        ${getStatusColor(tent.status)}
        text-white font-bold text-xs sm:text-sm p-2 sm:p-3 rounded-lg
        transition-all duration-200 transform hover:scale-105
        shadow-lg hover:shadow-xl
        min-w-[40px] min-h-[40px] sm:min-w-[50px] sm:min-h-[50px]
        flex items-center justify-center
        ${tent.status === 'available' ? 'cursor-pointer hover:ring-2 hover:ring-green-300' : ''}
      `}
      title={`${tent.code} - ${getStatusText(tent.status)}${tent.clientName ? ` - ${tent.clientName}` : ''}${tent.status === 'available' ? ' - Click to book' : ''}`}
    >
      {tent.code}
    </button>
  );

  return (
    <div className="p-4">
      {/* Legend */}
      <div className="mb-6 bg-white rounded-lg shadow-lg p-4">
        <h3 className="text-lg font-semibold mb-3">{t('layout.tentStatus')}</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span>{t('layout.available')} - Click to book</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span>{t('layout.booked')}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span>{t('layout.reserved')}</span>
          </div>
        </div>
      </div>

      {/* Tent Layout */}
      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
        <div className="grid grid-cols-1 gap-6">
          {/* Top Row */}
          <div className="flex justify-center">
            <div className="grid grid-cols-9 gap-2 sm:gap-3">
              {topTents.map(tent => (
                <TentButton key={tent.code} tent={tent} />
              ))}
            </div>
          </div>

          {/* Middle Section with Left, Center (Track), Right */}
          <div className="grid grid-cols-3 gap-4 items-center">
            {/* Left Column */}
            <div className="grid grid-cols-1 gap-2 sm:gap-3">
              {leftTents.map(tent => (
                <TentButton key={tent.code} tent={tent} />
              ))}
            </div>

            {/* Center (Race Track) */}
            <div className="bg-gray-200 rounded-lg p-8 flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">🏁</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800">
                  KARTING TRACK
                </h3>
                <p className="text-gray-600 mt-2">
                  TRIPOLI RACE 2025
                </p>
              </div>
            </div>

            {/* Right Column */}
            <div className="grid grid-cols-1 gap-2 sm:gap-3">
              {rightTents.map(tent => (
                <TentButton key={tent.code} tent={tent} />
              ))}
            </div>
          </div>

          {/* Bottom Row */}
          <div className="flex justify-center">
            <div className="grid grid-cols-9 gap-2 sm:gap-3">
              {bottomTents.map(tent => (
                <TentButton key={tent.code} tent={tent} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tent Details Modal */}
      {selectedTent && (
        <TentModal
          tent={selectedTent}
          onClose={() => setSelectedTent(null)}
        />
      )}

      {/* Quick Booking Modal */}
      {bookingTent && (
        <QuickBookingModal
          tent={bookingTent}
          onClose={() => setBookingTent(null)}
          onSuccess={() => {
            setBookingTent(null);
          }}
        />
      )}
    </div>
  );
};

export default TentGrid;
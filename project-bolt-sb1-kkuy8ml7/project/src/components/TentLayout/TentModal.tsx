import React from 'react';
import { X, User, Phone, Calendar, DollarSign, MapPin } from 'lucide-react';
import { Tent } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';

interface TentModalProps {
  tent: Tent;
  onClose: () => void;
}

const TentModal: React.FC<TentModalProps> = ({ tent, onClose }) => {
  const { t } = useLanguage();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'text-green-600 bg-green-100';
      case 'booked':
        return 'text-red-600 bg-red-100';
      case 'reserved':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-2 sm:mx-4 max-h-[95vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b sticky top-0 bg-white rounded-t-lg">
          <h3 className="text-base sm:text-lg font-semibold">
            {t('layout.tentDetails')} - {tent.code}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">
              {t('layout.status')}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(tent.status)}`}>
              {getStatusText(tent.status)}
            </span>
          </div>

          {tent.status !== 'available' && (
            <>
              {tent.clientName && (
                <div className="flex items-start space-x-3">
                  <User className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-gray-500">
                      {t('layout.clientName')}
                    </div>
                    <div className="text-sm text-gray-900 break-words">{tent.clientName}</div>
                  </div>
                </div>
              )}

              {tent.phone && (
                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-gray-500">
                      {t('layout.phone')}
                    </div>
                    <div className="text-sm text-gray-900 break-words">{tent.phone}</div>
                  </div>
                </div>
              )}

              {tent.bookingDate && (
                <div className="flex items-start space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-gray-500">
                      {t('layout.bookingTime')}
                    </div>
                    <div className="text-sm text-gray-900">{tent.bookingDate}</div>
                  </div>
                </div>
              )}

              {tent.price && (
                <div className="flex items-start space-x-3">
                  <DollarSign className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-gray-500">
                      {t('form.price')}
                    </div>
                    <div className="text-sm text-gray-900">${tent.price}</div>
                  </div>
                </div>
              )}

              {tent.usage && (
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-gray-500">
                      {t('form.usage')}
                    </div>
                    <div className="text-sm text-gray-900 break-words">{tent.usage}</div>
                  </div>
                </div>
              )}

              {tent.services && (Object.values(tent.services).some(Boolean)) && (
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-2">
                    {t('form.additionalServices')}
                  </div>
                  <div className="space-y-1">
                    {tent.services.electricity && (
                      <div className="text-sm text-gray-900">• {t('form.electricity')}</div>
                    )}
                    {tent.services.chairs && (
                      <div className="text-sm text-gray-900">• {t('form.chairs')}</div>
                    )}
                    {tent.services.table && (
                      <div className="text-sm text-gray-900">• {t('form.table')}</div>
                    )}
                  </div>
                </div>
              )}

              {tent.zones && tent.zones.length > 0 && (
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">
                    {t('form.advertisingZones')}
                  </div>
                  <div className="text-sm text-gray-900">
                    Zones: {tent.zones.join(', ')}
                  </div>
                </div>
              )}

              {(tent.qtyCarFlags || tent.qtyBannerFlags) && (
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-2">
                    Flags
                  </div>
                  <div className="space-y-1">
                    {tent.qtyCarFlags && (
                      <div className="text-sm text-gray-900">• {t('form.carFlags')}: {tent.qtyCarFlags}</div>
                    )}
                    {tent.qtyBannerFlags && (
                      <div className="text-sm text-gray-900">• {t('form.bannerFlags')}: {tent.qtyBannerFlags}</div>
                    )}
                  </div>
                </div>
              )}

              {tent.notes && (
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">
                    {t('form.notes')}
                  </div>
                  <div className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg break-words">
                    {tent.notes}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="px-4 sm:px-6 py-4 bg-gray-50 rounded-b-lg sticky bottom-0">
          <button
            onClick={onClose}
            className="w-full bg-gray-800 hover:bg-gray-900 text-white font-medium py-2 sm:py-3 rounded-lg transition-colors duration-200 text-sm sm:text-base"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TentModal;
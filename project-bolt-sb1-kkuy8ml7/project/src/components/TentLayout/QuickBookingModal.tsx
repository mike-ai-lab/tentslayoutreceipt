import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, Download, AlertCircle, CheckCircle } from 'lucide-react';
import { Tent, Receipt } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { generateReceipt } from '../../utils/receiptGenerator';

interface QuickBookingModalProps {
  tent: Tent;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormData {
  clientName: string;
  phone: string;
  bookingDate: string;
  price: number;
  usage: string;
  electricity: boolean;
  chairs: boolean;
  table: boolean;
  zoneA: boolean;
  zoneB: boolean;
  zoneC: boolean;
  zoneD: boolean;
  zoneE: boolean;
  zoneF: boolean;
  carFlags: number;
  bannerFlags: number;
  notes: string;
}

const QuickBookingModal: React.FC<QuickBookingModalProps> = ({ tent, onClose, onSuccess }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const { t } = useLanguage();
  const { updateTent, addReceipt } = useData();
  const { phoneNumber } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const onSubmit = async (data: FormData) => {
    setIsGenerating(true);
    setMessage(null);

    try {
      // Prepare receipt data
      const receiptId = `R${Date.now()}`;
      const zones = [];
      if (data.zoneA) zones.push('A');
      if (data.zoneB) zones.push('B');
      if (data.zoneC) zones.push('C');
      if (data.zoneD) zones.push('D');
      if (data.zoneE) zones.push('E');
      if (data.zoneF) zones.push('F');

      const receiptData: Receipt = {
        id: receiptId,
        tentCode: tent.code,
        clientName: data.clientName,
        phone: data.phone,
        date: data.bookingDate,
        price: data.price,
        usage: data.usage,
        services: {
          electricity: data.electricity,
          chairs: data.chairs,
          table: data.table,
        },
        zones,
        qtyCarFlags: data.carFlags || 0,
        qtyBannerFlags: data.bannerFlags || 0,
        notes: data.notes || '',
        generatedBy: phoneNumber || '',
      };

      // Update tent status
      updateTent(tent.code, {
        status: 'booked',
        clientName: data.clientName,
        phone: data.phone,
        bookingDate: data.bookingDate,
        price: data.price,
        usage: data.usage,
        services: {
          electricity: data.electricity,
          chairs: data.chairs,
          table: data.table,
        },
        zones,
        qtyCarFlags: data.carFlags || 0,
        qtyBannerFlags: data.bannerFlags || 0,
        notes: data.notes || '',
        receiptId,
      });

      // Add receipt to records
      addReceipt(receiptData);

      // Generate PDF receipt
      await generateReceipt(receiptData);

      setMessage({ type: 'success', text: t('form.receiptGenerated') });
      
      // Close modal after success
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (error) {
      console.error('Error generating receipt:', error);
      setMessage({ type: 'error', text: 'Failed to generate receipt' });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-2 sm:mx-4 max-h-[95vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b bg-gray-900 text-white rounded-t-lg sticky top-0">
          <h3 className="text-base sm:text-lg font-semibold">
            {t('form.title')} - {tent.code}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-white transition-colors p-1 hover:bg-gray-800 rounded-full"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Message */}
          {message && (
            <div className={`p-3 sm:p-4 rounded-lg flex items-center space-x-2 ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message.type === 'success' ? (
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
              )}
              <span className="text-sm sm:text-base">{message.text}</span>
            </div>
          )}

          {/* Basic Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('form.clientName')} *
              </label>
              <input
                type="text"
                {...register('clientName', { required: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm sm:text-base"
              />
              {errors.clientName && (
                <p className="mt-1 text-sm text-red-600">This field is required</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('form.phone')} *
              </label>
              <input
                type="tel"
                {...register('phone', { required: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm sm:text-base"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">This field is required</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('form.bookingDate')} *
              </label>
              <input
                type="date"
                {...register('bookingDate', { required: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm sm:text-base"
              />
              {errors.bookingDate && (
                <p className="mt-1 text-sm text-red-600">This field is required</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('form.price')} *
              </label>
              <input
                type="number"
                step="0.01"
                {...register('price', { required: true, min: 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm sm:text-base"
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-600">This field is required</p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('form.usage')} *
              </label>
              <input
                type="text"
                {...register('usage', { required: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm sm:text-base"
              />
              {errors.usage && (
                <p className="mt-1 text-sm text-red-600">This field is required</p>
              )}
            </div>
          </div>

          {/* Additional Services */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
              {t('form.additionalServices')}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...register('electricity')}
                  className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <span className="text-sm sm:text-base">{t('form.electricity')}</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...register('chairs')}
                  className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <span className="text-sm sm:text-base">{t('form.chairs')}</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...register('table')}
                  className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <span className="text-sm sm:text-base">{t('form.table')}</span>
              </label>
            </div>
          </div>

          {/* Advertising Zones */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
              {t('form.advertisingZones')}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              {['A', 'B', 'C', 'D', 'E', 'F'].map(zone => (
                <label key={zone} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    {...register(`zone${zone}` as keyof FormData)}
                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <span className="text-sm sm:text-base">Zone {zone}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Quantity Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('form.carFlags')}
              </label>
              <input
                type="number"
                min="0"
                {...register('carFlags')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm sm:text-base"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('form.bannerFlags')}
              </label>
              <input
                type="number"
                min="0"
                {...register('bannerFlags')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm sm:text-base"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('form.notes')}
            </label>
            <textarea
              {...register('notes')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm sm:text-base resize-none"
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-4 border-t sticky bottom-0 bg-white">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 text-sm sm:text-base"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isGenerating}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-medium px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-colors duration-200 text-sm sm:text-base"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white"></div>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>{t('form.generateReceipt')}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuickBookingModal;
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FileText, Download, AlertCircle, CheckCircle } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { generateReceipt } from '../../utils/receiptGenerator';
import { Receipt } from '../../types';

interface FormData {
  tentNumber: string;
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

const ReceiptForm: React.FC = () => {
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<FormData>();
  const { tents, updateTent, addReceipt, getTent } = useData();
  const { t } = useLanguage();
  const { phoneNumber } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const selectedTent = watch('tentNumber');
  const tent = selectedTent ? getTent(selectedTent) : null;

  const availableTents = tents.filter(tent => tent.status === 'available');

  const onSubmit = async (data: FormData) => {
    if (tent && tent.status !== 'available') {
      setMessage({ type: 'error', text: t('form.tentAlreadyBooked') });
      return;
    }

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
        tentCode: data.tentNumber,
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
      updateTent(data.tentNumber, {
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
      reset();
    } catch (error) {
      console.error('Error generating receipt:', error);
      setMessage({ type: 'error', text: 'Failed to generate receipt' });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="bg-gray-900 text-white p-6 rounded-t-lg">
          <div className="flex items-center space-x-3">
            <FileText className="w-6 h-6" />
            <h2 className="text-xl font-bold">{t('form.title')}</h2>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Message */}
          {message && (
            <div className={`p-4 rounded-lg flex items-center space-x-2 ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message.type === 'success' ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('form.tentNumber')} *
              </label>
              <select
                {...register('tentNumber', { required: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">{t('form.tentNumber')}</option>
                {availableTents.map(tent => (
                  <option key={tent.code} value={tent.code}>
                    {tent.code}
                  </option>
                ))}
              </select>
              {errors.tentNumber && (
                <p className="mt-1 text-sm text-red-600">This field is required</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('form.clientName')} *
              </label>
              <input
                type="text"
                {...register('clientName', { required: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-600">This field is required</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('form.usage')} *
              </label>
              <input
                type="text"
                {...register('usage', { required: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              {errors.usage && (
                <p className="mt-1 text-sm text-red-600">This field is required</p>
              )}
            </div>
          </div>

          {/* Additional Services */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {t('form.additionalServices')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...register('electricity')}
                  className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <span>{t('form.electricity')}</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...register('chairs')}
                  className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <span>{t('form.chairs')}</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...register('table')}
                  className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <span>{t('form.table')}</span>
              </label>
            </div>
          </div>

          {/* Advertising Zones */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {t('form.advertisingZones')}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              {['A', 'B', 'C', 'D', 'E', 'F'].map(zone => (
                <label key={zone} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    {...register(`zone${zone}` as keyof FormData)}
                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <span>Zone {zone}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Quantity Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('form.carFlags')}
              </label>
              <input
                type="number"
                min="0"
                {...register('carFlags')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isGenerating || !selectedTent}
              className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-medium px-6 py-3 rounded-lg transition-colors duration-200"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
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

export default ReceiptForm;
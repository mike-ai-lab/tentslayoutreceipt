import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Auth
    'auth.title': 'Tripoli Karting Race 2025',
    'auth.subtitle': 'Tent Reservation System',
    'auth.phoneLabel': 'Phone Number',
    'auth.phonePlaceholder': 'Enter your phone number',
    'auth.sendOtp': 'Send OTP',
    'auth.otpLabel': 'Enter OTP Code',
    'auth.otpPlaceholder': '6-digit code',
    'auth.verify': 'Verify & Login',
    'auth.otpSent': 'OTP sent to your phone',
    'auth.otpExpired': 'OTP expired, please request a new one',
    'auth.invalidOtp': 'Invalid OTP code',
    
    // Dashboard
    'dashboard.title': 'Tent Management Dashboard',
    'dashboard.viewLayout': 'View Tent Layout',
    'dashboard.receiptForm': 'Receipt Generator',
    'dashboard.logout': 'Logout',
    
    // Tent Layout
    'layout.title': 'Tent Layout - Tripoli Karting Race 2025',
    'layout.backToDashboard': 'Back to Dashboard',
    'layout.tentStatus': 'Tent Status',
    'layout.available': 'Available',
    'layout.booked': 'Booked',
    'layout.reserved': 'Reserved',
    'layout.tentDetails': 'Tent Details',
    'layout.clientName': 'Client Name',
    'layout.phone': 'Phone Number',
    'layout.bookingTime': 'Booking Time',
    'layout.status': 'Status',
    
    // Receipt Form
    'form.title': 'Generate Receipt',
    'form.tentNumber': 'Tent Number',
    'form.clientName': 'Client Full Name',
    'form.phone': 'Phone Number',
    'form.bookingDate': 'Booking Date',
    'form.price': 'Price',
    'form.usage': 'Usage Purpose',
    'form.additionalServices': 'Additional Services',
    'form.electricity': 'Electricity',
    'form.chairs': 'Chairs',
    'form.table': 'Table',
    'form.advertisingZones': 'Advertising Zone Selection',
    'form.carFlags': 'Car Flags',
    'form.bannerFlags': 'Banner Flags',
    'form.notes': 'Notes',
    'form.generateReceipt': 'Generate Receipt',
    'form.tentAlreadyBooked': 'This tent is already booked',
    'form.receiptGenerated': 'Receipt generated successfully',
    
    // Receipt
    'receipt.title': 'RECEIPT',
    'receipt.event': 'TRIPOLI KARTING RACE 2025 - SEASON 1',
    'receipt.date': 'DATE',
    'receipt.receivedFrom': 'RECEIVED FROM',
    'receipt.amount': 'AMOUNT',
    'receipt.forSubscription': 'FOR SUBSCRIPTION IN TRIPOLI KARTING RACE',
    'receipt.tentNo': 'TENT NO.',
    'receipt.usagePurpose': 'USAGE PURPOSE',
    'receipt.additionalServices': 'ADDITIONAL SERVICES',
    'receipt.electricity': 'ELECTRICITY',
    'receipt.chairs': 'CHAIRS',
    'receipt.table': 'TABLE',
    'receipt.description': 'DESCRIPTION',
    'receipt.advertisements': 'ADVERTISEMENTS ON TRACK',
    'receipt.totalQty': 'TOTAL QTY',
    'receipt.carFlags': 'CAR FLAGS',
    'receipt.bannerFlags': 'BANNER FLAGS',
    'receipt.notes': 'NOTES',
    'receipt.notTaxInvoice': 'THIS RECEIPT IS NOT A TAX INVOICE',
    'receipt.receiversSignature': "RECEIVER'S SIGNATURE",
    'receipt.signature': 'SIGNATURE',
  },
  ar: {
    // Auth (Arabic)
    'auth.title': 'مهرجان طرابلس للكارتينج ٢٠٢٥',
    'auth.subtitle': 'نظام حجز الخيام',
    'auth.phoneLabel': 'رقم الهاتف',
    'auth.phonePlaceholder': 'أدخل رقم الهاتف',
    'auth.sendOtp': 'إرسال الرمز',
    'auth.otpLabel': 'أدخل رمز التحقق',
    'auth.otpPlaceholder': 'رمز من ٦ أرقام',
    'auth.verify': 'تحقق و دخول',
    'auth.otpSent': 'تم إرسال الرمز إلى هاتفك',
    'auth.otpExpired': 'انتهت صلاحية الرمز، يرجى طلب رمز جديد',
    'auth.invalidOtp': 'رمز التحقق غير صحيح',
    
    // Dashboard (Arabic)
    'dashboard.title': 'لوحة تحكم الخيام',
    'dashboard.viewLayout': 'عرض الخيام',
    'dashboard.receiptForm': 'إنشاء وصل',
    'dashboard.logout': 'تسجيل خروج',
    
    // Tent Layout (Arabic)
    'layout.title': 'مخطط الخيام - مهرجان طرابلس للكارتينج ٢٠٢٥',
    'layout.backToDashboard': 'العودة للوحة التحكم',
    'layout.tentStatus': 'حالة الخيمة',
    'layout.available': 'متاحة',
    'layout.booked': 'محجوزة',
    'layout.reserved': 'مُحتَجزة',
    'layout.tentDetails': 'تفاصيل الخيمة',
    'layout.clientName': 'اسم العميل',
    'layout.phone': 'رقم الهاتف',
    'layout.bookingTime': 'وقت الحجز',
    'layout.status': 'الحالة',
    
    // Receipt Form (Arabic)
    'form.title': 'إنشاء وصل استلام',
    'form.tentNumber': 'رقم الخيمة',
    'form.clientName': 'الاسم الكامل',
    'form.phone': 'رقم الهاتف',
    'form.bookingDate': 'تاريخ الحجز',
    'form.price': 'المبلغ',
    'form.usage': 'جهة الاستعمال',
    'form.additionalServices': 'خدمات إضافية',
    'form.electricity': 'كهرباء',
    'form.chairs': 'كراسي',
    'form.table': 'طاولة',
    'form.advertisingZones': 'اختيار منطقة الإعلان',
    'form.carFlags': 'أعلام على السيارات',
    'form.bannerFlags': 'أعلام على الأرصفة',
    'form.notes': 'ملاحظات',
    'form.generateReceipt': 'إنشاء الوصل',
    'form.tentAlreadyBooked': 'هذه الخيمة محجوزة بالفعل',
    'form.receiptGenerated': 'تم إنشاء الوصل بنجاح',
    
    // Receipt (Arabic)
    'receipt.title': 'وصل استلام مبلغ',
    'receipt.event': 'مهرجان طرابلس للكارتينج ٢٠٢٥ - الموسم الأول',
    'receipt.date': 'تاريخ الاستلام',
    'receipt.receivedFrom': 'وصلنا من السادة',
    'receipt.amount': 'مبلغ وقدره',
    'receipt.forSubscription': 'وذلك بدل اشتراك في مهرجان طرابلس للكارتينج',
    'receipt.tentNo': 'الخيمة رقم',
    'receipt.usagePurpose': 'جهة الاستعمال',
    'receipt.additionalServices': 'خدمات أخرى',
    'receipt.electricity': 'توفير كهرباء',
    'receipt.chairs': 'توفير كراسي',
    'receipt.table': 'توفير طاولات',
    'receipt.description': 'الشرح',
    'receipt.advertisements': 'إعلانات على مسار الحلبة',
    'receipt.totalQty': 'العدد الإجمالي',
    'receipt.carFlags': 'أعلام على السيارات',
    'receipt.bannerFlags': 'أعلام على الأرصفة',
    'receipt.notes': 'ملاحظات',
    'receipt.notTaxInvoice': 'هذا الوصل لا يعتبر فاتورة ضريبية',
    'receipt.receiversSignature': 'المستلم',
    'receipt.signature': 'الإمضاء',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ar' : 'en');
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      <div className={language === 'ar' ? 'rtl' : 'ltr'} dir={language === 'ar' ? 'rtl' : 'ltr'}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
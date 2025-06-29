export interface Tent {
  code: string;
  status: 'available' | 'booked' | 'reserved';
  clientName?: string;
  phone?: string;
  bookingDate?: string;
  price?: number;
  usage?: string;
  services?: {
    electricity: boolean;
    chairs: boolean;
    table: boolean;
  };
  zones?: string[];
  qtyCarFlags?: number;
  qtyBannerFlags?: number;
  notes?: string;
  receiptId?: string;
}

export interface Receipt {
  id: string;
  tentCode: string;
  clientName: string;
  phone: string;
  date: string;
  price: number;
  usage: string;
  services: {
    electricity: boolean;
    chairs: boolean;
    table: boolean;
  };
  zones: string[];
  qtyCarFlags: number;
  qtyBannerFlags: number;
  notes: string;
  generatedBy: string;
}

export interface User {
  phoneNumber: string;
  otp?: string;
  otpExpiry?: Date;
  loginTime?: Date;
}

export type Language = 'en' | 'ar';
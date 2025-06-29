import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  phoneNumber: string | null;
  login: (phone: string) => void;
  logout: () => void;
  sendOTP: (phone: string) => Promise<boolean>;
  verifyOTP: (otp: string) => Promise<boolean>;
  otpSent: boolean;
  otpExpiry: Date | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otpExpiry, setOtpExpiry] = useState<Date | null>(null);
  const [currentOTP, setCurrentOTP] = useState<string>('');

  const sendOTP = async (phone: string): Promise<boolean> => {
    try {
      // Simulate OTP generation and SMS sending
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      setCurrentOTP(otp);
      
      // Set expiry to 2 minutes from now
      const expiry = new Date();
      expiry.setMinutes(expiry.getMinutes() + 2);
      setOtpExpiry(expiry);
      
      setPhoneNumber(phone);
      setOtpSent(true);
      
      // In a real app, this would make an API call to send SMS
      console.log(`OTP sent to ${phone}: ${otp}`);
      alert(`Demo OTP: ${otp} (expires in 2 minutes)`);
      
      return true;
    } catch (error) {
      console.error('Failed to send OTP:', error);
      return false;
    }
  };

  const verifyOTP = async (otp: string): Promise<boolean> => {
    try {
      // Check if OTP is expired
      if (otpExpiry && new Date() > otpExpiry) {
        setOtpSent(false);
        setOtpExpiry(null);
        setCurrentOTP('');
        return false;
      }

      // Verify OTP
      if (otp === currentOTP) {
        setIsAuthenticated(true);
        setOtpSent(false);
        setOtpExpiry(null);
        setCurrentOTP('');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Failed to verify OTP:', error);
      return false;
    }
  };

  const login = (phone: string) => {
    setPhoneNumber(phone);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setPhoneNumber(null);
    setOtpSent(false);
    setOtpExpiry(null);
    setCurrentOTP('');
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      phoneNumber,
      login,
      logout,
      sendOTP,
      verifyOTP,
      otpSent,
      otpExpiry
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
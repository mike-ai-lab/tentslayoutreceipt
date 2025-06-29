import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

// This component is now deprecated - language toggle is integrated into the header
// Keeping for backward compatibility but it won't render anything
const LanguageToggle: React.FC = () => {
  return null;
};

export default LanguageToggle;
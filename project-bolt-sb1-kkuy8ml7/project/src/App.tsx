import React, { useEffect, useState } from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider, useData } from './contexts/DataContext';
import LoginForm from './components/Auth/LoginForm';
import Header from './components/Layout/Header';
import ReceiptForm from './components/ReceiptForm/ReceiptForm';
import TentGrid from './components/TentLayout/TentGrid';

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { initializeTents } = useData();
  const [currentView, setCurrentView] = useState<'dashboard' | 'layout'>('dashboard');

  useEffect(() => {
    if (isAuthenticated) {
      initializeTents();
    }
  }, [isAuthenticated, initializeTents]);

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header currentView={currentView} onViewChange={setCurrentView} />
      <main className="py-6">
        {currentView === 'dashboard' ? <ReceiptForm /> : <TentGrid />}
      </main>
    </div>
  );
};

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <DataProvider>
          <AppContent />
        </DataProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
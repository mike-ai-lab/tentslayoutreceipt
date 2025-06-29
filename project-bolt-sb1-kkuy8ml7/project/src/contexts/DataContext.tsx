import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Tent, Receipt } from '../types';

interface DataContextType {
  tents: Tent[];
  receipts: Receipt[];
  updateTent: (tentCode: string, updates: Partial<Tent>) => void;
  addReceipt: (receipt: Receipt) => void;
  getTent: (code: string) => Tent | undefined;
  initializeTents: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Initialize tent layout
const createInitialTents = (): Tent[] => {
  const tents: Tent[] = [];
  
  // Top tents (T1-T9)
  for (let i = 1; i <= 9; i++) {
    tents.push({
      code: `T${i}`,
      status: 'available'
    });
  }
  
  // Bottom tents (B1-B9)
  for (let i = 1; i <= 9; i++) {
    tents.push({
      code: `B${i}`,
      status: 'available'
    });
  }
  
  // Left tents (L1-L19)
  for (let i = 1; i <= 19; i++) {
    tents.push({
      code: `L${i}`,
      status: 'available'
    });
  }
  
  // Right tents (R1-R19)
  for (let i = 1; i <= 19; i++) {
    tents.push({
      code: `R${i}`,
      status: 'available'
    });
  }
  
  return tents;
};

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tents, setTents] = useState<Tent[]>([]);
  const [receipts, setReceipts] = useState<Receipt[]>([]);

  const initializeTents = () => {
    if (tents.length === 0) {
      setTents(createInitialTents());
    }
  };

  const updateTent = (tentCode: string, updates: Partial<Tent>) => {
    setTents(prevTents => 
      prevTents.map(tent => 
        tent.code === tentCode ? { ...tent, ...updates } : tent
      )
    );
  };

  const addReceipt = (receipt: Receipt) => {
    setReceipts(prevReceipts => [...prevReceipts, receipt]);
  };

  const getTent = (code: string): Tent | undefined => {
    return tents.find(tent => tent.code === code);
  };

  return (
    <DataContext.Provider value={{
      tents,
      receipts,
      updateTent,
      addReceipt,
      getTent,
      initializeTents
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
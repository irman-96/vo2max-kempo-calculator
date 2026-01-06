
import React, { createContext, useContext, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface SettingsContextType {
  googleSheetUrl: string;
  setGoogleSheetUrl: (url: string) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [googleSheetUrl, setGoogleSheetUrl] = useLocalStorage('googleSheetUrl', '');

  const value = useMemo(() => ({
    googleSheetUrl,
    setGoogleSheetUrl,
  }), [googleSheetUrl, setGoogleSheetUrl]);

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

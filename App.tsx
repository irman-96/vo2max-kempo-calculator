

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Login from './components/Login';
import { Dashboard } from './components/Dashboard';
import TestForm from './components/TestForm';
import History from './components/History';
import Header from './components/Header';
import Settings from './components/Settings';
import { useLocalStorage } from './hooks/useLocalStorage';
import { User, TestResult } from './types';
// FIX: Import ThemeProvider to be used in the App component.
import { ThemeProvider } from './contexts/ThemeContext';
import { SettingsProvider, useSettings } from './contexts/SettingsContext';
import * as sheetService from './services/googleSheetService';

enum View {
  DASHBOARD,
  TEST_FORM,
  HISTORY,
  SETTINGS,
}

const AppContent: React.FC = () => {
  const [user, setUser] = useLocalStorage<User | null>('user', null);
  const [view, setView] = useState<View>(View.DASHBOARD);
  const [testResults, setTestResults] = useLocalStorage<TestResult[]>('testResults', []);
  const [isSyncing, setIsSyncing] = useState(true);
  const { googleSheetUrl } = useSettings();

  useEffect(() => {
    const syncData = async () => {
      if (googleSheetUrl) {
        setIsSyncing(true);
        try {
          const sheetData = await sheetService.fetchAllResultsFromSheet(googleSheetUrl);
          // Simple merge: sheet is the source of truth, but keep local items that aren't in the sheet (by id)
          const localOnlyData = testResults.filter(local => !sheetData.find(sheet => sheet.id === local.id));
          setTestResults([...sheetData, ...localOnlyData]);
        } catch (error) {
          console.error("Failed to sync with Google Sheet:", error);
          alert("Gagal menyinkronkan data dari Google Sheet. Data lokal akan ditampilkan.");
        } finally {
          setIsSyncing(false);
        }
      } else {
        setIsSyncing(false);
      }
    };
    syncData();
  }, [googleSheetUrl]); // Re-sync if URL changes, but primarily for initial load.

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setView(View.DASHBOARD);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const addTestResult = async (result: TestResult) => {
    // Optimistic UI update
    setTestResults(prevResults => [result, ...prevResults]);
    setView(View.HISTORY);
    if (googleSheetUrl) {
      try {
        await sheetService.saveTestResultToSheet(googleSheetUrl, result);
      } catch (error) {
        console.error("Failed to save to Google Sheet:", error);
        alert("Gagal menyimpan data ke Google Sheet. Data disimpan secara lokal.");
      }
    }
  };
  
  const deleteTestResults = async (idsToDelete: string[]) => {
    const originalResults = [...testResults];
    // Optimistic UI update
    setTestResults(prev => prev.filter(result => !idsToDelete.includes(result.id)));
    if (googleSheetUrl) {
      try {
        await sheetService.deleteTestResultsFromSheet(googleSheetUrl, idsToDelete);
      } catch (error) {
        console.error("Failed to delete from Google Sheet:", error);
        alert("Gagal menghapus data dari Google Sheet. Mengembalikan data lokal.");
        // Rollback on failure
        setTestResults(originalResults);
      }
    }
  };

  const renderContent = () => {
    if (isSyncing) {
        return <div className="text-center p-10">Menyinkronkan data...</div>
    }
    switch (view) {
      case View.DASHBOARD:
        return <Dashboard setView={setView} />;
      case View.TEST_FORM:
        return <TestForm onTestComplete={addTestResult} user={user!} />;
      case View.HISTORY:
        return <History testResults={testResults} deleteTestResults={deleteTestResults} />;
      case View.SETTINGS:
        return <Settings />;
      default:
        return <Dashboard setView={setView} />;
    }
  };

  if (!user) {
    return (
        <Login onLogin={handleLogin} />
    );
  }

  return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-['Inter'] transition-colors duration-300">
        <Header user={user} onLogout={handleLogout} setView={setView} currentView={view} />
        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          {renderContent()}
        </main>
      </div>
  );
};


const App: React.FC = () => (
  <ThemeProvider>
    <SettingsProvider>
      <AppContent />
    </SettingsProvider>
  </ThemeProvider>
);

export default App;
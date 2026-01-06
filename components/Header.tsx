
import React from 'react';
import { User } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { SunIcon, MoonIcon, LogoutIcon, DashboardIcon, HistoryIcon, SettingsIcon } from './icons';

interface HeaderProps {
  user: User;
  onLogout: () => void;
  setView: (view: any) => void;
  currentView: any;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, setView, currentView }) => {
  const { theme, toggleTheme } = useTheme();

  const NavButton: React.FC<{ view: any, icon: React.ReactNode, text: string }> = ({ view, icon, text }) => (
    <button
      onClick={() => setView(view)}
      className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
        currentView === view
          ? 'bg-indigo-600 text-white'
          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
      }`}
    >
      {icon}
      <span className="hidden sm:inline">{text}</span>
    </button>
  );

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">VO₂max Kempo</h1>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2">
             <NavButton view={0} icon={<DashboardIcon className="w-5 h-5"/>} text="Dashboard" />
             <NavButton view={2} icon={<HistoryIcon className="w-5 h-5"/>} text="Riwayat" />
             <NavButton view={3} icon={<SettingsIcon className="w-5 h-5"/>} text="Pengaturan" />
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300"
            >
              {theme === 'dark' ? <SunIcon className="w-6 h-6" /> : <MoonIcon className="w-6 h-6" />}
            </button>
            <div className="flex items-center space-x-2">
                <span className="text-sm font-medium hidden md:inline">{user.namaLengkap}</span>
                <button
                onClick={onLogout}
                className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300"
                title="Logout"
                >
                <LogoutIcon className="w-6 h-6" />
                </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

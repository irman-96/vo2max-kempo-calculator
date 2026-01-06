
import React from 'react';
import { HistoryIcon, PlusCircleIcon } from './icons';

interface DashboardProps {
  setView: (view: any) => void;
}

// FIX: Changed to a named export to resolve import issue.
export const Dashboard: React.FC<DashboardProps> = ({ setView }) => {
  const Card: React.FC<{ title: string, description: string, icon: React.ReactNode, onClick: () => void }> = ({ title, description, icon, onClick }) => (
    <div 
      onClick={onClick}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col items-center text-center cursor-pointer transform hover:-translate-y-2 transition-transform duration-300"
    >
      <div className="text-indigo-500 dark:text-indigo-400 mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm">{description}</p>
    </div>
  );

  return (
    <div className="animate-fade-in">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Dashboard Pelatih</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Selamat datang kembali! Kelola data tes fisik atlet Anda di sini.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card 
          title="Mulai Tes Baru"
          description="Input data atlet dan mulai perhitungan VO₂max dan BMI baru."
          icon={<PlusCircleIcon className="w-16 h-16" />}
          onClick={() => setView(1)} // View.TEST_FORM
        />
        <Card 
          title="Lihat Riwayat Tes"
          description="Tinjau, kelola, dan ekspor hasil tes yang telah disimpan sebelumnya."
          icon={<HistoryIcon className="w-16 h-16" />}
          onClick={() => setView(2)} // View.HISTORY
        />
      </div>
    </div>
  );
};


import React from 'react';
import { TestResult } from '../types';
import { BMI_CATEGORIES, VO2MAX_CATEGORIES } from '../constants';
import { CheckCircleIcon, XCircleIcon, DownloadIcon } from './icons';
import { exportToPDF } from '../services/pdfService';

interface ResultModalProps {
  result: TestResult;
  onClose: () => void;
  onSave: () => void;
}

const getCategoryStyle = (category: string, categories: { [key: string]: { label: string; color: string } }) => {
    const found = Object.values(categories).find(cat => cat.label === category);
    return found ? found.color : 'bg-gray-500';
};

const ResultModal: React.FC<ResultModalProps> = ({ result, onClose, onSave }) => {

  const bmiStyle = getCategoryStyle(result.kategoriBMI, BMI_CATEGORIES);
  const vo2maxStyle = getCategoryStyle(result.kategoriVo2max, VO2MAX_CATEGORIES);

  const handleExportPDF = () => {
    exportToPDF(result);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col transform transition-all duration-300 scale-95 animate-scale-in">
        <header className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Hasil Analisis Fisik</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
             <XCircleIcon className="w-8 h-8"/>
          </button>
        </header>

        <main className="p-6 overflow-y-auto space-y-6">
          <div className="text-center">
            <h3 className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">{result.namaAtlet}</h3>
            <p className="text-gray-500 dark:text-gray-400">{result.umur} tahun | {result.kategori}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ResultCard title="BMI" value={result.bmi.toString()} category={result.kategoriBMI} categoryClass={bmiStyle} />
            <ResultCard title="VO₂max" value={result.vo2max.toString()} unit="ml/kg/min" category={result.kategoriVo2max} categoryClass={vo2maxStyle} />
          </div>

          <div className="bg-gray-100 dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
             <h4 className="font-bold text-lg mb-3 text-gray-800 dark:text-gray-200 flex items-center">
                <span className="w-2 h-6 bg-indigo-500 rounded mr-2"></span>
                Analisis & Rekomendasi AI
             </h4>
             <div className="prose prose-sm dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                 {result.rekomendasi}
             </div>
          </div>
        </main>
        
        <footer className="p-6 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex space-x-2">
            <button onClick={handleExportPDF} className="flex items-center justify-center space-x-2 px-6 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-all duration-300">
              <DownloadIcon className="w-5 h-5"/>
              <span>Ekspor PDF</span>
            </button>
          </div>
          <div className="flex space-x-2">
            <button onClick={onClose} className="px-6 py-2 rounded-lg bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold hover:bg-gray-300 dark:hover:bg-gray-500 transition-all duration-300">
              Tutup
            </button>
            <button onClick={onSave} className="flex items-center justify-center space-x-2 px-6 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-all duration-300 shadow-lg shadow-indigo-500/20">
              <CheckCircleIcon className="w-5 h-5"/>
              <span>Simpan ke Database</span>
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

interface ResultCardProps {
    title: string;
    value: string;
    unit?: string;
    category: string;
    categoryClass: string;
}

const ResultCard: React.FC<ResultCardProps> = ({ title, value, unit, category, categoryClass }) => (
    <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-xl text-center shadow-inner border border-gray-100 dark:border-gray-700">
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">{title}</p>
        <p className="text-4xl font-extrabold text-gray-900 dark:text-white my-2">
            {value} <span className="text-lg font-medium text-gray-500 dark:text-gray-400">{unit}</span>
        </p>
        <span className={`px-4 py-1 text-sm font-bold text-white rounded-full shadow-sm ${categoryClass}`}>
            {category}
        </span>
    </div>
);

export default ResultModal;


import React from 'react';
import { TestResult } from '../types';
import { exportToPDF, exportHistoryToPDF } from '../services/pdfService';
import { TrashIcon, DownloadIcon, HistoryIcon } from './icons';
import { BMI_CATEGORIES, VO2MAX_CATEGORIES } from '../constants';

interface HistoryProps {
  testResults: TestResult[];
  deleteTestResults: (ids: string[]) => void;
}

const getCategoryStyle = (category: string, categories: { [key: string]: { label: string; color: string } }) => {
    const found = Object.values(categories).find(cat => cat.label === category);
    return found ? found.color : 'bg-gray-500';
};

const History: React.FC<HistoryProps> = ({ testResults, deleteTestResults }) => {
  const sortedResults = [...testResults].sort((a, b) => b.tanggalTes - a.tanggalTes);

  const handleExportAll = () => {
    if (sortedResults.length > 0) {
      exportHistoryToPDF(sortedResults);
    }
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus data tes untuk ${name}?`)) {
      deleteTestResults([id]);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg animate-fade-in border border-gray-100 dark:border-gray-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Riwayat Tes Atlet</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Kelola dan tinjau performa fisik atlet dari waktu ke waktu.</p>
        </div>
        {sortedResults.length > 0 && (
          <button
            onClick={handleExportAll}
            className="flex items-center space-x-2 px-5 py-2.5 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all duration-300 shadow-lg shadow-green-500/20"
          >
            <DownloadIcon className="w-5 h-5"/>
            <span>Rekap Semua (PDF)</span>
          </button>
        )}
      </div>

      {sortedResults.length > 0 ? (
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
              <tr>
                <th scope="col" className="px-6 py-4">Nama Atlet</th>
                <th scope="col" className="px-6 py-4">Tanggal Tes</th>
                <th scope="col" className="px-6 py-4">VO₂max</th>
                <th scope="col" className="px-6 py-4">BMI</th>
                <th scope="col" className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {sortedResults.map(result => (
                <tr key={result.id} className="bg-white dark:bg-gray-800 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10 transition-colors group">
                  <td className="px-6 py-4 font-semibold text-gray-900 whitespace-nowrap dark:text-white">
                    {result.namaAtlet}
                  </td>
                  <td className="px-6 py-4">
                    {new Date(result.tanggalTes).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-xs font-bold text-white rounded-full shadow-sm ${getCategoryStyle(result.kategoriVo2max, VO2MAX_CATEGORIES)}`}>
                      {result.vo2max}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-bold text-white rounded-full shadow-sm ${getCategoryStyle(result.kategoriBMI, BMI_CATEGORIES)}`}>
                          {result.bmi}
                      </span>
                  </td>
                  <td className="px-6 py-4 flex items-center justify-center space-x-3">
                      <button 
                        onClick={() => exportToPDF(result)} 
                        className="p-2 text-indigo-500 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 rounded-full transition-all" 
                        title="Download Laporan PDF"
                      >
                          <DownloadIcon className="w-5 h-5"/>
                      </button>
                      <button 
                        onClick={() => handleDelete(result.id, result.namaAtlet)} 
                        className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-full transition-all" 
                        title="Hapus Data"
                      >
                          <TrashIcon className="w-5 h-5"/>
                      </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-24 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/50 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
          <HistoryIcon className="w-20 h-20 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Belum Ada Riwayat</h3>
          <p className="mt-2 text-gray-500">Mulai input data tes fisik atlet Anda untuk melihat rekapitulasi di sini.</p>
        </div>
      )}
    </div>
  );
};

export default History;

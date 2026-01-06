
import React, { useState, useMemo } from 'react';
import { AthleteCategory, TestResult, TestType, User, AthleteData, TestInputData } from '../types';
import { calculateBMI, calculateVo2max, getVo2maxCategory } from '../services/calculationService';
import { generateRecommendation } from '../services/geminiService';
import ResultModal from './ResultModal';
import LoadingOverlay from './LoadingOverlay';

interface TestFormProps {
  onTestComplete: (result: TestResult) => void;
  user: User;
}

const TestForm: React.FC<TestFormProps> = ({ onTestComplete, user }) => {
  const [athleteData, setAthleteData] = useState<AthleteData>({
    namaAtlet: '',
    umur: 0,
    kategori: AthleteCategory.JUNIOR,
    tinggiBadan: 0,
    beratBadan: 0,
  });

  const [testInputData, setTestInputData] = useState<TestInputData>({
    jenisTes: TestType.COOPER,
    jarakTempuh: 0,
    waktuTempuh: 0,
    levelBleep: 1,
    shuttleBleep: 1,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<TestResult | null>(null);

  const handleAthleteChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setAthleteData({ ...athleteData, [e.target.name]: e.target.value });
  };

  const handleTestChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setTestInputData({ ...testInputData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (athleteData.umur <= 0 || athleteData.tinggiBadan <= 0 || athleteData.beratBadan <= 0) {
      setError("Data atlet tidak valid. Pastikan umur, tinggi, dan berat badan lebih dari 0.");
      return;
    }
    setError('');
    setIsLoading(true);

    // Force UI update to show loading overlay before heavy computation
    await new Promise(resolve => setTimeout(resolve, 0));

    try {
      const { bmi, category: kategoriBMI } = calculateBMI(athleteData.tinggiBadan, athleteData.beratBadan);
      const vo2max = calculateVo2max(testInputData);
      const kategoriVo2max = getVo2maxCategory(vo2max, athleteData.umur);

      const partialResult = {
        ...athleteData,
        ...testInputData,
        umur: Number(athleteData.umur),
        tinggiBadan: Number(athleteData.tinggiBadan),
        beratBadan: Number(athleteData.beratBadan),
        bmi,
        kategoriBMI,
        vo2max,
        kategoriVo2max,
        pelatihId: user.uid,
        pelatihNama: user.namaLengkap,
        tanggalTes: Date.now(),
      };

      const recommendation = await generateRecommendation(partialResult);

      setResult({ ...partialResult, rekomendasi: recommendation, id: crypto.randomUUID() });
    } catch (apiError) {
      console.error("Error during calculation or AI generation:", apiError);
      setError("Terjadi kesalahan saat memproses data. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSave = () => {
    if(result) {
      onTestComplete(result);
      setResult(null);
    }
  };

  const renderTestInputs = useMemo(() => {
    switch (testInputData.jenisTes) {
      case TestType.COOPER:
        return <Input label="Jarak Tempuh (meter)" name="jarakTempuh" type="number" value={testInputData.jarakTempuh || ''} onChange={handleTestChange} />;
      case TestType.BALKE:
      case TestType.RUN_1600M:
      case TestType.RUN_2400M:
        return <Input label="Waktu Tempuh (menit)" name="waktuTempuh" type="number" step="0.01" value={testInputData.waktuTempuh || ''} onChange={handleTestChange} />;
      case TestType.BLEEP:
        return (
          <div className="grid grid-cols-2 gap-4">
            <Input label="Level" name="levelBleep" type="number" min="1" max="15" value={testInputData.levelBleep || ''} onChange={handleTestChange} />
            <Input label="Shuttle" name="shuttleBleep" type="number" min="1" max="14" value={testInputData.shuttleBleep || ''} onChange={handleTestChange} />
          </div>
        );
      default:
        return null;
    }
  }, [testInputData.jenisTes, testInputData.jarakTempuh, testInputData.waktuTempuh, testInputData.levelBleep, testInputData.shuttleBleep]);

  return (
    <>
      {isLoading && <LoadingOverlay message="Menghitung hasil & membuat rekomendasi AI..." />}
      <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in">
        <FormSection title="Data Atlet">
          <Input label="Nama Atlet" name="namaAtlet" type="text" value={athleteData.namaAtlet} onChange={handleAthleteChange} required />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Umur" name="umur" type="number" value={athleteData.umur || ''} onChange={handleAthleteChange} required />
            <Select label="Kategori" name="kategori" value={athleteData.kategori} onChange={handleAthleteChange}>
              {Object.values(AthleteCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </Select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Tinggi Badan (cm)" name="tinggiBadan" type="number" value={athleteData.tinggiBadan || ''} onChange={handleAthleteChange} required />
            <Input label="Berat Badan (kg)" name="beratBadan" type="number" value={athleteData.beratBadan || ''} onChange={handleAthleteChange} required />
          </div>
        </FormSection>

        <FormSection title="Data Tes VO₂max">
          <Select label="Jenis Tes" name="jenisTes" value={testInputData.jenisTes} onChange={handleTestChange}>
            {Object.values(TestType).map(type => <option key={type} value={type}>{type}</option>)}
          </Select>
          {renderTestInputs}
        </FormSection>

        {error && <p className="text-sm text-red-500 text-center bg-red-100 dark:bg-red-900/30 p-3 rounded-md">{error}</p>}

        <div className="flex justify-end">
          <button type="submit" disabled={isLoading} className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 transition-all duration-300 transform hover:scale-105">
            {isLoading ? 'Menghitung...' : 'Hitung & Analisis'}
          </button>
        </div>
      </form>
      {result && <ResultModal result={result} onClose={() => setResult(null)} onSave={handleSave} />}
    </>
  );
};


const FormSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
      <h3 className="text-xl font-bold mb-6 border-b-2 border-indigo-500 pb-2">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
  
const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, ...props }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
      <input {...props} className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-300" />
    </div>
  );
  
const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label: string }> = ({ label, children, ...props }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
      <select {...props} className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-300">
        {children}
      </select>
    </div>
  );

export default TestForm;

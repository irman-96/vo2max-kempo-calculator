import { TestResult } from '../types';

export const generateRecommendation = async (
  result: Omit<TestResult, 'rekomendasi' | 'id'>
): Promise<string> => {

  const prompt = `
Anda adalah seorang Sports Scientist profesional yang berspesialisasi dalam olahraga bela diri Kempo.
Buat laporan analisis kinerja fisik lengkap untuk seorang atlet berdasarkan data berikut.

Data Atlet:
Nama: ${result.namaAtlet}
Umur: ${result.umur} tahun
Kategori: ${result.kategori}
BMI: ${result.bmi} (${result.kategoriBMI})
Skor VO₂max: ${result.vo2max} ml/kg/min (${result.kategoriVo2max})

Berikan analisis profesional, rekomendasi latihan, dan motivasi dalam Bahasa Indonesia.
`;

  try {
    const res = await fetch('/.netlify/functions/ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();

    if (!res.ok) {
      return data?.error || 'Gagal menghasilkan rekomendasi AI.';
    }

    // ✅ FIX TypeScript: pasti string
    return (
      data?.candidates?.[0]?.content?.parts?.[0]?.text ??
      'Rekomendasi AI tidak tersedia.'
    );

  } catch (error) {
    console.error('AI Error:', error);
    return 'Terjadi kesalahan saat memproses rekomendasi AI.';
  }
};

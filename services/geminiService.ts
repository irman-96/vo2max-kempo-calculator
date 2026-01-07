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

    console.log('AI RAW RESPONSE:', data); // 🔥 PENTING BUAT DEBUG

    if (!res.ok) {
      return data?.error || 'Gagal menghasilkan rekomendasi AI.';
    }

    // 🔥 PARSING AMAN (INI YANG SEBELUMNYA SALAH)
    const text =
      data?.candidates?.[0]?.content?.parts
        ?.map((p: any) => p.text)
        ?.join('\n');

    if (!text) {
      return 'Rekomendasi AI tidak tersedia (response kosong).';
    }

    return text;

  } catch (error) {
    console.error('AI Error:', error);
    return 'Terjadi kesalahan saat memproses rekomendasi AI.';
  }
};

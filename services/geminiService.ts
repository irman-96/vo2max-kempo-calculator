
import { GoogleGenAI } from "@google/genai";
import { TestResult } from '../types';

export const generateRecommendation = async (result: Omit<TestResult, 'rekomendasi' | 'id'>): Promise<string> => {
  if (!process.env.API_KEY) {
    console.error("API_KEY environment variable not set.");
    return "Rekomendasi AI tidak tersedia saat ini. Kunci API belum diatur.";
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    Anda adalah seorang Sports Scientist profesional yang berspesialisasi dalam olahraga bela diri Kempo.
    Buat laporan analisis kinerja fisik lengkap untuk seorang atlet berdasarkan data berikut.

    **Data Atlet:**
    *   Nama: ${result.namaAtlet}
    *   Umur: ${result.umur} tahun
    *   Kategori: ${result.kategori}
    *   BMI: ${result.bmi} (${result.kategoriBMI})
    *   Skor VO₂max: ${result.vo2max} ml/kg/min (${result.kategoriVo2max})

    **Instruksi Format Laporan:**
    Hasilkan respons sebagai laporan lengkap yang diformat dengan Markdown. Ikuti struktur ini DENGAN TEPAT:

    **LAPORAN ANALISIS KINERJA FISIK ATLET KEMPO**

    **Kepada:** ${result.namaAtlet}
    **Dari:** Sports Scientist Spesialis Bela Diri
    **Perihal:** Evaluasi Kebugaran Fisik dan Rencana Pengembangan Performa

    ---

    ### **1. Penilaian Keseluruhan**
    Sapa atlet dengan nama mereka. Berikan ringkasan yang memberi semangat tentang kondisi fisik mereka saat ini berdasarkan data yang ada. Sebutkan bahwa data ini adalah titik awal (*baseline*) yang bagus untuk pengembangan.

    ### **2. Analisis VO₂max: Daya Tahan dan Pemulihan**
    Jelaskan arti skor VO₂max dalam konteks Kempo (kebutuhan daya tahan aerobik untuk pertarungan panjang dan pemulihan cepat antar babak *randori*).
    *   **Konteks Kempo:** Kaitkan skor VO₂max dengan kemampuan mereka untuk mempertahankan teknik (*waza*) yang eksplosif tanpa cepat lelah.
    *   **Implikasi:** Jelaskan fokus latihan yang dibutuhkan berdasarkan skor mereka (misalnya, meningkatkan efisiensi jantung dan paru-paru).

    ### **3. Analisis BMI: Komposisi Tubuh dan Agilitas**
    Berikan komentar tentang BMI mereka. Jelaskan potensi implikasinya terhadap kelincahan dan rasio kekuatan-terhadap-berat dalam Kempo.
    *   **Konteks Kempo:** Jika BMI tidak ideal, jelaskan pengaruhnya pada kecepatan gerak dan stamina.
    *   **Implikasi:** Sarankan fokus pada komposisi tubuh (massa otot vs. lemak) daripada hanya berat badan.

    ### **4. Rekomendasi Latihan Terstruktur**
    Berikan 3-5 poin rekomendasi latihan yang spesifik dan dapat ditindaklanjuti. Gunakan format bullet point (*).
    *   Contoh: Tingkatkan kapasitas aerobik dengan lari interval: 400m lari cepat, diikuti 200m jalan kaki, ulangi 8 kali.
    *   Contoh: Latihan sirkuit Kempo: lakukan *tsuki*, *geri*, dan *uke* secara berurutan selama 3 menit, istirahat 1 menit, ulangi 5 ronde.

    **Nada Tulisan:**
    Profesional, positif, memberi semangat, dan memberdayakan. Gunakan Bahasa Indonesia yang baku dan jelas.
    `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Gagal menghasilkan rekomendasi. Silakan coba lagi nanti.";
  }
};

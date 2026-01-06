
export interface User {
  uid: string;
  username: string;
  namaLengkap: string;
  role: 'pelatih';
}

export enum AthleteCategory {
  JUNIOR = 'Junior',
  SENIOR = 'Senior',
}

export enum TestType {
  COOPER = 'Cooper Test (12 menit)',
  BALKE = 'Balke Test (15 menit)',
  RUN_1600M = 'Lari 1600 meter',
  RUN_2400M = 'Lari 2400 meter',
  BLEEP = 'Bleep Test',
}

export interface AthleteData {
  namaAtlet: string;
  umur: number;
  kategori: AthleteCategory;
  tinggiBadan: number; // in cm
  beratBadan: number; // in kg
}

export interface TestInputData {
  jenisTes: TestType;
  jarakTempuh?: number; // in meters for Cooper
  waktuTempuh?: number; // in minutes for Balke, 1600m, 2400m
  levelBleep?: number;
  shuttleBleep?: number;
}

export interface TestResult extends AthleteData, TestInputData {
  id: string;
  bmi: number;
  kategoriBMI: string;
  vo2max: number;
  kategoriVo2max: string;
  rekomendasi: string;
  pelatihId: string;
  pelatihNama: string;
  tanggalTes: number; // timestamp
}

export interface BleepTestValue {
  vo2max: number;
}

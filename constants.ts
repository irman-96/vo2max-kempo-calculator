
import { BleepTestValue } from './types';

export const BMI_CATEGORIES = {
  UNDERWEIGHT: { label: 'Kurus', color: 'bg-blue-500' },
  NORMAL: { label: 'Normal', color: 'bg-green-500' },
  OVERWEIGHT: { label: 'Overweight', color: 'bg-yellow-500' },
  OBESITY: { label: 'Obesitas', color: 'bg-red-500' },
};

export const VO2MAX_CATEGORIES = {
  SUPERIOR: { label: 'Sangat Baik', color: 'bg-purple-600' },
  EXCELLENT: { label: 'Baik', color: 'bg-green-500' },
  GOOD: { label: 'Cukup', color: 'bg-blue-500' },
  FAIR: { label: 'Kurang', color: 'bg-yellow-500' },
  POOR: { label: 'Sangat Kurang', color: 'bg-red-500' },
};

// Bleep test VO2max values lookup table [level][shuttle]
// Source: Commonly used tables based on Leger, L. A.; Mercier, D.; Gadoury, C.; Lambert, J. (1988)
export const BLEEP_TEST_TABLE: { [level: number]: { [shuttle: number]: BleepTestValue } } = {
  1: {
    1: { vo2max: 15.3 }, 2: { vo2max: 15.8 }, 3: { vo2max: 16.2 }, 4: { vo2max: 16.7 }, 5: { vo2max: 17.1 }, 6: { vo2max: 17.6 }, 7: { vo2max: 18.0 }
  },
  2: {
    1: { vo2max: 18.5 }, 2: { vo2max: 18.9 }, 3: { vo2max: 19.4 }, 4: { vo2max: 19.8 }, 5: { vo2max: 20.3 }, 6: { vo2max: 20.7 }, 7: { vo2max: 21.2 }, 8: { vo2max: 21.6 }
  },
  3: {
    1: { vo2max: 22.1 }, 2: { vo2max: 22.5 }, 3: { vo2max: 23.0 }, 4: { vo2max: 23.4 }, 5: { vo2max: 23.9 }, 6: { vo2max: 24.3 }, 7: { vo2max: 24.8 }, 8: { vo2max: 25.2 }
  },
  4: {
    1: { vo2max: 25.7 }, 2: { vo2max: 26.1 }, 3: { vo2max: 26.6 }, 4: { vo2max: 27.0 }, 5: { vo2max: 27.5 }, 6: { vo2max: 27.9 }, 7: { vo2max: 28.4 }, 8: { vo2max: 28.8 }, 9: { vo2max: 29.3 }
  },
  5: {
    1: { vo2max: 29.7 }, 2: { vo2max: 30.2 }, 3: { vo2max: 30.6 }, 4: { vo2max: 31.1 }, 5: { vo2max: 31.5 }, 6: { vo2max: 32.0 }, 7: { vo2max: 32.4 }, 8: { vo2max: 32.9 }, 9: { vo2max: 33.3 }
  },
  6: {
    1: { vo2max: 33.8 }, 2: { vo2max: 34.2 }, 3: { vo2max: 34.7 }, 4: { vo2max: 35.1 }, 5: { vo2max: 35.6 }, 6: { vo2max: 36.0 }, 7: { vo2max: 36.5 }, 8: { vo2max: 36.9 }, 9: { vo2max: 37.4 }, 10: { vo2max: 37.8 }
  },
  7: {
    1: { vo2max: 38.3 }, 2: { vo2max: 38.7 }, 3: { vo2max: 39.2 }, 4: { vo2max: 39.6 }, 5: { vo2max: 40.1 }, 6: { vo2max: 40.5 }, 7: { vo2max: 41.0 }, 8: { vo2max: 41.4 }, 9: { vo2max: 41.9 }, 10: { vo2max: 42.3 }
  },
  8: {
    1: { vo2max: 42.8 }, 2: { vo2max: 43.2 }, 3: { vo2max: 43.7 }, 4: { vo2max: 44.1 }, 5: { vo2max: 44.6 }, 6: { vo2max: 45.0 }, 7: { vo2max: 45.5 }, 8: { vo2max: 45.9 }, 9: { vo2max: 46.4 }, 10: { vo2max: 46.8 }, 11: { vo2max: 47.3 }
  },
  9: {
    1: { vo2max: 47.7 }, 2: { vo2max: 48.2 }, 3: { vo2max: 48.6 }, 4: { vo2max: 49.1 }, 5: { vo2max: 49.5 }, 6: { vo2max: 50.0 }, 7: { vo2max: 50.4 }, 8: { vo2max: 50.9 }, 9: { vo2max: 51.3 }, 10: { vo2max: 51.8 }, 11: { vo2max: 52.2 }
  },
  10: {
    1: { vo2max: 52.7 }, 2: { vo2max: 53.1 }, 3: { vo2max: 53.6 }, 4: { vo2max: 54.0 }, 5: { vo2max: 54.5 }, 6: { vo2max: 54.9 }, 7: { vo2max: 55.4 }, 8: { vo2max: 55.8 }, 9: { vo2max: 56.3 }, 10: { vo2max: 56.7 }, 11: { vo2max: 57.2 }
  },
  11: {
    1: { vo2max: 57.6 }, 2: { vo2max: 58.1 }, 3: { vo2max: 58.5 }, 4: { vo2max: 59.0 }, 5: { vo2max: 59.4 }, 6: { vo2max: 59.9 }, 7: { vo2max: 60.3 }, 8: { vo2max: 60.8 }, 9: { vo2max: 61.2 }, 10: { vo2max: 61.7 }, 11: { vo2max: 62.1 }, 12: { vo2max: 62.6 }
  },
  12: {
    1: { vo2max: 63.0 }, 2: { vo2max: 63.5 }, 3: { vo2max: 63.9 }, 4: { vo2max: 64.4 }, 5: { vo2max: 64.8 }, 6: { vo2max: 65.3 }, 7: { vo2max: 65.7 }, 8: { vo2max: 66.2 }, 9: { vo2max: 66.6 }, 10: { vo2max: 67.1 }, 11: { vo2max: 67.5 }, 12: { vo2max: 68.0 }
  },
  13: {
    1: { vo2max: 68.4 }, 2: { vo2max: 68.9 }, 3: { vo2max: 69.3 }, 4: { vo2max: 69.8 }, 5: { vo2max: 70.2 }, 6: { vo2max: 70.7 }, 7: { vo2max: 71.1 }, 8: { vo2max: 71.6 }, 9: { vo2max: 72.0 }, 10: { vo2max: 72.5 }, 11: { vo2max: 72.9 }, 12: { vo2max: 73.4 }, 13: { vo2max: 73.8 }
  },
  14: {
    1: { vo2max: 74.3 }, 2: { vo2max: 74.7 }, 3: { vo2max: 75.2 }, 4: { vo2max: 75.6 }, 5: { vo2max: 76.1 }, 6: { vo2max: 76.5 }, 7: { vo2max: 77.0 }, 8: { vo2max: 77.4 }, 9: { vo2max: 77.9 }, 10: { vo2max: 78.3 }, 11: { vo2max: 78.8 }, 12: { vo2max: 79.2 }, 13: { vo2max: 79.7 }
  },
  15: {
    1: { vo2max: 80.1 }, 2: { vo2max: 80.6 }, 3: { vo2max: 81.0 }, 4: { vo2max: 81.5 }, 5: { vo2max: 81.9 }, 6: { vo2max: 82.4 }, 7: { vo2max: 82.8 }, 8: { vo2max: 83.3 }, 9: { vo2max: 83.7 }, 10: { vo2max: 84.2 }, 11: { vo2max: 84.6 }, 12: { vo2max: 85.1 }, 13: { vo2max: 85.5 }, 14: { vo2max: 86.0 }
  },
};

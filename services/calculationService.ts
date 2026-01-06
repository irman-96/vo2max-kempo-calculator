
import { TestType, AthleteData, TestInputData } from '../types';
import { BMI_CATEGORIES, VO2MAX_CATEGORIES, BLEEP_TEST_TABLE } from '../constants';

export const calculateBMI = (heightCm: number, weightKg: number): { bmi: number, category: string } => {
  if (heightCm <= 0 || weightKg <= 0) return { bmi: 0, category: '' };
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  let category: string;

  if (bmi < 18.5) {
    category = BMI_CATEGORIES.UNDERWEIGHT.label;
  } else if (bmi >= 18.5 && bmi < 25) {
    category = BMI_CATEGORIES.NORMAL.label;
  } else if (bmi >= 25 && bmi < 30) {
    category = BMI_CATEGORIES.OVERWEIGHT.label;
  } else {
    category = BMI_CATEGORIES.OBESITY.label;
  }

  return { bmi: parseFloat(bmi.toFixed(2)), category };
};

export const calculateVo2max = (testData: TestInputData): number => {
  let vo2max = 0;
  switch (testData.jenisTes) {
    case TestType.COOPER:
      // Formula: (Jarak (m) - 504.9) / 44.73
      if (testData.jarakTempuh) {
        vo2max = (testData.jarakTempuh - 504.9) / 44.73;
      }
      break;
    case TestType.BALKE:
       // Formula: 33.3 + (0.178 * Waktu (menit)) - Balke is usually 15 min test, formula is generic for time
       // I'll assume the input is total minutes run until exhaustion. The prompt is vague.
       // Let's stick to the formula provided: 33.3 + (0.178 × waktu menit)
      if (testData.waktuTempuh) {
         vo2max = 33.3 + (0.178 * testData.waktuTempuh);
      }
      break;
    case TestType.RUN_1600M:
      // Formula: VO2max = (35.959 * distance_in_miles / time_in_minutes) - 11.288
      if (testData.waktuTempuh && testData.waktuTempuh > 0) {
        const distanceMiles = 1.0; // 1600m is approx 1 mile
        vo2max = (35.959 * distanceMiles / testData.waktuTempuh) - 11.288;
      }
      break;
    case TestType.RUN_2400M:
       // Formula: VO2max = (483 / time_in_minutes) + 3.5
      if (testData.waktuTempuh && testData.waktuTempuh > 0) {
        vo2max = (483 / testData.waktuTempuh) + 3.5;
      }
      break;
    case TestType.BLEEP:
      if (testData.levelBleep && testData.shuttleBleep) {
        vo2max = BLEEP_TEST_TABLE[testData.levelBleep]?.[testData.shuttleBleep]?.vo2max || 0;
      }
      break;
    default:
      vo2max = 0;
  }

  return parseFloat(vo2max.toFixed(2));
};

export const getVo2maxCategory = (vo2max: number, age: number): string => {
  // Simplified categorization. A real-world app would use age and gender-specific tables.
  if (age < 30) {
    if (vo2max > 52) return VO2MAX_CATEGORIES.SUPERIOR.label;
    if (vo2max > 45) return VO2MAX_CATEGORIES.EXCELLENT.label;
    if (vo2max > 38) return VO2MAX_CATEGORIES.GOOD.label;
    if (vo2max > 32) return VO2MAX_CATEGORIES.FAIR.label;
    return VO2MAX_CATEGORIES.POOR.label;
  } else { // age >= 30
    if (vo2max > 48) return VO2MAX_CATEGORIES.SUPERIOR.label;
    if (vo2max > 41) return VO2MAX_CATEGORIES.EXCELLENT.label;
    if (vo2max > 35) return VO2MAX_CATEGORIES.GOOD.label;
    if (vo2max > 29) return VO2MAX_CATEGORIES.FAIR.label;
    return VO2MAX_CATEGORIES.POOR.label;
  }
};

/** Calorie & macro estimation — pure functions, no client state. */

export type Sex = "male" | "female";
export type Activity = "sedentary" | "light" | "moderate" | "active" | "athlete";
export type CalGoal = "cut" | "maintain" | "bulk";

const ACTIVITY_FACTOR: Record<Activity, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  athlete: 1.9,
};

export interface CalorieInput {
  sex: Sex;
  age: number;
  weightKg: number;
  heightCm: number;
  /** Optional body-fat % — enables the more accurate Katch-McArdle BMR. */
  bodyFat?: number;
  activity: Activity;
  goal: CalGoal;
}

export interface CalorieResult {
  bmr: number;
  tdee: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

function round10(n: number): number {
  return Math.round(n / 10) * 10;
}

/**
 * Compute daily calories and macros.
 * - BMR: Katch-McArdle when body-fat is provided, else Mifflin-St Jeor.
 * - Goal: cut −20%, bulk +12%, maintain TDEE.
 * - Protein: 2.2/2.0/1.8 g·kg for cut/maintain/bulk; fat 25% of calories; rest carbs.
 */
export function calcPlan(input: CalorieInput): CalorieResult {
  const { sex, age, weightKg, heightCm, bodyFat, activity, goal } = input;

  let bmr: number;
  if (bodyFat && bodyFat > 0 && bodyFat < 60) {
    const leanMass = weightKg * (1 - bodyFat / 100);
    bmr = 370 + 21.6 * leanMass; // Katch-McArdle
  } else {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + (sex === "male" ? 5 : -161); // Mifflin-St Jeor
  }

  const tdee = bmr * ACTIVITY_FACTOR[activity];
  const calories = goal === "cut" ? tdee * 0.8 : goal === "bulk" ? tdee * 1.12 : tdee;

  const proteinPerKg = goal === "cut" ? 2.2 : goal === "bulk" ? 1.8 : 2.0;
  const protein = Math.round(weightKg * proteinPerKg);
  const fat = Math.round((calories * 0.25) / 9);
  const carbs = Math.max(0, Math.round((calories - protein * 4 - fat * 9) / 4));

  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    calories: round10(calories),
    protein,
    carbs,
    fat,
  };
}


export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  DOCTOR = 'DOCTOR'
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  profile?: UserProfile;
}

export interface UserProfile {
  name: string;
  age: number;
  weight: number;
  height: number;
  grade: 1 | 2 | 3;
  symptoms: string[];
  fertilityGoal: string;
  testosterone?: number;
  spermCount?: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  image: string;
  stock: number;
  category: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  total: number;
  status: OrderStatus;
  items: CartItem[];
}

export interface LabAnalysisResult {
  riskScore: number;
  summary: string;
  improvementPlan: string[];
  fertilityStatus: string;
  suggestions: string[];
}

export interface Exercise {
  id: string;
  title: string;
  category: 'Pelvic Floor' | 'Circulation' | 'Yoga' | 'Light';
  duration: string; // e.g., "10 min"
  calories: string; // e.g., "50 kcal"
  intensity: 'Low' | 'Medium' | 'High';
  image: string;
  videoUrl: string;
  description: string;
}

export interface ExerciseCompletion {
  exerciseId: string;
  date: string;
}

export interface DailyDietPlan {
  breakfast: DietMeal;
  lunch: DietMeal;
  dinner: DietMeal;
  snacks: DietMeal;
  totalCalories: number;
}

export interface DietMeal {
  name: string;
  calories: number;
  protein: number;
  fats: number;
  carbs: number;
  description: string;
}

export type RiskTolerance = 'Low' | 'Medium' | 'High';

export interface FarmerProfileData {
  name: string;
  age: number;
  experience_years: number;
  family_size: number;
  education: string;
  annual_income: number;
  savings: number;
  land_value: number; // per acre
  bank_loan: number;
  risk_tolerance: RiskTolerance;
  investment_capacity: number;
  total_acres: number;
  irrigated_acres: number;
  soil_type: string;
  irrigation_type: string;
  state: string;
  district: string;
  latitude: number;
  longitude: number;

  // Derived metrics
  total_assets: number;
  net_worth: number;
  debt_to_income_ratio: number;
  investment_ratio: number;
}

export interface RecommendedCrop {
  name: string;
  category: string;
  expected_yield: string; // e.g. "3.50" tons/acre
  sowing_season: string;
  harvest_time: string;
  water_requirement: string;
  growth_duration: number;
  investment: number;
  expected_revenue: number;
  net_profit: number;
  roi: number;
  risk_level: 'Low' | 'Medium' | 'High';
  irrigation_cost: number;
  risk_score: number;
}

export interface CropRecommendationsResult {
  crops: RecommendedCrop[];
  total_recommendations: number;
  risk_profile: {
    level: string;
    score: number;
    distribution: {
      Low: number;
      Medium: number;
      High: number;
    };
  };
  investment_summary: {
    total_investment: number;
    affordable_crops: number;
    investment_per_acre: number;
    utilization_rate: number;
  };
}

export interface RiskCategoryDetail {
  level: string;
  probability: number;
  impact: string;
  mitigation: string;
  insurance: boolean;
}

export interface RiskToleranceAnalysis {
  recommended_risk: string;
  compatibility_score: number;
  max_loss_tolerance: number;
  min_profit_target: number;
  adjusted_recommendation: string;
}

export interface RiskAnalysisResult {
  overall_risk: string;
  risk_score: number;
  disease_risk: RiskCategoryDetail;
  pest_risk: RiskCategoryDetail;
  weather_risk: RiskCategoryDetail;
  market_risk: RiskCategoryDetail;
  water_risk: RiskCategoryDetail;
  soil_risk: RiskCategoryDetail;
  economic_risk: string;
  economic_risk_score: number;
  environmental_risk: string;
  environmental_risk_score: number;
  tolerance_analysis: RiskToleranceAnalysis;
  risk_mitigation_strategies: string[];
}

export interface FinancialAnalysisResult {
  total_investment: number;
  total_revenue: number;
  net_profit: number;
  investment_per_acre: number;
  revenue_per_acre: number;
  profit_per_acre: number;
  roi: number;
  profit_margin: number;
  monthly_expenses: number[];
  monthly_income: number[];
  break_even_yield: number;
  break_even_price: number;
  safety_margin: number;
  risk_adjusted_roi: number;
  cash_flow_summary: {
    total_expenses: number;
    total_income: number;
    net_cash_flow: number;
    peak_cash_requirement: number;
    positive_months: number;
    negative_months: number;
  };
  financial_health: string;
  sensitivity_analysis?: {
    base_roi: number;
    scenarios: Record<string, number>;
    worst_case_roi: number;
    best_case_roi: number;
  };
  financing_recommendations?: {
    financing_needed: boolean;
    recommendation: string;
    loan_amount: number;
    loan_type: string;
    monthly_emi?: number;
  };
  risk_mitigation?: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface SMSGatewayInfo {
  carrier: string;
  name: string;
  gateway: string;
  region: 'India' | 'US' | 'Generic';
}

export interface WeatherData {
  temperature: string;
  humidity: string;
  rainfall: string;
  wind_speed: string;
  recommendations: string;
  precautions: string;
}

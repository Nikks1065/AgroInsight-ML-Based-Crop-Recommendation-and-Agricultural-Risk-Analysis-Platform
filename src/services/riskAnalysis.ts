import { FarmerProfileData, CropRecommendationsResult, RiskAnalysisResult, RiskCategoryDetail } from '../types';
import { getRegion } from './cropRecommendation';

const DISEASE_RISKS: Record<string, { probability: number; impact: string; mitigation: string }> = {
  wheat: { probability: 0.3, impact: 'Medium', mitigation: 'Fungicide application' },
  rice: { probability: 0.4, impact: 'High', mitigation: 'Resistant varieties' },
  maize: { probability: 0.25, impact: 'Medium', mitigation: 'Crop rotation' },
  cotton: { probability: 0.5, impact: 'High', mitigation: 'IPM practices' },
  sugarcane: { probability: 0.2, impact: 'Medium', mitigation: 'Healthy seed' },
  pulses: { probability: 0.15, impact: 'Low', mitigation: 'Seed treatment' },
  vegetables: { probability: 0.6, impact: 'High', mitigation: 'Greenhouse' },
};

const PEST_RISKS: Record<string, { probability: number; impact: string; mitigation: string }> = {
  wheat: { probability: 0.2, impact: 'Low', mitigation: 'Natural predators' },
  rice: { probability: 0.35, impact: 'Medium', mitigation: 'Pest-resistant varieties' },
  maize: { probability: 0.3, impact: 'Medium', mitigation: 'Biological control' },
  cotton: { probability: 0.6, impact: 'High', mitigation: 'IPM strategies' },
  sugarcane: { probability: 0.15, impact: 'Low', mitigation: 'Clean cultivation' },
  pulses: { probability: 0.25, impact: 'Medium', mitigation: 'Crop rotation' },
  vegetables: { probability: 0.7, impact: 'High', mitigation: 'Integrated pest management' },
};

export function analyzeRisks(farmer: FarmerProfileData, recommendations: CropRecommendationsResult): RiskAnalysisResult {
  const crops = recommendations.crops;

  // 1. Disease Risk
  let totalDiseaseProb = 0;
  if (crops.length > 0) {
    for (const crop of crops) {
      const key = crop.name.toLowerCase().split(' ')[0];
      const entry = DISEASE_RISKS[key];
      totalDiseaseProb += entry ? entry.probability : 0.3;
    }
  }
  const avgDiseaseProb = crops.length > 0 ? totalDiseaseProb / crops.length : 0.25;
  const diseaseLevel = avgDiseaseProb < 0.2 ? 'Low' : avgDiseaseProb < 0.4 ? 'Medium' : 'High';
  const diseaseRisk: RiskCategoryDetail = {
    level: diseaseLevel,
    probability: Math.round(avgDiseaseProb * 100),
    impact: avgDiseaseProb > 0.3 ? 'Medium' : 'Low',
    mitigation: 'Regular monitoring and preventive fungicide spray',
    insurance: true,
  };

  // 2. Pest Risk
  let totalPestProb = 0;
  if (crops.length > 0) {
    for (const crop of crops) {
      const key = crop.name.toLowerCase().split(' ')[0];
      const entry = PEST_RISKS[key];
      totalPestProb += entry ? entry.probability : 0.3;
    }
  }
  const avgPestProb = crops.length > 0 ? totalPestProb / crops.length : 0.25;
  const pestLevel = avgPestProb < 0.25 ? 'Low' : avgPestProb < 0.45 ? 'Medium' : 'High';
  const pestRisk: RiskCategoryDetail = {
    level: pestLevel,
    probability: Math.round(avgPestProb * 100),
    impact: avgPestProb > 0.35 ? 'Medium' : 'Low',
    mitigation: 'Integrated Pest Management (IPM) & pheromone traps',
    insurance: true,
  };

  // 3. Weather Risk
  const region = getRegion(farmer.state);
  const regionalWeatherRisk: Record<string, number> = {
    'North-West': 0.3,
    North: 0.4,
    West: 0.35,
    South: 0.25,
  };
  let weatherBase = regionalWeatherRisk[region] || 0.3;
  const irrigationCoverage = farmer.total_acres > 0 ? farmer.irrigated_acres / farmer.total_acres : 0;
  if (irrigationCoverage > 0.8) {
    weatherBase *= 0.7;
  } else if (irrigationCoverage > 0.5) {
    weatherBase *= 0.85;
  }
  const weatherLevel = weatherBase < 0.25 ? 'Low' : weatherBase < 0.4 ? 'Medium' : 'High';
  const weatherRisk: RiskCategoryDetail = {
    level: weatherLevel,
    probability: Math.round(weatherBase * 100),
    impact: weatherBase > 0.35 ? 'High' : 'Medium',
    mitigation: 'Weather monitoring and contingency drainage/irrigation',
    insurance: true,
  };

  // 4. Market Risk
  let marketBase = 0.35;
  if (crops.length > 0) {
    const categories = new Set(crops.map((c) => c.category)).size;
    if (categories > 3) marketBase *= 0.8;
    else if (categories === 1) marketBase *= 1.2;
  }
  if (farmer.debt_to_income_ratio > 0.5) marketBase *= 1.3;
  const marketLevel = marketBase < 0.3 ? 'Low' : marketBase < 0.5 ? 'Medium' : 'High';
  const marketRisk: RiskCategoryDetail = {
    level: marketLevel,
    probability: Math.round(marketBase * 100),
    impact: 'Medium',
    mitigation: 'Market diversification and forward contracts with mandis',
    insurance: false,
  };

  // 5. Water Risk
  let waterBase = irrigationCoverage < 0.3 ? 0.6 : irrigationCoverage < 0.6 ? 0.4 : 0.25;
  const irrigationTypeRisk: Record<string, number> = {
    Well: 0.3,
    Canal: 0.2,
    Borewell: 0.4,
    Rainfed: 0.7,
    Mixed: 0.25,
  };
  const typeRisk = irrigationTypeRisk[farmer.irrigation_type] ?? 0.4;
  waterBase = (waterBase + typeRisk) / 2;
  const waterLevel = waterBase < 0.3 ? 'Low' : waterBase < 0.5 ? 'Medium' : 'High';
  const waterRisk: RiskCategoryDetail = {
    level: waterLevel,
    probability: Math.round(waterBase * 100),
    impact: waterBase > 0.4 ? 'High' : 'Medium',
    mitigation: 'Drip micro-irrigation, rainwater harvesting, water recycling',
    insurance: false,
  };

  // 6. Soil Risk
  const soilRiskFactors: Record<string, number> = {
    Clay: 0.3,
    Sandy: 0.4,
    Loamy: 0.2,
    'Red Soil': 0.35,
    'Black Soil': 0.25,
    Alluvial: 0.2,
  };
  let soilBase = soilRiskFactors[farmer.soil_type] || 0.3;
  if (farmer.experience_years > 15) soilBase *= 0.8;
  else if (farmer.experience_years < 5) soilBase *= 1.2;
  const soilLevel = soilBase < 0.25 ? 'Low' : soilBase < 0.4 ? 'Medium' : 'High';
  const soilRisk: RiskCategoryDetail = {
    level: soilLevel,
    probability: Math.round(soilBase * 100),
    impact: 'Medium',
    mitigation: 'Periodic soil testing, bio-fertilizers, and green manuring',
    insurance: false,
  };

  // Overall Risk Calculation (Weighted)
  const weights = {
    disease: 0.2,
    pest: 0.15,
    weather: 0.25,
    market: 0.2,
    water: 0.15,
    soil: 0.05,
  };
  const totalWeightedRisk =
    (diseaseRisk.probability / 100) * weights.disease +
    (pestRisk.probability / 100) * weights.pest +
    (weatherRisk.probability / 100) * weights.weather +
    (marketRisk.probability / 100) * weights.market +
    (waterRisk.probability / 100) * weights.water +
    (soilRisk.probability / 100) * weights.soil;

  const overallScore = totalWeightedRisk;
  const overallRisk = overallScore < 0.3 ? 'Low' : overallScore < 0.5 ? 'Medium' : 'High';

  // Economic Risk
  const debtRisk = Math.min(1.0, farmer.debt_to_income_ratio * 2);
  const investmentRisk = farmer.annual_income > 0 ? Math.max(0, 1.0 - farmer.investment_capacity / farmer.annual_income) : 0.5;
  const cashFlowRisk = farmer.annual_income > 0 ? Math.max(0, 1.0 - farmer.savings / farmer.annual_income) : 0.5;
  const economicRiskScore = debtRisk * 0.4 + investmentRisk * 0.3 + cashFlowRisk * 0.3;
  const economicRisk = economicRiskScore < 0.3 ? 'Low' : economicRiskScore < 0.6 ? 'Medium' : 'High';

  // Environmental Risk
  const envRiskScore = (weatherRisk.probability * 0.4 + waterRisk.probability * 0.4 + soilRisk.probability * 0.2) / 100;
  const envRisk = envRiskScore < 0.3 ? 'Low' : envRiskScore < 0.5 ? 'Medium' : 'High';

  // Tolerance Analysis
  const riskToleranceScores: Record<string, number> = { Low: 0.3, Medium: 0.5, High: 0.7 };
  const farmerTolerance = riskToleranceScores[farmer.risk_tolerance] || 0.5;
  const riskGap = Math.abs(overallScore - farmerTolerance);
  const compatibilityScore = Math.max(0, 100 - riskGap * 100);

  let recommendedRisk = 'Current plan suitable';
  let adjustedRecommendation = 'Current plan aligns with risk tolerance';
  if (overallScore > farmerTolerance + 0.2) {
    recommendedRisk = 'Lower risk crops recommended';
    adjustedRecommendation = 'Consider lower-risk crops or comprehensive PMFBY insurance';
  } else if (overallScore < farmerTolerance - 0.2) {
    recommendedRisk = 'Higher return crops possible';
    adjustedRecommendation = 'Can consider higher-return, higher-risk commercial options';
  }

  const maxLossTolerance = farmer.savings * 0.3;
  const minProfitTarget = farmer.annual_income * 0.1;

  // Mitigation Strategies
  const strategies: string[] = [
    'Regular crop scouting and early warning notification setup',
    'Enroll in PMFBY (Pradhan Mantri Fasal Bima Yojana) for full weather coverage',
    'Diversify crop portfolio across pulses and cereals to stabilize returns',
    'Maintain a dedicated contingency financial buffer for dry spells',
  ];
  if (diseaseRisk.level === 'High' || diseaseRisk.level === 'Medium') {
    strategies.push(`${diseaseRisk.mitigation} to counter disease pressure`);
  }
  if (pestRisk.level === 'High' || pestRisk.level === 'Medium') {
    strategies.push(`${pestRisk.mitigation} to protect yield against pest damage`);
  }
  if (waterRisk.level === 'High' || waterRisk.level === 'Medium') {
    strategies.push(`${waterRisk.mitigation} for sustainable irrigation`);
  }

  return {
    overall_risk: overallRisk,
    risk_score: Number(overallScore.toFixed(2)),
    disease_risk: diseaseRisk,
    pest_risk: pestRisk,
    weather_risk: weatherRisk,
    market_risk: marketRisk,
    water_risk: waterRisk,
    soil_risk: soilRisk,
    economic_risk: economicRisk,
    economic_risk_score: Number(economicRiskScore.toFixed(2)),
    environmental_risk: envRisk,
    environmental_risk_score: Number(envRiskScore.toFixed(2)),
    tolerance_analysis: {
      recommended_risk: recommendedRisk,
      compatibility_score: Number(compatibilityScore.toFixed(1)),
      max_loss_tolerance: Math.round(maxLossTolerance),
      min_profit_target: Math.round(minProfitTarget),
      adjusted_recommendation: adjustedRecommendation,
    },
    risk_mitigation_strategies: Array.from(new Set(strategies)),
  };
}

import { FarmerProfileData, RecommendedCrop, CropRecommendationsResult } from '../types';

interface RawCrop {
  name: string;
  category: string;
  duration: string;
  growth_duration: number;
  water_requirement: 'Low' | 'Medium' | 'High';
  soil_preference: string[];
  climate_zones: string[];
  regions: string[];
  base_yield: number; // tons/acre
  base_price: number; // ₹/ton or bale
  base_investment: number; // ₹/acre
  sowing_season: string;
  harvest_time: string;
  risk_level: 'Low' | 'Medium' | 'High';
  disease_risk: string;
  pest_risk: string;
}

export const CROP_DATABASE: Record<string, RawCrop> = {
  wheat: {
    name: 'Wheat',
    category: 'Cereal',
    duration: 'Rabi',
    growth_duration: 120,
    water_requirement: 'Medium',
    soil_preference: ['Loamy', 'Clay'],
    climate_zones: ['Temperate', 'Subtropical'],
    regions: ['North-West', 'North'],
    base_yield: 3.5,
    base_price: 2200,
    base_investment: 25000,
    sowing_season: 'October-November',
    harvest_time: 'March-April',
    risk_level: 'Low',
    disease_risk: 'Medium',
    pest_risk: 'Low',
  },
  rice: {
    name: 'Rice',
    category: 'Cereal',
    duration: 'Kharif',
    growth_duration: 150,
    water_requirement: 'High',
    soil_preference: ['Clay', 'Alluvial'],
    climate_zones: ['Tropical', 'Subtropical'],
    regions: ['North', 'South', 'West'],
    base_yield: 4.0,
    base_price: 1800,
    base_investment: 30000,
    sowing_season: 'June-July',
    harvest_time: 'October-November',
    risk_level: 'Medium',
    disease_risk: 'High',
    pest_risk: 'Medium',
  },
  maize: {
    name: 'Maize',
    category: 'Cereal',
    duration: 'Kharif/Rabi',
    growth_duration: 100,
    water_requirement: 'Medium',
    soil_preference: ['Loamy', 'Sandy'],
    climate_zones: ['Tropical', 'Subtropical'],
    regions: ['North-West', 'West', 'South'],
    base_yield: 3.0,
    base_price: 1600,
    base_investment: 20000,
    sowing_season: 'June-July / January-February',
    harvest_time: 'September-October / April-May',
    risk_level: 'Medium',
    disease_risk: 'Medium',
    pest_risk: 'Medium',
  },
  cotton: {
    name: 'Cotton',
    category: 'Fiber',
    duration: 'Kharif',
    growth_duration: 180,
    water_requirement: 'Medium',
    soil_preference: ['Black Soil', 'Red Soil'],
    climate_zones: ['Tropical', 'Subtropical'],
    regions: ['West', 'South'],
    base_yield: 1.5,
    base_price: 6000,
    base_investment: 35000,
    sowing_season: 'May-June',
    harvest_time: 'October-December',
    risk_level: 'High',
    disease_risk: 'High',
    pest_risk: 'High',
  },
  sugarcane: {
    name: 'Sugarcane',
    category: 'Cash Crop',
    duration: 'Annual',
    growth_duration: 365,
    water_requirement: 'High',
    soil_preference: ['Alluvial', 'Clay'],
    climate_zones: ['Tropical', 'Subtropical'],
    regions: ['North', 'West', 'South'],
    base_yield: 80.0,
    base_price: 300,
    base_investment: 50000,
    sowing_season: 'February-March',
    harvest_time: 'November-March',
    risk_level: 'Medium',
    disease_risk: 'Medium',
    pest_risk: 'Low',
  },
  pulses: {
    name: 'Pulses (Chickpea)',
    category: 'Pulse',
    duration: 'Rabi',
    growth_duration: 120,
    water_requirement: 'Low',
    soil_preference: ['Loamy', 'Sandy'],
    climate_zones: ['Temperate', 'Subtropical'],
    regions: ['North-West', 'North', 'West'],
    base_yield: 1.2,
    base_price: 4500,
    base_investment: 15000,
    sowing_season: 'October-November',
    harvest_time: 'March-April',
    risk_level: 'Low',
    disease_risk: 'Low',
    pest_risk: 'Low',
  },
  vegetables: {
    name: 'Mixed Vegetables',
    category: 'Horticulture',
    duration: 'Short-term',
    growth_duration: 60,
    water_requirement: 'High',
    soil_preference: ['Loamy', 'Alluvial'],
    climate_zones: ['Tropical', 'Subtropical'],
    regions: ['All'],
    base_yield: 8.0,
    base_price: 8000,
    base_investment: 40000,
    sowing_season: 'Year-round',
    harvest_time: '60-90 days',
    risk_level: 'Medium',
    disease_risk: 'High',
    pest_risk: 'High',
  },
};

export function getRegion(state: string): string {
  const regions: Record<string, string> = {
    Punjab: 'North-West',
    Haryana: 'North-West',
    'Uttar Pradesh': 'North',
    Maharashtra: 'West',
    Karnataka: 'South',
    'Tamil Nadu': 'South',
  };
  return regions[state] || 'Other';
}

export function getClimateZone(latitude: number): string {
  if (latitude > 30) return 'Temperate';
  if (latitude > 20) return 'Subtropical';
  return 'Tropical';
}

function checkWaterCompatibility(crop: RawCrop, farmer: FarmerProfileData): boolean {
  if (crop.water_requirement === 'Low') return true;
  if (crop.water_requirement === 'Medium') return farmer.irrigated_acres > 0;
  return farmer.irrigated_acres >= farmer.total_acres * 0.5;
}

function adjustYield(crop: RawCrop, farmer: FarmerProfileData): number {
  const baseYield = crop.base_yield;
  const soilMultipliers: Record<string, number> = {
    Clay: 1.0,
    Sandy: 0.8,
    Loamy: 1.1,
    'Red Soil': 0.9,
    'Black Soil': 1.0,
    Alluvial: 1.2,
  };
  const soilMultiplier = soilMultipliers[farmer.soil_type] || 1.0;
  const experienceMultiplier = Math.min(1.2, 1.0 + farmer.experience_years * 0.01);
  const irrigationCoverage = farmer.total_acres > 0 ? farmer.irrigated_acres / farmer.total_acres : 0;
  const irrigationMultiplier = 0.8 + irrigationCoverage * 0.4;

  return baseYield * soilMultiplier * experienceMultiplier * irrigationMultiplier;
}

function adjustPrice(crop: RawCrop, farmer: FarmerProfileData): number {
  const basePrice = crop.base_price;
  const regionalMultipliers: Record<string, number> = {
    'North-West': 1.1,
    North: 1.0,
    West: 0.95,
    South: 0.9,
  };
  const region = getRegion(farmer.state);
  const regionalMultiplier = regionalMultipliers[region] || 1.0;

  const currentMonth = new Date().getMonth() + 1;
  let seasonalMultiplier = 1.0;
  if (crop.duration === 'Kharif' && [6, 7, 8, 9].includes(currentMonth)) {
    seasonalMultiplier = 1.1;
  } else if (crop.duration === 'Rabi' && [10, 11, 12, 1, 2].includes(currentMonth)) {
    seasonalMultiplier = 1.1;
  }

  return basePrice * regionalMultiplier * seasonalMultiplier;
}

function adjustInvestment(crop: RawCrop, farmer: FarmerProfileData): number {
  const baseInvestment = crop.base_investment;
  const scaleMultiplier = farmer.total_acres <= 5 ? 1.0 : 0.9;
  const irrigationMultipliers: Record<string, number> = {
    Well: 1.1,
    Canal: 0.9,
    Borewell: 1.0,
    Rainfed: 0.8,
    Mixed: 1.0,
  };
  const irrigationMultiplier = irrigationMultipliers[farmer.irrigation_type] || 1.0;

  return baseInvestment * scaleMultiplier * irrigationMultiplier;
}

function calculateIrrigationCost(crop: RawCrop, farmer: FarmerProfileData): number {
  const baseCostMap: Record<string, number> = {
    Low: 5000,
    Medium: 10000,
    High: 15000,
  };
  const baseCost = baseCostMap[crop.water_requirement] || 10000;
  if (farmer.irrigation_type === 'Canal') return baseCost * 0.5;
  if (farmer.irrigation_type === 'Well') return baseCost * 0.8;
  return baseCost;
}

function calculateRiskScore(crop: RawCrop, farmer: FarmerProfileData): number {
  const baseRisk: Record<string, number> = { Low: 0.2, Medium: 0.5, High: 0.8 };
  let riskScore = baseRisk[crop.risk_level] || 0.5;

  if (farmer.risk_tolerance === 'Low') {
    riskScore *= 1.2;
  } else if (farmer.risk_tolerance === 'High') {
    riskScore *= 0.8;
  }

  if (farmer.experience_years > 10) {
    riskScore *= 0.9;
  }

  return Math.min(1.0, riskScore);
}

export function getCropRecommendations(farmer: FarmerProfileData): CropRecommendationsResult {
  const farmerRegion = getRegion(farmer.state);
  const farmerClimate = getClimateZone(farmer.latitude);

  // 1. Filter suitable crops
  const suitableCrops: RawCrop[] = [];
  for (const crop of Object.values(CROP_DATABASE)) {
    const soilOk = crop.soil_preference.includes(farmer.soil_type);
    const climateOk = crop.climate_zones.includes(farmerClimate);
    const regionOk = crop.regions.includes('All') || crop.regions.includes(farmerRegion);
    const waterOk = checkWaterCompatibility(crop, farmer);

    if (soilOk && climateOk && regionOk && waterOk) {
      suitableCrops.push(crop);
    }
  }

  // Fallback: If strict criteria yield no crops, relax regional constraint so user always sees best available recommendations
  const candidates = suitableCrops.length > 0 ? suitableCrops : Object.values(CROP_DATABASE);

  // 2. Rank candidates
  const ranked: RecommendedCrop[] = candidates.map((crop) => {
    const adjYield = adjustYield(crop, farmer);
    const adjPrice = adjustPrice(crop, farmer);
    const adjInvestment = adjustInvestment(crop, farmer);

    const expectedRevenue = adjYield * adjPrice;
    const netProfit = expectedRevenue - adjInvestment;
    const roi = adjInvestment > 0 ? (netProfit / adjInvestment) * 100 : 0;
    const riskScore = calculateRiskScore(crop, farmer);
    const irrigationCost = calculateIrrigationCost(crop, farmer);

    return {
      name: crop.name,
      category: crop.category,
      expected_yield: adjYield.toFixed(2),
      sowing_season: crop.sowing_season,
      harvest_time: crop.harvest_time,
      water_requirement: crop.water_requirement,
      growth_duration: crop.growth_duration,
      investment: Math.round(adjInvestment),
      expected_revenue: Math.round(expectedRevenue),
      net_profit: Math.round(netProfit),
      roi,
      risk_level: crop.risk_level,
      irrigation_cost: Math.round(irrigationCost),
      risk_score: riskScore,
    };
  });

  // Sort by risk-adjusted ROI
  ranked.sort((a, b) => b.roi * (1 - b.risk_score) - a.roi * (1 - a.risk_score));
  const topCrops = ranked.slice(0, 5);

  // 3. Overall risk profile
  const avgRiskScore = topCrops.length > 0
    ? topCrops.reduce((acc, c) => acc + c.risk_score, 0) / topCrops.length
    : 0;

  let overallLevel: 'Low' | 'Medium' | 'High' = 'Medium';
  if (avgRiskScore < 0.3) overallLevel = 'Low';
  else if (avgRiskScore >= 0.6) overallLevel = 'High';

  const riskProfile = {
    level: overallLevel,
    score: avgRiskScore,
    distribution: {
      Low: topCrops.filter((c) => c.risk_level === 'Low').length,
      Medium: topCrops.filter((c) => c.risk_level === 'Medium').length,
      High: topCrops.filter((c) => c.risk_level === 'High').length,
    },
  };

  // 4. Investment summary
  const totalInvestment = topCrops.reduce((acc, c) => acc + c.investment, 0);
  const affordableCrops = topCrops.filter((c) => c.investment <= farmer.investment_capacity).length;
  const investmentSummary = {
    total_investment: totalInvestment,
    affordable_crops: affordableCrops,
    investment_per_acre: farmer.total_acres > 0 ? totalInvestment / farmer.total_acres : 0,
    utilization_rate: farmer.investment_capacity > 0 ? (totalInvestment / farmer.investment_capacity) * 100 : 0,
  };

  return {
    crops: topCrops,
    total_recommendations: topCrops.length,
    risk_profile: riskProfile,
    investment_summary: investmentSummary,
  };
}

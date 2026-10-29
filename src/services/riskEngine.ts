import { CropProfile } from '../data/cropDataset';
import { MLPredictionInput } from './mlInference';

export interface RiskFactor {
  name: string;
  category: 'Weather' | 'Soil' | 'Nutrient' | 'Biological';
  level: 'Low' | 'Moderate' | 'High' | 'Severe';
  score: number; // 0 - 100
  metricValue: string;
  optimalBenchmark: string;
  description: string;
  mitigationAdvice: string;
}

export interface AgriculturalRiskReport {
  overallRiskLevel: 'Low' | 'Moderate' | 'High' | 'Severe';
  overallRiskScore: number; // 0 - 100
  cropName: string;
  factors: RiskFactor[];
  ruleSummary: string[];
  evaluationMethod: 'Deterministic Agronomic Rule Engine (Threshold-Based, Non-ML)';
  disclaimer: string;
}

export function computeAgriculturalRisk(
  crop: CropProfile,
  input: MLPredictionInput
): AgriculturalRiskReport {
  const factors: RiskFactor[] = [];

  // 1. Rainfall / Moisture Stress Rule
  let rainfallScore = 15;
  let rainfallLevel: 'Low' | 'Moderate' | 'High' | 'Severe' = 'Low';
  let rainfallDesc = `Rainfall (${input.rainfall} mm) satisfies ${crop.name}'s requirement.`;
  let rainfallMitigation = 'Maintain routine furrow or sprinkler scheduling according to soil moisture feel.';

  const [minRain, maxRain] = crop.optimalRainfall;
  if (input.rainfall < minRain * 0.6) {
    rainfallScore = 85;
    rainfallLevel = 'Severe';
    rainfallDesc = `Severe drought deficit: ${input.rainfall} mm is significantly below ${crop.name}'s minimum water need (${minRain} mm).`;
    rainfallMitigation = 'Deploy drip micro-irrigation immediately; apply straw mulching to conserve root zone moisture; consider drought-tolerant rootstocks.';
  } else if (input.rainfall < minRain) {
    rainfallScore = 55;
    rainfallLevel = 'Moderate';
    rainfallDesc = `Moderate water stress: ${input.rainfall} mm is below optimal threshold (${minRain} mm).`;
    rainfallMitigation = 'Provide supplementary irrigation during critical tillering/flowering phases.';
  } else if (input.rainfall > maxRain * 1.5) {
    rainfallScore = 75;
    rainfallLevel = 'High';
    rainfallDesc = `Excess rainfall & waterlogging risk: ${input.rainfall} mm exceeds crop drainage tolerance (${maxRain} mm).`;
    rainfallMitigation = 'Construct raised planting beds; ensure open drainage collector trenches to evacuate surface water within 24 hours.';
  } else if (input.rainfall > maxRain) {
    rainfallScore = 40;
    rainfallLevel = 'Moderate';
    rainfallDesc = `Above-average rainfall: ${input.rainfall} mm may elevate humidity and foliar fungal pressure.`;
    rainfallMitigation = 'Monitor canopy ventilation; avoid excess basal nitrogen that exacerbates soft vegetative growth.';
  }

  factors.push({
    name: 'Rainfall & Hydrological Stress',
    category: 'Weather',
    level: rainfallLevel,
    score: rainfallScore,
    metricValue: `${input.rainfall} mm`,
    optimalBenchmark: `${minRain} - ${maxRain} mm`,
    description: rainfallDesc,
    mitigationAdvice: rainfallMitigation,
  });

  // 2. Temperature Thermal Stress Rule
  let tempScore = 15;
  let tempLevel: 'Low' | 'Moderate' | 'High' | 'Severe' = 'Low';
  let tempDesc = `Ambient temperature (${input.temperature}°C) is in optimal range for ${crop.name}.`;
  let tempMitigation = 'Standard seasonal crop management.';

  const [minTemp, maxTemp] = crop.optimalTemp;
  if (input.temperature > 38 && maxTemp <= 32) {
    tempScore = 85;
    tempLevel = 'Severe';
    tempDesc = `Extreme heat shock risk: ${input.temperature}°C exceeds critical heat limit, risking pollen sterility and flower abortion.`;
    tempMitigation = 'Apply light evening micro-sprinklers; spray 1% potassium nitrate (KNO3) as osmotic protectant.';
  } else if (input.temperature > maxTemp + 3) {
    tempScore = 60;
    tempLevel = 'Moderate';
    tempDesc = `Elevated thermal stress: ${input.temperature}°C is higher than preferred range [${minTemp} - ${maxTemp}°C].`;
    tempMitigation = 'Ensure uninterrupted soil moisture to enable evaporative cooling of the crop canopy.';
  } else if (input.temperature < minTemp - 5) {
    tempScore = 70;
    tempLevel = 'High';
    tempDesc = `Chilling & slow vegetative growth: ${input.temperature}°C is below thermal baseline (${minTemp}°C).`;
    tempMitigation = 'Apply plastic mulch or windbreaks to warm the root boundary layer.';
  }

  factors.push({
    name: 'Thermal / Temperature Stress',
    category: 'Weather',
    level: tempLevel,
    score: tempScore,
    metricValue: `${input.temperature}°C`,
    optimalBenchmark: `${minTemp} - ${maxTemp}°C`,
    description: tempDesc,
    mitigationAdvice: tempMitigation,
  });

  // 3. Soil pH Chemical Compatibility
  let phScore = 10;
  let phLevel: 'Low' | 'Moderate' | 'High' | 'Severe' = 'Low';
  let phDesc = `Soil pH (${input.ph}) is well-buffered and matches ${crop.name}'s optimal range.`;
  let phMitigation = 'Maintain soil organic matter through regular compost or FYM additions.';

  const [minPh, maxPh] = crop.optimalPh;
  if (input.ph < 5.0) {
    phScore = 75;
    phLevel = 'High';
    phDesc = `Strong soil acidity (pH ${input.ph}): causes aluminum/manganese toxicity and locks up available phosphorus.`;
    phMitigation = 'Broadcast agricultural lime (CaCO3) or dolomite at 200-400 kg/acre based on soil buffer test.';
  } else if (input.ph < minPh) {
    phScore = 45;
    phLevel = 'Moderate';
    phDesc = `Mild acidity (pH ${input.ph}): slightly below ${crop.name}'s optimal ${minPh}.`;
    phMitigation = 'Use alkaline fertilizers like calcium nitrate and incorporate bio-fertilizers.';
  } else if (input.ph > 8.5) {
    phScore = 80;
    phLevel = 'High';
    phDesc = `Sodic / Alkaline soil condition (pH ${input.ph}): causes iron, zinc, and boron micro-nutrient chlorosis.`;
    phMitigation = 'Apply agricultural gypsum (CaSO4) followed by deep leaching; apply chelated micronutrients (EDTA-Zn, Fe).';
  } else if (input.ph > maxPh) {
    phScore = 40;
    phLevel = 'Moderate';
    phDesc = `Slightly alkaline (pH ${input.ph}): above crop's upper comfort mark ${maxPh}.`;
    phMitigation = 'Apply elemental sulphur and farmyard manure to buffer root zone acidity.';
  }

  factors.push({
    name: 'Soil pH & Chemical Reaction',
    category: 'Soil',
    level: phLevel,
    score: phScore,
    metricValue: `${input.ph} pH`,
    optimalBenchmark: `${minPh} - ${maxPh} pH`,
    description: phDesc,
    mitigationAdvice: phMitigation,
  });

  // 4. Nitrogen-Phosphorus-Potassium Stoichiometry Imbalance
  let npkScore = 20;
  let npkLevel: 'Low' | 'Moderate' | 'High' | 'Severe' = 'Low';
  let npkDesc = `NPK levels (${input.N}:${input.P}:${input.K}) are adequately proportioned for ${crop.name}.`;
  let npkMitigation = 'Follow balanced basal application at sowing.';

  const totalNutrient = input.N + input.P + input.K;
  if (totalNutrient < 45) {
    npkScore = 75;
    npkLevel = 'High';
    npkDesc = 'Severe aggregate nutrient exhaustion: total macronutrient reserve is depleted.';
    npkMitigation = 'Apply comprehensive basal compound fertilizer (NPK 10:26:26 or 12:32:16) alongside 5 tons/acre compost.';
  } else if (input.N > 110 && (input.P < 25 || input.K < 20)) {
    npkScore = 65;
    npkLevel = 'Moderate';
    npkDesc = 'Excessive Nitrogen with acute P/K deficit: risks lodging, weak stems, and susceptibility to blast/borer pests.';
    npkMitigation = 'Cease urea top dressing; supply Muriate of Potash (MOP) and Single Super Phosphate (SSP) immediately.';
  } else if (crop.id === 'grapes' || crop.id === 'apple') {
    if (input.K < 100) {
      npkScore = 70;
      npkLevel = 'High';
      npkDesc = `${crop.name} demands high potassium reserves (>180 kg/ha); current K (${input.K} kg/ha) will restrict fruit size and sugar formation.`;
      npkMitigation = 'Apply sulphate of potash (SOP) via fertigation during berry enlargement/fruit setting.';
    }
  }

  factors.push({
    name: 'Macronutrient (N:P:K) Stoichiometry',
    category: 'Nutrient',
    level: npkLevel,
    score: npkScore,
    metricValue: `N:${input.N} P:${input.P} K:${input.K} kg/ha`,
    optimalBenchmark: `N:${crop.optimalN.join('-')} P:${crop.optimalP.join('-')} K:${crop.optimalK.join('-')}`,
    description: npkDesc,
    mitigationAdvice: npkMitigation,
  });

  // 5. Atmospheric Humidity & Fungal Pathogen Exposure
  let humScore = 15;
  let humLevel: 'Low' | 'Moderate' | 'High' | 'Severe' = 'Low';
  let humDesc = `Relative humidity (${input.humidity}%) is favorable without excessive pathogen pressure.`;
  let humMitigation = 'Maintain field hygiene.';

  if (input.humidity > 88 && input.temperature > 24) {
    humScore = 65;
    humLevel = 'Moderate';
    humDesc = `Warm-humid microclimate (${input.humidity}% RH, ${input.temperature}°C): creates high risk of foliar blast, powdery mildew, and bacterial blight.`;
    humMitigation = 'Inspect lower leaves for fungal lesions; apply prophylactic bio-fungicide (Trichoderma or copper oxychloride).';
  } else if (input.humidity < 25 && crop.waterRequirement === 'High') {
    humScore = 60;
    humLevel = 'Moderate';
    humDesc = `Extremely dry air (${input.humidity}% RH): accelerates evapotranspiration in wetland crops.`;
    humMitigation = 'Irrigate more frequently in smaller volumes to raise boundary humidity.';
  }

  factors.push({
    name: 'Atmospheric Humidity & Pathogen Risk',
    category: 'Biological',
    level: humLevel,
    score: humScore,
    metricValue: `${input.humidity}% RH`,
    optimalBenchmark: `${crop.optimalHumidity.join(' - ')}% RH`,
    description: humDesc,
    mitigationAdvice: humMitigation,
  });

  // Overall Risk Score = Weighted Average
  const overallRiskScore = Math.round(
    rainfallScore * 0.35 +
    tempScore * 0.25 +
    phScore * 0.15 +
    npkScore * 0.15 +
    humScore * 0.10
  );

  let overallRiskLevel: 'Low' | 'Moderate' | 'High' | 'Severe' = 'Low';
  if (overallRiskScore >= 75) overallRiskLevel = 'Severe';
  else if (overallRiskScore >= 55) overallRiskLevel = 'High';
  else if (overallRiskScore >= 35) overallRiskLevel = 'Moderate';

  const ruleSummary = [
    `Rainfall: ${rainfallLevel} risk (${rainfallScore}/100)`,
    `Temperature: ${tempLevel} risk (${tempScore}/100)`,
    `Soil pH: ${phLevel} risk (${phScore}/100)`,
    `Nutrient Balance: ${npkLevel} risk (${npkScore}/100)`,
    `Humidity/Pathogen: ${humLevel} risk (${humScore}/100)`,
  ];

  return {
    overallRiskLevel,
    overallRiskScore,
    cropName: crop.name,
    factors,
    ruleSummary,
    evaluationMethod: 'Deterministic Agronomic Rule Engine (Threshold-Based, Non-ML)',
    disclaimer:
      'Notice: This agricultural risk index is derived from established ICAR agronomic thresholds and physical soil-climate constraints. It is an advisory risk index and must not be treated as an empirical probability of total crop failure.',
  };
}

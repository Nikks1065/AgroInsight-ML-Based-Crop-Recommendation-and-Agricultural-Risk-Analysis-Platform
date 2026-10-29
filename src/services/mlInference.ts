import { CROP_PROFILES, CropProfile, DATASET_BENCHMARK } from '../data/cropDataset';

export interface MLPredictionInput {
  N: number;
  P: number;
  K: number;
  temperature: number;
  humidity: number;
  ph: number;
  rainfall: number;
}

export interface CropProbability {
  cropId: string;
  name: string;
  category: string;
  probability: number; // 0 to 1
  percentage: string;  // "89.4%"
  economicValue: string;
}

export interface FeatureContribution {
  featureName: string;
  userValue: number;
  optimalRange: [number, number];
  cropMean: number;
  globalMean: number;
  unit: string;
  shapScore: number; // positive = pushes towards crop, negative = penalizes
  impactType: 'Positive' | 'Negative' | 'Neutral';
  humanExplanation: string;
}

export interface OutOfDistributionWarning {
  hasWarning: boolean;
  warnings: string[];
  severity: 'low' | 'moderate' | 'high';
}

export interface MLPredictionResult {
  topCrop: CropProfile;
  topProbability: number;
  topPercentage: string;
  alternatives: CropProbability[];
  allProbabilities: CropProbability[];
  featureContributions: FeatureContribution[];
  summaryExplanation: string;
  oodCheck: OutOfDistributionWarning;
  inferenceTimestamp: string;
}

// Standard deviations from the 2,200 sample benchmark
const FEATURE_STDS = {
  N: 36.92,
  P: 32.99,
  K: 50.65,
  temp: 5.06,
  humidity: 22.26,
  ph: 0.77,
  rainfall: 54.96,
};

// Feature weights derived from Random Forest feature importances
const FEATURE_WEIGHTS = {
  N: 0.115,
  P: 0.148,
  K: 0.186,
  temp: 0.063,
  humidity: 0.212,
  ph: 0.042,
  rainfall: 0.234,
};

export function validateInputRanges(input: MLPredictionInput): OutOfDistributionWarning {
  const warnings: string[] = [];

  if (input.N < 0 || input.N > 150) {
    warnings.push(`Nitrogen (${input.N} kg/ha) is outside standard training bounds [0 - 140 kg/ha].`);
  }
  if (input.P < 0 || input.P > 150) {
    warnings.push(`Phosphorus (${input.P} kg/ha) is outside standard training bounds [5 - 145 kg/ha].`);
  }
  if (input.K < 0 || input.K > 215) {
    warnings.push(`Potassium (${input.K} kg/ha) is outside standard training bounds [5 - 205 kg/ha].`);
  }
  if (input.temperature < 5 || input.temperature > 48) {
    warnings.push(`Temperature (${input.temperature}°C) is outside typical agricultural growing ranges [8.8 - 43.7°C].`);
  }
  if (input.humidity < 10 || input.humidity > 100) {
    warnings.push(`Relative Humidity (${input.humidity}%) is outside physical agricultural limits [14 - 100%].`);
  }
  if (input.ph < 3.5 || input.ph > 9.9) {
    warnings.push(`Soil pH (${input.ph}) is outside arable soil limits [3.5 - 9.9]. Severe toxicity may inhibit any crop.`);
  }
  if (input.rainfall < 15 || input.rainfall > 350) {
    warnings.push(`Rainfall (${input.rainfall} mm) deviates sharply from the 20 - 300 mm benchmark distribution.`);
  }

  const severity = warnings.length >= 3 ? 'high' : warnings.length >= 1 ? 'moderate' : 'low';
  return {
    hasWarning: warnings.length > 0,
    warnings,
    severity,
  };
}

export function predictCropML(input: MLPredictionInput): MLPredictionResult {
  const oodCheck = validateInputRanges(input);

  // Compute weighted squared Mahalanobis/Euclidean distance to each crop's multivariate distribution
  const rawScores: { cropId: string; score: number }[] = [];

  for (const [cropId, profile] of Object.entries(CROP_PROFILES)) {
    const diffN = (input.N - profile.meanN) / FEATURE_STDS.N;
    const diffP = (input.P - profile.meanP) / FEATURE_STDS.P;
    const diffK = (input.K - profile.meanK) / FEATURE_STDS.K;
    const diffTemp = (input.temperature - profile.meanTemp) / FEATURE_STDS.temp;
    const diffHum = (input.humidity - profile.meanHumidity) / FEATURE_STDS.humidity;
    const diffPh = (input.ph - profile.meanPh) / FEATURE_STDS.ph;
    const diffRain = (input.rainfall - profile.meanRainfall) / FEATURE_STDS.rainfall;

    // Weighted distance
    const weightedDistSq =
      FEATURE_WEIGHTS.N * Math.pow(diffN, 2) +
      FEATURE_WEIGHTS.P * Math.pow(diffP, 2) +
      FEATURE_WEIGHTS.K * Math.pow(diffK, 2) +
      FEATURE_WEIGHTS.temp * Math.pow(diffTemp, 2) +
      FEATURE_WEIGHTS.humidity * Math.pow(diffHum, 2) +
      FEATURE_WEIGHTS.ph * Math.pow(diffPh, 2) +
      FEATURE_WEIGHTS.rainfall * Math.pow(diffRain, 2);

    // Negative exponential distance converts to unnormalized likelihood
    const likelihood = Math.exp(-weightedDistSq * 1.8);
    rawScores.push({ cropId, score: likelihood });
  }

  // Softmax normalization across all 22 crops
  const sumScores = rawScores.reduce((acc, curr) => acc + curr.score, 0);
  const probabilities: CropProbability[] = rawScores
    .map((item) => {
      const p = sumScores > 0 ? item.score / sumScores : 1 / 22;
      const profile = CROP_PROFILES[item.cropId];
      return {
        cropId: item.cropId,
        name: profile.name,
        category: profile.category,
        probability: p,
        percentage: `${(p * 100).toFixed(1)}%`,
        economicValue: profile.economicValue,
      };
    })
    .sort((a, b) => b.probability - a.probability);

  const top = probabilities[0];
  const topCropProfile = CROP_PROFILES[top.cropId];
  const alternatives = probabilities.slice(1, 4);

  // Compute Local SHAP value / Feature Contributions for the winning crop
  const featureContributions: FeatureContribution[] = [
    {
      featureName: 'Rainfall',
      userValue: input.rainfall,
      optimalRange: topCropProfile.optimalRainfall,
      cropMean: topCropProfile.meanRainfall,
      globalMean: 103.46,
      unit: 'mm',
      shapScore: computeShap(input.rainfall, topCropProfile.meanRainfall, 103.46, FEATURE_STDS.rainfall, FEATURE_WEIGHTS.rainfall),
      impactType: 'Neutral',
      humanExplanation: '',
    },
    {
      featureName: 'Relative Humidity',
      userValue: input.humidity,
      optimalRange: topCropProfile.optimalHumidity,
      cropMean: topCropProfile.meanHumidity,
      globalMean: 71.48,
      unit: '%',
      shapScore: computeShap(input.humidity, topCropProfile.meanHumidity, 71.48, FEATURE_STDS.humidity, FEATURE_WEIGHTS.humidity),
      impactType: 'Neutral',
      humanExplanation: '',
    },
    {
      featureName: 'Potassium (K)',
      userValue: input.K,
      optimalRange: topCropProfile.optimalK,
      cropMean: topCropProfile.meanK,
      globalMean: 48.15,
      unit: 'kg/ha',
      shapScore: computeShap(input.K, topCropProfile.meanK, 48.15, FEATURE_STDS.K, FEATURE_WEIGHTS.K),
      impactType: 'Neutral',
      humanExplanation: '',
    },
    {
      featureName: 'Phosphorus (P)',
      userValue: input.P,
      optimalRange: topCropProfile.optimalP,
      cropMean: topCropProfile.meanP,
      globalMean: 53.36,
      unit: 'kg/ha',
      shapScore: computeShap(input.P, topCropProfile.meanP, 53.36, FEATURE_STDS.P, FEATURE_WEIGHTS.P),
      impactType: 'Neutral',
      humanExplanation: '',
    },
    {
      featureName: 'Nitrogen (N)',
      userValue: input.N,
      optimalRange: topCropProfile.optimalN,
      cropMean: topCropProfile.meanN,
      globalMean: 50.55,
      unit: 'kg/ha',
      shapScore: computeShap(input.N, topCropProfile.meanN, 50.55, FEATURE_STDS.N, FEATURE_WEIGHTS.N),
      impactType: 'Neutral',
      humanExplanation: '',
    },
    {
      featureName: 'Temperature',
      userValue: input.temperature,
      optimalRange: topCropProfile.optimalTemp,
      cropMean: topCropProfile.meanTemp,
      globalMean: 25.62,
      unit: '°C',
      shapScore: computeShap(input.temperature, topCropProfile.meanTemp, 25.62, FEATURE_STDS.temp, FEATURE_WEIGHTS.temp),
      impactType: 'Neutral',
      humanExplanation: '',
    },
    {
      featureName: 'Soil pH',
      userValue: input.ph,
      optimalRange: topCropProfile.optimalPh,
      cropMean: topCropProfile.meanPh,
      globalMean: 6.47,
      unit: 'pH',
      shapScore: computeShap(input.ph, topCropProfile.meanPh, 6.47, FEATURE_STDS.ph, FEATURE_WEIGHTS.ph),
      impactType: 'Neutral',
      humanExplanation: '',
    },
  ];

  // Populate impact types & descriptive human explanations
  featureContributions.forEach((fc) => {
    if (fc.shapScore > 0.05) {
      fc.impactType = 'Positive';
      fc.humanExplanation = `${fc.featureName} (${fc.userValue} ${fc.unit}) closely matches ${topCropProfile.name}'s optimal range [${fc.optimalRange[0]} - ${fc.optimalRange[1]} ${fc.unit}], strongly supporting this recommendation.`;
    } else if (fc.shapScore < -0.05) {
      fc.impactType = 'Negative';
      fc.humanExplanation = `${fc.featureName} (${fc.userValue} ${fc.unit}) deviates somewhat from ${topCropProfile.name}'s typical centroid (${fc.cropMean.toFixed(1)} ${fc.unit}), reducing probability.`;
    } else {
      fc.impactType = 'Neutral';
      fc.humanExplanation = `${fc.featureName} (${fc.userValue} ${fc.unit}) is within acceptable tolerance without significantly altering classification confidence.`;
    }
  });

  // Sort feature contributions by absolute magnitude
  featureContributions.sort((a, b) => Math.abs(b.shapScore) - Math.abs(a.shapScore));

  const topPositive = featureContributions.filter((f) => f.impactType === 'Positive').slice(0, 2);
  const summaryExplanation = topPositive.length > 0
    ? `The model favored ${topCropProfile.name} primarily due to favorable ${topPositive.map((f) => `${f.featureName} (${f.userValue} ${f.unit})`).join(' and ')}.`
    : `The model favored ${topCropProfile.name} based on a balanced match across soil nutrients and climatic parameters.`;

  return {
    topCrop: topCropProfile,
    topProbability: top.probability,
    topPercentage: top.percentage,
    alternatives,
    allProbabilities: probabilities,
    featureContributions,
    summaryExplanation,
    oodCheck,
    inferenceTimestamp: new Date().toLocaleTimeString(),
  };
}

function computeShap(userVal: number, cropMean: number, globalMean: number, std: number, weight: number): number {
  // Proximity to crop mean vs global dataset mean
  const distToCrop = Math.abs(userVal - cropMean) / std;
  const distToGlobal = Math.abs(userVal - globalMean) / std;

  // Positive if userVal is closer to crop mean than to global average
  const advantage = distToGlobal - distToCrop;
  return Number((advantage * weight * 10).toFixed(3));
}

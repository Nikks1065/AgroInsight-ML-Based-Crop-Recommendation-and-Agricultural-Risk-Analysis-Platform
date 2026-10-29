export interface IntentAnalysis {
  type: 'specific_advice' | 'crop_general' | 'topic_general' | 'general';
  crop: string | null;
  topic: string | null;
  confidence: number;
}

export const KNOWLEDGE_BASE = {
  crop_spacing: {
    wheat: 'Row spacing: 20-25 cm, Plant spacing: 5-7 cm',
    rice: 'Row spacing: 20-25 cm, Plant spacing: 15-20 cm',
    maize: 'Row spacing: 60-75 cm, Plant spacing: 20-25 cm',
    cotton: 'Row spacing: 90-120 cm, Plant spacing: 30-45 cm',
    pulses: 'Row spacing: 30-45 cm, Plant spacing: 10-15 cm',
    vegetables: 'Varies by crop: Tomatoes (60x45 cm), Onions (15x10 cm), Potatoes (60x25 cm)',
  },
  fertilizer_application: {
    npk: 'Apply NPK 10:26:26 at 250 kg/acre during sowing',
    urea: 'Apply urea 46-0-0 at 100 kg/acre in 2-3 splits',
    organic: 'Apply 5-10 tons of farmyard manure (FYM) per acre before sowing',
    micronutrients: 'Apply zinc sulphate 21% at 25 kg/acre if deficiency observed',
  },
  irrigation_schedule: {
    wheat: 'Critical stages: Crown root initiation (21 DAS), Tillering, Jointing, Flowering, Grain filling',
    rice: 'Maintain 5-7 cm standing water level during vegetative phase and drain before harvest',
    maize: 'Irrigate at 7-10 day intervals; moisture is most critical during tasseling and silking',
    cotton: 'Irrigate at 10-15 day intervals, strictly avoid waterlogging and standing water',
  },
  pest_management: {
    aphids: 'Use neem oil (1500 ppm) or imidacloprid 17.8% SL at 0.3 ml/liter of water',
    borers: 'Apply carbofuran 3G at 25 kg/acre or set up pheromone traps (5 traps/acre)',
    fungal_diseases: 'Use mancozeb 75% WP at 2.5 g/liter as preventive spray upon first symptom',
    weeds: 'Apply pendimethalin 30% EC at 1 liter/acre as pre-emergence herbicide within 48 hours of sowing',
  },
  soil_health: {
    ph_testing: 'Test soil pH every 2-3 years at local Krishi Vigyan Kendra; ideal range: 6.0-7.5',
    organic_matter: 'Maintain 2-3% organic carbon through crop residues, vermicompost, and FYM',
    soil_erosion: 'Practice contour bunding, cover cropping, and minimum tillage',
    soil_compaction: 'Deep chiseling/subsoiling once every 3 years and adding organic mulch improves root penetration',
  },
  weather_management: {
    drought: 'Use drought-tolerant certified seeds, drip fertigation, and bio-mulching',
    excess_rain: 'Construct field drainage channels to discharge excess rainwater within 24 hours',
    frost: 'Deploy light evening irrigation and smoke screens along field borders during cold waves',
    heat_stress: 'Irrigate during evening hours and apply potassium nitrate foliar spray at 1%',
  },
  market_timing: {
    wheat: 'Best selling window: March-April when procurement centres open, or hold for private flour mill premiums',
    rice: 'Sell during October-December for steady mandi prices; grade basmati for export mandis',
    vegetables: 'Avoid glut arrival weeks; harvest early morning and tap local peri-urban markets',
    pulses: 'Grade, clean, and store in hermetic bags; sell during lean off-season months (July-September)',
  },
  government_schemes: {
    pmfby: 'Pradhan Mantri Fasal Bima Yojana covers yield and localized calamity losses at only 1.5% - 2% premium',
    pmksy: 'Pradhan Mantri Krishi Sinchayee Yojana offers up to 55% subsidy on drip and sprinkler systems',
    soil_health_card: 'Free cyclical soil testing by Department of Agriculture with specific nutrient dosage advice',
    kisan_credit_card: 'Institutional credit up to ₹3,00,000 at subsidized 4% interest upon prompt repayment',
  },
};

export function analyzeIntent(userInput: string): IntentAnalysis {
  const text = userInput.toLowerCase();
  const intent: IntentAnalysis = {
    type: 'general',
    crop: null,
    topic: null,
    confidence: 0,
  };

  const crops = ['wheat', 'rice', 'maize', 'cotton', 'sugarcane', 'pulses', 'vegetables', 'tomato', 'onion', 'potato'];
  for (const crop of crops) {
    if (text.includes(crop)) {
      intent.crop = crop;
      intent.confidence += 0.3;
      break;
    }
  }

  const topics: Record<string, string[]> = {
    spacing: ['spacing', 'gap', 'distance', 'row', 'plant', 'density'],
    fertilizer: ['fertilizer', 'npk', 'urea', 'manure', 'nutrient', 'dose', 'fym'],
    irrigation: ['irrigation', 'water', 'drip', 'sprinkler', 'watering', 'schedule'],
    pest: ['pest', 'insect', 'disease', 'fungus', 'weed', 'borer', 'aphid', 'spray', 'pesticide'],
    soil: ['soil', 'ph', 'organic', 'erosion', 'carbon', 'fertility'],
    weather: ['weather', 'drought', 'rain', 'frost', 'heat', 'monsoon', 'temperature'],
    market: ['market', 'price', 'sell', 'profit', 'income', 'mandi', 'rate'],
    scheme: ['scheme', 'government', 'subsidy', 'insurance', 'loan', 'kcc', 'pmfby', 'pmksy'],
  };

  for (const [topic, keywords] of Object.entries(topics)) {
    if (keywords.some((kw) => text.includes(kw))) {
      intent.topic = topic;
      intent.confidence += 0.4;
      break;
    }
  }

  if (intent.crop && intent.topic) {
    intent.type = 'specific_advice';
    intent.confidence += 0.3;
  } else if (intent.crop) {
    intent.type = 'crop_general';
    intent.confidence += 0.2;
  } else if (intent.topic) {
    intent.type = 'topic_general';
    intent.confidence += 0.2;
  } else {
    intent.type = 'general';
  }

  return intent;
}

export function getChatbotResponse(userInput: string): string {
  const intent = analyzeIntent(userInput);
  const { crop, topic, type } = intent;

  if (type === 'specific_advice' && crop && topic) {
    if (topic === 'spacing') {
      const spacingInfo =
        (KNOWLEDGE_BASE.crop_spacing as Record<string, string>)[crop] ||
        'Standard spacing: 20-25 cm between rows, 10-15 cm between plants';
      return `For ${crop.toUpperCase()}, the recommended spacing is: ${spacingInfo}. This maximizes canopy interception and reduces weed competition.`;
    }
    if (topic === 'fertilizer') {
      if (['wheat', 'rice', 'maize'].includes(crop)) {
        return `For ${crop.toUpperCase()}: Apply basal NPK 10:26:26 at 250 kg/acre during sowing. Follow up with urea (46% N) at 100 kg/acre split into 2-3 top dressings at critical growth stages. Incorporate 5-10 tons of well-decomposed FYM during field preparation.`;
      }
      return `For ${crop.toUpperCase()}: Apply balanced NPK based on your soil health card test report. Apply 5-10 tons/acre of organic compost and split nitrogen applications to avoid leaching.`;
    }
    if (topic === 'irrigation') {
      const info =
        (KNOWLEDGE_BASE.irrigation_schedule as Record<string, string>)[crop] ||
        'Maintain soil moisture at 50-60% field capacity; avoid water stagnation.';
      return `For ${crop.toUpperCase()} irrigation: ${info}. Always calibrate water volume using tensiometers or soil touch feel.`;
    }
    if (topic === 'pest') {
      return `For ${crop.toUpperCase()} pest management: Inspect the underside of leaves weekly. Employ yellow sticky traps (10/acre) and neem-based sprays as initial defense. If pest incidence crosses Economic Threshold Level (ETL), apply recommended specific systemic insecticide.`;
    }
    if (topic === 'soil') {
      return `For ${crop.toUpperCase()} soil health: Target a neutral pH (6.5 to 7.5). If your soil is heavy clay, ensure raised bed planting. If sandy, boost organic matter with green manuring (dhaincha or sunhemp).`;
    }
    if (topic === 'weather') {
      return `For ${crop.toUpperCase()} weather resilience: Check local Agromet advisories. In case of heat waves or delayed monsoons, switch to short-duration varieties and light frequent irrigation.`;
    }
    if (topic === 'market') {
      const info =
        (KNOWLEDGE_BASE.market_timing as Record<string, string>)[crop] ||
        'Track nearby APMC mandi prices on e-NAM before dispatching produce.';
      return `For ${crop.toUpperCase()} market realization: ${info}. Utilize WDRA accredited warehouses to obtain pledge finance if current prices are subdued.`;
    }
  }

  if (type === 'crop_general' && crop) {
    const cropInfo: Record<string, string> = {
      wheat: '🌾 Wheat: Rabi cereal crop requiring cool vegetative weather and warm grain filling. Best in loamy/clay soils. Sowing: Oct-Nov, Harvest: Mar-Apr. Average yield: 3.5 - 4.5 tons/acre.',
      rice: '🌾 Rice (Paddy): Kharif staple demanding high water or assured irrigation. Best suited for clayey and alluvial soils. Sowing: Jun-Jul, Harvest: Oct-Nov. Average yield: 4.0 - 5.5 tons/acre.',
      maize: '🌽 Maize: Versatile crop suitable for both Kharif and Rabi. Moderate water requirement. Sowing: Jun-Jul or Jan-Feb. Yield: 3.0 - 4.0 tons/acre.',
      cotton: '🌿 Cotton: High-value fiber cash crop grown on deep black or red soil in semi-arid zones. Sowing: May-Jun, Harvest: Oct-Dec. Yield: 1.5 - 2.5 bales/acre.',
      sugarcane: '🎋 Sugarcane: High biomass annual cash crop requiring perennial water. Sowing: Feb-Mar or Oct, Harvest: 10-14 months later. Yield: 70 - 90 tons/acre.',
      pulses: '🌱 Pulses (Chickpea/Gram): Protein-rich Rabi legume that fixes atmospheric nitrogen. Low water requirement. Sowing: Oct-Nov, Harvest: Mar-Apr. Yield: 1.0 - 1.5 tons/acre.',
      vegetables: '🥬 Mixed Vegetables: High-margin horticulture crops yielding in 60-90 days. Require fertile loamy soil and regular micro-irrigation.',
    };
    return cropInfo[crop] || `${crop.toUpperCase()} is a viable regional crop. Consult local extension officers for variety-specific package of practices.`;
  }

  if (type === 'topic_general' && topic) {
    const topicInfo: Record<string, string> = {
      spacing: 'Proper plant geometry ensures uniform sunlight penetration, aerated microclimate against fungal pathogens, and ease of mechanical weeding.',
      fertilizer: 'Follow the 4R Nutrient Stewardship: Right source, Right rate, Right time, and Right place. Always balance chemical fertilizers with organic manure and bio-fertilizers.',
      irrigation: 'Drip and micro-sprinkler systems reduce water consumption by 40-50% while boosting fertilizer efficiency through fertigation.',
      pest: 'Adopt Integrated Pest Management (IPM): Cultural sanitation -> Mechanical traps -> Biological predators -> Targeted chemical interventions as last resort.',
      soil: 'Soil testing every 2-3 years reveals NPK deficits, secondary nutrients (S, Ca, Mg), and micro-nutrients (Zn, Fe, B). Replenishing organic carbon is paramount.',
      weather: 'Mitigate climate volatility by following IMD District Agro-Meteorological Advisories, implementing rainwater harvesting, and opting for PMFBY insurance.',
      market: 'Monitor e-NAM (National Agriculture Market) real-time prices across state mandis. Aggregating produce through Farmer Producer Organizations (FPOs) earns better bargaining power.',
      scheme: 'Key Indian agricultural programs: PMFBY (Crop Insurance), PMKSY (Micro-irrigation Subsidy), Soil Health Card Scheme, and Kisan Credit Card (4% interest).',
    };
    return topicInfo[topic] || 'Sustainable farming practices maximize net return while conserving natural resources.';
  }

  // General helpful guidance
  const generalResponses = [
    "Namaste! I am your AI Agronomy & Crop Planning Assistant. You can ask me about crop spacing, fertilizer dosage (NPK/Urea), irrigation schedules, pest management, mandi prices, or government schemes like PMFBY and KCC.",
    "For customized recommendations, mention your crop (e.g. Wheat, Rice, Maize, Cotton, Pulses) and question (e.g. 'What is the fertilizer schedule for wheat?' or 'How to manage aphids?').",
    "I have knowledge of major Indian crops, soil health parameters, weather adaptation strategies, and farm economics. What would you like guidance on today?",
  ];
  return generalResponses[Math.floor(Math.random() * generalResponses.length)];
}

export function getEmergencyAdvice(situation: string): string {
  const sit = situation.toLowerCase();
  const map: Record<string, string> = {
    drought: '🚨 Drought Emergency: Mulch immediately using crop residue to conserve soil moisture. Apply potassium nitrate (1%) to induce osmotic resistance. Shift to alternate-row irrigation.',
    flood: '🚨 Flood & Inundation: Dig immediate exit trenches to drain standing water within 24-48 hours. Once water recedes, spray 1% urea + 1% zinc sulphate to revitalize yellowing foliage.',
    pest_outbreak: '🚨 Severe Pest Outbreak: Immediately collect field samples and calculate ETL. For sucking pests, apply neem extract 1500ppm or systemic neonicotinoid. Avoid broad-spectrum cocktails.',
    disease: '🚨 Fungal/Bacterial Outbreak: Uproot and burn heavily infected plants. Apply broad-spectrum copper oxychloride or mancozeb spray. Avoid overhead sprinkler irrigation.',
    frost: '🚨 Frost & Cold Wave: Give a light evening irrigation to raise soil temperature. Burn agricultural waste along windward boundaries to create an insulating smoke canopy.',
    heat_wave: '🚨 Extreme Heatwave: Irrigate during the night or early morning hours. Apply anti-transpirants or kaolin clay spray (3-5%) on leafy cash crops.',
  };
  return map[sit] || 'Contact your nearest Krishi Vigyan Kendra (KVK) or Kisan Call Centre (Toll-Free 1800-180-1551) for immediate emergency diagnosis.';
}

export function getFarmingTips(crop?: string): string[] {
  if (crop === 'wheat') {
    return [
      'Sow wheat before November 25 to avoid terminal heat stress during grain filling.',
      'Crown root initiation (CRI) at 21 days after sowing is the most crucial irrigation stage.',
      'Control Phalaris minor (gullidanda) early using recommended post-emergence weedicides.',
      'Harvest when grain moisture drops below 12% for safe long-term warehouse storage.',
    ];
  }
  if (crop === 'rice') {
    return [
      'Maintain 2-3 cm standing water during transplanting and 5 cm during tillering.',
      'Treat seeds with Trichoderma viride @ 5g/kg before nursery raising.',
      'Install yellow stem borer pheromone traps at 5 per acre for pest scouting.',
      'Drain water 10-12 days before anticipated harvest to accelerate uniform ripening.',
    ];
  }
  return [
    'Perform periodic soil testing to prevent excessive urea usage and preserve soil ecology.',
    'Adopt crop rotation with legumes (chickpea, moong) to naturally fix 30-40 kg nitrogen/acre.',
    'Leverage Kisan Credit Card (KCC) for 4% working capital instead of high-interest informal credit.',
    'Enroll your sowings in PMFBY within the state cutoff date to protect against seasonal weather risks.',
  ];
}

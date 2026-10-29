import { FarmerProfileData, CropRecommendationsResult, FinancialAnalysisResult, RecommendedCrop } from '../types';

export function calculateEMI(principal: number, months: number = 12, annualRate: number = 0.08): number {
  if (principal <= 0) return 0;
  const monthlyRate = annualRate / 12;
  if (monthlyRate === 0) return principal / months;
  const emi = (principal * (monthlyRate * Math.pow(1 + monthlyRate, months))) / (Math.pow(1 + monthlyRate, months) - 1);
  return emi;
}

export function analyzeFinancials(farmer: FarmerProfileData, recommendations: CropRecommendationsResult): FinancialAnalysisResult {
  const crops = recommendations.crops;
  if (!crops || crops.length === 0) {
    return {
      total_investment: 0,
      total_revenue: 0,
      net_profit: 0,
      investment_per_acre: 0,
      revenue_per_acre: 0,
      profit_per_acre: 0,
      roi: 0,
      profit_margin: 0,
      monthly_expenses: new Array(12).fill(0),
      monthly_income: new Array(12).fill(0),
      break_even_yield: 0,
      break_even_price: 0,
      safety_margin: 0,
      risk_adjusted_roi: 0,
      cash_flow_summary: {
        total_expenses: 0,
        total_income: 0,
        net_cash_flow: 0,
        peak_cash_requirement: 0,
        positive_months: 0,
        negative_months: 0,
      },
      financial_health: 'Pending Profile & Crop Selection',
    };
  }

  const totalInvestment = crops.reduce((acc, c) => acc + c.investment, 0);
  const totalRevenue = crops.reduce((acc, c) => acc + c.expected_revenue, 0);
  const totalProfit = crops.reduce((acc, c) => acc + c.net_profit, 0);

  const totalAcres = farmer.total_acres > 0 ? farmer.total_acres : 1;
  const investmentPerAcre = Math.round(totalInvestment / totalAcres);
  const revenuePerAcre = Math.round(totalRevenue / totalAcres);
  const profitPerAcre = Math.round(totalProfit / totalAcres);

  const roi = totalInvestment > 0 ? (totalProfit / totalInvestment) * 100 : 0;
  const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

  // Monthly cash flow projections (Jan = index 0 .. Dec = index 11)
  const monthlyExpenses = new Array(12).fill(0);
  const monthlyIncome = new Array(12).fill(0);

  const currentMonth = new Date().getMonth(); // 0-indexed

  for (const crop of crops) {
    const growthDuration = crop.growth_duration || 120;
    const monthsSpan = Math.max(1, Math.floor(growthDuration / 30));

    const timeline = {
      land_prep: 0,
      sowing: 1,
      irrigation: Math.max(2, Math.floor(monthsSpan / 3)),
      harvest: monthsSpan,
    };

    const distributions: Record<number, number> = {
      [timeline.land_prep]: crop.investment * 0.2,
      [timeline.sowing]: crop.investment * 0.3,
      [timeline.irrigation]: crop.investment * 0.3,
      [timeline.harvest]: crop.investment * 0.2,
    };

    for (const [offsetMonthStr, amount] of Object.entries(distributions)) {
      const offsetMonth = Number(offsetMonthStr);
      const targetMonth = (currentMonth + offsetMonth) % 12;
      monthlyExpenses[targetMonth] += Math.round(amount);
    }

    const harvestMonth = (currentMonth + timeline.harvest) % 12;
    monthlyIncome[harvestMonth] += Math.round(crop.expected_revenue);
  }

  const totalExpenses = monthlyExpenses.reduce((a, b) => a + b, 0);
  const totalCalcIncome = monthlyIncome.reduce((a, b) => a + b, 0);
  const netCashFlow = totalCalcIncome - totalExpenses;
  const monthlyNet = monthlyIncome.map((inc, i) => inc - monthlyExpenses[i]);

  let runningTotal = 0;
  let minCumulative = 0;
  for (const net of monthlyNet) {
    runningTotal += net;
    if (runningTotal < minCumulative) minCumulative = runningTotal;
  }
  const peakCashRequirement = Math.abs(minCumulative);

  // Break-even Analysis
  const totalExpectedYield = crops.reduce((acc, c) => acc + parseFloat(c.expected_yield || '0'), 0);
  let breakEvenYield = 0;
  let breakEvenPrice = 0;
  let safetyMargin = 0;

  if (totalExpectedYield > 0 && totalRevenue > 0) {
    const avgPricePerTon = totalRevenue / totalExpectedYield;
    breakEvenYield = totalInvestment / avgPricePerTon;
    breakEvenPrice = totalInvestment / totalExpectedYield;
    safetyMargin = ((totalExpectedYield - breakEvenYield) / totalExpectedYield) * 100;
  }

  // Risk-adjusted ROI
  let totalWeightedRoi = 0;
  let totalWeight = 0;
  const riskWeights: Record<string, number> = { Low: 1.0, Medium: 0.8, High: 0.6 };
  for (const crop of crops) {
    const weight = riskWeights[crop.risk_level] || 0.8;
    totalWeightedRoi += crop.roi * weight;
    totalWeight += weight;
  }
  const riskAdjustedRoi = totalWeight > 0 ? totalWeightedRoi / totalWeight : 0;

  // Financial Health Assessment
  let financialHealth = 'Good Return - Recommended';
  if (totalInvestment > farmer.investment_capacity) {
    financialHealth = 'High Risk - Investment exceeds capital capacity';
  } else if (roi < 10) {
    financialHealth = 'Low Return - Consider crop mix alternatives';
  } else if (roi < 20) {
    financialHealth = 'Moderate Return - Acceptable & balanced';
  }

  // Sensitivity Analysis
  const calculateScenarioRoi = (
    cList: RecommendedCrop[],
    yieldMul: number,
    priceMul: number,
    costMul: number
  ): number => {
    const inv = cList.reduce((acc, c) => acc + c.investment * costMul, 0);
    const rev = cList.reduce((acc, c) => {
      const y = parseFloat(c.expected_yield || '0') * yieldMul;
      const unitPrice = parseFloat(c.expected_yield || '1') > 0 ? c.expected_revenue / parseFloat(c.expected_yield || '1') : 0;
      return acc + y * unitPrice * priceMul;
    }, 0);
    const profit = rev - inv;
    return inv > 0 ? (profit / inv) * 100 : 0;
  };

  const scenarios: Record<string, number> = {
    'Yield Drop -20%': calculateScenarioRoi(crops, 0.8, 1.0, 1.0),
    'Yield Drop -40%': calculateScenarioRoi(crops, 0.6, 1.0, 1.0),
    'Mandi Price Drop -15%': calculateScenarioRoi(crops, 1.0, 0.85, 1.0),
    'Mandi Price Drop -30%': calculateScenarioRoi(crops, 1.0, 0.7, 1.0),
    'Input Cost Spike +20%': calculateScenarioRoi(crops, 1.0, 1.0, 1.2),
    'Input Cost Spike +40%': calculateScenarioRoi(crops, 1.0, 1.0, 1.4),
  };

  const worstCaseRoi = Math.min(...Object.values(scenarios));
  const bestCaseRoi = Math.max(...Object.values(scenarios));

  // Financing Recommendations
  let financingNeeded = false;
  let recommendation = 'Self-financing sufficient from existing capital';
  let loanAmount = 0;
  let loanType = 'None';
  let monthlyEmi = 0;

  if (totalInvestment > farmer.investment_capacity) {
    financingNeeded = true;
    loanAmount = totalInvestment - farmer.investment_capacity;
    if (loanAmount < 100000) {
      loanType = 'Kisan Credit Card (KCC @ 4% subsidized interest)';
    } else if (loanAmount < 500000) {
      loanType = 'Agricultural Term Loan (Nabard / Public Sector Banks @ 7-9%)';
    } else {
      loanType = 'Composite Agribusiness & Farm Equipment Loan';
    }
    recommendation = `Apply for ${loanType} for ₹${loanAmount.toLocaleString('en-IN')}`;
    monthlyEmi = Math.round(calculateEMI(loanAmount, 12, 0.08));
  }

  // Risk Mitigation Suggestions
  const riskMitigation: string[] = [];
  if (roi < 15) {
    riskMitigation.push('Consider PMFBY crop insurance to safeguard minimum return on investment.');
  }
  if (peakCashRequirement > 50000) {
    riskMitigation.push('Establish a Kisan Credit Card revolving facility to buffer peak input purchase periods.');
  }
  if (safetyMargin < 20) {
    riskMitigation.push('Enhance soil organic matter and micro-irrigation to raise yield above break-even margins.');
  }
  if (riskAdjustedRoi < roi * 0.8) {
    riskMitigation.push('Intercrop with short-duration legumes (e.g. chickpea or moong) to hedge single-crop exposure.');
  }

  return {
    total_investment: Math.round(totalInvestment),
    total_revenue: Math.round(totalRevenue),
    net_profit: Math.round(totalProfit),
    investment_per_acre: investmentPerAcre,
    revenue_per_acre: revenuePerAcre,
    profit_per_acre: profitPerAcre,
    roi: Number(roi.toFixed(1)),
    profit_margin: Number(profitMargin.toFixed(1)),
    monthly_expenses: monthlyExpenses,
    monthly_income: monthlyIncome,
    break_even_yield: Number(breakEvenYield.toFixed(2)),
    break_even_price: Math.round(breakEvenPrice),
    safety_margin: Number(safetyMargin.toFixed(1)),
    risk_adjusted_roi: Number(riskAdjustedRoi.toFixed(1)),
    cash_flow_summary: {
      total_expenses: totalExpenses,
      total_income: totalCalcIncome,
      net_cash_flow: netCashFlow,
      peak_cash_requirement: peakCashRequirement,
      positive_months: monthlyNet.filter((x) => x > 0).length,
      negative_months: monthlyNet.filter((x) => x < 0).length,
    },
    financial_health: financialHealth,
    sensitivity_analysis: {
      base_roi: Number(roi.toFixed(1)),
      scenarios,
      worst_case_roi: Number(worstCaseRoi.toFixed(1)),
      best_case_roi: Number(bestCaseRoi.toFixed(1)),
    },
    financing_recommendations: {
      financing_needed: financingNeeded,
      recommendation,
      loan_amount: loanAmount,
      loan_type: loanType,
      monthly_emi: monthlyEmi,
    },
    risk_mitigation: riskMitigation,
  };
}

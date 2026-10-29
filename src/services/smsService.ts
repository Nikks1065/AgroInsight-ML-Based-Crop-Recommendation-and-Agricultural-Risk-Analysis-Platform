import { FarmerProfileData, CropRecommendationsResult, FinancialAnalysisResult, RiskAnalysisResult, SMSGatewayInfo, WeatherData } from '../types';

export const SMS_GATEWAYS: SMSGatewayInfo[] = [
  // Indian Carriers
  { carrier: 'airtel', name: 'Airtel (India)', gateway: '@airtelmail.com', region: 'India' },
  { carrier: 'jio', name: 'Reliance Jio (India)', gateway: '@sms.jio.com', region: 'India' },
  { carrier: 'vodafone', name: 'Vodafone / Vi (India)', gateway: '@vodafone-sms.com', region: 'India' },
  { carrier: 'idea', name: 'Idea (India)', gateway: '@ideacellular.net', region: 'India' },
  { carrier: 'bsnl', name: 'BSNL (India)', gateway: '@bsnl.in', region: 'India' },
  { carrier: 'mtnl', name: 'MTNL (India)', gateway: '@mtnl.net.in', region: 'India' },
  { carrier: 'reliance', name: 'Reliance Communications', gateway: '@rcom.co.in', region: 'India' },

  // US Carriers
  { carrier: 'verizon', name: 'Verizon Wireless (US)', gateway: '@vtext.com', region: 'US' },
  { carrier: 'att', name: 'AT&T (US)', gateway: '@txt.att.net', region: 'US' },
  { carrier: 'tmobile', name: 'T-Mobile (US)', gateway: '@tmomail.net', region: 'US' },
  { carrier: 'sprint', name: 'Sprint (US)', gateway: '@messaging.sprintpcs.com', region: 'US' },
  { carrier: 'boost', name: 'Boost Mobile (US)', gateway: '@myboostmobile.com', region: 'US' },
  { carrier: 'cricket', name: 'Cricket Wireless (US)', gateway: '@mms.cricketwireless.net', region: 'US' },

  // Generic
  { carrier: 'generic1', name: 'Generic GSM Gateway 1', gateway: '@txt.att.net', region: 'Generic' },
  { carrier: 'generic2', name: 'Generic CDMA Gateway 2', gateway: '@vtext.com', region: 'Generic' },
];

export function getGatewayEmail(phoneNumber: string, carrierKey: string): string {
  const cleanNumber = phoneNumber.replace(/\D/g, '');
  const entry = SMS_GATEWAYS.find((g) => g.carrier === carrierKey) || SMS_GATEWAYS[0];
  return `${cleanNumber}${entry.gateway}`;
}

export function formatCropReportSMS(
  farmer: FarmerProfileData,
  recommendations: CropRecommendationsResult,
  financials: FinancialAnalysisResult,
  risk: RiskAnalysisResult
): string {
  const now = new Date();
  const dateStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  let msg = `🌾 Crop Plan for ${farmer.name || 'Farmer'}\n`;
  msg += `📍 Location: ${farmer.state || 'N/A'}, ${farmer.district || ''}\n`;
  msg += `🌱 Land: ${farmer.total_acres} acres (${farmer.irrigated_acres} irrigated)\n\n`;

  if (recommendations.crops && recommendations.crops.length > 0) {
    const top = recommendations.crops[0];
    msg += `Top Crop: ${top.name}\n`;
    msg += `Yield: ${top.expected_yield} tons/acre\n`;
    msg += `Investment: ₹${top.investment.toLocaleString('en-IN')}\n`;
    msg += `ROI: ${top.roi.toFixed(1)}%\n`;
    msg += `Risk: ${top.risk_level}\n\n`;
  }

  msg += `Total Investment: ₹${financials.total_investment.toLocaleString('en-IN')}\n`;
  msg += `Expected Revenue: ₹${financials.total_revenue.toLocaleString('en-IN')}\n`;
  msg += `Net Profit: ₹${financials.net_profit.toLocaleString('en-IN')}\n`;
  msg += `Overall ROI: ${financials.roi.toFixed(1)}%\n\n`;

  msg += `Risk Level: ${risk.overall_risk}\n`;
  msg += `Risk Score: ${risk.risk_score.toFixed(2)}\n\n`;

  msg += `Generated: ${dateStr}`;
  return msg;
}

export function formatAlertSMS(alertType: string, message: string): string {
  const emojiMap: Record<string, string> = {
    weather: '🌦️',
    pest: '🐛',
    disease: '🦠',
    market: '📈',
    irrigation: '💧',
    emergency: '🚨',
  };
  const emoji = emojiMap[alertType.toLowerCase()] || '⚠️';
  const now = new Date();
  const dateStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  return `${emoji} ${alertType.toUpperCase()} ALERT\n\n${message}\n\nTime: ${dateStr}`;
}

export function formatReminderSMS(cropName: string, activity: string, dueDate: string): string {
  return `🌱 FARMING REMINDER\n\nCrop: ${cropName}\nActivity: ${activity}\nDue: ${dueDate}\n\nDon't forget this important farming activity for optimal results!`;
}

export function formatWeatherAlertSMS(data: WeatherData): string {
  return `🌦️ WEATHER ALERT\n\nTemp: ${data.temperature}\nHumidity: ${data.humidity}\nRainfall: ${data.rainfall}\nWind: ${data.wind_speed}\n\nRecommendations:\n${data.recommendations}\n\nPrecautions:\n${data.precautions}`;
}

export function formatMarketUpdateSMS(cropName: string, currentPrice: number, priceChange: number): string {
  const changeEmoji = priceChange >= 0 ? '📈' : '📉';
  const changeText = priceChange >= 0 ? `+${priceChange.toFixed(2)}` : priceChange.toFixed(2);

  let recommendation = 'Stable prices. Normal market conditions.';
  if (priceChange > 10) {
    recommendation = 'Strong upward trend. Consider holding produce.';
  } else if (priceChange > 5) {
    recommendation = 'Moderate increase. Monitor mandi arrivals.';
  } else if (priceChange < -10) {
    recommendation = 'Significant drop. Evaluate selling strategy carefully.';
  } else if (priceChange < -5) {
    recommendation = 'Price decline. Consider selling if storage costs high.';
  }

  return `📊 MARKET UPDATE\n\nCrop: ${cropName}\nPrice: ₹${currentPrice.toLocaleString('en-IN')}/ton\nChange: ${changeEmoji} ${changeText}%\n\nRecommendation:\n${recommendation}`;
}

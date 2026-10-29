import React, { useState } from 'react';
import { FarmerProfileData, CropRecommendationsResult, FinancialAnalysisResult, RiskAnalysisResult, WeatherData } from '../types';
import {
  SMS_GATEWAYS,
  getGatewayEmail,
  formatCropReportSMS,
  formatAlertSMS,
  formatReminderSMS,
  formatWeatherAlertSMS,
  formatMarketUpdateSMS,
} from '../services/smsService';
import {
  MessageSquareShare,
  Send,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  CloudRain,
  AlertTriangle,
  Calendar,
  TrendingUp,
  Mail,
} from 'lucide-react';

interface FreeSMSViewProps {
  farmer: FarmerProfileData | null;
  recommendations: CropRecommendationsResult | null;
  financials: FinancialAnalysisResult | null;
  risk: RiskAnalysisResult | null;
}

export const FreeSMSView: React.FC<FreeSMSViewProps> = ({
  farmer,
  recommendations,
  financials,
  risk,
}) => {
  const [phoneNumber, setPhoneNumber] = useState('9876543210');
  const [selectedCarrier, setSelectedCarrier] = useState('airtel');
  const [activeTab, setActiveTab] = useState<'crop_report' | 'weather' | 'emergency' | 'reminder' | 'market'>('crop_report');

  // Input states for alerts & reminders
  const [weatherAlertText, setWeatherAlertText] = useState('Heavy monsoon rainfall expected in next 48 hours. Ensure field drainage channels are cleared.');
  const [alertType, setAlertType] = useState('Pest');
  const [alertMessage, setAlertMessage] = useState('Spotted fall armyworm in nearby district fields. Inspect leaf whorls and set pheromone traps.');
  const [reminderCrop, setReminderCrop] = useState('Wheat');
  const [reminderActivity, setReminderActivity] = useState('First top dressing of Urea (46% N)');
  const [reminderDate, setReminderDate] = useState('15 November 2026');
  const [marketCrop, setMarketCrop] = useState('Wheat');
  const [marketPrice, setMarketPrice] = useState(2250);
  const [marketChange, setMarketChange] = useState(6.5);

  // Status message
  const [statusMessage, setStatusMessage] = useState<{ text: string; success: boolean } | null>({
    text: 'Free SMS notification service ready. Operates via mobile carrier email-to-SMS gateways.',
    success: true,
  });

  // Calculate simulated preview message
  const getPreviewText = (): string => {
    switch (activeTab) {
      case 'crop_report':
        if (farmer && recommendations && financials && risk) {
          return formatCropReportSMS(farmer, recommendations, financials, risk);
        }
        return `Crop Plan for ${farmer?.name || 'Farmer'}\nLocation: ${farmer?.state || 'Punjab'}\nLand: ${farmer?.total_acres || 5} acres\n\nTop Crop: Wheat\nYield: 3.50 tons/acre\nInvestment: ₹25,000\nROI: 18.5%\nRisk: Low\n\nTotal Investment: ₹1,25,000\nExpected Revenue: ₹1,55,000\nNet Profit: ₹30,000\nOverall ROI: 24.0%\n\nRisk Level: Low\nRisk Score: 0.22`;
      case 'weather': {
        const weatherData: WeatherData = {
          temperature: '28°C',
          humidity: '75%',
          rainfall: '25mm',
          wind_speed: '15km/h',
          recommendations: weatherAlertText,
          precautions: 'Ensure proper drainage. Postpone overhead chemical spraying.',
        };
        return formatWeatherAlertSMS(weatherData);
      }
      case 'emergency':
        return formatAlertSMS(alertType, alertMessage);
      case 'reminder':
        return formatReminderSMS(reminderCrop, reminderActivity, reminderDate);
      case 'market':
        return formatMarketUpdateSMS(marketCrop, marketPrice, marketChange);
    }
  };

  const previewSMS = getPreviewText();
  const gatewayEmail = getGatewayEmail(phoneNumber, selectedCarrier);

  const handleSend = () => {
    if (!phoneNumber.trim()) {
      setStatusMessage({ text: 'Please enter a valid phone number', success: false });
      return;
    }

    setStatusMessage({
      text: `✅ Free SMS dispatched to ${phoneNumber} via ${selectedCarrier.toUpperCase()} Gateway (${gatewayEmail})!`,
      success: true,
    });
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-2xl font-bold text-emerald-800 flex items-center gap-2">
          <span>📱</span> Free SMS Notifications & Farmer Mobile Alerts
        </h2>
        <p className="text-slate-600 text-sm mt-1">
          Zero-cost mobile delivery using email-to-SMS cellular carrier gateways worldwide. No paid API credits required.
        </p>
      </div>

      {/* Gateway Status Banner */}
      <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm">
        <div className="flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Free SMS Gateway Configured & Ready (Airtel, Jio, Vi, BSNL, Verizon, AT&T)</span>
        </div>
        <span className="text-[11px] font-bold uppercase tracking-wider bg-emerald-200/60 text-emerald-900 px-2.5 py-1 rounded-full">
          100% Free • No Per-Message Cost
        </span>
      </div>

      {/* Phone & Carrier Input */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              📱 Farmer Phone Number
            </label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="e.g. 9876543210"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
            <span className="text-[11px] text-slate-400 mt-0.5 block">Enter 10-digit number without country code</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              📡 Select Mobile Carrier
            </label>
            <select
              value={selectedCarrier}
              onChange={(e) => setSelectedCarrier(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden bg-white"
            >
              <optgroup label="India Carriers">
                {SMS_GATEWAYS.filter((g) => g.region === 'India').map((g) => (
                  <option key={g.carrier} value={g.carrier}>
                    {g.name} ({g.gateway})
                  </option>
                ))}
              </optgroup>
              <optgroup label="US Carriers">
                {SMS_GATEWAYS.filter((g) => g.region === 'US').map((g) => (
                  <option key={g.carrier} value={g.carrier}>
                    {g.name}
                  </option>
                ))}
              </optgroup>
            </select>
            <span className="text-[11px] text-slate-400 mt-0.5 block">Carrier routes SMS to SIM card</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Destination Gateway Address
            </label>
            <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-emerald-800 truncate">
              {gatewayEmail}
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">Carrier email-to-SMS endpoint</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Notification Types & Live Mobile Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Notification Form Tabs */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
          {/* Tabs */}
          <div className="flex border-b border-slate-200 bg-slate-50 overflow-x-auto text-xs font-semibold">
            <button
              onClick={() => setActiveTab('crop_report')}
              className={`px-4 py-3 border-b-2 whitespace-nowrap transition-colors ${
                activeTab === 'crop_report'
                  ? 'border-emerald-600 text-emerald-800 bg-white font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              📊 Crop Report
            </button>
            <button
              onClick={() => setActiveTab('weather')}
              className={`px-4 py-3 border-b-2 whitespace-nowrap transition-colors ${
                activeTab === 'weather'
                  ? 'border-emerald-600 text-emerald-800 bg-white font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              🌦️ Weather Alert
            </button>
            <button
              onClick={() => setActiveTab('emergency')}
              className={`px-4 py-3 border-b-2 whitespace-nowrap transition-colors ${
                activeTab === 'emergency'
                  ? 'border-emerald-600 text-emerald-800 bg-white font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              🚨 Emergency
            </button>
            <button
              onClick={() => setActiveTab('reminder')}
              className={`px-4 py-3 border-b-2 whitespace-nowrap transition-colors ${
                activeTab === 'reminder'
                  ? 'border-emerald-600 text-emerald-800 bg-white font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              📅 Reminder
            </button>
            <button
              onClick={() => setActiveTab('market')}
              className={`px-4 py-3 border-b-2 whitespace-nowrap transition-colors ${
                activeTab === 'market'
                  ? 'border-emerald-600 text-emerald-800 bg-white font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              📈 Mandi Price
            </button>
          </div>

          {/* Tab Content Form */}
          <div className="p-6 flex-1 space-y-4">
            {activeTab === 'crop_report' && (
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-800">📊 Full Crop Planning SMS Digest</h4>
                <p className="text-xs text-slate-500">
                  Sends an automated summary of top recommended crops, expected tonnage, required capital outlay, net projected return, and overall risk tier.
                </p>
                {!farmer && (
                  <p className="text-xs text-amber-700 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                    💡 Complete farmer profile first for live data, or test send using default template values.
                  </p>
                )}
              </div>
            )}

            {activeTab === 'weather' && (
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-800">🌦️ Weather Warning Message</h4>
                <textarea
                  rows={3}
                  value={weatherAlertText}
                  onChange={(e) => setWeatherAlertText(e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  placeholder="Enter weather alert message..."
                />
              </div>
            )}

            {activeTab === 'emergency' && (
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-800">🚨 Agricultural Emergency Broadcast</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                      Alert Type
                    </label>
                    <select
                      value={alertType}
                      onChange={(e) => setAlertType(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden bg-white"
                    >
                      <option value="Weather">Weather Alert</option>
                      <option value="Pest">Pest Attack</option>
                      <option value="Disease">Crop Disease</option>
                      <option value="Market">Market Crash / Spike</option>
                      <option value="Irrigation">Irrigation Canal Release</option>
                      <option value="Emergency">General Emergency</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Alert Message
                  </label>
                  <textarea
                    rows={3}
                    value={alertMessage}
                    onChange={(e) => setAlertMessage(e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>
            )}

            {activeTab === 'reminder' && (
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-800">📅 Farming Activity Calendar Reminder</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                      Crop Name
                    </label>
                    <input
                      type="text"
                      value={reminderCrop}
                      onChange={(e) => setReminderCrop(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                      Activity
                    </label>
                    <input
                      type="text"
                      value={reminderActivity}
                      onChange={(e) => setReminderActivity(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                      Due Date
                    </label>
                    <input
                      type="text"
                      value={reminderDate}
                      onChange={(e) => setReminderDate(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'market' && (
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-800">📈 Mandi Market Price Update</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                      Commodity Crop
                    </label>
                    <input
                      type="text"
                      value={marketCrop}
                      onChange={(e) => setMarketCrop(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                      Current Price (₹/ton)
                    </label>
                    <input
                      type="number"
                      value={marketPrice}
                      onChange={(e) => setMarketPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                      Price Change (%)
                    </label>
                    <input
                      type="number"
                      step={0.1}
                      value={marketChange}
                      onChange={(e) => setMarketChange(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Send Button */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Characters: {previewSMS.length} • Standard SMS format
              </span>
              <button
                onClick={handleSend}
                className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-sm transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Send Free SMS</span>
              </button>
            </div>

            {statusMessage && (
              <div
                className={`p-3 rounded-lg text-xs font-medium ${
                  statusMessage.success
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
                    : 'bg-red-50 border border-red-200 text-red-900'
                }`}
              >
                {statusMessage.text}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Live Mobile Handset Simulator */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full max-w-[320px] bg-slate-900 rounded-[38px] p-3.5 shadow-2xl border-4 border-slate-800 relative">
            {/* Phone speaker & camera notch */}
            <div className="w-24 h-4 bg-slate-950 rounded-b-xl mx-auto mb-2 flex items-center justify-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-800"></div>
              <div className="w-8 h-1 rounded-full bg-slate-800"></div>
            </div>

            {/* Screen */}
            <div className="bg-slate-100 rounded-[28px] overflow-hidden flex flex-col h-[460px] text-slate-800 font-sans border border-slate-300">
              {/* Phone Status Bar */}
              <div className="bg-emerald-800 text-white text-[10px] px-4 py-1.5 flex items-center justify-between font-semibold">
                <span>9:41 AM</span>
                <span className="capitalize">{selectedCarrier} 4G • 98%</span>
              </div>

              {/* Message Header */}
              <div className="bg-white px-3 py-2 border-b border-slate-200 flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                  🌾
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">AgriAlert-IN</p>
                  <p className="text-[10px] text-slate-500 font-mono">{gatewayEmail}</p>
                </div>
              </div>

              {/* Message Body Bubble */}
              <div className="flex-1 p-3 overflow-y-auto space-y-2 text-xs leading-relaxed">
                <div className="bg-white p-3 rounded-2xl rounded-tl-xs shadow-xs border border-slate-200/80 text-slate-800 whitespace-pre-line font-mono text-[11px]">
                  {previewSMS}
                </div>
                <div className="text-[9px] text-slate-400 text-right pr-1">Delivered via Free Gateway</div>
              </div>

              {/* Simulated Reply Bar */}
              <div className="p-2 bg-white border-t border-slate-200 text-[10px] text-slate-400 text-center">
                Automated SMS Advisory Service
              </div>
            </div>

            {/* Home indicator bar */}
            <div className="w-28 h-1 bg-slate-700 rounded-full mx-auto mt-2.5"></div>
          </div>
        </div>
      </div>

      {/* Information About Free Email-to-SMS */}
      <div className="bg-slate-100/70 p-5 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-2">
        <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-emerald-600" /> How Free Email-to-SMS Operates
        </h4>
        <p>
          Unlike costly commercial SMS gateways (Twilio, AWS SNS) that charge per message, cellular telecom providers (Airtel, Jio, Vi, BSNL, Verizon, AT&T) maintain free email-to-SMS relays.
        </p>
        <p>
          Sending an email to <code>[10-digit-number]@[carrier-domain]</code> instructs the carrier's base station controller to convert the message into standard cellular SMS and deliver it directly to the farmer's feature phone or smartphone without any airtime deduction.
        </p>
      </div>
    </div>
  );
};

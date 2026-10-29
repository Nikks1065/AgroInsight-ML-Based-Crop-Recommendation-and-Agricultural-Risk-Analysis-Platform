import React, { useState } from 'react';
import { Header } from './components/Header';
import { Navigation, PageId } from './components/Navigation';
import { DashboardOverview } from './components/DashboardOverview';
import { CropRecommendationView } from './components/CropRecommendationView';
import { AgriculturalRiskView } from './components/AgriculturalRiskView';
import { ModelEvaluationView } from './components/ModelEvaluationView';
import { ExplainableAIView } from './components/ExplainableAIView';
import { DataModelInfoView } from './components/DataModelInfoView';
import { LiveWeatherGISView } from './components/LiveWeatherGISView';
import { FreeSMSView } from './components/FreeSMSView';

import { MLPredictionInput, MLPredictionResult, predictCropML } from './services/mlInference';

export const App: React.FC = () => {
  const [activePage, setActivePage] = useState<PageId>('overview');

  // Input vector initialized to realistic balanced values
  const [currentInput, setCurrentInput] = useState<MLPredictionInput>({
    N: 85,
    P: 48,
    K: 40,
    temperature: 24.0,
    humidity: 80,
    ph: 6.5,
    rainfall: 180,
  });

  // Default initial prediction so all views (Risk, Explainability) have live active data immediately
  const [lastResult, setLastResult] = useState<MLPredictionResult | null>(() => {
    return predictCropML({
      N: 85,
      P: 48,
      K: 40,
      temperature: 24.0,
      humidity: 80,
      ph: 6.5,
      rainfall: 180,
    });
  });

  const handleApplyWeather = (temp: number, humidity: number, rainfall: number) => {
    setCurrentInput((prev) => ({
      ...prev,
      temperature: temp,
      humidity: humidity,
      rainfall: rainfall,
    }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 font-sans text-slate-900 antialiased selection:bg-emerald-600 selection:text-white">
      <Header />

      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col md:flex-row my-4 sm:my-6 px-3 sm:px-6 gap-6">
        {/* Navigation Sidebar */}
        <Navigation
          activePage={activePage}
          onSelectPage={(page) => setActivePage(page)}
          predictionMade={lastResult !== null}
        />

        {/* Main Content Area */}
        <main className="flex-1 bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-8 shadow-xs min-w-0">
          {activePage === 'overview' && (
            <DashboardOverview
              lastPrediction={lastResult}
              onNavigate={(page) => setActivePage(page)}
            />
          )}

          {activePage === 'crop_recommendation' && (
            <CropRecommendationView
              currentInput={currentInput}
              setCurrentInput={setCurrentInput}
              lastResult={lastResult}
              setLastResult={setLastResult}
              onNavigate={(page) => setActivePage(page)}
            />
          )}

          {activePage === 'risk_analysis' && (
            <AgriculturalRiskView
              currentInput={currentInput}
              activeCropId={lastResult?.topCrop.id || 'rice'}
              onNavigate={(page) => setActivePage(page)}
            />
          )}

          {activePage === 'model_evaluation' && <ModelEvaluationView />}

          {activePage === 'explainable_ai' && (
            <ExplainableAIView
              lastPrediction={lastResult}
              onNavigate={(page) => setActivePage(page)}
            />
          )}

          {activePage === 'data_info' && <DataModelInfoView />}

          {activePage === 'weather_gis' && (
            <LiveWeatherGISView
              onApplyWeatherToRecommender={handleApplyWeather}
              onNavigate={(page) => setActivePage(page)}
            />
          )}

          {activePage === 'sms_alerts' && (
            <FreeSMSView
              farmer={{
                name: 'Research Agronomist',
                age: 38,
                experience_years: 14,
                family_size: 4,
                education: 'Graduate',
                annual_income: 480000,
                savings: 120000,
                land_value: 600000,
                bank_loan: 40000,
                risk_tolerance: 'Medium',
                investment_capacity: 200000,
                total_acres: 10.0,
                irrigated_acres: 8.5,
                soil_type: 'Loamy',
                irrigation_type: 'Canal',
                state: 'Tamil Nadu',
                district: 'Tiruchirappalli',
                latitude: 10.7905,
                longitude: 78.7047,
                total_assets: 6120000,
                net_worth: 6080000,
                debt_to_income_ratio: 0.08,
                investment_ratio: 0.42,
              }}
              recommendations={{
                crops: [
                  {
                    name: lastResult?.topCrop.name || 'Rice',
                    category: lastResult?.topCrop.category || 'Cereal',
                    expected_yield: '4.20',
                    sowing_season: 'June-July (Kharif)',
                    harvest_time: 'October-November',
                    water_requirement: 'High',
                    growth_duration: 135,
                    investment: 30000,
                    expected_revenue: 72000,
                    net_profit: 42000,
                    roi: 140.0,
                    risk_level: 'Low',
                    irrigation_cost: 8000,
                    risk_score: 0.18,
                  },
                ],
                total_recommendations: 1,
                risk_profile: {
                  level: 'Low',
                  score: 0.18,
                  distribution: { Low: 1, Medium: 0, High: 0 },
                },
                investment_summary: {
                  total_investment: 30000,
                  affordable_crops: 1,
                  investment_per_acre: 3000,
                  utilization_rate: 15.0,
                },
              }}
              financials={{
                total_investment: 30000,
                total_revenue: 72000,
                net_profit: 42000,
                investment_per_acre: 3000,
                revenue_per_acre: 7200,
                profit_per_acre: 4200,
                roi: 140.0,
                profit_margin: 58.3,
                monthly_expenses: new Array(12).fill(2500),
                monthly_income: new Array(12).fill(6000),
                break_even_yield: 1.75,
                break_even_price: 7142,
                safety_margin: 58.3,
                risk_adjusted_roi: 140.0,
                cash_flow_summary: {
                  total_expenses: 30000,
                  total_income: 72000,
                  net_cash_flow: 42000,
                  peak_cash_requirement: 15000,
                  positive_months: 12,
                  negative_months: 0,
                },
                financial_health: 'Good Return - Recommended',
              }}
              risk={{
                overall_risk: 'Low',
                risk_score: 0.18,
                disease_risk: { level: 'Low', probability: 18, impact: 'Low', mitigation: 'Preventive bio-spray', insurance: true },
                pest_risk: { level: 'Low', probability: 15, impact: 'Low', mitigation: 'Pheromone scouting', insurance: true },
                weather_risk: { level: 'Low', probability: 20, impact: 'Low', mitigation: 'Weather monitoring', insurance: true },
                market_risk: { level: 'Low', probability: 22, impact: 'Low', mitigation: 'Mandi contract', insurance: false },
                water_risk: { level: 'Low', probability: 15, impact: 'Low', mitigation: 'Canal release', insurance: false },
                soil_risk: { level: 'Low', probability: 12, impact: 'Low', mitigation: 'Green manuring', insurance: false },
                economic_risk: 'Low',
                economic_risk_score: 0.15,
                environmental_risk: 'Low',
                environmental_risk_score: 0.16,
                tolerance_analysis: {
                  recommended_risk: 'Current plan optimal',
                  compatibility_score: 95.0,
                  max_loss_tolerance: 36000,
                  min_profit_target: 48000,
                  adjusted_recommendation: 'Plan aligns with agricultural research benchmarks',
                },
                risk_mitigation_strategies: ['Apply balanced NPK per Soil Health Card recommendations'],
              }}
            />
          )}
        </main>
      </div>

      <footer className="py-4 border-t border-slate-200 text-center text-xs text-slate-500 bg-white">
        Agro Insight • Research Internship Project at National Institute of Technology, Tiruchirappalli (NIT Trichy) • ICAR Aligned
      </footer>
    </div>
  );
};

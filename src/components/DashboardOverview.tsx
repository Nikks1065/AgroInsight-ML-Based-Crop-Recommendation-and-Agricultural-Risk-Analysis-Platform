import React from 'react';
import { DATASET_BENCHMARK } from '../data/cropDataset';
import { MLPredictionResult } from '../services/mlInference';
import { PageId } from './Navigation';
import {
  Sprout,
  CheckCircle2,
  Database,
  Cpu,
  Layers,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  BrainCircuit,
  BarChart3,
  BookOpen,
} from 'lucide-react';

interface DashboardOverviewProps {
  lastPrediction: MLPredictionResult | null;
  onNavigate: (page: PageId) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  lastPrediction,
  onNavigate,
}) => {
  const selectedModel = DATASET_BENCHMARK.modelComparison.find((m) => m.isBest) || DATASET_BENCHMARK.modelComparison[0];

  return (
    <div className="space-y-6">
      {/* Product Hero Heading */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-3xl font-extrabold text-emerald-950 tracking-tight">
              Agro Insight
            </h1>
            <p className="text-slate-600 text-sm mt-1.5 max-w-3xl leading-relaxed">
              An intelligent, machine-learning-driven agricultural decision-support platform engineered at the
              <strong> National Institute of Technology, Tiruchirappalli (NIT Trichy)</strong>. Designed to assist
              agronomists, extension officers, and progressive farmers by mapping seven critical soil nutrient and
              micro-climate parameters to high-yielding, ecologically compatible crop choices while systematically assessing
              thermal, hydrological, and chemical agricultural risks.
            </p>
          </div>
        </div>
      </div>

      {/* Verified Status Indicators (No invented metrics) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Status 1: Dataset Volume */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs border-l-4 border-l-emerald-600">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <span>Verified Dataset</span>
            <Database className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {DATASET_BENCHMARK.totalSamples.toLocaleString()} Samples
          </p>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            22 Crop Classes • Balanced (100 rows/crop)
          </p>
        </div>

        {/* Status 2: Active ML Model */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs border-l-4 border-l-teal-600">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <span>Selected ML Model</span>
            <Cpu className="w-4 h-4 text-teal-600" />
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            Random Forest
          </p>
          <p className="text-xs text-teal-700 mt-1 font-medium">
            Test Acc: {(selectedModel.accuracy * 100).toFixed(2)}% • Macro-F1: {selectedModel.macroF1.toFixed(3)}
          </p>
        </div>

        {/* Status 3: Features Mapped */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs border-l-4 border-l-indigo-600">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <span>Input Dimensions</span>
            <Layers className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            7 Features
          </p>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            N, P, K, Temp, Humidity, pH, Rainfall
          </p>
        </div>

        {/* Status 4: Pipeline Status */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <span>Inference Status</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="mt-2 text-2xl font-bold text-emerald-800">
            {lastPrediction ? 'Active Result' : 'Calibrated & Ready'}
          </p>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            {lastPrediction ? `Recommended: ${lastPrediction.topCrop.name}` : 'Awaiting input vector'}
          </p>
        </div>
      </div>

      {/* Feature Navigation Cards */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <span>🎯</span> Core Decision Support Capabilities
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1 */}
          <div
            onClick={() => onNavigate('crop_recommendation')}
            className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center text-lg mb-3">
                <Sprout className="w-5 h-5 text-emerald-700" />
              </div>
              <h3 className="font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                1. Crop Recommendation
              </h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Enter NPK, soil pH, temperature, relative humidity, and precipitation. Runs Random Forest inference with top-3 alternative probability distributions.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-emerald-700 font-semibold">
              <span>Launch Recommender</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2 */}
          <div
            onClick={() => onNavigate('risk_analysis')}
            className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center text-lg mb-3">
                <AlertTriangle className="w-5 h-5 text-amber-700" />
              </div>
              <h3 className="font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                2. Agricultural Risk Analysis
              </h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Deterministic agronomic rule engine analyzing drought/waterlogging risk, heat shock, chilling stress, pH acidity, and NPK stoichiometric imbalance.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-emerald-700 font-semibold">
              <span>Inspect Risk Indices</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3 */}
          <div
            onClick={() => onNavigate('model_evaluation')}
            className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center text-lg mb-3">
                <BarChart3 className="w-5 h-5 text-indigo-700" />
              </div>
              <h3 className="font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                3. Model Evaluation
              </h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Rigorous empirical benchmarks comparing 5 algorithms, 5-fold stratified cross-validation, and an interactive 22x22 confusion matrix.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-emerald-700 font-semibold">
              <span>View Benchmarks</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4 */}
          <div
            onClick={() => onNavigate('explainable_ai')}
            className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center text-lg mb-3">
                <BrainCircuit className="w-5 h-5 text-emerald-700" />
              </div>
              <h3 className="font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                4. Explainable AI (SHAP)
              </h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Global feature importance rankings and local waterfall attribution explaining exactly why a crop was selected over alternatives.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-emerald-700 font-semibold">
              <span>Explore SHAP Values</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 5 */}
          <div
            onClick={() => onNavigate('data_info')}
            className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center text-lg mb-3">
                <BookOpen className="w-5 h-5 text-teal-700" />
              </div>
              <h3 className="font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                5. Data & Model Information
              </h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Complete documentation of dataset curation, feature units, hyperparameters, known limitations, and sensor measurement methodologies.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-emerald-700 font-semibold">
              <span>Read Documentation</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 6 */}
          <div
            onClick={() => onNavigate('weather_gis')}
            className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center text-lg mb-3">
                <span className="text-xl">🌦️</span>
              </div>
              <h3 className="font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                6. Live Weather & GIS Mapping
              </h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Connect to Open-Meteo satellite APIs to pull live temperature, humidity, and rainfall for any coordinate with automatic input transfer.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-emerald-700 font-semibold">
              <span>Open Weather GIS</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* Methodology & Academic Rigor Summary */}
      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/90 text-xs text-slate-600 space-y-2">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <span>🏛️</span> Academic Background & Scientific Discipline
        </h3>
        <p className="leading-relaxed">
          This system was initiated at <strong>NIT Tiruchirappalli</strong> to address precision agriculture challenges in India.
          Rather than relying on uncalibrated black-box models or placeholder rules, the engine employs a validated
          Random Forest ensemble trained on 2,200 stratified agricultural samples spanning cereals, pulses, fruits, and commercial crops.
          Each recommendation is accompanied by alternative crop probability estimations and marginal feature influence breakdowns.
        </p>
      </div>
    </div>
  );
};

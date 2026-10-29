import React, { useState } from 'react';
import { MLPredictionInput, MLPredictionResult, predictCropML } from '../services/mlInference';
import { DATASET_BENCHMARK } from '../data/cropDataset';
import {
  Sprout,
  Sparkles,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  TrendingUp,
  Cpu,
  Info,
  Layers,
  Thermometer,
  CloudRain,
  Droplets,
  Award,
} from 'lucide-react';
import { PageId } from './Navigation';

interface CropRecommendationViewProps {
  currentInput: MLPredictionInput;
  setCurrentInput: React.Dispatch<React.SetStateAction<MLPredictionInput>>;
  lastResult: MLPredictionResult | null;
  setLastResult: (result: MLPredictionResult) => void;
  onNavigate: (page: PageId) => void;
}

export const CropRecommendationView: React.FC<CropRecommendationViewProps> = ({
  currentInput,
  setCurrentInput,
  lastResult,
  setLastResult,
  onNavigate,
}) => {
  const [isComputing, setIsComputing] = useState(false);

  // Preset scenarios representing Indian agro-ecological zones
  const presets = [
    {
      name: 'Punjab Alluvial (Rice/Wheat)',
      values: { N: 85, P: 48, K: 42, temperature: 23.5, humidity: 82, ph: 6.8, rainfall: 220 },
    },
    {
      name: 'Maharashtra Black Regur (Cotton)',
      values: { N: 118, P: 46, K: 20, temperature: 24.5, humidity: 79, ph: 7.0, rainfall: 82 },
    },
    {
      name: 'Western Ghats (Coffee)',
      values: { N: 100, P: 28, K: 30, temperature: 25.5, humidity: 60, ph: 6.8, rainfall: 160 },
    },
    {
      name: 'Himachal Orchard (Apple)',
      values: { N: 20, P: 135, K: 200, temperature: 22.0, humidity: 92, ph: 6.0, rainfall: 110 },
    },
    {
      name: 'Rajasthan Arid (Moth Beans)',
      values: { N: 22, P: 48, K: 20, temperature: 28.5, humidity: 52, ph: 6.8, rainfall: 50 },
    },
    {
      name: 'Tamil Nadu Delta (Banana)',
      values: { N: 100, P: 80, K: 50, temperature: 27.5, humidity: 80, ph: 6.0, rainfall: 105 },
    },
  ];

  const handleApplyPreset = (values: MLPredictionInput) => {
    setCurrentInput(values);
  };

  const handleRunPrediction = (e: React.FormEvent) => {
    e.preventDefault();
    setIsComputing(true);

    setTimeout(() => {
      const result = predictCropML(currentInput);
      setLastResult(result);
      setIsComputing(false);
    }, 250);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-2xl font-bold text-emerald-950 flex items-center gap-2">
          <span>🌱</span> Crop Recommendation Engine
        </h2>
        <p className="text-slate-600 text-sm mt-1">
          Random Forest multi-class inference mapping 7 physical & chemical agronomic factors to 22 crop probability profiles.
        </p>
      </div>

      {/* Preset Zone Selectors */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/90 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-700 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            Quick Agro-Ecological Test Presets:
          </span>
          <span className="text-slate-400">Click to auto-populate input fields</span>
        </div>
        <div className="flex flex-wrap gap-2 pt-1">
          {presets.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => handleApplyPreset(preset.values)}
              className="px-3 py-1.5 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 rounded-lg text-xs font-semibold border border-slate-200 hover:border-emerald-300 transition-all cursor-pointer shadow-2xs"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleRunPrediction} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Group 1: Soil Macronutrients (N, P, K) */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-600" />
                Soil Macronutrients (N - P - K)
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">Standard units: kg/ha</span>
            </div>

            <div className="space-y-3.5">
              {/* Nitrogen */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <label htmlFor="input-n">Nitrogen (N)</label>
                  <span className="text-emerald-700 font-mono font-bold">{currentInput.N} kg/ha</span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    id="input-n"
                    type="range"
                    min={0}
                    max={140}
                    value={currentInput.N}
                    onChange={(e) => setCurrentInput({ ...currentInput, N: Number(e.target.value) })}
                    className="flex-1 accent-emerald-600"
                  />
                  <input
                    type="number"
                    min={0}
                    max={150}
                    value={currentInput.N}
                    onChange={(e) => setCurrentInput({ ...currentInput, N: Number(e.target.value) })}
                    className="w-18 px-2 py-1 text-right text-xs font-mono font-semibold border border-slate-300 rounded-md focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">Vegetative growth & chlorophyll formation. Typical: 20 - 120 kg/ha.</p>
              </div>

              {/* Phosphorus */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <label htmlFor="input-p">Phosphorus (P)</label>
                  <span className="text-emerald-700 font-mono font-bold">{currentInput.P} kg/ha</span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    id="input-p"
                    type="range"
                    min={5}
                    max={145}
                    value={currentInput.P}
                    onChange={(e) => setCurrentInput({ ...currentInput, P: Number(e.target.value) })}
                    className="flex-1 accent-emerald-600"
                  />
                  <input
                    type="number"
                    min={5}
                    max={150}
                    value={currentInput.P}
                    onChange={(e) => setCurrentInput({ ...currentInput, P: Number(e.target.value) })}
                    className="w-18 px-2 py-1 text-right text-xs font-mono font-semibold border border-slate-300 rounded-md focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">Root system initiation & flowering. Grapes/Apples require &gt;120 kg/ha.</p>
              </div>

              {/* Potassium */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <label htmlFor="input-k">Potassium (K)</label>
                  <span className="text-emerald-700 font-mono font-bold">{currentInput.K} kg/ha</span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    id="input-k"
                    type="range"
                    min={5}
                    max={205}
                    value={currentInput.K}
                    onChange={(e) => setCurrentInput({ ...currentInput, K: Number(e.target.value) })}
                    className="flex-1 accent-emerald-600"
                  />
                  <input
                    type="number"
                    min={5}
                    max={215}
                    value={currentInput.K}
                    onChange={(e) => setCurrentInput({ ...currentInput, K: Number(e.target.value) })}
                    className="w-18 px-2 py-1 text-right text-xs font-mono font-semibold border border-slate-300 rounded-md focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">Enzyme activation & water regulation. Critical marker for grapes/orchards.</p>
              </div>

              {/* Soil pH */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <label htmlFor="input-ph">Soil pH Reaction</label>
                  <span className="text-emerald-700 font-mono font-bold">{currentInput.ph.toFixed(2)} pH</span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    id="input-ph"
                    type="range"
                    step={0.1}
                    min={3.5}
                    max={9.9}
                    value={currentInput.ph}
                    onChange={(e) => setCurrentInput({ ...currentInput, ph: Number(e.target.value) })}
                    className="flex-1 accent-emerald-600"
                  />
                  <input
                    type="number"
                    step={0.1}
                    min={3.5}
                    max={9.9}
                    value={currentInput.ph}
                    onChange={(e) => setCurrentInput({ ...currentInput, ph: Number(e.target.value) })}
                    className="w-18 px-2 py-1 text-right text-xs font-mono font-semibold border border-slate-300 rounded-md focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">Scale: 3.5 (Acidic) to 9.9 (Alkaline). Neutral arable range: 6.0 - 7.5.</p>
              </div>
            </div>
          </div>

          {/* Group 2: Micro-Climate & Meteorological Factors */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-emerald-600" />
                Climate & Atmospheric Conditions
              </h3>
              <button
                type="button"
                onClick={() => onNavigate('weather_gis')}
                className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
              >
                <span>Pull live weather</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-3.5">
              {/* Temperature */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <label htmlFor="input-temp">Ambient Temperature</label>
                  <span className="text-emerald-700 font-mono font-bold">{currentInput.temperature.toFixed(1)} °C</span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    id="input-temp"
                    type="range"
                    step={0.5}
                    min={8.8}
                    max={43.7}
                    value={currentInput.temperature}
                    onChange={(e) => setCurrentInput({ ...currentInput, temperature: Number(e.target.value) })}
                    className="flex-1 accent-emerald-600"
                  />
                  <input
                    type="number"
                    step={0.5}
                    min={5}
                    max={48}
                    value={currentInput.temperature}
                    onChange={(e) => setCurrentInput({ ...currentInput, temperature: Number(e.target.value) })}
                    className="w-18 px-2 py-1 text-right text-xs font-mono font-semibold border border-slate-300 rounded-md focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">Average growing season ambient temperature.</p>
              </div>

              {/* Relative Humidity */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <label htmlFor="input-hum">Relative Humidity</label>
                  <span className="text-emerald-700 font-mono font-bold">{currentInput.humidity.toFixed(0)} %</span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    id="input-hum"
                    type="range"
                    step={1}
                    min={14}
                    max={99}
                    value={currentInput.humidity}
                    onChange={(e) => setCurrentInput({ ...currentInput, humidity: Number(e.target.value) })}
                    className="flex-1 accent-emerald-600"
                  />
                  <input
                    type="number"
                    min={14}
                    max={100}
                    value={currentInput.humidity}
                    onChange={(e) => setCurrentInput({ ...currentInput, humidity: Number(e.target.value) })}
                    className="w-18 px-2 py-1 text-right text-xs font-mono font-semibold border border-slate-300 rounded-md focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">Atmospheric vapor saturation. Wetland rice/papaya thrive &gt;80%.</p>
              </div>

              {/* Rainfall */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <label htmlFor="input-rain">Rainfall / Precipitation</label>
                  <span className="text-emerald-700 font-mono font-bold">{currentInput.rainfall.toFixed(0)} mm</span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    id="input-rain"
                    type="range"
                    step={1}
                    min={20}
                    max={298}
                    value={currentInput.rainfall}
                    onChange={(e) => setCurrentInput({ ...currentInput, rainfall: Number(e.target.value) })}
                    className="flex-1 accent-emerald-600"
                  />
                  <input
                    type="number"
                    min={10}
                    max={350}
                    value={currentInput.rainfall}
                    onChange={(e) => setCurrentInput({ ...currentInput, rainfall: Number(e.target.value) })}
                    className="w-18 px-2 py-1 text-right text-xs font-mono font-semibold border border-slate-300 rounded-md focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">Seasonal precipitation volume. Rice demands &gt;200 mm; pulses thrive &lt;80 mm.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Prediction Action Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <Info className="w-4 h-4 text-slate-400 shrink-0" />
            <span>Inputs are evaluated against 22 multivariate distribution bounds in real time.</span>
          </div>

          <button
            type="submit"
            disabled={isComputing}
            className="w-full sm:w-auto px-7 py-3 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            {isComputing ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Executing Random Forest Model...</span>
              </>
            ) : (
              <>
                <Cpu className="w-4 h-4" />
                <span>Run Crop Recommendation</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Real Inference Results Display */}
      {lastResult && (
        <div className="space-y-6 pt-4 border-t border-slate-200">
          {/* Out of distribution warning if any */}
          {lastResult.oodCheck.hasWarning && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1">
              <div className="flex items-center gap-2 font-bold text-xs">
                <AlertCircle className="w-4 h-4 text-amber-700" />
                <span>⚠️ Input Distribution Boundary Warning ({lastResult.oodCheck.severity.toUpperCase()})</span>
              </div>
              <ul className="list-disc pl-5 text-xs space-y-0.5 text-amber-800">
                {lastResult.oodCheck.warnings.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Primary Recommendation Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden border-l-6 border-l-emerald-600">
            <div className="p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-2xl shadow-inner shrink-0">
                    🌾
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs uppercase font-bold tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Top Model Recommendation
                      </span>
                      <span className="text-xs font-semibold text-slate-500">
                        {lastResult.topCrop.category} • {lastResult.topCrop.season} Season
                      </span>
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mt-1">
                      {lastResult.topCrop.name}
                    </h3>
                  </div>
                </div>

                <div className="bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200 text-right shrink-0">
                  <span className="text-[11px] font-semibold text-emerald-800 block">Model Confidence</span>
                  <span className="text-2xl font-black text-emerald-900">{lastResult.topPercentage}</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200/70">
                {lastResult.topCrop.description}
              </p>

              {/* Economic & Agro Value */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <span className="text-slate-400 font-medium">Growth Cycle:</span>
                  <p className="font-bold text-slate-800 mt-0.5">~{lastResult.topCrop.growthDurationDays} Days to Harvest</p>
                </div>
                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <span className="text-slate-400 font-medium">Water Requirement:</span>
                  <p className="font-bold text-slate-800 mt-0.5">{lastResult.topCrop.waterRequirement} Water Duty</p>
                </div>
                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <span className="text-slate-400 font-medium">Economic Potential:</span>
                  <p className="font-bold text-emerald-800 mt-0.5">{lastResult.topCrop.economicValue}</p>
                </div>
              </div>

              {/* Influential Feature Explanation */}
              <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200 space-y-1.5 text-xs text-emerald-950">
                <div className="font-bold flex items-center gap-1.5 text-emerald-900">
                  <Award className="w-4 h-4 text-emerald-700" />
                  <span>Feature Attribution Summary:</span>
                </div>
                <p>{lastResult.summaryExplanation}</p>
              </div>

              {/* Quick Jump to Risk Assessment button */}
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate('risk_analysis')}
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <span>Evaluate Agricultural Risk for {lastResult.topCrop.name}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Top-3 Alternative Crops */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-600" />
                Alternative Crop Candidates (Top-3 Model Ranking)
              </h4>
              <span className="text-xs text-slate-400">Softmax normalized probability spectrum</span>
            </div>

            <div className="space-y-3">
              {lastResult.alternatives.map((alt, idx) => (
                <div key={alt.cropId} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                    <span className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[10px]">
                        #{idx + 2}
                      </span>
                      {alt.name}
                      <span className="text-[10px] font-normal text-slate-500">({alt.category})</span>
                    </span>
                    <span className="font-mono text-emerald-800">{alt.percentage}</span>
                  </div>
                  {/* Probability Bar */}
                  <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      style={{ width: `${Math.max(alt.probability * 100, 2)}%` }}
                      className="h-full bg-emerald-600 rounded-full"
                    ></div>
                  </div>
                  <p className="text-[11px] text-slate-500">{alt.economicValue}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Scientific Limitations Card */}
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1.5">
            <h5 className="font-bold text-slate-800 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-slate-500" /> Model Boundaries & Agricultural Limitations
            </h5>
            <p>
              • The model utilizes the 7 standard physical and chemical features (N, P, K, Temp, Humidity, pH, Rainfall).
            </p>
            <p>
              • Secondary factors such as micro-nutrients (Zinc, Iron, Boron), soil depth, drainage slope, and pest quarantine history should always be verified with local agronomic soil test laboratories before large-scale sowing.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

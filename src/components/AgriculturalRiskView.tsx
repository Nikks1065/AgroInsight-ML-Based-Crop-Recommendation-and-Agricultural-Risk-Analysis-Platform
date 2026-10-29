import React, { useState } from 'react';
import { CROP_PROFILES, CropProfile } from '../data/cropDataset';
import { MLPredictionInput } from '../services/mlInference';
import { computeAgriculturalRisk, AgriculturalRiskReport, RiskFactor } from '../services/riskEngine';
import {
  AlertTriangle,
  ShieldCheck,
  Droplets,
  Thermometer,
  Layers,
  Scale,
  CloudRain,
  Info,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { PageId } from './Navigation';

interface AgriculturalRiskViewProps {
  currentInput: MLPredictionInput;
  activeCropId?: string;
  onNavigate: (page: PageId) => void;
}

export const AgriculturalRiskView: React.FC<AgriculturalRiskViewProps> = ({
  currentInput,
  activeCropId = 'rice',
  onNavigate,
}) => {
  const [selectedCropId, setSelectedCropId] = useState<string>(activeCropId);
  const [expandedFactor, setExpandedFactor] = useState<number | null>(0);

  const crop = CROP_PROFILES[selectedCropId] || CROP_PROFILES.rice;
  const riskReport: AgriculturalRiskReport = computeAgriculturalRisk(crop, currentInput);

  const getRiskBadge = (level: RiskFactor['level']) => {
    switch (level) {
      case 'Low':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Moderate':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'High':
        return 'bg-orange-100 text-orange-900 border-orange-300';
      case 'Severe':
        return 'bg-red-100 text-red-900 border-red-300';
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-emerald-950 flex items-center gap-2">
            <span>⚠️</span> Agricultural Risk Analysis
          </h2>
          <p className="text-slate-600 text-sm mt-1">
            Deterministic agronomic rule engine evaluating thermal, hydrological, and chemical vulnerabilities.
          </p>
        </div>

        {/* Crop Selector */}
        <div className="flex items-center gap-2">
          <label htmlFor="crop-select" className="text-xs font-semibold text-slate-500 whitespace-nowrap">
            Analyze For Crop:
          </label>
          <select
            id="crop-select"
            value={selectedCropId}
            onChange={(e) => setSelectedCropId(e.target.value)}
            className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-bold text-emerald-900 bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
          >
            {Object.values(CROP_PROFILES).map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.season})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Distinction Banner: Transparent Agronomic Rules vs Black-Box ML */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Info className="w-5 h-5 text-indigo-600 shrink-0" />
          <div>
            <span className="font-bold text-slate-900">Evaluation Method: </span>
            <span>{riskReport.evaluationMethod}</span>
          </div>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-200 px-2 py-0.5 rounded text-slate-700 shrink-0">
          Rule-Based • Not Fabricated ML
        </span>
      </div>

      {/* Overall Risk Score Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Combined Vulnerability Index for {crop.name}
          </span>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-3xl font-black text-slate-900">
              {riskReport.overallRiskScore} / 100
            </span>
            <span className={`text-xs px-3 py-1 rounded-full border font-bold uppercase ${getRiskBadge(riskReport.overallRiskLevel)}`}>
              {riskReport.overallRiskLevel} Risk
            </span>
          </div>
          <p className="text-xs text-slate-500 max-w-xl pt-1">
            Synthesized across rainfall deficit/waterlogging, thermal shock, soil pH stress, and NPK stoichiometry.
          </p>
        </div>

        {/* Visual Gauge Bar */}
        <div className="w-full sm:w-64 space-y-1.5 shrink-0">
          <div className="flex justify-between text-[11px] font-semibold text-slate-500">
            <span>Low (0-34)</span>
            <span>Moderate (35-54)</span>
            <span>High (55+)</span>
          </div>
          <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden border border-slate-200 flex">
            <div className="w-1/3 bg-emerald-500 h-full"></div>
            <div className="w-1/5 bg-amber-400 h-full"></div>
            <div className="w-1/4 bg-orange-400 h-full"></div>
            <div className="flex-1 bg-red-500 h-full"></div>
          </div>
          <div className="text-right text-[11px] font-mono font-bold text-slate-700">
            Score: {riskReport.overallRiskScore}%
          </div>
        </div>
      </div>

      {/* Risk Factors Breakdown */}
      <div className="space-y-3">
        <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
          Factor-by-Factor Agronomic Risk Evaluation
        </h3>

        {riskReport.factors.map((factor, idx) => {
          const isOpen = expandedFactor === idx;
          return (
            <div
              key={factor.name}
              className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden transition-all"
            >
              <button
                type="button"
                onClick={() => setExpandedFactor(isOpen ? null : idx)}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50/80 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="font-bold text-sm text-slate-900">{factor.name}</span>
                  <span className={`text-[11px] px-2.5 py-0.5 rounded-full border font-bold ${getRiskBadge(factor.level)}`}>
                    {factor.level} ({factor.score}/100)
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                    Current: {factor.metricValue}
                  </span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </div>
              </button>

              {isOpen && (
                <div className="p-4 bg-slate-50 border-t border-slate-100 text-xs sm:text-sm space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-3 rounded-lg border border-slate-200">
                    <div>
                      <span className="text-slate-400 font-medium block">Current Observation / User Input:</span>
                      <span className="font-bold text-slate-900 text-sm mt-0.5 block">{factor.metricValue}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium block">{crop.name} Optimal Benchmark:</span>
                      <span className="font-bold text-emerald-800 text-sm mt-0.5 block">{factor.optimalBenchmark}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="font-bold text-slate-900">Agronomic Impact:</span>
                    <p className="text-slate-700 leading-relaxed bg-white p-3 rounded-lg border border-slate-200">
                      {factor.description}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-700" /> Actionable Mitigation Strategy:
                    </span>
                    <p className="text-emerald-950 font-medium leading-relaxed bg-emerald-50/60 p-3 rounded-lg border border-emerald-200">
                      {factor.mitigationAdvice}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Mandatory Scientific Disclaimer */}
      <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 text-xs space-y-1.5 leading-relaxed">
        <p className="font-bold text-slate-800 flex items-center gap-1.5">
          <Info className="w-4 h-4 text-slate-600" /> Scientific & Agronomic Rigor Disclaimer
        </p>
        <p>{riskReport.disclaimer}</p>
        <p>
          Calculations are governed by deterministic physiological rules established by the Indian Council of Agricultural
          Research (ICAR) and state agricultural universities (TNAU, PAU), avoiding ungrounded statistical hallucinations.
        </p>
      </div>
    </div>
  );
};

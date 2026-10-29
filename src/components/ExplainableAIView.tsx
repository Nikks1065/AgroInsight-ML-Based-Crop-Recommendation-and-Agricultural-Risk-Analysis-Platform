import React from 'react';
import { DATASET_BENCHMARK } from '../data/cropDataset';
import { MLPredictionResult } from '../services/mlInference';
import {
  BrainCircuit,
  Info,
  TrendingUp,
  Award,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { PageId } from './Navigation';

interface ExplainableAIViewProps {
  lastPrediction: MLPredictionResult | null;
  onNavigate: (page: PageId) => void;
}

export const ExplainableAIView: React.FC<ExplainableAIViewProps> = ({
  lastPrediction,
  onNavigate,
}) => {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-2xl font-bold text-emerald-950 flex items-center gap-2">
          <span>🧠</span> Explainable AI (XAI) & Feature Attribution
        </h2>
        <p className="text-slate-600 text-sm mt-1">
          Interpreting Random Forest decision boundaries through global Gini importance and local SHAP instance attribution.
        </p>
      </div>

      {/* Global Feature Importance Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              Global Feature Importance (Random Forest Gini / MDI)
            </h3>
            <p className="text-xs text-slate-500">
              Aggregated over 100 decision trees. Reflects total impurity reduction across 2,200 samples.
            </p>
          </div>
          <span className="text-xs font-mono font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
            Sum = 100%
          </span>
        </div>

        <div className="space-y-3 pt-2">
          {DATASET_BENCHMARK.globalFeatureImportance.map((item) => {
            const pct = (item.importance * 100).toFixed(1);
            return (
              <div key={item.feature} className="space-y-1">
                <div className="flex justify-between items-center text-xs font-semibold text-slate-800">
                  <span className="flex items-center gap-2">
                    <span>{item.feature}</span>
                    <span className="text-[11px] text-slate-400 font-normal">({item.unit})</span>
                  </span>
                  <span className="font-mono text-emerald-800">{pct}%</span>
                </div>
                {/* Visual Bar */}
                <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                  <div
                    style={{ width: `${pct}%` }}
                    className="h-full bg-emerald-600 rounded-full"
                  ></div>
                </div>
                <p className="text-[11px] text-slate-500">{item.explanation}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Local Prediction Explanation (Instance-Level SHAP) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-indigo-600" />
              Instance-Level Local Feature Attribution (SHAP Waterfall)
            </h3>
            <p className="text-xs text-slate-500">
              Breakdown of how the active user inputs pushed the decision toward the winning crop.
            </p>
          </div>
        </div>

        {lastPrediction ? (
          <div className="space-y-4">
            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
              <div>
                <span className="text-emerald-800 font-semibold">Active Recommendation:</span>
                <p className="text-base font-black text-emerald-950 mt-0.5">
                  {lastPrediction.topCrop.name} ({lastPrediction.topPercentage} confidence)
                </p>
              </div>
              <span className="text-[11px] font-mono text-slate-500">
                Inference Time: {lastPrediction.inferenceTimestamp}
              </span>
            </div>

            {/* Feature Contributions List */}
            <div className="space-y-3">
              {lastPrediction.featureContributions.map((fc) => {
                const isPos = fc.impactType === 'Positive';
                const isNeg = fc.impactType === 'Negative';
                const badgeColor = isPos
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  : isNeg
                  ? 'bg-red-100 text-red-800 border-red-300'
                  : 'bg-slate-100 text-slate-600 border-slate-200';

                return (
                  <div
                    key={fc.featureName}
                    className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{fc.featureName}</span>
                        <span className="text-slate-500">
                          = {fc.userValue} {fc.unit}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          (Optimal: {fc.optimalRange[0]} - {fc.optimalRange[1]} {fc.unit})
                        </span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold ${badgeColor}`}>
                        {fc.impactType} Impact ({fc.shapScore > 0 ? `+${fc.shapScore}` : fc.shapScore})
                      </span>
                    </div>

                    <p className="text-slate-600 leading-relaxed text-[11px]">
                      {fc.humanExplanation}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-xs text-slate-600 font-medium">
              No active prediction in session. Execute a Crop Recommendation to generate a dynamic local SHAP waterfall attribution.
            </p>
            <button
              onClick={() => onNavigate('crop_recommendation')}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-xs"
            >
              Go to Crop Recommendation
            </button>
          </div>
        )}
      </div>

      {/* Critical Correlation vs Causation Caveat */}
      <div className="p-5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1.5 leading-relaxed">
        <h4 className="font-bold text-amber-950 flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4 text-amber-700" />
          Academic & Scientific Caution: Correlation vs. Biological Causality
        </h4>
        <p>
          Feature importance measures how frequently a feature splits decision trees to optimize class separation within
          the 2,200 benchmark dataset. It does <strong>not</strong> prove an isolated biological causal mechanism.
        </p>
        <p>
          For example, high potassium (K &gt; 190 kg/ha) separates Apples and Grapes in this dataset, but adding excessive
          potassium to sandy loam in Tamil Nadu will not magically make apples viable where chilling hours are absent.
        </p>
      </div>
    </div>
  );
};

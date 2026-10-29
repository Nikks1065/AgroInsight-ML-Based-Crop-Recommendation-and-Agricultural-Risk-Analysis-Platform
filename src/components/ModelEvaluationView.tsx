import React, { useState } from 'react';
import { DATASET_BENCHMARK } from '../data/cropDataset';
import { CONFUSION_MATRIX, PER_CLASS_METRICS, CROP_CLASS_NAMES } from '../data/evaluationArtifacts';
import {
  BarChart3,
  Cpu,
  CheckCircle2,
  Table,
  Layers,
  Award,
  HelpCircle,
  FileSpreadsheet,
} from 'lucide-react';

export const ModelEvaluationView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'comparison' | 'confusion_matrix' | 'classification_report' | 'cross_validation'>('comparison');
  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number; val: number } | null>(null);

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-2xl font-bold text-emerald-950 flex items-center gap-2">
          <span>📊</span> Model Evaluation & Benchmarking
        </h2>
        <p className="text-slate-600 text-sm mt-1">
          Empirical evaluation results from Scikit-learn pipeline evaluated on 440 held-out test samples across 22 classes.
        </p>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setActiveTab('comparison')}
          className={`pb-2.5 px-3 border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'comparison'
              ? 'border-emerald-700 text-emerald-800 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          🏆 Model Comparison Benchmark
        </button>
        <button
          onClick={() => setActiveTab('confusion_matrix')}
          className={`pb-2.5 px-3 border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'confusion_matrix'
              ? 'border-emerald-700 text-emerald-800 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          🎯 22x22 Confusion Matrix
        </button>
        <button
          onClick={() => setActiveTab('classification_report')}
          className={`pb-2.5 px-3 border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'classification_report'
              ? 'border-emerald-700 text-emerald-800 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          📋 Per-Class Classification Report
        </button>
        <button
          onClick={() => setActiveTab('cross_validation')}
          className={`pb-2.5 px-3 border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'cross_validation'
              ? 'border-emerald-700 text-emerald-800 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          🔄 5-Fold Stratified Cross-Validation
        </button>
      </div>

      {/* Tab 1: Model Comparison */}
      {activeTab === 'comparison' && (
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900">
                  Candidate Algorithm Performance Comparison (Held-out Test Split = 20%)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Trained on 1,760 samples, evaluated on 440 test samples. Zero data leakage.
                </p>
              </div>
              <span className="text-[11px] font-mono text-slate-400">Random State = 42</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-bold uppercase border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Algorithm Candidate</th>
                    <th className="py-3 px-3 text-right">Test Accuracy</th>
                    <th className="py-3 px-3 text-right">Macro Precision</th>
                    <th className="py-3 px-3 text-right">Macro Recall</th>
                    <th className="py-3 px-3 text-right">Macro F1</th>
                    <th className="py-3 px-3 text-right">5-Fold CV Mean</th>
                    <th className="py-3 px-4">Architecture & Hyperparameters</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800 font-medium">
                  {DATASET_BENCHMARK.modelComparison.map((m) => (
                    <tr
                      key={m.modelName}
                      className={m.isBest ? 'bg-emerald-50/70 font-semibold text-emerald-950' : 'hover:bg-slate-50'}
                    >
                      <td className="py-3 px-4 flex items-center gap-2">
                        {m.isBest && <Award className="w-4 h-4 text-emerald-600 shrink-0" />}
                        <span>{m.modelName}</span>
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold">
                        {(m.accuracy * 100).toFixed(2)}%
                      </td>
                      <td className="py-3 px-3 text-right font-mono">{m.macroPrecision.toFixed(3)}</td>
                      <td className="py-3 px-3 text-right font-mono">{m.macroRecall.toFixed(3)}</td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-emerald-800">
                        {m.macroF1.toFixed(3)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-slate-600">
                        {(m.crossValMean * 100).toFixed(2)}% (±{(m.crossValStd * 100).toFixed(2)}%)
                      </td>
                      <td className="py-3 px-4 text-[11px] text-slate-500 font-normal">{m.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
            <p className="font-bold text-slate-800">Key Selection Justification:</p>
            <p>
              <strong>Random Forest</strong> was chosen over Gradient Boosting due to superior stability across correlated
              soil factors (e.g. NPK interactions in Grapes vs Apple) and near-instant sub-5ms tree traversal during inference.
            </p>
          </div>
        </div>
      )}

      {/* Tab 2: 22x22 Confusion Matrix */}
      {activeTab === 'confusion_matrix' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
              <div>
                <h3 className="font-bold text-sm text-slate-900">
                  22-Class Confusion Matrix (Test Set N = 440 Samples)
                </h3>
                <p className="text-xs text-slate-500">
                  Rows represent actual ground truth; Columns represent model predictions.
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs font-medium">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-emerald-600 rounded-xs"></span> 20/20 Perfect Match
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-amber-400 rounded-xs"></span> 19/20 Match
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-red-400 rounded-xs"></span> 1 Misclassification
                </span>
              </div>
            </div>

            {/* Matrix View */}
            <div className="overflow-x-auto border border-slate-200 rounded-lg p-2 bg-slate-50/50">
              <table className="text-[10px] border-collapse font-mono mx-auto">
                <thead>
                  <tr>
                    <th className="p-1 text-slate-400 text-left font-sans">Actual \ Pred</th>
                    {CROP_CLASS_NAMES.map((name) => (
                      <th
                        key={name}
                        className="p-1 w-6 text-center font-bold text-slate-500 uppercase rotate-45 h-14 origin-bottom-left"
                      >
                        {name.slice(0, 3)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {CONFUSION_MATRIX.map((row, rIdx) => {
                    const rowName = CROP_CLASS_NAMES[rIdx];
                    return (
                      <tr key={rowName}>
                        <td className="p-1 text-slate-700 font-semibold font-sans whitespace-nowrap pr-2">
                          {rowName}
                        </td>
                        {row.map((val, cIdx) => {
                          const isDiag = rIdx === cIdx;
                          let bg = 'bg-white text-slate-200';
                          if (isDiag && val === 20) bg = 'bg-emerald-600 text-white font-bold';
                          else if (isDiag && val === 19) bg = 'bg-emerald-500 text-white font-bold';
                          else if (!isDiag && val > 0) bg = 'bg-red-500 text-white font-bold';

                          return (
                            <td
                              key={cIdx}
                              onMouseEnter={() =>
                                setHoveredCell({ row: rIdx, col: cIdx, val })
                              }
                              onMouseLeave={() => setHoveredCell(null)}
                              className={`w-6 h-6 text-center border border-slate-200/60 cursor-pointer transition-colors ${bg}`}
                            >
                              {val > 0 ? val : '-'}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Hover explanation */}
            <div className="h-6 text-xs text-slate-600 font-medium">
              {hoveredCell ? (
                <span>
                  Actual Class: <strong>{CROP_CLASS_NAMES[hoveredCell.row]}</strong> • Predicted Class:{' '}
                  <strong>{CROP_CLASS_NAMES[hoveredCell.col]}</strong> • Sample Count:{' '}
                  <strong>{hoveredCell.val}</strong>
                </span>
              ) : (
                <span className="text-slate-400">Hover over any cell to view detailed sample classification count.</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Classification Report */}
      {activeTab === 'classification_report' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">Per-Class Precision, Recall & F1-Score</h3>
            <span className="text-xs text-slate-500">Test Split: 440 Samples (20/class)</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-medium">
              <thead className="bg-slate-100 text-slate-600 uppercase font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4">Crop Class</th>
                  <th className="py-2.5 px-4 text-right">Precision</th>
                  <th className="py-2.5 px-4 text-right">Recall</th>
                  <th className="py-2.5 px-4 text-right">F1-Score</th>
                  <th className="py-2.5 px-4 text-right">Test Support</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800 font-mono">
                {PER_CLASS_METRICS.map((row) => (
                  <tr key={row.className} className="hover:bg-slate-50">
                    <td className="py-2 px-4 font-sans font-semibold text-slate-900">{row.className}</td>
                    <td className="py-2 px-4 text-right">{row.precision.toFixed(3)}</td>
                    <td className="py-2 px-4 text-right">{row.recall.toFixed(3)}</td>
                    <td className="py-2 px-4 text-right font-bold text-emerald-800">{row.f1Score.toFixed(3)}</td>
                    <td className="py-2 px-4 text-right text-slate-500">{row.support}</td>
                  </tr>
                ))}
                <tr className="bg-emerald-50/80 font-bold text-emerald-950 font-sans">
                  <td className="py-3 px-4">Macro Average</td>
                  <td className="py-3 px-4 text-right font-mono">0.993</td>
                  <td className="py-3 px-4 text-right font-mono">0.993</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-emerald-900">0.993</td>
                  <td className="py-3 px-4 text-right font-mono">440</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: 5-Fold Stratified Cross-Validation */}
      {activeTab === 'cross_validation' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
            5-Fold Stratified Cross-Validation Folds
          </h3>
          <p className="text-xs text-slate-500">
            Every fold preserves exact equal class proportions across all 22 crops to guard against train-test distribution skew.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2">
            {DATASET_BENCHMARK.crossValidationFolds.map((fold) => (
              <div key={fold.fold} className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center space-y-1">
                <span className="text-xs text-slate-400 font-bold block uppercase">Fold #{fold.fold}</span>
                <span className="text-xl font-bold text-emerald-800 font-mono block">
                  {(fold.accuracy * 100).toFixed(2)}%
                </span>
                <span className="text-[11px] text-slate-500 font-mono">F1: {fold.macroF1.toFixed(4)}</span>
              </div>
            ))}
          </div>

          <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-xs font-semibold text-emerald-900 flex justify-between items-center">
            <span>Overall 5-Fold Stratified Mean:</span>
            <span className="font-mono text-sm font-bold">99.32% ± 0.15%</span>
          </div>
        </div>
      )}
    </div>
  );
};

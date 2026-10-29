import React from 'react';
import {
  LayoutDashboard,
  Sprout,
  AlertTriangle,
  BarChart3,
  BrainCircuit,
  BookOpen,
  CloudSun,
  Smartphone,
  ShieldCheck,
} from 'lucide-react';

export type PageId =
  | 'overview'
  | 'crop_recommendation'
  | 'risk_analysis'
  | 'model_evaluation'
  | 'explainable_ai'
  | 'data_info'
  | 'weather_gis'
  | 'sms_alerts';

interface NavigationProps {
  activePage: PageId;
  onSelectPage: (page: PageId) => void;
  predictionMade: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  activePage,
  onSelectPage,
  predictionMade,
}) => {
  const navItems = [
    {
      id: 'overview' as PageId,
      label: 'Dashboard Overview',
      icon: LayoutDashboard,
      badge: null,
      desc: 'System summary & ML status',
    },
    {
      id: 'crop_recommendation' as PageId,
      label: 'Crop Recommendation',
      icon: Sprout,
      badge: predictionMade ? 'Predicted' : 'Ready',
      desc: 'Random Forest inference engine',
    },
    {
      id: 'risk_analysis' as PageId,
      label: 'Agricultural Risk Analysis',
      icon: AlertTriangle,
      badge: 'Agronomic Rules',
      desc: 'Thermal, moisture & pH risks',
    },
    {
      id: 'model_evaluation' as PageId,
      label: 'Model Evaluation',
      icon: BarChart3,
      badge: '99.3% Acc',
      desc: 'Benchmark & confusion matrix',
    },
    {
      id: 'explainable_ai' as PageId,
      label: 'Explainable AI (SHAP)',
      icon: BrainCircuit,
      badge: 'Interpretability',
      desc: 'Feature attribution & importance',
    },
    {
      id: 'data_info' as PageId,
      label: 'Data & Model Info',
      icon: BookOpen,
      badge: null,
      desc: 'Dataset source & constraints',
    },
    {
      id: 'weather_gis' as PageId,
      label: 'Live Weather & GIS Map',
      icon: CloudSun,
      badge: 'Live API',
      desc: 'Open-Meteo & coordinates',
    },
    {
      id: 'sms_alerts' as PageId,
      label: 'Farmer Alerts & Free SMS',
      icon: Smartphone,
      badge: '100% Free',
      desc: 'Carrier gateway notifications',
    },
  ];

  return (
    <aside className="w-full md:w-68 bg-white border-r border-slate-200 p-4 shrink-0 flex flex-col justify-between">
      <div>
        <div className="mb-3 px-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Navigation Modules
          </p>
          <p className="text-xs text-slate-500 font-medium">Agro Insight Decision Suite</p>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectPage(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-left group ${
                  isActive
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-900'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-white' : 'text-emerald-700 group-hover:text-emerald-800'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase ${
                      isActive
                        ? 'bg-emerald-900/70 text-emerald-100'
                        : item.badge === '100% Free'
                        ? 'bg-emerald-100 text-emerald-800'
                        : item.badge === 'Predicted'
                        ? 'bg-indigo-100 text-indigo-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="mt-8 pt-4 border-t border-slate-200 text-xs text-slate-500 space-y-2">
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
          <div className="flex items-center gap-1.5 font-bold text-slate-800 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Research Rigor</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
            Trained on 2,200 ICAR benchmark samples. Calibrated without fabricated stats.
          </p>
        </div>
      </div>
    </aside>
  );
};

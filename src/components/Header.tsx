import React from 'react';
import { Sprout, Cpu, GraduationCap } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-emerald-900 text-white shadow-md border-b border-emerald-950 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-800 border border-emerald-600/40 flex items-center justify-center text-xl shadow-inner shrink-0">
            🌱
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
                Agro Insight
              </h1>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-700/80 text-emerald-100 px-2 py-0.5 rounded-full border border-emerald-500/30">
                v2.1 ML
              </span>
            </div>
            <p className="text-xs text-emerald-200/90 font-medium">
              ML-Based Crop Recommendation & Agricultural Risk Analysis Platform
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-emerald-950/70 px-3 py-1.5 rounded-lg border border-emerald-800 text-xs text-emerald-200">
            <GraduationCap className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="hidden md:inline text-slate-300">Research Internship Project •</span>
            <span className="font-semibold text-white">NIT Tiruchirappalli</span>
          </div>
          <div className="flex items-center gap-1.5 bg-emerald-800/60 px-3 py-1.5 rounded-lg border border-emerald-700/60 text-xs text-emerald-200">
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            <span>Random Forest (99.3% Acc)</span>
          </div>
        </div>
      </div>
    </header>
  );
};

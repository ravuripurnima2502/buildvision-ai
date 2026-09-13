import React from 'react';
import { CostCategory } from '../../types/estimation';
import { formatCurrency, formatCompactNumber } from '../../utils/formatting';
import {
  Building,
  Layers,
  Zap,
  Paintbrush,
  DoorOpen,
  ShieldCheck,
  AlertCircle,
  PieChart,
  DollarSign,
} from 'lucide-react';

interface CostBreakdownProps {
  categories: CostCategory[];
  totalCost: number;
  builtUpAreaSqFt: number;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Building,
  Layers,
  Zap,
  Paintbrush,
  DoorOpen,
  ShieldCheck,
};

export const CostBreakdown: React.FC<CostBreakdownProps> = ({
  categories,
  totalCost,
  builtUpAreaSqFt,
}) => {
  const costPerSqFt = builtUpAreaSqFt > 0 ? Math.round(totalCost / builtUpAreaSqFt) : 0;

  return (
    <div className="space-y-6">
      {/* Animated Hero Card: Total Preliminary Estimate */}
      <div className="rounded-3xl glass-panel-gold p-6 sm:p-8 border border-gold-500/40 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gold-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-7 space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-gold-400 bg-gold-500/15 px-3 py-1 rounded-full border border-gold-500/30">
              PRELIMINARY ESTIMATE SUMMARY
            </span>
            <div className="pt-2">
              <span className="text-3xl sm:text-5xl font-display font-bold text-white tracking-tight">
                {formatCurrency(totalCost)}
              </span>
              <span className="text-slate-400 text-sm ml-2 font-mono">
                ({formatCompactNumber(totalCost)})
              </span>
            </div>
            <p className="text-xs text-slate-300 max-w-lg">
              Comprehensive turnkey forecast encompassing substructure, RCC framed super-structure, AAC block masonry, high-grade finishes, and electrical & plumbing installations.
            </p>
          </div>

          <div className="md:col-span-5 grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-charcoal-900/90 border border-slate-800">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">Cost / sq.ft</span>
              <span className="text-lg font-display font-bold text-gold-300 mt-0.5 block">
                ₹{costPerSqFt.toLocaleString()}
              </span>
              <span className="text-[10px] text-slate-500">Premium Residential</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-charcoal-900/90 border border-slate-800">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">Built-Up Area</span>
              <span className="text-lg font-display font-bold text-white mt-0.5 block">
                {builtUpAreaSqFt.toLocaleString()} sq.ft
              </span>
              <span className="text-[10px] text-slate-500">{(builtUpAreaSqFt * 0.0929).toFixed(0)} m²</span>
            </div>
          </div>
        </div>

        {/* Progress Ratio Bar */}
        <div className="mt-6 pt-6 border-t border-gold-500/20">
          <div className="h-3 rounded-full overflow-hidden flex bg-charcoal-900">
            {categories.map((cat) => (
              <div
                key={cat.id}
                style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }}
                title={`${cat.name}: ${cat.percentage}%`}
                className="h-full transition-all hover:opacity-80"
              />
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 mt-2.5">
            {categories.map((cat) => (
              <div key={cat.id} className="flex items-center space-x-1.5 text-[11px]">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }}></span>
                <span className="text-slate-300">{cat.name} ({cat.percentage}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Categorized Expense Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => {
          const Icon = ICON_MAP[cat.iconName] || Building;
          return (
            <div
              key={cat.id}
              className="p-5 rounded-2xl glass-panel border border-slate-800/80 hover:border-gold-500/30 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center border"
                    style={{ backgroundColor: `${cat.color}20`, borderColor: `${cat.color}40`, color: cat.color }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-charcoal-900 text-slate-300 border border-slate-800">
                    {cat.percentage}%
                  </span>
                </div>

                <h4 className="text-sm font-display font-bold text-white">{cat.name}</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{cat.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[10px] uppercase font-mono text-slate-500">Allocated Budget</span>
                <span className="text-sm font-mono font-bold text-gold-300">
                  {formatCurrency(cat.amount)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Prominent Required Disclaimer */}
      <div className="p-4 rounded-2xl bg-charcoal-900/90 border border-amber-500/30 flex items-start space-x-3 text-xs text-amber-200/90">
        <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold uppercase tracking-wider block font-mono text-[10px] text-amber-300">
            Professional Engineering Notice:
          </span>
          “Preliminary estimate — actual cost depends on site conditions, design, material rates and professional assessment.”
        </div>
      </div>
    </div>
  );
};

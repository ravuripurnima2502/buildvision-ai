import React from 'react';
import { ChangeImpactDelta } from '../../types/project';
import { formatCurrency } from '../../utils/formatting';
import {
  TrendingUp,
  TrendingDown,
  Clock,
  Maximize2,
  Minimize2,
  X,
  AlertCircle,
  SplitSquareVertical,
  Boxes,
  Activity,
  Layers,
} from 'lucide-react';

interface ChangeImpactDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  delta: ChangeImpactDelta;
  onToggleCompareView?: () => void;
  isCompareActive?: boolean;
}

export const ChangeImpactDrawer: React.FC<ChangeImpactDrawerProps> = ({
  isOpen,
  onClose,
  delta,
  onToggleCompareView,
  isCompareActive = false,
}) => {
  if (!isOpen) return null;

  const isAreaIncrease = delta.areaDeltaSqFt >= 0;
  const isCostIncrease = delta.costDelta >= 0;
  const isTimeIncrease = delta.timeDeltaDays >= 0;

  return (
    <div className="fixed bottom-0 right-0 z-40 w-full sm:max-w-md lg:max-w-lg bg-[#080C14]/95 backdrop-blur-2xl border-t sm:border-l border-gold-500/40 p-6 shadow-2xl animate-slideUp sm:animate-slideLeft select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-gold-500/15 border border-gold-500/40 flex items-center justify-center text-gold-400 shadow-sm">
            <Activity className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div>
            <h3 className="text-base font-display font-bold text-white tracking-tight flex items-center">
              CHANGE IMPACT TELEMETRY
            </h3>
            <p className="text-[11px] text-slate-400 font-mono">BIM Delta → Material Quantities → Cost → Schedule</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Revision Summary Description */}
      <div className="py-3 px-3.5 my-4 rounded-xl bg-gold-500/10 border border-gold-500/20 text-xs text-gold-200 leading-relaxed">
        <span className="font-bold text-gold-300 font-mono uppercase block text-[10px] mb-0.5">
          Applied Engineering Delta:
        </span>
        {delta.summaryDescription}
      </div>

      {/* Key Metric Deltas Grid */}
      <div className="grid grid-cols-3 gap-2.5 mb-4">
        {/* Floor Area Delta */}
        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          <span className="text-[10px] uppercase font-mono text-slate-400 block mb-1">Built-Up Area</span>
          <div className="flex items-center space-x-1">
            {isAreaIncrease ? (
              <Maximize2 className="w-3.5 h-3.5 text-emerald-400 stroke-[2.2]" />
            ) : (
              <Minimize2 className="w-3.5 h-3.5 text-amber-400 stroke-[2.2]" />
            )}
            <span
              className={`text-xs sm:text-sm font-mono font-bold ${
                isAreaIncrease ? 'text-emerald-400' : 'text-amber-400'
              }`}
            >
              {isAreaIncrease ? '+' : ''}{delta.areaDeltaSqFt} sf
            </span>
          </div>
        </div>

        {/* Cost Delta */}
        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          <span className="text-[10px] uppercase font-mono text-slate-400 block mb-1">Prelim. Cost</span>
          <div className="flex items-center space-x-1">
            {isCostIncrease ? (
              <TrendingUp className="w-3.5 h-3.5 text-gold-400 stroke-[2.2]" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5 text-sky-400 stroke-[2.2]" />
            )}
            <span
              className={`text-xs font-mono font-bold ${
                isCostIncrease ? 'text-gold-300' : 'text-sky-400'
              }`}
            >
              {isCostIncrease ? '+' : ''}{formatCurrency(delta.costDelta)}
            </span>
          </div>
        </div>

        {/* Construction Time Delta */}
        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          <span className="text-[10px] uppercase font-mono text-slate-400 block mb-1">Timeline</span>
          <div className="flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5 text-slate-300 stroke-[2.2]" />
            <span
              className={`text-xs sm:text-sm font-mono font-bold ${
                isTimeIncrease ? 'text-slate-200' : 'text-sky-400'
              }`}
            >
              {isTimeIncrease ? '+' : ''}{delta.timeDeltaDays} Days
            </span>
          </div>
        </div>
      </div>

      {/* Material Takeoff Deltas */}
      <div className="space-y-2 mb-4">
        <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
          <Boxes className="w-3.5 h-3.5 text-gold-400" />
          <span>Material Takeoff Delta:</span>
        </h4>
        <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
          {delta.materialDeltas.map((mat, i) => (
            <div
              key={i}
              className="flex items-center justify-between text-xs py-1.5 px-3 rounded-xl bg-white/[0.02] border border-white/[0.06]"
            >
              <span className="text-slate-300 font-medium">{mat.item}</span>
              <span
                className={`font-mono font-semibold ${
                  mat.isIncrease ? 'text-emerald-400' : 'text-amber-400'
                }`}
              >
                {mat.deltaQuantity}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Component Level Changes */}
      <div className="mb-4">
        <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5 flex items-center space-x-1.5">
          <Layers className="w-3.5 h-3.5 text-gold-400" />
          <span>Modified Structural Elements:</span>
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {delta.changedComponents.map((comp, idx) => (
            <span
              key={idx}
              className="text-[11px] font-mono px-2 py-0.5 rounded-lg bg-white/[0.04] text-slate-200 border border-white/[0.08]"
            >
              {comp}
            </span>
          ))}
        </div>
      </div>

      {/* Before / After Toggle Button */}
      {onToggleCompareView && (
        <button
          onClick={onToggleCompareView}
          className={`w-full py-2.5 px-4 mb-3 rounded-xl text-xs font-bold tracking-wide border flex items-center justify-center space-x-2 transition-all cursor-pointer ${
            isCompareActive
              ? 'bg-sky-500 text-charcoal-950 border-sky-400 shadow-blueprint-glow'
              : 'bg-white/[0.04] hover:bg-white/[0.08] text-sky-400 border-sky-500/30'
          }`}
        >
          <SplitSquareVertical className="w-4 h-4" />
          <span>{isCompareActive ? 'Exit Ghost Comparison' : 'View Ghosted Before vs After Overlay'}</span>
        </button>
      )}

      {/* Engineering Disclaimer */}
      <div className="flex items-start space-x-2 p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-[10px] text-slate-400">
        <AlertCircle className="w-3.5 h-3.5 text-gold-400 shrink-0 mt-0.5" />
        <span>
          Estimates generated via structural BIM parametric models. Final quantities are subject to structural engineer soil load tests and local site logistics.
        </span>
      </div>
    </div>
  );
};

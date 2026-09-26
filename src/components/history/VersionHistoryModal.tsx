import React from 'react';
import { Project, ProjectVersion } from '../../types/project';
import { formatCurrency, formatArea } from '../../utils/formatting';
import {
  History,
  X,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Layers,
  RotateCcw,
  GitBranch,
} from 'lucide-react';

interface VersionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  onSelectVersion: (versionId: string) => void;
}

export const VersionHistoryModal: React.FC<VersionHistoryModalProps> = ({
  isOpen,
  onClose,
  project,
  onSelectVersion,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/80 backdrop-blur-md animate-fadeIn select-none">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#0B1017]/95 border border-gold-500/40 p-6 sm:p-8 shadow-2xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-xl hover:bg-white/[0.08] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="inline-flex items-center space-x-2 text-[10px] font-mono text-gold-400 uppercase tracking-widest bg-gold-500/10 px-2.5 py-1 rounded-full border border-gold-500/20 mb-2 font-semibold">
            <History className="w-3.5 h-3.5" />
            <span>Parametric Revisions Log</span>
          </div>
          <h2 className="text-2xl font-display font-bold text-white tracking-tight">
            Version History &amp; Blueprint Timeline
          </h2>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Every structural iteration, wall alteration, and floor expansion is tracked with volumetric deltas. Revert to any milestone with a single click.
          </p>
        </div>

        {/* Timeline List */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-3.5">
          {project.versions.map((ver, idx) => {
            const isCurrent = ver.id === project.currentVersionId;
            const delta = ver.deltaFromPrevious;

            return (
              <div
                key={ver.id}
                className={`p-5 rounded-2xl border transition-all ${
                  isCurrent
                    ? 'bg-gold-500/10 border-gold-500/50 shadow-gold-glow'
                    : 'bg-white/[0.02] border-white/[0.08] hover:border-white/[0.16]'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                        isCurrent
                          ? 'bg-gold-500 text-charcoal-950 border-gold-400 font-bold'
                          : 'bg-white/[0.04] text-slate-300 border-white/[0.08]'
                      }`}
                    >
                      v{ver.versionNumber}.0 {isCurrent ? '• ACTIVE' : ''}
                    </span>
                    <h4 className="text-sm font-display font-bold text-white">
                      {ver.title}
                    </h4>
                  </div>

                  <span className="text-[11px] font-mono text-slate-400 flex items-center">
                    <Clock className="w-3 h-3 mr-1 text-slate-500" />
                    {new Date(ver.timestamp).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                <p className="text-xs text-slate-300 mb-3 leading-relaxed">{ver.description}</p>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-2 py-2 px-3 rounded-xl bg-[#080C14] border border-white/[0.06] text-xs font-mono mb-3">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-sans">Floors</span>
                    <span className="font-bold text-white">{ver.buildingSpec.floors.length} Levels</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-sans">Area</span>
                    <span className="font-bold text-white">{ver.buildingSpec.totalBuiltUpAreaSqFt.toLocaleString()} sq.ft</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-sans">Turnkey Forecast</span>
                    <span className="font-bold text-gold-300">{formatCurrency(ver.estimation.totalCost)}</span>
                  </div>
                </div>

                {/* Delta Badge if recorded */}
                {delta && (
                  <div className="text-[11px] text-emerald-400 font-mono flex items-center space-x-2 py-1">
                    <TrendingUp className="w-3.5 h-3.5 shrink-0" />
                    <span>
                      Delta: {delta.areaDeltaSqFt > 0 ? `+${delta.areaDeltaSqFt}` : delta.areaDeltaSqFt} sf • {delta.costDelta > 0 ? `+${formatCurrency(delta.costDelta)}` : formatCurrency(delta.costDelta)} • {delta.timeDeltaDays > 0 ? `+${delta.timeDeltaDays}` : delta.timeDeltaDays} Days
                    </span>
                  </div>
                )}

                {/* Actions */}
                {!isCurrent && (
                  <div className="pt-2 mt-2 border-t border-white/[0.06] flex justify-end">
                    <button
                      onClick={() => {
                        onSelectVersion(ver.id);
                        onClose();
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-gold-500 text-slate-300 hover:text-charcoal-950 text-xs font-bold font-mono transition-all flex items-center space-x-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Switch to This Version</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

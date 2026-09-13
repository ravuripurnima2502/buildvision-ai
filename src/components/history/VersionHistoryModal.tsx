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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl rounded-2xl glass-panel-gold p-6 sm:p-8 border border-gold-500/40 blueprint-grid shadow-2xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-gold-300 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 text-xs font-mono text-gold-400 uppercase tracking-wider mb-1">
            <History className="w-4 h-4" />
            <span>Design Evolution Timeline</span>
          </div>
          <h2 className="text-2xl font-display font-bold text-white">
            Version History & Revisions
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Track structural design alterations across revisions, compare changes, or restore earlier blueprints.
          </p>
        </div>

        {/* Timeline List */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-4">
          {project.versions.map((ver, idx) => {
            const isCurrent = ver.id === project.currentVersionId;
            const delta = ver.deltaFromPrevious;

            return (
              <div
                key={ver.id}
                className={`p-5 rounded-xl border transition-all ${
                  isCurrent
                    ? 'bg-gold-500/15 border-gold-500/60 shadow-gold-glow'
                    : 'bg-charcoal-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded border ${
                        isCurrent
                          ? 'bg-gold-500 text-charcoal-950 border-gold-400'
                          : 'bg-charcoal-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      v{ver.versionNumber}.0 {isCurrent ? '• ACTIVE' : ''}
                    </span>
                    <h4 className="text-sm font-display font-bold text-white">
                      {ver.title}
                    </h4>
                  </div>

                  <span className="text-[11px] font-mono text-slate-400 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {new Date(ver.timestamp).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                <p className="text-xs text-slate-300 mb-3">{ver.description}</p>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-2 py-2 px-3 rounded-lg bg-charcoal-950/80 border border-slate-800 text-xs font-mono mb-3">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Floors</span>
                    <span className="font-bold text-slate-200">{ver.buildingSpec.floors.length} Levels</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Area</span>
                    <span className="font-bold text-slate-200">{ver.buildingSpec.totalBuiltUpAreaSqFt} sq.ft</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Estimate</span>
                    <span className="font-bold text-gold-300">{formatCurrency(ver.estimation.totalCost)}</span>
                  </div>
                </div>

                {/* Delta Badge if recorded */}
                {delta && (
                  <div className="text-[11px] text-emerald-400 font-mono flex items-center space-x-2 py-1">
                    <TrendingUp className="w-3.5 h-3.5 shrink-0" />
                    <span>
                      Delta: {delta.areaDeltaSqFt > 0 ? `+${delta.areaDeltaSqFt}` : delta.areaDeltaSqFt} sq.ft • {delta.costDelta > 0 ? `+${formatCurrency(delta.costDelta)}` : formatCurrency(delta.costDelta)} • {delta.timeDeltaDays > 0 ? `+${delta.timeDeltaDays}` : delta.timeDeltaDays} Days
                    </span>
                  </div>
                )}

                {/* Actions */}
                {!isCurrent && (
                  <div className="pt-2 mt-2 border-t border-slate-800/80 flex justify-end">
                    <button
                      onClick={() => {
                        onSelectVersion(ver.id);
                        onClose();
                      }}
                      className="px-3.5 py-1.5 rounded-lg bg-charcoal-800 hover:bg-gold-500 text-slate-300 hover:text-charcoal-950 text-xs font-bold font-mono transition-all flex items-center space-x-1.5"
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

import React from 'react';
import { Project } from '../../types/project';
import { useTheme } from '../theme/ThemeContext';
import {
  ArrowLeft,
  Sparkles,
  Presentation,
  History,
  Share2,
  Eye,
  Calculator,
  Palette,
  Activity,
  Box,
} from 'lucide-react';

interface EditorHeaderProps {
  project: Project;
  activeTab: '3d_viewer' | 'estimation' | 'presentation';
  onChangeTab: (tab: '3d_viewer' | 'estimation' | 'presentation') => void;
  onOpenModifyModal: () => void;
  onOpenVersionHistory: () => void;
  onBackToDashboard: () => void;
  hasDeltas: boolean;
  onToggleImpactDrawer: () => void;
  onOpenThemeSelector: () => void;
}

export const EditorHeader: React.FC<EditorHeaderProps> = ({
  project,
  activeTab,
  onChangeTab,
  onOpenModifyModal,
  onOpenVersionHistory,
  onBackToDashboard,
  hasDeltas,
  onToggleImpactDrawer,
  onOpenThemeSelector,
}) => {
  const currentVersion = project.versions.find(v => v.id === project.currentVersionId) || project.versions[project.versions.length - 1];
  const { currentTheme } = useTheme();

  return (
    <header className="h-16 px-4 sm:px-6 bg-[#080C14]/90 backdrop-blur-xl border-b border-white/[0.08] flex items-center justify-between z-30 select-none">
      {/* Left: Back & Project Telemetry */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        <button
          onClick={onBackToDashboard}
          title="Return to Dashboard"
          className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-gold-500/50 text-slate-300 hover:text-white hover:bg-white/[0.08] transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="flex flex-col">
          <div className="flex items-center space-x-2">
            <h1 className="text-sm sm:text-base font-display font-bold text-white tracking-tight truncate max-w-[180px] sm:max-w-xs md:max-w-sm">
              {project.title}
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-gold-500/10 text-gold-400 border border-gold-500/30 font-semibold">
              v{currentVersion?.versionNumber || 1}.0
            </span>
          </div>
          <div className="flex items-center space-x-2 text-[11px] text-slate-400 font-mono">
            <span className="inline-flex items-center text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mr-1.5"></span>
              BIM Kernel Synced
            </span>
            <span className="text-slate-600">•</span>
            <span className="hidden sm:inline truncate">
              {project.journeyType === 'already_built_changes'
                ? 'Renovation & Vertical Expansion'
                : `${currentVersion?.buildingSpec.floors.length} Floors • ${currentVersion?.buildingSpec.totalBuiltUpAreaSqFt.toLocaleString()} sq.ft`}
            </span>
          </div>
        </div>
      </div>

      {/* Center: View Switcher Tabs (CAD Mode Selector) */}
      <div className="hidden md:flex items-center bg-[#0B1017] p-1 rounded-xl border border-white/[0.08] shadow-inner">
        <button
          onClick={() => onChangeTab('3d_viewer')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
            activeTab === '3d_viewer'
              ? 'bg-gold-500 text-charcoal-950 font-bold shadow-gold-glow'
              : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <Eye className="w-3.5 h-3.5 stroke-[2.2]" />
          <span>Interactive 3D</span>
        </button>

        <button
          onClick={() => onChangeTab('estimation')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
            activeTab === 'estimation'
              ? 'bg-gold-500 text-charcoal-950 font-bold shadow-gold-glow'
              : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <Calculator className="w-3.5 h-3.5 stroke-[2.2]" />
          <span>BOQ & Estimates</span>
        </button>

        <button
          onClick={() => onChangeTab('presentation')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
            activeTab === 'presentation'
              ? 'bg-gold-500 text-charcoal-950 font-bold shadow-gold-glow'
              : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <Presentation className="w-3.5 h-3.5 stroke-[2.2]" />
          <span>Presentation</span>
        </button>
      </div>

      {/* Right: Architectural Actions */}
      <div className="flex items-center space-x-2 sm:space-x-2.5">
        {/* Theme Switcher Button */}
        <button
          onClick={onOpenThemeSelector}
          title={`Theme: ${currentTheme.name} (Click to toggle)`}
          className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-gold-500/40 text-slate-400 hover:text-gold-400 transition-all cursor-pointer"
        >
          <Palette className="w-4 h-4 text-gold-400" />
        </button>

        {/* Change Impact Drawer Pill */}
        {hasDeltas && (
          <button
            onClick={onToggleImpactDrawer}
            className="px-3 py-1.5 rounded-xl bg-gold-500/10 border border-gold-500/40 text-gold-400 hover:bg-gold-500/20 text-xs font-mono font-bold flex items-center space-x-1.5 transition-all shadow-gold-glow cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-gold-400 animate-ping"></span>
            <span>Delta Shift</span>
          </button>
        )}

        {/* Modify Design Button */}
        <button
          onClick={onOpenModifyModal}
          className="btn-gold px-3 sm:px-4 py-2 text-xs font-bold flex items-center space-x-1.5 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Modify Design</span>
        </button>

        {/* Version History Button */}
        <button
          onClick={onOpenVersionHistory}
          title="Revisions History"
          className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-gold-500/40 text-slate-400 hover:text-white transition-all flex items-center space-x-1 cursor-pointer"
        >
          <History className="w-4 h-4 text-gold-400" />
          <span className="text-xs font-mono hidden lg:inline">{project.versions.length}</span>
        </button>

        {/* Export Project JSON */}
        <button
          onClick={() => {
            const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(project, null, 2));
            const dlAnchor = document.createElement('a');
            dlAnchor.setAttribute('href', dataStr);
            dlAnchor.setAttribute('download', `${project.title.toLowerCase().replace(/\s+/g, '_')}_spec.json`);
            dlAnchor.click();
          }}
          title="Export BIM Specification JSON"
          className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-gold-500/40 text-slate-400 hover:text-gold-400 transition-all hidden sm:flex items-center cursor-pointer"
        >
          <Share2 className="w-4 h-4" />
        </button>

        {/* Client Presentation Trigger (Mobile Only) */}
        <button
          onClick={() => onChangeTab('presentation')}
          title="Present to Client"
          className="md:hidden p-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-gold-400 cursor-pointer"
        >
          <Presentation className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};

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
    <header className="h-16 px-4 sm:px-6 bg-theme-surface border-b border-theme-subtle flex items-center justify-between z-30 select-none">
      {/* Left: Back & Project Title */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        <button
          onClick={onBackToDashboard}
          title="Back to Projects"
          className="p-2 rounded-xl bg-theme-card border border-theme-subtle hover:border-gold-500/50 text-theme-secondary hover:text-theme-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-sm sm:text-base font-display font-bold text-theme-primary tracking-wide truncate max-w-[200px] sm:max-w-md">
              {project.title}
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gold-500/20 text-gold-400 border border-gold-500/30">
              v{currentVersion?.versionNumber || 1}.0
            </span>
          </div>
          <p className="text-[11px] text-theme-secondary hidden sm:block truncate max-w-sm font-mono">
            {project.journeyType === 'already_built_changes'
              ? 'Existing Structure → Proposed Alterations'
              : `${currentVersion?.buildingSpec.floors.length} Floors • ${currentVersion?.buildingSpec.totalBuiltUpAreaSqFt} sq.ft`}
          </p>
        </div>
      </div>

      {/* Center: View Switcher Tabs */}
      <div className="hidden md:flex items-center bg-theme-card/90 p-1 rounded-xl border border-theme-subtle">
        <button
          onClick={() => onChangeTab('3d_viewer')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
            activeTab === '3d_viewer'
              ? 'bg-gold-500 text-charcoal-950 shadow-gold-glow font-bold'
              : 'text-theme-secondary hover:text-theme-primary'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Interactive 3D</span>
        </button>

        <button
          onClick={() => onChangeTab('estimation')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
            activeTab === 'estimation'
              ? 'bg-gold-500 text-charcoal-950 shadow-gold-glow font-bold'
              : 'text-theme-secondary hover:text-theme-primary'
          }`}
        >
          <Calculator className="w-3.5 h-3.5" />
          <span>BOQ & Estimates</span>
        </button>

        <button
          onClick={() => onChangeTab('presentation')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
            activeTab === 'presentation'
              ? 'bg-gold-500 text-charcoal-950 shadow-gold-glow font-bold'
              : 'text-theme-secondary hover:text-theme-primary'
          }`}
        >
          <Presentation className="w-3.5 h-3.5" />
          <span>Present to Client</span>
        </button>
      </div>

      {/* Right: Key Architectural Actions */}
      <div className="flex items-center space-x-2 sm:space-x-2.5">
        {/* Theme Switcher Button */}
        <button
          onClick={onOpenThemeSelector}
          title={`Theme: ${currentTheme.name} (Click to change)`}
          className="p-2 rounded-xl bg-theme-card border border-theme-subtle hover:border-gold-500/50 text-theme-secondary hover:text-gold-400 transition-colors"
        >
          <Palette className="w-4 h-4 text-gold-400" />
        </button>

        {/* Change Impact Pill Button */}
        {hasDeltas && (
          <button
            onClick={onToggleImpactDrawer}
            className="px-3 py-1.5 rounded-xl bg-gold-500/15 border border-gold-500/40 text-gold-400 hover:bg-gold-500/25 text-xs font-mono font-bold flex items-center space-x-1.5 transition-all shadow-gold-glow"
          >
            <span className="w-2 h-2 rounded-full bg-gold-400 animate-ping"></span>
            <span>Change Impact</span>
          </button>
        )}

        {/* Modify Design Button */}
        <button
          onClick={onOpenModifyModal}
          className="px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-charcoal-950 text-xs font-bold shadow-gold-glow hover:brightness-110 active:scale-95 transition-all flex items-center space-x-1.5"
        >
          <Sparkles className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Modify Design</span>
        </button>

        {/* Version History Button */}
        <button
          onClick={onOpenVersionHistory}
          title="Version Timeline"
          className="p-2 rounded-xl bg-theme-card border border-theme-subtle hover:border-gold-500/40 text-theme-secondary hover:text-theme-primary transition-colors flex items-center space-x-1"
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
          title="Export Project BIM Specification JSON"
          className="p-2 rounded-xl bg-theme-card border border-theme-subtle hover:border-gold-500/40 text-theme-secondary hover:text-gold-400 transition-colors hidden sm:flex items-center"
        >
          <Share2 className="w-4 h-4" />
        </button>

        {/* Client Presentation Trigger (Quick Mobile) */}
        <button
          onClick={() => onChangeTab('presentation')}
          title="Present to Client"
          className="md:hidden p-2 rounded-xl bg-theme-card border border-theme-subtle text-gold-400"
        >
          <Presentation className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};

import React, { useState } from 'react';
import { Project } from '../../types/project';
import { formatCurrency, formatArea } from '../../utils/formatting';
import {
  FolderOpen,
  Copy,
  Trash2,
  Edit2,
  Calendar,
  Layers,
  ArrowRight,
  TrendingUp,
  Clock,
  Building,
} from 'lucide-react';

interface ProjectListProps {
  projects: Project[];
  onOpenProject: (projectId: string) => void;
  onDuplicateProject: (projectId: string) => void;
  onDeleteProject: (projectId: string) => void;
  onRenameProject: (projectId: string, newTitle: string) => void;
}

export const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  onOpenProject,
  onDuplicateProject,
  onDeleteProject,
  onRenameProject,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const startRenaming = (project: Project) => {
    setEditingId(project.id);
    setEditTitle(project.title);
  };

  const saveRename = (id: string) => {
    if (editTitle.trim()) {
      onRenameProject(id, editTitle.trim());
    }
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-display font-bold text-theme-primary">Recent Projects</h3>
          <p className="text-xs text-theme-secondary">Continue where you left off or inspect past versions</p>
        </div>
        <span className="text-xs font-mono text-gold-400 bg-gold-500/10 px-3 py-1 rounded-full border border-gold-500/20">
          {projects.length} Saved Projects
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => {
          const currentVersion = project.versions.find(v => v.id === project.currentVersionId) || project.versions[project.versions.length - 1];
          const spec = currentVersion?.buildingSpec;
          const est = currentVersion?.estimation;
          const isJourney3 = project.journeyType === 'already_built_changes';

          return (
            <div
              key={project.id}
              className="rounded-2xl glass-panel p-6 border border-theme-subtle hover:border-gold-500/40 hover:shadow-gold-glow transition-all flex flex-col justify-between group relative overflow-hidden"
            >
              {/* Journey Badge */}
              <div className="flex items-start justify-between mb-4">
                <span
                  className={`text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-md border ${
                    isJourney3
                      ? 'bg-cyan-950/60 border-cyan-500/30 text-cyan-300'
                      : project.journeyType === 'idea_to_structure'
                      ? 'bg-gold-950/60 border-gold-500/30 text-gold-300'
                      : 'bg-indigo-950/60 border-indigo-500/30 text-indigo-300'
                  }`}
                >
                  {isJourney3
                    ? 'Existing → Proposed'
                    : project.journeyType === 'idea_to_structure'
                    ? 'Idea → 3D'
                    : 'Requirements → 3D'}
                </span>

                <div className="flex items-center space-x-1 opacity-80 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onDuplicateProject(project.id)}
                    title="Duplicate Project"
                    className="p-1.5 rounded-lg text-theme-secondary hover:text-gold-400 hover:bg-theme-card transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => startRenaming(project)}
                    title="Rename Project"
                    className="p-1.5 rounded-lg text-theme-secondary hover:text-gold-400 hover:bg-theme-card transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete "${project.title}"?`)) {
                        onDeleteProject(project.id);
                      }
                    }}
                    title="Delete Project"
                    className="p-1.5 rounded-lg text-theme-secondary hover:text-red-400 hover:bg-theme-card transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Title & Description */}
              <div className="space-y-1.5 mb-5">
                {editingId === project.id ? (
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && saveRename(project.id)}
                      className="bg-theme-card text-theme-primary text-base font-bold px-2 py-1 rounded border border-gold-500/60 focus:outline-none w-full"
                      autoFocus
                    />
                    <button
                      onClick={() => saveRename(project.id)}
                      className="text-xs bg-gold-500 text-charcoal-950 font-bold px-2.5 py-1 rounded hover:bg-gold-400"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <h4
                    onClick={() => onOpenProject(project.id)}
                    className="text-lg font-display font-bold text-theme-primary group-hover:text-gold-400 transition-colors cursor-pointer"
                  >
                    {project.title}
                  </h4>
                )}

                <p className="text-xs text-theme-secondary line-clamp-2">{project.description}</p>
              </div>

              {/* Architectural Metrics */}
              <div className="grid grid-cols-3 gap-2 py-3 px-3.5 rounded-xl bg-theme-card border border-theme-subtle mb-5">
                <div>
                  <span className="text-[10px] text-theme-secondary uppercase font-mono block">Floors</span>
                  <span className="text-xs font-bold text-theme-primary flex items-center mt-0.5">
                    <Layers className="w-3 h-3 text-gold-400 mr-1" />
                    {spec?.floors.length || 1} Levels
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-theme-secondary uppercase font-mono block">Built-Up</span>
                  <span className="text-xs font-bold text-theme-primary mt-0.5 block">
                    {spec ? Math.round(spec.totalBuiltUpAreaSqFt) : 0} sq.ft
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-theme-secondary uppercase font-mono block">Version</span>
                  <span className="text-xs font-bold text-gold-400 mt-0.5 block font-mono">
                    v{currentVersion?.versionNumber || 1}.0
                  </span>
                </div>
              </div>

              {/* Financial & Time Estimates */}
              <div className="flex items-center justify-between pt-2 border-t border-theme-subtle mb-5">
                <div>
                  <span className="text-[10px] text-theme-secondary block font-mono">Prelim. Estimate</span>
                  <span className="text-sm font-bold text-gold-gradient">
                    {est ? formatCurrency(est.totalCost) : '—'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-theme-secondary block font-mono">Timeline</span>
                  <span className="text-xs font-semibold text-theme-primary flex items-center justify-end">
                    <Clock className="w-3 h-3 text-theme-secondary mr-1" />
                    {est ? `${est.totalWeeks} Weeks` : '—'}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onOpenProject(project.id)}
                className="w-full py-2.5 px-4 rounded-xl bg-theme-card hover:bg-gold-500 hover:text-charcoal-950 text-theme-primary text-xs font-bold tracking-wide border border-theme-subtle hover:border-gold-500 transition-all flex items-center justify-center space-x-2 shadow-sm"
              >
                <span>Continue Building</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

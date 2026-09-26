import React, { useState } from 'react';
import { Project } from '../../types/project';
import { formatCurrency } from '../../utils/formatting';
import {
  FolderOpen,
  Copy,
  Trash2,
  Edit2,
  Calendar,
  Layers,
  ArrowRight,
  Clock,
  Building,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Sliders,
  Eye,
  Maximize2,
} from 'lucide-react';

interface ProjectListProps {
  projects: Project[];
  onOpenProject: (projectId: string) => void;
  onDuplicateProject: (projectId: string) => void;
  onDeleteProject: (projectId: string) => void;
  onRenameProject: (projectId: string, newTitle: string) => void;
}

// Maps project metadata to realistic architectural thumbnails
const getProjectThumbnail = (project: Project): string => {
  const title = (project.title || '').toLowerCase();
  const desc = (project.description || '').toLowerCase();

  if (title.includes('office') || desc.includes('commercial') || title.includes('commercial')) {
    return '/thumbnails/office_complex.jpg';
  }
  if (project.journeyType === 'already_built_changes' || title.includes('second floor') || title.includes('bungalow') || title.includes('renovat')) {
    return '/thumbnails/second_floor_addition.jpg';
  }
  if (project.journeyType === 'structure_to_3d' || title.includes('urban') || title.includes('compact')) {
    return '/thumbnails/blueprint_to_3d.jpg';
  }
  return '/thumbnails/exterior.jpg';
};

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
    <div className="space-y-6 pt-4">
      {/* Gallery Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-theme-subtle pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-xl sm:text-2xl font-display font-bold text-theme-primary tracking-tight">
              Recent Projects
            </h3>
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
          </div>
          <p className="text-xs text-theme-secondary mt-0.5 font-sans">
            BIM-coordinated building models, change delta proposals, and preliminary cost schedules.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-xs font-mono text-gold-400 bg-gold-500/10 px-3.5 py-1.5 rounded-full border border-gold-500/30 shadow-sm flex items-center space-x-1.5">
            <Building className="w-3.5 h-3.5" />
            <span>{projects.length} Saved Models</span>
          </span>
        </div>
      </div>

      {/* Projects Grid or Empty State */}
      {projects.length === 0 ? (
        <div className="cad-panel p-12 text-center max-w-xl mx-auto my-8 border-dashed border-white/[0.12] space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mx-auto text-gold-400">
            <Building className="w-7 h-7" />
          </div>
          <div>
            <h4 className="text-lg font-display font-bold text-white">No Project Models Yet</h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Synthesize your first architectural building model using one of the 3 starting workflows above.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {projects.map((project) => {
            const currentVersion =
              project.versions.find((v) => v.id === project.currentVersionId) ||
              project.versions[project.versions.length - 1];
            const spec = currentVersion?.buildingSpec;
            const est = currentVersion?.estimation;
            const isJourney3 = project.journeyType === 'already_built_changes';
            const thumbnail = getProjectThumbnail(project);

            return (
              <div
                key={project.id}
                className="cad-panel-interactive flex flex-col justify-between overflow-hidden group relative"
              >
                {/* Card Top: Architectural Visual Banner with Technical Badges */}
                <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-[#070A0F]">
                  <img
                    src={thumbnail}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                  />

                  {/* Gradient Depth Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1017] via-transparent to-transparent pointer-events-none"></div>

                  {/* Journey & Status Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                    <span
                      className={`text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-md backdrop-blur-md border font-semibold ${
                        isJourney3
                          ? 'bg-cyan-950/80 border-cyan-500/40 text-cyan-300'
                          : project.journeyType === 'idea_to_structure'
                          ? 'bg-gold-950/80 border-gold-500/40 text-gold-300'
                          : 'bg-indigo-950/80 border-indigo-500/40 text-indigo-300'
                      }`}
                    >
                      {isJourney3
                        ? 'Changes / Extension'
                        : project.journeyType === 'idea_to_structure'
                        ? 'Idea → 3D Model'
                        : 'Requirements → 3D'}
                    </span>

                    <span className="text-[10px] font-mono bg-[#070A0F]/80 backdrop-blur-md border border-white/[0.08] text-slate-300 px-2.5 py-1 rounded-md flex items-center space-x-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      <span>3D READY</span>
                    </span>
                  </div>

                  {/* Top-Right Action Toolbars */}
                  <div className="absolute bottom-3 right-3 flex items-center space-x-1.5 z-10 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDuplicateProject(project.id);
                      }}
                      title="Duplicate Project Model"
                      className="p-1.5 rounded-lg bg-[#0B1017]/90 backdrop-blur-md border border-white/[0.1] hover:border-gold-500 text-slate-300 hover:text-gold-300 transition-colors cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        startRenaming(project);
                      }}
                      title="Rename Project"
                      className="p-1.5 rounded-lg bg-[#0B1017]/90 backdrop-blur-md border border-white/[0.1] hover:border-gold-500 text-slate-300 hover:text-gold-300 transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Are you sure you want to delete "${project.title}"?`)) {
                          onDeleteProject(project.id);
                        }
                      }}
                      title="Delete Project"
                      className="p-1.5 rounded-lg bg-[#0B1017]/90 backdrop-blur-md border border-white/[0.1] hover:border-rose-500 text-slate-300 hover:text-rose-400 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Quick 3D View Hover Trigger */}
                  <div
                    onClick={() => onOpenProject(project.id)}
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-[#070A0F]/40 backdrop-blur-[2px] cursor-pointer"
                  >
                    <span className="btn-gold px-4 py-2 rounded-xl text-xs font-bold font-mono tracking-wider shadow-gold-glow flex items-center space-x-1.5 scale-95 group-hover:scale-100 transition-transform">
                      <Eye className="w-3.5 h-3.5" />
                      <span>LAUNCH 3D WORKSPACE</span>
                    </span>
                  </div>
                </div>

                {/* Card Body: Details & Metadata */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Title */}
                    {editingId === project.id ? (
                      <div className="flex items-center space-x-2 mb-2">
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && saveRename(project.id)}
                          className="bg-[#070A0F] text-slate-100 text-sm font-bold px-2.5 py-1.5 rounded-lg border border-gold-500 focus:outline-none w-full"
                          autoFocus
                        />
                        <button
                          onClick={() => saveRename(project.id)}
                          className="text-xs bg-gold-500 text-charcoal-950 font-bold px-3 py-1.5 rounded-lg hover:bg-gold-400 cursor-pointer"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <h4
                        onClick={() => onOpenProject(project.id)}
                        className="text-base font-display font-bold text-white group-hover:text-gold-200 transition-colors cursor-pointer leading-snug line-clamp-1"
                      >
                        {project.title}
                      </h4>
                    )}

                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed font-sans">
                      {project.description}
                    </p>
                  </div>

                  {/* Technical Metric Indicators */}
                  <div className="grid grid-cols-3 gap-2 py-2.5 px-3 rounded-xl bg-white/[0.02] border border-white/[0.06] my-3.5">
                    <div>
                      <span className="text-[9px] text-slate-400 uppercase font-mono block">Floors</span>
                      <span className="text-xs font-bold text-slate-200 flex items-center mt-0.5">
                        <Layers className="w-3 h-3 text-gold-400 mr-1" />
                        {spec?.floors.length || 1} Levels
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 uppercase font-mono block">Built-Up</span>
                      <span className="text-xs font-bold text-slate-200 mt-0.5 block font-mono">
                        {spec ? Math.round(spec.totalBuiltUpAreaSqFt).toLocaleString() : 0} sq.ft
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 uppercase font-mono block">Revision</span>
                      <span className="text-xs font-bold text-cyan-400 mt-0.5 block font-mono">
                        v{currentVersion?.versionNumber || 1}.0
                      </span>
                    </div>
                  </div>

                  {/* Financial & Time Estimates */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/[0.06] mb-3.5">
                    <div>
                      <span className="text-[9px] text-slate-400 block font-mono">Prelim. Estimate</span>
                      <span className="text-xs sm:text-sm font-bold text-gold-gradient font-mono">
                        {est ? formatCurrency(est.totalCost) : '—'}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] text-slate-400 block font-mono">Timeline</span>
                      <span className="text-xs font-semibold text-slate-300 flex items-center justify-end font-mono">
                        <Clock className="w-3 h-3 text-cyan-400 mr-1" />
                        {est ? `${est.totalWeeks} Weeks` : '—'}
                      </span>
                    </div>
                  </div>

                  {/* Bottom Action Button */}
                  <button
                    onClick={() => onOpenProject(project.id)}
                    className="w-full py-2 px-3.5 rounded-xl bg-white/[0.03] group-hover:bg-gold-500 group-hover:text-charcoal-950 text-slate-300 text-xs font-bold tracking-wide border border-white/[0.08] group-hover:border-gold-400 transition-all flex items-center justify-center space-x-1.5 shadow-sm cursor-pointer"
                  >
                    <span>Open 3D Workspace</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

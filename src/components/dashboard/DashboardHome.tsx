import React, { useState } from 'react';
import { Project, JourneyType } from '../../types/project';
import { ProjectList } from './ProjectList';
import { JourneyWizard } from './JourneyWizard';
import {
  Compass,
  Layers,
  Repeat,
  Sparkles,
  ArrowRight,
  Building2,
  PlusCircle,
  TrendingUp,
} from 'lucide-react';

interface DashboardHomeProps {
  projects: Project[];
  onOpenProject: (projectId: string) => void;
  onDuplicateProject: (projectId: string) => void;
  onDeleteProject: (projectId: string) => void;
  onRenameProject: (projectId: string, newTitle: string) => void;
  onProjectCreated: (project: Project) => void;
}

export const DashboardHome: React.FC<DashboardHomeProps> = ({
  projects,
  onOpenProject,
  onDuplicateProject,
  onDeleteProject,
  onRenameProject,
  onProjectCreated,
}) => {
  const [activeJourney, setActiveJourney] = useState<JourneyType | null>(null);

  const handleStartJourney = (journey: JourneyType) => {
    setActiveJourney(journey);
  };

  return (
    <div className="min-h-screen bg-theme-base text-theme-primary blueprint-grid pb-20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-12">
        {/* Main Dashboard Header */}
        <div className="text-center sm:text-left border-b border-theme-subtle pb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-400 text-xs font-mono mb-2">
              <Building2 className="w-3.5 h-3.5" />
              <span>ARCHITECTURAL WORKSPACE</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-theme-primary tracking-tight">
              What are you building today?
            </h1>
            <p className="text-sm text-theme-secondary mt-1">
              Select one of three structured journeys to synthesize, modify, or extend your building in 3D.
            </p>
          </div>
        </div>

        {/* EXACTLY THREE MAJOR OPTIONS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* OPTION 1: Don't Have an Idea? Structure -> 3D */}
          <div
            onClick={() => handleStartJourney('structure_to_3d')}
            className="group cursor-pointer rounded-2xl glass-panel p-6 border border-theme-subtle hover:border-gold-500/60 hover:shadow-gold-glow transition-all flex flex-col justify-between relative overflow-hidden"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-mono uppercase tracking-widest text-theme-secondary bg-theme-card px-2 py-0.5 rounded border border-theme-subtle">
                  Option 01
                </span>
                <div className="w-10 h-10 rounded-xl bg-theme-card border border-gold-500/30 flex items-center justify-center text-gold-400 group-hover:scale-110 transition-transform">
                  <Compass className="w-5 h-5" />
                </div>
              </div>

              <h2 className="text-xl font-display font-bold text-theme-primary group-hover:text-gold-400 transition-colors">
                Don’t Have an Idea?
              </h2>
              <p className="text-xs font-mono font-semibold text-gold-400 mt-1">
                Structure → 3D
              </p>

              <p className="text-xs text-theme-secondary mt-3 leading-relaxed">
                “Start with your requirements and let BuildVision AI create a preliminary building concept.”
              </p>

              {/* Flow Pills */}
              <div className="mt-4 pt-3 border-t border-theme-subtle">
                <span className="text-[10px] text-theme-secondary uppercase font-mono block mb-1.5">Flow:</span>
                <div className="flex items-center text-[10px] font-mono text-theme-secondary space-x-1 overflow-x-auto">
                  <span className="bg-theme-card border border-theme-subtle px-1.5 py-0.5 rounded text-gold-400">Requirements</span>
                  <span>→</span>
                  <span className="bg-theme-card border border-theme-subtle px-1.5 py-0.5 rounded">Structure</span>
                  <span>→</span>
                  <span className="bg-theme-card border border-theme-subtle px-1.5 py-0.5 rounded">3D</span>
                  <span>→</span>
                  <span className="bg-theme-card border border-theme-subtle px-1.5 py-0.5 rounded">Estimation</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-3 flex items-center justify-between text-xs text-gold-300 font-bold">
              <span>Select Option 1</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* OPTION 2: Have an Idea: Idea -> Structure -> 3D */}
          <div
            onClick={() => handleStartJourney('idea_to_structure')}
            className="group cursor-pointer rounded-2xl glass-panel-gold p-6 border border-gold-500/40 hover:shadow-gold-glow-lg transition-all flex flex-col justify-between relative overflow-hidden"
          >
            <div className="absolute -right-6 -top-6 w-20 h-20 bg-gold-500/10 rounded-full blur-xl pointer-events-none"></div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-mono uppercase tracking-widest text-gold-400 bg-gold-500/20 px-2 py-0.5 rounded border border-gold-500/30">
                  Option 02 • Recommended
                </span>
                <div className="w-10 h-10 rounded-xl bg-gold-500/20 border border-gold-500/40 flex items-center justify-center text-gold-300 group-hover:scale-110 transition-transform shadow-gold-glow">
                  <Layers className="w-5 h-5" />
                </div>
              </div>

              <h2 className="text-xl font-display font-bold text-theme-primary group-hover:text-gold-400 transition-colors">
                Have an Idea
              </h2>
              <p className="text-xs font-mono font-semibold text-gold-400 mt-1">
                Idea → Structure → 3D
              </p>

              <p className="text-xs text-theme-secondary mt-3 leading-relaxed">
                “Describe your building idea and turn it into an interactive 3D concept.”
              </p>

              {/* Items allowed */}
              <div className="mt-4 pt-3 border-t border-gold-500/20">
                <span className="text-[10px] text-gold-400/90 uppercase font-mono block mb-1.5">Includes:</span>
                <div className="flex flex-wrap gap-1">
                  {['Floors', 'Bedrooms', 'Kitchen', 'Living', 'Bathrooms', 'Balcony', 'Parking'].map(tag => (
                    <span key={tag} className="text-[10px] bg-theme-card text-theme-secondary px-1.5 py-0.5 rounded border border-theme-subtle">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-3 flex items-center justify-between text-xs text-gold-400 font-bold">
              <span>Select Option 2</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* OPTION 3: Already Built: Changes / Additional Floor -> Structure -> 3D */}
          <div
            onClick={() => handleStartJourney('already_built_changes')}
            className="group cursor-pointer rounded-2xl glass-panel p-6 border border-theme-subtle hover:border-cyan-500/60 hover:shadow-blueprint-glow transition-all flex flex-col justify-between relative overflow-hidden"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                  Option 03 • Renovation
                </span>
                <div className="w-10 h-10 rounded-xl bg-theme-card border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                  <Repeat className="w-5 h-5" />
                </div>
              </div>

              <h2 className="text-xl font-display font-bold text-theme-primary group-hover:text-cyan-400 transition-colors">
                Already Built
              </h2>
              <p className="text-xs font-mono font-semibold text-cyan-400 mt-1">
                Changes / Add Floor → Structure → 3D
              </p>

              <p className="text-xs text-theme-secondary mt-3 leading-relaxed">
                “Start with your existing building and visualize proposed changes or additions.”
              </p>

              {/* Scenarios */}
              <div className="mt-4 pt-3 border-t border-theme-subtle">
                <span className="text-[10px] text-cyan-400/80 uppercase font-mono block mb-1.5">Scenarios:</span>
                <div className="flex flex-wrap gap-1">
                  {['Add Floor', 'Add Balcony', 'Extend Room', 'Renovate', 'Before/After'].map(sc => (
                    <span key={sc} className="text-[10px] bg-theme-card text-cyan-400 px-1.5 py-0.5 rounded border border-theme-subtle">
                      {sc}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-3 flex items-center justify-between text-xs text-cyan-300 font-bold">
              <span>Select Option 3</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>

        {/* RECENT PROJECTS LIST */}
        <ProjectList
          projects={projects}
          onOpenProject={onOpenProject}
          onDuplicateProject={onDuplicateProject}
          onDeleteProject={onDeleteProject}
          onRenameProject={onRenameProject}
        />
      </div>

      {/* Guided Creation Wizard Modal */}
      {activeJourney && (
        <JourneyWizard
          journeyType={activeJourney}
          isOpen={!!activeJourney}
          onClose={() => setActiveJourney(null)}
          onProjectCreated={(project) => {
            setActiveJourney(null);
            onProjectCreated(project);
          }}
        />
      )}
    </div>
  );
};

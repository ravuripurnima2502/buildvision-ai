import React, { useState } from 'react';
import { Project, JourneyType } from '../../types/project';
import { ProjectList } from './ProjectList';
import { JourneyWizard } from './JourneyWizard';
import { ArchitecturalCADBackground } from './ArchitecturalCADBackground';
import {
  Compass,
  Layers,
  Repeat,
  Sparkles,
  ArrowRight,
  Building2,
  Cpu,
  CheckCircle2,
  FolderKanban,
  Box,
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

  // Metrics
  const totalArea = projects.reduce((acc, p) => {
    const v = p.versions.find(ver => ver.id === p.currentVersionId) || p.versions[0];
    return acc + (v?.buildingSpec?.totalBuiltUpAreaSqFt || 0);
  }, 0);

  return (
    <div className="min-h-screen bg-theme-base text-slate-100 relative pb-24 overflow-hidden">
      {/* Animated CAD / Blueprint Architectural Background */}
      <ArchitecturalCADBackground />

      <div className="relative z-10 max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-10">
        {/* ======================================================== */}
        {/* TOP TECHNICAL COMMAND BAR                                */}
        {/* ======================================================== */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono tracking-wider text-slate-400 border-b border-white/[0.08] pb-3.5">
          <div className="flex items-center space-x-3">
            <span className="flex items-center space-x-1.5 text-gold-400 font-semibold">
              <Building2 className="w-3.5 h-3.5" />
              <span>BUILDVISION AI</span>
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-cyan-400 flex items-center space-x-1">
              <Cpu className="w-3 h-3" />
              <span>BIM REPOSITORY</span>
            </span>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="hidden sm:inline text-slate-400">COORDINATES: WGS84 // UTM-32N</span>
          </div>

          <div className="flex items-center space-x-3 text-[10px]">
            <span className="bg-white/[0.03] border border-white/[0.08] px-2.5 py-1 rounded text-slate-300 font-mono">
              TOTAL AREA: {Math.round(totalArea).toLocaleString()} SQ.FT
            </span>
            <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-2.5 py-1 rounded flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>BIM KERNEL ONLINE</span>
            </span>
          </div>
        </div>

        {/* ======================================================== */}
        {/* HERO TITLE SECTION                                       */}
        {/* ======================================================== */}
        <div className="text-center lg:text-left space-y-2">
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            What are you building today?
          </h1>
          <p className="text-sm sm:text-base text-slate-300 font-sans max-w-2xl leading-relaxed">
            Choose a starting pathway to visualize, synthesize, or extend your architectural structure in interactive 3D.
          </p>
        </div>

        {/* ======================================================== */}
        {/* THREE CORE JOURNEY WORKFLOW CARDS                        */}
        {/* ======================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {/* CARD 1: REQUIREMENTS TO 3D */}
          <div
            onClick={() => handleStartJourney('structure_to_3d')}
            className="cad-panel-interactive flex flex-col justify-between overflow-hidden group cursor-pointer"
          >
            {/* Visual Image Header */}
            <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-[#070A0F]">
              <img
                src="/thumbnails/blueprint_to_3d.jpg"
                alt="Blueprint transforming into 3D structure"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900 via-charcoal-900/30 to-transparent pointer-events-none"></div>

              {/* Technical Overlay Badges */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-md bg-[#070A0F]/80 backdrop-blur-md border border-white/[0.08] text-slate-300">
                  Option 01
                </span>
                <span className="text-[10px] font-mono text-gold-400 bg-gold-500/20 backdrop-blur-md border border-gold-500/40 px-2 py-0.5 rounded">
                  AI SYNTHESIS
                </span>
              </div>

              <div className="absolute bottom-3 left-3 z-10 flex items-center space-x-1.5 text-[11px] font-mono text-cyan-300 bg-[#070A0F]/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-cyan-500/30">
                <Compass className="w-3.5 h-3.5 text-cyan-400" />
                <span>REQUIREMENTS → 3D</span>
              </div>
            </div>

            {/* Card Content Body */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h2 className="text-xl font-display font-bold text-white group-hover:text-gold-200 transition-colors">
                  Don’t Have an Idea?
                </h2>
                <p className="text-xs font-mono font-semibold text-gold-400 mt-1">
                  Structure → 3D
                </p>
                <p className="text-xs sm:text-sm text-slate-300 mt-2.5 leading-relaxed font-sans">
                  Start with your site boundary and parameters. BuildVision AI generates a code-compliant structural concept.
                </p>

                {/* Workflow Tag Pills */}
                <div className="mt-4 pt-3 border-t border-white/[0.06] flex flex-wrap gap-1.5">
                  <span className="text-[10px] font-mono bg-white/[0.03] border border-white/[0.08] px-2 py-0.5 rounded text-slate-300">Plot Boundary</span>
                  <span className="text-[10px] font-mono bg-white/[0.03] border border-white/[0.08] px-2 py-0.5 rounded text-slate-300">Family Size</span>
                  <span className="text-[10px] font-mono bg-white/[0.03] border border-white/[0.08] px-2 py-0.5 rounded text-slate-300">Budget Tier</span>
                  <span className="text-[10px] font-mono bg-gold-500/10 border border-gold-500/30 px-2 py-0.5 rounded text-gold-300">Auto-Floor Plan</span>
                </div>
              </div>

              {/* Bottom CTA */}
              <div className="pt-2 flex items-center justify-between text-xs text-gold-400 font-bold font-mono">
                <span>Configure Requirements</span>
                <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.1] group-hover:border-gold-500/50 flex items-center justify-center text-gold-400 group-hover:bg-gold-500 group-hover:text-charcoal-950 transition-all">
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          </div>

          {/* CARD 2: HAVE AN IDEA (RECOMMENDED PRIMARY) */}
          <div
            onClick={() => handleStartJourney('idea_to_structure')}
            className="cad-panel-interactive flex flex-col justify-between overflow-hidden group cursor-pointer border-gold-500/50 relative shadow-gold-glow"
          >
            {/* Top Recommended Banner */}
            <div className="bg-gradient-to-r from-gold-600 via-gold-500 to-amber-500 text-charcoal-950 text-[10px] font-bold font-mono uppercase tracking-widest py-1 px-4 text-center flex items-center justify-center space-x-1.5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 fill-current" />
              <span>PRIMARY WORKFLOW • RECOMMENDED</span>
            </div>

            {/* Visual Image Header */}
            <div className="relative h-56 sm:h-60 w-full overflow-hidden bg-[#070A0F]">
              <img
                src="/thumbnails/exterior.jpg"
                alt="Photorealistic modern two-storey villa"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900 via-charcoal-900/20 to-transparent pointer-events-none"></div>

              {/* Technical Overlay Badges */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-md bg-[#070A0F]/85 backdrop-blur-md border border-gold-500/60 text-gold-300 font-bold">
                  Option 02
                </span>
                <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950/80 backdrop-blur-md border border-emerald-500/40 px-2.5 py-1 rounded flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>BIM READY</span>
                </span>
              </div>

              <div className="absolute bottom-3 left-3 z-10 flex items-center space-x-2 text-[11px] font-mono text-gold-300 bg-[#070A0F]/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-gold-500/40 shadow-lg">
                <Layers className="w-3.5 h-3.5 text-gold-400" />
                <span className="font-semibold">2 FLOORS • CUTAWAY • 3D WALKTHROUGH</span>
              </div>
            </div>

            {/* Card Content Body */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h2 className="text-2xl font-display font-bold text-white group-hover:text-gold-200 transition-colors">
                  Have an Idea
                </h2>
                <p className="text-xs font-mono font-semibold text-gold-400 mt-1">
                  Idea → Structure → 3D
                </p>
                <p className="text-xs sm:text-sm text-slate-200 mt-2.5 leading-relaxed font-sans">
                  Describe your desired layout in natural language and transform it into a coordinate-accurate 3D BIM model.
                </p>

                {/* Items Allowed & Room Feature Pills */}
                <div className="mt-4 pt-3 border-t border-gold-500/20 flex flex-wrap gap-1.5">
                  {['2 Floors', 'Bedrooms', 'Chef Kitchen', 'Living Room', 'Balcony', 'Pool & Parking', 'Live BOQ'].map(tag => (
                    <span
                      key={tag}
                      className="text-[10px] font-mono bg-gold-500/10 border border-gold-500/30 px-2 py-0.5 rounded text-gold-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom CTA Button */}
              <button
                type="button"
                className="btn-gold w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold tracking-wide shadow-gold-glow flex items-center justify-center space-x-2 cursor-pointer mt-2"
              >
                <span>Start from Idea</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5] group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* CARD 3: EXISTING BUILDING & FLOOR ADDITION */}
          <div
            onClick={() => handleStartJourney('already_built_changes')}
            className="cad-panel-interactive flex flex-col justify-between overflow-hidden group cursor-pointer"
          >
            {/* Visual Image Header */}
            <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-[#070A0F]">
              <img
                src="/thumbnails/second_floor_addition.jpg"
                alt="Existing house with proposed second floor addition"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900 via-charcoal-900/30 to-transparent pointer-events-none"></div>

              {/* Technical Overlay Badges */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-md bg-[#070A0F]/80 backdrop-blur-md border border-white/[0.08] text-slate-300">
                  Option 03
                </span>
                <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/80 backdrop-blur-md border border-cyan-500/40 px-2 py-0.5 rounded">
                  RENOVATION & EXTENSION
                </span>
              </div>

              <div className="absolute bottom-3 left-3 z-10 flex items-center space-x-1.5 text-[11px] font-mono text-cyan-300 bg-[#070A0F]/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-cyan-500/30">
                <Repeat className="w-3.5 h-3.5 text-cyan-400" />
                <span>BEFORE / AFTER DELTA</span>
              </div>
            </div>

            {/* Card Content Body */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h2 className="text-xl font-display font-bold text-white group-hover:text-cyan-200 transition-colors">
                  Already Built
                </h2>
                <p className="text-xs font-mono font-semibold text-cyan-400 mt-1">
                  Changes / Add Floor → Structure → 3D
                </p>
                <p className="text-xs sm:text-sm text-slate-300 mt-2.5 leading-relaxed font-sans">
                  Start with your existing building and visualize proposed changes: add an entire second floor, cantilever a balcony, and compare Before vs After.
                </p>

                {/* Scenarios Tag Pills */}
                <div className="mt-4 pt-3 border-t border-white/[0.06] flex flex-wrap gap-1.5">
                  <span className="text-[10px] font-mono bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 rounded text-cyan-300">Add Second Floor</span>
                  <span className="text-[10px] font-mono bg-white/[0.03] border border-white/[0.08] px-2 py-0.5 rounded text-slate-300">Cantilever Balcony</span>
                  <span className="text-[10px] font-mono bg-white/[0.03] border border-white/[0.08] px-2 py-0.5 rounded text-slate-300">Room Extension</span>
                  <span className="text-[10px] font-mono bg-white/[0.03] border border-white/[0.08] px-2 py-0.5 rounded text-slate-300">Before vs After</span>
                </div>
              </div>

              {/* Bottom CTA */}
              <div className="pt-2 flex items-center justify-between text-xs text-cyan-300 font-bold font-mono">
                <span>Start Extension Flow</span>
                <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.1] group-hover:border-cyan-500/50 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500 group-hover:text-charcoal-950 transition-all">
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* RECENT PROJECTS GALLERY                                  */}
        {/* ======================================================== */}
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

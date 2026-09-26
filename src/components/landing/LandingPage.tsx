import React from 'react';
import { Hero3DPreview } from '../3d/Hero3DPreview';
import {
  ArrowRight,
  Layers,
  Compass,
  Repeat,
  DollarSign,
  Clock,
  Bot,
  Presentation,
  CheckCircle2,
  Building2,
  Ruler,
  Eye,
  ShieldCheck,
  ChevronRight,
  Cpu,
  FileSpreadsheet,
  Boxes,
  Sparkles,
} from 'lucide-react';

interface LandingPageProps {
  onStartBuilding: () => void;
  onSelectJourney: (journey: 'structure_to_3d' | 'idea_to_structure' | 'already_built_changes') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartBuilding,
  onSelectJourney,
}) => {
  const steps = [
    { num: '01', title: 'Define Spatial Brief', desc: 'Input plot dimensions, family requirements, or describe your vision in natural language.', icon: Compass },
    { num: '02', title: 'Generate 3D BIM Model', desc: 'AI translates parameters into a coordinate-accurate, multi-level architectural structure.', icon: Layers },
    { num: '03', title: 'Cutaway & Walkthrough', desc: 'Inspect floor-by-floor with plan cutaways, daylight simulation, and cinematic interior tours.', icon: Eye },
    { num: '04', title: 'Modify in Natural Language', desc: 'Request architectural revisions: add balconies, cantilever rooms, or stack additional floors.', icon: Repeat },
    { num: '05', title: 'Live Change Impact Delta', desc: 'Instantly view exact square footage delta, material quantity shifts, and cost impact.', icon: Ruler },
    { num: '06', title: 'Itemized BOQ & Timeline', desc: 'Turnkey Bill of Quantities with editable unit rates and phased construction Gantt schedule.', icon: DollarSign },
    { num: '07', title: 'Client Presentation Mode', desc: 'Switch to a distraction-free executive pitch viewport with live Before/After comparison.', icon: Presentation },
    { num: '08', title: 'BIM Specification Export', desc: 'Export full coordinate specifications and project metadata ready for construction teams.', icon: Boxes },
  ];

  return (
    <div className="min-h-screen bg-theme-base text-slate-100 blueprint-grid pb-24 relative overflow-hidden">
      {/* Subtle CAD Background Grid Glow */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-gradient-to-b from-gold-500/[0.04] to-transparent blur-[140px] pointer-events-none"></div>
      <div className="absolute top-64 right-10 w-[500px] h-[300px] bg-cyan-500/[0.03] blur-[120px] pointer-events-none"></div>

      {/* ======================================================== */}
      {/* HERO SECTION                                             */}
      {/* ======================================================== */}
      <section className="relative pt-6 sm:pt-10 lg:pt-14 pb-16 px-4 sm:px-6 lg:px-8 max-w-[1560px] mx-auto z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-14 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-5 xl:col-span-5 space-y-6 text-center lg:text-left">
            {/* Engineering Technical Badge */}
            <div className="inline-flex items-center space-x-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-gold-500/30 text-gold-300 text-xs font-mono shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-300">
                Civil Engineering • 3D BIM Synthesis
              </span>
            </div>

            {/* Hero Main Headline */}
            <div className="space-y-3">
              <h1 className="font-display text-4xl sm:text-5xl xl:text-6xl font-bold tracking-tight text-white leading-[1.08]">
                See your building <br />
                <span className="text-gold-gradient">before it is built.</span>
              </h1>
              <p className="text-base sm:text-lg text-slate-300 font-sans font-normal leading-relaxed max-w-xl mx-auto lg:mx-0">
                Transform conceptual briefs or existing structures into cutaway 3D BIM models with live bill-of-quantities (BOQ), material deltas, and construction forecasts.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                onClick={onStartBuilding}
                className="btn-gold w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-sm tracking-wide shadow-gold-glow flex items-center justify-center space-x-2.5 cursor-pointer"
              >
                <span>Start Building Now</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>

              <button
                onClick={() => onSelectJourney('already_built_changes')}
                className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] hover:border-cyan-500/40 text-slate-200 hover:text-cyan-300 text-xs font-mono font-semibold transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Repeat className="w-3.5 h-3.5 text-cyan-400" />
                <span>Test 2nd Floor Addition</span>
              </button>
            </div>

            {/* Engineering Telemetry Row */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-white/[0.08] text-left">
              <div>
                <p className="font-mono text-lg font-bold text-gold-400">3 Workflows</p>
                <p className="text-[11px] text-slate-400 font-sans">Requirements, Brief, As-Built</p>
              </div>
              <div className="border-l border-white/[0.08] pl-4">
                <p className="font-mono text-lg font-bold text-white">Live Delta</p>
                <p className="text-[11px] text-slate-400 font-sans">Instant Area & BOQ Impact</p>
              </div>
              <div className="border-l border-white/[0.08] pl-4">
                <p className="font-mono text-lg font-bold text-cyan-400">AI Civil Robo</p>
                <p className="text-[11px] text-slate-400 font-sans">Technical Copilot</p>
              </div>
            </div>
          </div>

          {/* Right 3D Interactive Hero Preview */}
          <div className="lg:col-span-7 xl:col-span-7 w-full z-10">
            <Hero3DPreview />
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3 CORE WORKFLOWS / STARTING POINTS                       */}
      {/* ======================================================== */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10 scroll-mt-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-gold-400 bg-gold-500/10 px-3 py-1 rounded-full border border-gold-500/20">
            ENGINEERING PATHWAYS
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mt-3">
            Choose Your Construction Starting Point
          </h2>
          <p className="text-sm text-slate-400 mt-2 font-sans">
            From raw parcel parameters to vertical expansions on existing buildings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {/* Option 1: Requirements to 3D */}
          <div
            onClick={() => onSelectJourney('structure_to_3d')}
            className="cad-panel-interactive p-6 flex flex-col justify-between group cursor-pointer"
          >
            <div>
              <div className="w-11 h-11 rounded-xl bg-white/[0.04] border border-white/[0.1] group-hover:border-gold-500/50 flex items-center justify-center text-gold-400 mb-5 group-hover:scale-105 transition-all">
                <Compass className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Option 01</span>
                <span className="text-[10px] font-mono text-gold-400 bg-gold-500/10 px-2 py-0.5 rounded">Structure → 3D</span>
              </div>
              <h3 className="text-xl font-display font-bold text-white mt-2 group-hover:text-gold-200 transition-colors">
                Don’t Have an Idea?
              </h3>
              <p className="text-xs text-slate-300 mt-2.5 leading-relaxed font-sans">
                Start with your core parameters (plot dimensions, budget tier, family size) and let BuildVision synthesize a code-compliant concept.
              </p>

              <div className="mt-4 pt-3 border-t border-white/[0.06] flex flex-wrap gap-1.5">
                <span className="text-[10px] font-mono bg-white/[0.03] border border-white/[0.08] px-2 py-0.5 rounded text-slate-300">Plot Boundary</span>
                <span className="text-[10px] font-mono bg-white/[0.03] border border-white/[0.08] px-2 py-0.5 rounded text-slate-300">Family Size</span>
                <span className="text-[10px] font-mono bg-white/[0.03] border border-white/[0.08] px-2 py-0.5 rounded text-slate-300">Budget Tier</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-gold-400 font-semibold font-mono">
              <span>Launch Requirements Flow</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Option 2: Idea to Structure (Recommended) */}
          <div
            onClick={() => onSelectJourney('idea_to_structure')}
            className="cad-panel-interactive p-6 flex flex-col justify-between group cursor-pointer border-gold-500/50 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 bg-gradient-to-l from-gold-500/20 to-transparent w-32 h-16 pointer-events-none"></div>
            <div>
              <div className="w-11 h-11 rounded-xl bg-gold-500/15 border border-gold-500/40 flex items-center justify-center text-gold-300 mb-5 group-hover:scale-105 transition-all">
                <Layers className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-gold-400 font-bold">Option 02 • Recommended</span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>BIM Ready</span>
                </span>
              </div>
              <h3 className="text-xl font-display font-bold text-white mt-2 group-hover:text-gold-200 transition-colors">
                Have an Idea
              </h3>
              <p className="text-xs text-slate-200 mt-2.5 leading-relaxed font-sans">
                Describe your dream home or project (floors, bedrooms, chef kitchen, balconies, parking) and translate it into a coordinate-accurate 3D BIM model.
              </p>

              <div className="mt-4 pt-3 border-t border-gold-500/20 flex flex-wrap gap-1.5">
                <span className="text-[10px] font-mono bg-gold-500/10 border border-gold-500/30 px-2 py-0.5 rounded text-gold-300">2 Floors</span>
                <span className="text-[10px] font-mono bg-gold-500/10 border border-gold-500/30 px-2 py-0.5 rounded text-gold-300">Chef Kitchen</span>
                <span className="text-[10px] font-mono bg-gold-500/10 border border-gold-500/30 px-2 py-0.5 rounded text-gold-300">Balcony</span>
                <span className="text-[10px] font-mono bg-gold-500/10 border border-gold-500/30 px-2 py-0.5 rounded text-gold-300">Pool & Parking</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gold-500/20 flex items-center justify-between text-xs text-gold-300 font-bold font-mono">
              <span>Start from Idea</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Option 3: Already Built / Add Floor */}
          <div
            onClick={() => onSelectJourney('already_built_changes')}
            className="cad-panel-interactive p-6 flex flex-col justify-between group cursor-pointer"
          >
            <div>
              <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-5 group-hover:scale-105 transition-all">
                <Repeat className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Option 03</span>
                <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded">Before / After</span>
              </div>
              <h3 className="text-xl font-display font-bold text-white mt-2 group-hover:text-cyan-200 transition-colors">
                Already Built
              </h3>
              <p className="text-xs text-slate-300 mt-2.5 leading-relaxed font-sans">
                Start with your existing building and visualize proposed changes: add an entire second floor, cantilever a balcony, extend rooms, and see live Before vs After.
              </p>

              <div className="mt-4 pt-3 border-t border-white/[0.06] flex flex-wrap gap-1.5">
                <span className="text-[10px] font-mono bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 rounded text-cyan-300">Add Second Floor</span>
                <span className="text-[10px] font-mono bg-white/[0.03] border border-white/[0.08] px-2 py-0.5 rounded text-slate-300">Cantilever Balcony</span>
                <span className="text-[10px] font-mono bg-white/[0.03] border border-white/[0.08] px-2 py-0.5 rounded text-slate-300">Room Extension</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-cyan-300 font-semibold font-mono">
              <span>Compare Existing vs Proposed</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 8-STEP ARCHITECTURAL PIPELINE (BALANCED GRID)            */}
      {/* ======================================================== */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10 scroll-mt-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-gold-400 bg-gold-500/10 px-3 py-1 rounded-full border border-gold-500/20">
            END-TO-END PIPELINE
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mt-3">
            How BuildVision AI Works
          </h2>
          <p className="text-xs text-slate-400 mt-2 font-sans">
            A seamless bridge from conceptual design to engineering estimates and client approval.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="cad-panel p-5 flex flex-col justify-between group hover:border-gold-500/40 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-3.5">
                    <span className="text-[11px] font-mono font-bold text-gold-400 bg-gold-500/10 px-2 py-0.5 rounded border border-gold-500/20">
                      STEP {step.num}
                    </span>
                    <Icon className="w-4 h-4 text-slate-400 group-hover:text-gold-300 transition-colors" />
                  </div>
                  <h4 className="text-sm font-display font-semibold text-white group-hover:text-gold-100 transition-colors">
                    {step.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed font-sans">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ======================================================== */}
      {/* AI CIVIL COPILOT SPOTLIGHT                               */}
      {/* ======================================================== */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        <div className="cad-panel p-8 sm:p-12 border-gold-500/30 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Mascot description */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-300 text-xs font-mono">
                <Bot className="w-3.5 h-3.5 text-gold-400" />
                <span>INTELLIGENT CIVIL COPILOT</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-display font-bold text-white">
                Meet Your Built-In AI Civil Engineer
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed font-sans">
                Accessible anywhere in the workspace, the Civil Robo mascot explains structural engineering logic, verifies load-bearing constraints, calculates material volumes, and translates complex jargon for clients.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-slate-300">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0" />
                  <span>Context-aware of selected floor & room</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Explains RCC, plinth & cantilever limits</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0" />
                  <span>Turnkey BOQ price & material breakdown</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>IS-456 & NBC architectural compliance</span>
                </div>
              </div>
            </div>

            {/* Feature Highlights Cards */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-4 rounded-xl bg-white/[0.03] border border-gold-500/20">
                <div className="flex items-center space-x-2.5 mb-1.5">
                  <Ruler className="w-4 h-4 text-gold-400" />
                  <h4 className="text-sm font-semibold text-white font-sans">Live Change Impact Drawer</h4>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  Modify any wall or add a room — immediately inspect the exact delta: floor area (+45 sq.ft), cement bags (+18), cost (+₹1,20,000), and schedule (+6 days).
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.03] border border-cyan-500/20">
                <div className="flex items-center space-x-2.5 mb-1.5">
                  <Presentation className="w-4 h-4 text-cyan-400" />
                  <h4 className="text-sm font-semibold text-white font-sans">Distraction-Free Presentation</h4>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  Switch from engineering CAD tools to an executive pitch viewport with smooth orbit camera, high-resolution cutaways, and Before/After ghost overlays.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* BOTTOM CTA & FOOTER                                      */}
      {/* ======================================================== */}
      <section className="pt-8 pb-16 px-4 max-w-4xl mx-auto text-center relative z-10">
        <h2 className="text-3xl sm:text-4xl font-display font-bold text-white">
          Ready to visualize your next building?
        </h2>
        <p className="text-sm text-slate-300 mt-2.5 max-w-lg mx-auto font-sans">
          Start from an idea, spatial parameters, or an existing structure to generate coordinate-accurate 3D BIM models with turnkey estimates.
        </p>
        <button
          onClick={onStartBuilding}
          className="btn-gold mt-6 px-8 py-3.5 rounded-xl font-bold text-sm tracking-wide shadow-gold-glow inline-flex items-center space-x-2 cursor-pointer"
        >
          <span>Open Projects Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>

      {/* Engineering Footer */}
      <footer className="border-t border-white/[0.08] max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 text-xs text-slate-400 font-mono flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <Building2 className="w-4 h-4 text-gold-400" />
          <span className="text-slate-300 font-bold">BUILDVISION AI</span>
          <span className="text-slate-600">|</span>
          <span>Architectural Synthesis & Civil Engineering</span>
        </div>
        <div className="flex items-center space-x-4 text-[11px]">
          <span>3D BIM Engine v2.0</span>
          <span>•</span>
          <span>Neon PostgreSQL Authenticated</span>
          <span>•</span>
          <span>Turnkey BOQ Formulation</span>
        </div>
      </footer>
    </div>
  );
};

import React from 'react';
import { Hero3DPreview } from '../3d/Hero3DPreview';
import {
  Sparkles,
  ArrowRight,
  Layers,
  Compass,
  Repeat,
  DollarSign,
  Clock,
  Bot,
  Presentation,
  CheckCircle2,
  Building,
  Ruler,
  Eye,
  ShieldCheck,
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
    { num: '01', title: 'Start with an Idea', desc: 'Choose from requirements, conceptual brief, or your existing built structure.', icon: Compass },
    { num: '02', title: 'Build the Structure', desc: 'AI converts spatial parameters into a watertight 3D architectural specification.', icon: Layers },
    { num: '03', title: 'Explore it in 3D', desc: 'Inspect floor-by-floor, rotate, zoom, cutaway, and take cinematic interior walkthroughs.', icon: Eye },
    { num: '04', title: 'Modify the Design', desc: 'Request natural language revisions: add balconies, enlarge rooms, or add floors.', icon: Repeat },
    { num: '05', title: 'Understand the Impact', desc: 'Instantly view Change Impact: exact area delta, materials shift, cost, and time.', icon: Ruler },
    { num: '06', title: 'Estimate Cost & Time', desc: 'Full Bill of Quantities (BOQ), editable unit rates, and phased Gantt timeline.', icon: DollarSign },
    { num: '07', title: 'Present to Your Client', desc: 'Switch to distraction-free client presentation mode with one click for pitch meetings.', icon: Presentation },
  ];

  return (
    <div className="min-h-screen bg-charcoal-950 text-slate-100 blueprint-grid pb-24">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Glow ambient background orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gold-500/10 blur-[130px] rounded-full pointer-events-none"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left z-10">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-300 text-xs font-mono tracking-wider shadow-gold-glow">
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              <span>NEXT-GEN CIVIL BIM & VISUALIZATION PLATFORM</span>
            </div>

            <div className="space-y-2">
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
                BUILDVISION <span className="text-gold-gradient">AI</span>
              </h1>
              <p className="font-display text-xl sm:text-2xl font-semibold text-gold-200/90 tracking-wide italic">
                “Visualize it. Understand it. Improve it. Then build it.”
              </p>
            </div>

            <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed max-w-xl mx-auto lg:mx-0">
              Transform building ideas, existing structures, and preliminary plans into interactive 3D construction experiences. Connect architectural design directly with real-time material, cost, and time impacts.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onStartBuilding}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-charcoal-950 font-bold text-base shadow-gold-glow hover:brightness-110 active:scale-95 transition-all flex items-center justify-center space-x-3"
              >
                <span>Start Building Now</span>
                <ArrowRight className="w-5 h-5 stroke-[2.5]" />
              </button>

              <button
                onClick={() => onSelectJourney('already_built_changes')}
                className="w-full sm:w-auto px-6 py-4 rounded-xl glass-panel text-slate-200 hover:text-gold-300 hover:border-gold-500/40 text-sm font-semibold transition-all flex items-center justify-center space-x-2"
              >
                <Repeat className="w-4 h-4 text-gold-400" />
                <span>Test Second Floor Addition</span>
              </button>
            </div>

            {/* Value Badges */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-800/80 text-left">
              <div>
                <p className="font-mono text-xl font-bold text-gold-300">3 Journeys</p>
                <p className="text-xs text-slate-400">Idea, Blueprint or Existing</p>
              </div>
              <div>
                <p className="font-mono text-xl font-bold text-white">Live Delta</p>
                <p className="text-xs text-slate-400">Instant Cost & Time Impact</p>
              </div>
              <div>
                <p className="font-mono text-xl font-bold text-gold-400">AI Civil Robo</p>
                <p className="text-xs text-slate-400">Educational Planning Mascot</p>
              </div>
            </div>
          </div>

          {/* Right 3D Interactive Hero Preview */}
          <div className="lg:col-span-6 w-full h-[440px] lg:h-[500px] z-10">
            <Hero3DPreview />
          </div>
        </div>
      </section>

      {/* The 3 Core Construction Journeys Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-xs font-mono uppercase tracking-widest text-gold-400 mb-2">
            TAILORED ENGINEERING PATHWAYS
          </h2>
          <p className="text-3xl sm:text-4xl font-display font-bold text-white">
            Choose Your Construction Starting Point
          </p>
          <p className="text-sm text-slate-400 mt-2">
            Whether starting from scratch or expanding an existing property, BuildVision AI guides you seamlessly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Option 1 */}
          <div
            onClick={() => onSelectJourney('structure_to_3d')}
            className="group cursor-pointer rounded-2xl glass-panel p-7 border border-slate-800 hover:border-gold-500/50 hover:shadow-gold-glow transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-charcoal-800 border border-gold-500/30 flex items-center justify-center text-gold-400 mb-5 group-hover:scale-110 transition-transform">
                <Compass className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Option 01</span>
              <h3 className="text-xl font-display font-bold text-white mt-1 group-hover:text-gold-300 transition-colors">
                Don’t Have an Idea?
              </h3>
              <p className="text-sm font-medium text-gold-400/90 font-mono mt-1">Structure → 3D</p>
              <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                Start with your requirements (plot dimensions, budget tier, family size) and let BuildVision AI generate a structurally sound concept.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-gold-300 font-semibold">
              <span>Launch Requirements Flow</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Option 2 */}
          <div
            onClick={() => onSelectJourney('idea_to_structure')}
            className="group cursor-pointer rounded-2xl glass-panel-gold p-7 border border-gold-500/40 hover:shadow-gold-glow-lg transition-all flex flex-col justify-between relative overflow-hidden"
          >
            <div className="absolute -right-8 -top-8 w-24 h-24 bg-gold-500/10 rounded-full blur-xl pointer-events-none"></div>
            <div>
              <div className="w-12 h-12 rounded-xl bg-gold-500/20 border border-gold-500/40 flex items-center justify-center text-gold-300 mb-5 group-hover:scale-110 transition-transform">
                <Layers className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-gold-400">Option 02 • Recommended</span>
              <h3 className="text-xl font-display font-bold text-white mt-1 group-hover:text-gold-300 transition-colors">
                Have an Idea
              </h3>
              <p className="text-sm font-medium text-gold-300 font-mono mt-1">Idea → Structure → 3D</p>
              <p className="text-xs text-slate-200 mt-3 leading-relaxed">
                Describe your dream home or project (floors, bedrooms, chef kitchen, balconies, parking) and translate it into a coordinate-accurate 3D BIM model.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-gold-500/20 flex items-center justify-between text-xs text-gold-300 font-bold">
              <span>Start from Idea</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Option 3 */}
          <div
            onClick={() => onSelectJourney('already_built_changes')}
            className="group cursor-pointer rounded-2xl glass-panel p-7 border border-slate-800 hover:border-gold-500/50 hover:shadow-gold-glow transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-charcoal-800 border border-gold-500/30 flex items-center justify-center text-cyan-400 mb-5 group-hover:scale-110 transition-transform">
                <Repeat className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Option 03</span>
              <h3 className="text-xl font-display font-bold text-white mt-1 group-hover:text-gold-300 transition-colors">
                Already Built
              </h3>
              <p className="text-sm font-medium text-cyan-300 font-mono mt-1">Changes / Add Floor → 3D</p>
              <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                Start with your existing building and visualize proposed changes: add an entire second floor, cantilever a balcony, extend rooms, and see Before vs After.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-cyan-300 font-semibold">
              <span>Compare Existing vs Proposed</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works (7 Step Architectural Pipeline) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-mono uppercase tracking-widest text-gold-400">
            ENGINEERING WORKFLOW
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mt-1">
            How BuildVision AI Works
          </h2>
          <p className="text-xs text-slate-400 mt-2">
            A unified end-to-end workflow from conceptual visualization to client sign-off.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="relative rounded-xl glass-panel p-5 border border-slate-800/80 hover:border-gold-500/30 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold text-gold-400/80 bg-gold-500/10 px-2.5 py-1 rounded-md border border-gold-500/20">
                      STEP {step.num}
                    </span>
                    <Icon className="w-5 h-5 text-slate-400 group-hover:text-gold-300 transition-colors" />
                  </div>
                  <h4 className="text-base font-display font-semibold text-white group-hover:text-gold-200 transition-colors">
                    {step.title}
                  </h4>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Differentiating Features Showcase */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-3xl glass-panel-gold p-8 sm:p-12 border border-gold-500/30 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-5">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-300 text-xs font-mono">
                <Bot className="w-3.5 h-3.5 text-gold-400" />
                <span>INTELLIGENT CIVIL COPILOT</span>
              </div>
              <h3 className="text-3xl font-display font-bold text-white">
                Meet Your Floating AI Civil Engineer Mascot
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Positioned unobtrusively at the corner of your screen, our tiny metallic Civil Robo explains complex architectural nuances in plain English for clients and homeowners.
              </p>
              <ul className="space-y-2.5 text-xs text-slate-200">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0" />
                  <span>Context-aware: Automatically knows which floor and room you are viewing</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0" />
                  <span>Explains civil terms: RCC, plinth beams, shear walls, and cantilever limits</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0" />
                  <span>Clear preliminary guidance disclaimer ensuring client transparency</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-charcoal-900/90 border border-gold-500/20">
                <div className="flex items-center space-x-3 mb-2">
                  <Ruler className="w-5 h-5 text-gold-400" />
                  <h4 className="text-sm font-semibold text-white">Instant Change Impact Analysis</h4>
                </div>
                <p className="text-xs text-slate-300">
                  Resize any bedroom or add a terrace — watch the exact delta update live: +45 sq.ft floor area, +18 bags cement, +₹1,20,000 cost, and +6 construction days.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-charcoal-900/90 border border-gold-500/20">
                <div className="flex items-center space-x-3 mb-2">
                  <Presentation className="w-5 h-5 text-gold-400" />
                  <h4 className="text-sm font-semibold text-white">One-Click Client Presentation Mode</h4>
                </div>
                <p className="text-xs text-slate-300">
                  Hide all technical editors and switch to an executive presentation viewport with auto-rotating models, Before/After toggle, and commercial estimates.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="pt-10 px-4 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-display font-bold text-white">
          Ready to visualize and plan your next building?
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-xl mx-auto">
          Start your journey with BuildVision AI and go from an idea or existing property to an interactive 3D model with preliminary BOQ estimates.
        </p>
        <button
          onClick={onStartBuilding}
          className="mt-6 px-8 py-3.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-charcoal-950 font-bold text-sm shadow-gold-glow hover:brightness-110 active:scale-95 transition-all inline-flex items-center space-x-2"
        >
          <span>Open BuildVision Workspace</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>
    </div>
  );
};

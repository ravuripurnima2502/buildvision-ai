import React, { useState, useMemo } from 'react';
import { Project } from '../../types/project';
import { BuildingCanvas } from '../3d/BuildingCanvas';
import { formatCurrency } from '../../utils/formatting';
import { generateWalkthroughStops } from '../3d/WalkthroughController';
import {
  X,
  RotateCcw,
  Sparkles,
  Clock,
  SplitSquareVertical,
  CheckCircle2,
  Building2,
  Video,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
} from 'lucide-react';

interface ClientPresentationProps {
  project: Project;
  onExit: () => void;
}

export const ClientPresentation: React.FC<ClientPresentationProps> = ({
  project,
  onExit,
}) => {
  const currentVersion = project.versions.find(v => v.id === project.currentVersionId) || project.versions[project.versions.length - 1];
  const previousVersion = project.versions.length > 1 ? project.versions[project.versions.length - 2] : null;

  const [compareMode, setCompareMode] = useState<'none' | 'ghost' | 'side_by_side'>('none');
  const [autoRotate, setAutoRotate] = useState(true);
  const [isWalkthrough, setIsWalkthrough] = useState(false);
  const [walkthroughStop, setWalkthroughStop] = useState(0);
  const [isAutoPlayTour, setIsAutoPlayTour] = useState(true);

  const spec = currentVersion.buildingSpec;
  const est = currentVersion.estimation;
  const delta = currentVersion.deltaFromPrevious;
  const walkthroughStops = useMemo(() => generateWalkthroughStops(spec), [spec]);

  return (
    <div className="fixed inset-0 z-50 bg-charcoal-950 text-white flex flex-col select-none overflow-hidden animate-fadeIn">
      {/* Presentation Top Bar (Clean Luxury Header) */}
      <header className="h-16 px-6 bg-charcoal-950/90 backdrop-blur-md border-b border-gold-500/20 flex items-center justify-between z-30">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-charcoal-950 shadow-gold-glow">
            <Building2 className="w-5 h-5 stroke-[2.4]" />
          </div>
          <div>
            <span className="text-[10px] font-mono tracking-widest uppercase text-gold-400">
              EXECUTIVE CLIENT PRESENTATION
            </span>
            <h1 className="text-lg font-display font-bold text-white leading-tight">
              {project.title}
            </h1>
          </div>
        </div>

        {/* Presentation Navigation & Actions */}
        <div className="flex items-center space-x-3">
          {previousVersion && (
            <button
              onClick={() => setCompareMode(prev => prev === 'none' ? 'ghost' : 'none')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-semibold flex items-center space-x-1.5 transition-all border ${
                compareMode !== 'none'
                  ? 'bg-cyan-500 text-charcoal-950 border-cyan-400 shadow-blueprint-glow'
                  : 'bg-charcoal-900 border-slate-800 text-cyan-300 hover:border-cyan-500/40'
              }`}
            >
              <SplitSquareVertical className="w-3.5 h-3.5" />
              <span>{compareMode !== 'none' ? 'Hide Comparison' : 'Compare Before/After'}</span>
            </button>
          )}

          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all border ${
              autoRotate
                ? 'bg-gold-500 text-charcoal-950 font-bold border-gold-400 shadow-gold-glow'
                : 'bg-charcoal-900 text-slate-300 border-slate-800'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5 inline mr-1" />
            <span>Auto Orbit</span>
          </button>

          <button
            onClick={onExit}
            title="Exit Presentation"
            className="p-2 rounded-xl bg-charcoal-900 hover:bg-charcoal-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Body: 3D Stage + Floating Executive Summary Cards */}
      <div className="flex-1 relative w-full h-full">
        {/* Fullscreen 3D Canvas */}
        <BuildingCanvas
          spec={spec}
          activeFloorNumber="all"
          cutawayMode={false}
          showRoof={true}
          autoRotate={autoRotate}
          comparisonSpec={compareMode !== 'none' && previousVersion ? previousVersion.buildingSpec : null}
          compareMode={compareMode}
          isWalkthroughActive={isWalkthrough}
          walkthroughStopIndex={walkthroughStop}
          onAdvanceWalkthrough={() => {
            if (isAutoPlayTour) {
              setWalkthroughStop((prev) => (prev + 1) % walkthroughStops.length);
            }
          }}
        />

        {/* Left Floating Overlay: Key Architectural Highlights */}
        <div className="absolute top-6 left-6 z-20 w-80 max-h-[calc(100vh-140px)] overflow-y-auto space-y-3 pointer-events-auto">
          {/* Main Specs Badge */}
          <div className="p-5 rounded-2xl glass-panel-gold border border-gold-500/40 shadow-2xl backdrop-blur-xl">
            <span className="text-[10px] font-mono uppercase tracking-widest text-gold-400 block mb-1">
              PROPOSED DESIGN SPECS
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-200 mt-2">
              <div className="p-2 rounded-lg bg-charcoal-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Total Area</span>
                <span className="font-bold text-white">{spec.totalBuiltUpAreaSqFt} sq.ft</span>
              </div>
              <div className="p-2 rounded-lg bg-charcoal-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Floors</span>
                <span className="font-bold text-gold-300">{spec.floors.length} Levels</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 mt-3 leading-relaxed">
              {currentVersion.description}
            </p>
          </div>

          {/* If there was a delta (e.g. Added Floor, Balcony, etc.) */}
          {delta && (
            <div className="p-4 rounded-2xl glass-panel border border-cyan-500/30 shadow-xl backdrop-blur-xl space-y-2">
              <div className="flex items-center space-x-1.5 text-xs font-mono text-cyan-300 font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>KEY DESIGN DECISIONS:</span>
              </div>
              <ul className="text-xs space-y-1.5 text-slate-300">
                {delta.changedComponents.map((c, i) => (
                  <li key={i} className="flex items-start space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Walkthrough Tour Quick Trigger */}
          <button
            onClick={() => {
              setIsWalkthrough(!isWalkthrough);
              setAutoRotate(false);
            }}
            className="w-full py-3 px-4 rounded-2xl bg-charcoal-900/90 hover:bg-gold-500 text-slate-200 hover:text-charcoal-950 border border-gold-500/40 text-xs font-bold font-mono tracking-wider transition-all flex items-center justify-center space-x-2 shadow-gold-glow"
          >
            <Video className="w-4 h-4 text-gold-400 group-hover:text-charcoal-950" />
            <span>{isWalkthrough ? 'Exit Cinematic Tour' : 'Launch Client Walkthrough'}</span>
          </button>
        </div>

        {/* Walkthrough Tour Active Controls (Centered Bottom Bar) */}
        {isWalkthrough && (
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30 pointer-events-auto flex items-center space-x-2 p-2 rounded-2xl glass-panel-gold border border-gold-500/40 shadow-2xl backdrop-blur-xl">
            <button
              onClick={() => setWalkthroughStop((prev) => (prev > 0 ? prev - 1 : walkthroughStops.length - 1))}
              className="p-2 rounded-xl bg-charcoal-900/80 hover:bg-gold-500 text-slate-300 hover:text-charcoal-950 border border-slate-700 transition-colors"
              title="Previous View"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsAutoPlayTour(!isAutoPlayTour)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center space-x-1.5 border transition-all ${
                isAutoPlayTour
                  ? 'bg-gold-500 text-charcoal-950 border-gold-400 shadow-gold-glow'
                  : 'bg-charcoal-900/80 text-slate-300 border-slate-700'
              }`}
              title={isAutoPlayTour ? 'Pause Autoplay' : 'Autoplay Tour'}
            >
              {isAutoPlayTour ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isAutoPlayTour ? 'Playing' : 'Paused'}</span>
            </button>

            <div className="px-3 py-1 text-center min-w-[160px]">
              <span className="text-[10px] font-mono text-gold-400 block uppercase tracking-wider">
                {walkthroughStops[walkthroughStop]?.floorName || `Stop ${walkthroughStop + 1}`}
              </span>
              <span className="text-xs font-bold text-white truncate block max-w-[200px]">
                {walkthroughStops[walkthroughStop]?.name}
              </span>
            </div>

            <button
              onClick={() => setWalkthroughStop((prev) => (prev + 1) % walkthroughStops.length)}
              className="p-2 rounded-xl bg-charcoal-900/80 hover:bg-gold-500 text-slate-300 hover:text-charcoal-950 border border-slate-700 transition-colors"
              title="Next View"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsWalkthrough(false)}
              className="ml-2 px-2.5 py-1.5 rounded-xl bg-charcoal-800 hover:bg-red-500/20 text-slate-400 hover:text-red-300 border border-slate-700 text-xs font-mono transition-colors"
              title="Exit Walkthrough"
            >
              Exit Tour
            </button>
          </div>
        )}

        {/* Bottom Floating Bar: Preliminary Cost & Timeline Pitch Highlights */}
        <div className="absolute bottom-6 right-6 z-20 pointer-events-auto">
          <div className="flex flex-col sm:flex-row items-center gap-3 p-4 rounded-2xl glass-panel-gold border border-gold-500/40 shadow-2xl backdrop-blur-xl">
            <div className="pr-4 sm:border-r border-slate-800">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">
                Turnkey Budget Estimate
              </span>
              <span className="text-2xl font-display font-bold text-gold-gradient">
                {formatCurrency(est.totalCost)}
              </span>
            </div>

            <div className="pl-0 sm:pl-2">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">
                Target Handover
              </span>
              <span className="text-lg font-mono font-bold text-white flex items-center">
                <Clock className="w-4 h-4 text-slate-400 mr-1.5" />
                {est.totalWeeks} Weeks ({est.totalDays} Days)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

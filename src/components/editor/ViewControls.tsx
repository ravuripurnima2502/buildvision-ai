import React, { useState } from 'react';
import { Floor } from '../../types/building';
import { WalkthroughStop, DEFAULT_WALKTHROUGH_STOPS } from '../3d/WalkthroughController';
import {
  Layers,
  Scissors,
  Eye,
  EyeOff,
  Video,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  RotateCcw,
  SplitSquareVertical,
  Compass,
  Sun,
  Sunset,
  Moon,
  HelpCircle,
  Maximize,
  Sparkles,
} from 'lucide-react';

interface ViewControlsProps {
  floors: Floor[];
  activeFloorNumber: number | 'all';
  onChangeFloor: (floor: number | 'all') => void;
  cutawayMode: boolean;
  onToggleCutaway: () => void;
  showRoof: boolean;
  onToggleRoof: () => void;
  // Walkthrough
  isWalkthroughActive: boolean;
  walkthroughStopIndex: number;
  onToggleWalkthrough: () => void;
  onNextStop: () => void;
  onPrevStop: () => void;
  stops?: WalkthroughStop[];
  isAutoPlay?: boolean;
  onToggleAutoPlay?: () => void;
  // Compare Mode
  hasComparison: boolean;
  compareMode: 'none' | 'ghost' | 'side_by_side';
  onChangeCompareMode: (mode: 'none' | 'ghost' | 'side_by_side') => void;
  // Auto-rotate
  autoRotate: boolean;
  onToggleAutoRotate: () => void;
  // Lighting
  lightingMode?: 'day' | 'sunset' | 'night';
  onChangeLightingMode?: (mode: 'day' | 'sunset' | 'night') => void;
}

export const ViewControls: React.FC<ViewControlsProps> = ({
  floors,
  activeFloorNumber,
  onChangeFloor,
  cutawayMode,
  onToggleCutaway,
  showRoof,
  onToggleRoof,
  isWalkthroughActive,
  walkthroughStopIndex,
  onToggleWalkthrough,
  onNextStop,
  onPrevStop,
  stops = DEFAULT_WALKTHROUGH_STOPS,
  isAutoPlay = false,
  onToggleAutoPlay,
  hasComparison,
  compareMode,
  onChangeCompareMode,
  autoRotate,
  onToggleAutoRotate,
  lightingMode = 'day',
  onChangeLightingMode,
}) => {
  const currentStop = stops[walkthroughStopIndex] || stops[0];
  const [showControlsGuide, setShowControlsGuide] = useState(false);

  return (
    <>
      {/* Top Left Floating CAD HUD Controls: Floor Filter & Viewport Toggles */}
      <div className="absolute top-4 left-4 z-20 flex flex-col space-y-2 pointer-events-auto select-none">
        {/* Floor Level Filter Bar */}
        <div className="bg-[#0B1017]/85 backdrop-blur-xl p-1 rounded-2xl border border-white/[0.08] flex items-center space-x-1 shadow-2xl">
          <button
            onClick={() => onChangeFloor('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer ${
              activeFloorNumber === 'all'
                ? 'bg-gold-500 text-charcoal-950 font-bold shadow-gold-glow'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            All Floors
          </button>
          {floors.map((floor) => (
            <button
              key={floor.floorNumber}
              onClick={() => onChangeFloor(floor.floorNumber)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer ${
                activeFloorNumber === floor.floorNumber
                  ? 'bg-gold-500 text-charcoal-950 font-bold shadow-gold-glow'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              {floor.floorNumber === 0 ? 'GF' : `L${floor.floorNumber}`}
            </button>
          ))}
        </div>

        {/* Architectural Section & Roof & Lighting Toggles */}
        <div className="bg-[#0B1017]/85 backdrop-blur-xl p-1.5 rounded-2xl border border-white/[0.08] flex items-center space-x-1 shadow-2xl">
          <button
            onClick={onToggleCutaway}
            title={cutawayMode ? 'Restore Full Wall Height' : 'Section Cutaway Mode (1.2m Plan Cut)'}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-medium flex items-center space-x-1.5 transition-all cursor-pointer ${
              cutawayMode
                ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Scissors className="w-3.5 h-3.5 stroke-[2.2]" />
            <span className="hidden sm:inline">Cutaway</span>
          </button>

          <button
            onClick={onToggleRoof}
            title={showRoof ? 'Hide Roof Slab to View Upper Interior' : 'Show Roof Slab'}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-medium flex items-center space-x-1.5 transition-all cursor-pointer ${
              !showRoof
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            {showRoof ? <Eye className="w-3.5 h-3.5 stroke-[2.2]" /> : <EyeOff className="w-3.5 h-3.5 stroke-[2.2]" />}
            <span className="hidden sm:inline">Roof</span>
          </button>

          <button
            onClick={onToggleAutoRotate}
            title={autoRotate ? 'Stop Auto Orbit' : 'Start Auto Orbit'}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-medium flex items-center space-x-1 transition-all cursor-pointer ${
              autoRotate ? 'bg-gold-500/20 text-gold-400 border border-gold-500/40' : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5 stroke-[2.2]" />
            <span className="hidden sm:inline">Orbit</span>
          </button>

          {/* Controls Guide Trigger */}
          <button
            onClick={() => setShowControlsGuide(!showControlsGuide)}
            title="3D Navigation Shortcuts"
            className="p-1.5 rounded-xl text-slate-400 hover:text-gold-400 hover:bg-white/[0.04] transition-colors cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>

          {/* Lighting Mode Selector */}
          {onChangeLightingMode && (
            <div className="flex items-center pl-1.5 ml-1 border-l border-white/[0.08] space-x-0.5">
              <button
                onClick={() => onChangeLightingMode('day')}
                title="Midday Sun"
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  lightingMode === 'day' ? 'bg-gold-500 text-charcoal-950 font-bold shadow-gold-glow' : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onChangeLightingMode('sunset')}
                title="Golden Hour Sunset"
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  lightingMode === 'sunset' ? 'bg-amber-500 text-charcoal-950 font-bold shadow-md' : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <Sunset className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onChangeLightingMode('night')}
                title="Night Architectural Illumination"
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  lightingMode === 'night' ? 'bg-indigo-500 text-white font-bold shadow-md' : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Floating Quick Controls Guide Tooltip */}
        {showControlsGuide && (
          <div className="bg-[#0B1017]/95 backdrop-blur-2xl border border-white/[0.1] rounded-2xl p-3.5 shadow-2xl space-y-2 text-xs text-slate-200 max-w-xs animate-fadeIn">
            <div className="flex items-center justify-between font-bold text-white text-[11px] uppercase tracking-wider font-mono">
              <span className="flex items-center space-x-1.5 text-gold-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>3D Navigation</span>
              </span>
              <button onClick={() => setShowControlsGuide(false)} className="text-slate-400 hover:text-white cursor-pointer">✕</button>
            </div>
            <div className="space-y-1.5 text-[11px] font-mono text-slate-300">
              <div className="flex justify-between py-1 border-b border-white/[0.04]"><span>Rotate Camera:</span> <span className="text-white font-semibold">Left Click + Drag</span></div>
              <div className="flex justify-between py-1 border-b border-white/[0.04]"><span>Pan Model:</span> <span className="text-white font-semibold">Right Click + Drag</span></div>
              <div className="flex justify-between py-1 border-b border-white/[0.04]"><span>Zoom Viewport:</span> <span className="text-white font-semibold">Scroll / Pinch</span></div>
              <div className="flex justify-between py-1"><span>Select Space:</span> <span className="text-gold-400 font-semibold">Click room interior</span></div>
            </div>
          </div>
        )}
      </div>

      {/* Top Right Floating Controls: Before/After Comparison Bar */}
      {hasComparison && (
        <div className="absolute top-4 right-4 z-20 pointer-events-auto select-none">
          <div className="bg-[#0B1017]/85 backdrop-blur-xl p-1.5 rounded-2xl border border-white/[0.08] flex items-center space-x-1 shadow-2xl">
            <span className="text-[10px] uppercase font-mono text-gold-400 px-2 font-bold flex items-center space-x-1">
              <SplitSquareVertical className="w-3 h-3" />
              <span>Compare:</span>
            </span>
            <button
              onClick={() => onChangeCompareMode('none')}
              className={`px-2.5 py-1 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                compareMode === 'none' ? 'bg-gold-500 text-charcoal-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Current
            </button>
            <button
              onClick={() => onChangeCompareMode('ghost')}
              className={`px-2.5 py-1 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                compareMode === 'ghost' ? 'bg-sky-500 text-charcoal-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Ghost Overlay
            </button>
            <button
              onClick={() => onChangeCompareMode('side_by_side')}
              className={`px-2.5 py-1 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                compareMode === 'side_by_side' ? 'bg-purple-500 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Side-by-Side
            </button>
          </div>
        </div>
      )}

      {/* Bottom Floating Bar: Cinematic Room-by-Room Walkthrough Tour */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-auto select-none w-full max-w-lg px-4">
        {isWalkthroughActive ? (
          <div className="bg-[#0B1017]/95 backdrop-blur-2xl rounded-2xl border border-gold-500/40 p-4 shadow-2xl space-y-3">
            {/* Walkthrough Header & Stop Info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-gold-400">
                  Cinematic Walkthrough Tour
                </span>
              </div>
              <div className="flex items-center space-x-2">
                {onToggleAutoPlay && (
                  <button
                    onClick={onToggleAutoPlay}
                    className={`px-2 py-0.5 rounded-lg text-[11px] font-mono flex items-center space-x-1 border transition-all cursor-pointer ${
                      isAutoPlay
                        ? 'bg-gold-500 text-charcoal-950 font-bold border-gold-400 shadow-gold-glow'
                        : 'bg-white/[0.04] text-slate-300 border-white/[0.08] hover:text-white'
                    }`}
                  >
                    {isAutoPlay ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                    <span>{isAutoPlay ? 'Auto-Advancing' : 'Auto-Play'}</span>
                  </button>
                )}

                <button
                  onClick={onToggleWalkthrough}
                  className="text-[11px] font-mono text-slate-400 hover:text-red-400 px-2.5 py-0.5 rounded-lg bg-white/[0.04] border border-white/[0.08] transition-colors cursor-pointer"
                >
                  Exit Tour
                </button>
              </div>
            </div>

            <div className="bg-[#080C14] rounded-xl p-3 border border-white/[0.06]">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-display font-bold text-white">
                  {currentStop.name}
                </h4>
                {currentStop.dimensions && (
                  <span className="text-[11px] font-mono text-gold-400 bg-gold-500/10 px-2 py-0.5 rounded-md border border-gold-500/20">
                    {currentStop.dimensions}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {currentStop.description}
              </p>
            </div>

            {/* Stepper Navigation */}
            <div className="flex items-center justify-between pt-1">
              <button
                onClick={onPrevStop}
                disabled={walkthroughStopIndex === 0}
                className="p-2 rounded-xl bg-white/[0.04] text-slate-300 hover:text-gold-400 disabled:opacity-40 border border-white/[0.08] transition-colors cursor-pointer"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              {/* Progress Dots */}
              <div className="flex items-center space-x-1.5 overflow-x-auto px-2">
                {stops.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {}}
                    className={`h-1.5 rounded-full transition-all ${
                      i === walkthroughStopIndex ? 'w-5 bg-gold-400' : 'w-1.5 bg-slate-700'
                    }`}
                  ></button>
                ))}
              </div>

              <button
                onClick={onNextStop}
                disabled={walkthroughStopIndex === stops.length - 1}
                className="p-2 rounded-xl bg-white/[0.04] text-slate-300 hover:text-gold-400 disabled:opacity-40 border border-white/[0.08] transition-colors cursor-pointer"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <button
              onClick={onToggleWalkthrough}
              className="px-5 py-2.5 rounded-2xl bg-[#0B1017]/90 hover:bg-gold-500 text-white hover:text-charcoal-950 text-xs font-bold font-mono tracking-wider border border-gold-500/30 hover:border-gold-500 backdrop-blur-xl shadow-2xl flex items-center space-x-2 transition-all group cursor-pointer"
            >
              <Video className="w-4 h-4 text-gold-400 group-hover:text-charcoal-950 transition-colors" />
              <span>Launch Cinematic Walkthrough</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
};

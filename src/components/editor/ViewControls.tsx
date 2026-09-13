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
      {/* Top Left Floating Controls: Floor Level Switcher */}
      <div className="absolute top-4 left-4 z-20 flex flex-col space-y-2 pointer-events-auto select-none">
        {/* Floor Level Filter Bar */}
        <div className="bg-theme-card/90 backdrop-blur-md p-1 rounded-xl border border-theme-subtle flex items-center space-x-1 shadow-lg">
          <button
            onClick={() => onChangeFloor('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              activeFloorNumber === 'all'
                ? 'bg-gold-500 text-charcoal-950 font-bold shadow-gold-glow'
                : 'text-theme-secondary hover:text-theme-heading'
            }`}
          >
            All Floors
          </button>
          {floors.map((floor) => (
            <button
              key={floor.floorNumber}
              onClick={() => onChangeFloor(floor.floorNumber)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                activeFloorNumber === floor.floorNumber
                  ? 'bg-gold-500 text-charcoal-950 font-bold shadow-gold-glow'
                  : 'text-theme-secondary hover:text-theme-heading'
              }`}
            >
              {floor.floorNumber === 0 ? 'GF' : `L${floor.floorNumber}`}
            </button>
          ))}
        </div>

        {/* Architectural Section & Roof & Lighting Toggles */}
        <div className="bg-theme-card/90 backdrop-blur-md p-1.5 rounded-xl border border-theme-subtle flex items-center space-x-1 shadow-lg">
          <button
            onClick={onToggleCutaway}
            title={cutawayMode ? 'Restore Full Wall Height' : 'Section Cutaway Mode (1.2m Plan View)'}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-all ${
              cutawayMode
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                : 'text-theme-secondary hover:text-theme-heading'
            }`}
          >
            <Scissors className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Cutaway</span>
          </button>

          <button
            onClick={onToggleRoof}
            title={showRoof ? 'Hide Roof Slab to View Upper Interior' : 'Show Roof Slab'}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-all ${
              !showRoof
                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40'
                : 'text-theme-secondary hover:text-theme-heading'
            }`}
          >
            {showRoof ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">Roof</span>
          </button>

          <button
            onClick={onToggleAutoRotate}
            title={autoRotate ? 'Stop Auto Rotation' : 'Start Auto Orbit'}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1 transition-all ${
              autoRotate ? 'bg-gold-500/20 text-gold-400 border border-gold-500/40' : 'text-theme-secondary hover:text-theme-heading'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Orbit</span>
          </button>

          {/* Controls Guide Trigger */}
          <button
            onClick={() => setShowControlsGuide(!showControlsGuide)}
            title="Interactive 3D Controls Guide"
            className="p-1.5 rounded-lg text-theme-secondary hover:text-gold-400 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>

          {/* Lighting Mode Selector */}
          {onChangeLightingMode && (
            <div className="flex items-center pl-1 ml-1 border-l border-theme-subtle space-x-0.5">
              <button
                onClick={() => onChangeLightingMode('day')}
                title="Midday Sun Lighting"
                className={`p-1.5 rounded-lg transition-all ${
                  lightingMode === 'day' ? 'bg-gold-500 text-charcoal-950 font-bold shadow-gold-glow' : 'text-theme-secondary hover:text-theme-heading'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onChangeLightingMode('sunset')}
                title="Golden Hour Sunset Lighting"
                className={`p-1.5 rounded-lg transition-all ${
                  lightingMode === 'sunset' ? 'bg-amber-500 text-charcoal-950 font-bold shadow-md' : 'text-theme-secondary hover:text-theme-heading'
                }`}
              >
                <Sunset className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onChangeLightingMode('night')}
                title="Night Architectural Illumination"
                className={`p-1.5 rounded-lg transition-all ${
                  lightingMode === 'night' ? 'bg-indigo-500 text-white font-bold shadow-md' : 'text-theme-secondary hover:text-theme-heading'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Floating Quick Controls Guide Tooltip */}
        {showControlsGuide && (
          <div className="bg-theme-card/95 backdrop-blur-xl border border-theme-subtle rounded-xl p-3 shadow-2xl space-y-1.5 text-xs text-theme-primary max-w-xs animate-fadeIn">
            <div className="flex items-center justify-between font-bold text-theme-heading text-[11px] uppercase tracking-wider font-mono">
              <span>Interactive Controls</span>
              <button onClick={() => setShowControlsGuide(false)} className="text-theme-secondary hover:text-white">✕</button>
            </div>
            <div className="space-y-1 text-[11px] font-mono text-theme-secondary">
              <div className="flex justify-between"><span>Rotate View:</span> <span className="text-theme-primary font-semibold">Left Click + Drag</span></div>
              <div className="flex justify-between"><span>Pan Building:</span> <span className="text-theme-primary font-semibold">Right Click + Drag</span></div>
              <div className="flex justify-between"><span>Zoom In/Out:</span> <span className="text-theme-primary font-semibold">Mouse Wheel / Pinch</span></div>
              <div className="flex justify-between"><span>Inspect Room:</span> <span className="text-gold-400 font-semibold">Click any room in 3D</span></div>
            </div>
          </div>
        )}
      </div>

      {/* Top Right Floating Controls: Before/After Comparison Bar */}
      {hasComparison && (
        <div className="absolute top-4 right-4 z-20 pointer-events-auto select-none">
          <div className="bg-theme-card/90 backdrop-blur-md p-1.5 rounded-xl border border-theme-subtle flex items-center space-x-1 shadow-gold-glow">
            <span className="text-[10px] uppercase font-mono text-gold-400 px-2 font-bold">
              Compare:
            </span>
            <button
              onClick={() => onChangeCompareMode('none')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                compareMode === 'none' ? 'bg-gold-500 text-charcoal-950 font-bold' : 'text-theme-secondary hover:text-theme-heading'
              }`}
            >
              Current
            </button>
            <button
              onClick={() => onChangeCompareMode('ghost')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                compareMode === 'ghost' ? 'bg-cyan-500 text-charcoal-950 font-bold' : 'text-theme-secondary hover:text-theme-heading'
              }`}
            >
              Ghost Overlay
            </button>
            <button
              onClick={() => onChangeCompareMode('side_by_side')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                compareMode === 'side_by_side' ? 'bg-purple-500 text-white font-bold' : 'text-theme-secondary hover:text-theme-heading'
              }`}
            >
              Side-by-Side
            </button>
          </div>
        </div>
      )}

      {/* Bottom Floating Bar: Cinematic Room-by-Room Walkthrough Experience */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-auto select-none w-full max-w-lg px-4">
        {isWalkthroughActive ? (
          <div className="bg-theme-card/95 backdrop-blur-xl rounded-2xl border border-gold-500/40 p-4 shadow-2xl space-y-3">
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
                    className={`px-2 py-0.5 rounded text-[11px] font-mono flex items-center space-x-1 border transition-all ${
                      isAutoPlay
                        ? 'bg-gold-500 text-charcoal-950 font-bold border-gold-400 shadow-gold-glow'
                        : 'bg-theme-base text-theme-secondary border-theme-subtle hover:text-theme-heading'
                    }`}
                  >
                    {isAutoPlay ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                    <span>{isAutoPlay ? 'Auto-Advancing' : 'Auto-Play'}</span>
                  </button>
                )}

                <button
                  onClick={onToggleWalkthrough}
                  className="text-[11px] font-mono text-theme-secondary hover:text-red-400 px-2 py-0.5 rounded bg-theme-base border border-theme-subtle"
                >
                  Exit Tour
                </button>
              </div>
            </div>

            <div className="bg-theme-base/80 rounded-xl p-3 border border-theme-subtle">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-display font-bold text-theme-heading">
                  {currentStop.name}
                </h4>
                {currentStop.dimensions && (
                  <span className="text-[11px] font-mono text-gold-400 bg-gold-500/10 px-2 py-0.5 rounded border border-gold-500/20">
                    {currentStop.dimensions}
                  </span>
                )}
              </div>
              <p className="text-xs text-theme-secondary mt-1 leading-relaxed">
                {currentStop.description}
              </p>
            </div>

            {/* Stepper Navigation */}
            <div className="flex items-center justify-between pt-1">
              <button
                onClick={onPrevStop}
                disabled={walkthroughStopIndex === 0}
                className="p-2 rounded-xl bg-theme-base text-theme-primary hover:text-gold-400 disabled:opacity-40 border border-theme-subtle"
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
                className="p-2 rounded-xl bg-theme-base text-theme-primary hover:text-gold-400 disabled:opacity-40 border border-theme-subtle"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <button
              onClick={onToggleWalkthrough}
              className="px-5 py-2.5 rounded-xl bg-theme-card/90 hover:bg-gold-500 text-theme-primary hover:text-charcoal-950 text-xs font-bold font-mono tracking-wider border border-gold-500/30 hover:border-gold-500 backdrop-blur-md shadow-gold-glow flex items-center space-x-2 transition-all group"
            >
              <Video className="w-4 h-4 text-gold-400 group-hover:text-charcoal-950" />
              <span>Start Cinematic Room-by-Room Walkthrough</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
};

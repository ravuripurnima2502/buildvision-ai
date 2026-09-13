import React from 'react';
import { Sparkles } from 'lucide-react';

interface RoomHUDLabelProps {
  roomName: string;
  dimensions?: string;
  areaSqFt?: number;
  floorName?: string;
  description?: string;
  isVisible: boolean;
}

export const RoomHUDLabel: React.FC<RoomHUDLabelProps> = ({
  roomName,
  dimensions,
  areaSqFt,
  floorName,
  description,
  isVisible,
}) => {
  if (!isVisible || !roomName) return null;

  return (
    <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 pointer-events-none select-none transition-all duration-500 transform animate-fadeIn">
      <div className="px-5 py-2.5 rounded-2xl bg-charcoal-950/85 backdrop-blur-xl border border-gold-500/40 shadow-gold-glow flex flex-col items-center space-y-1">
        {/* Top Header: Room Title & Dimensions */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse"></span>
            <span className="text-xs sm:text-sm font-display font-bold uppercase tracking-widest text-white">
              {roomName}
            </span>
          </div>

          {dimensions && (
            <span className="text-xs font-mono font-semibold text-gold-400 bg-gold-500/10 px-2 py-0.5 rounded border border-gold-500/20">
              {dimensions}
            </span>
          )}
        </div>

        {/* Sub-info: Area & Preliminary Notice */}
        <div className="flex items-center space-x-2 text-[10px] font-mono text-slate-400">
          {floorName && <span>{floorName}</span>}
          {floorName && areaSqFt && <span>•</span>}
          {areaSqFt && <span className="text-slate-300 font-semibold">{Math.round(areaSqFt)} sq.ft</span>}
          <span>•</span>
          <span className="text-gold-300/80 italic flex items-center">
            <Sparkles className="w-2.5 h-2.5 mr-0.5" />
            Preliminary Concept
          </span>
        </div>

        {description && (
          <p className="text-[11px] text-slate-300 text-center max-w-xs sm:max-w-md pt-0.5 line-clamp-1">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

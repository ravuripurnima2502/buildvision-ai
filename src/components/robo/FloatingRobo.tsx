import React, { useState } from 'react';
import { RoboContext } from '../../types/robo';
import { RoboChatDrawer } from './RoboChatDrawer';
import { Sparkles } from 'lucide-react';

interface FloatingRoboProps {
  context: RoboContext;
}

export const FloatingRobo: React.FC<FloatingRoboProps> = ({ context }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Permanent Floating Robo Mascot (Bottom-Right) */}
      <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 select-none">
        <div className="relative group">
          {/* Subtle pulsating halo glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-gold-500 via-amber-400 to-gold-600 rounded-full blur-md opacity-70 group-hover:opacity-100 animate-pulse transition duration-1000"></div>

          {/* Robo Trigger Avatar */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="relative w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-theme-surface border-2 border-gold-400 shadow-gold-glow flex items-center justify-center cursor-pointer hover:scale-110 active:scale-95 transition-all overflow-visible theme-card"
            title="👷 BuildVision Civil Engineer Robo - Click to Chat"
            aria-label="BuildVision Civil Engineer Robo"
          >
            {/* Custom SVG Civil Engineer Robot with Hardhat & Blueprint */}
            <svg
              viewBox="0 0 100 100"
              className="w-10 h-10 sm:w-11 sm:h-11 drop-shadow-md animate-float-slow"
            >
              {/* Construction Yellow/Gold Helmet */}
              <path
                d="M 22 42 C 22 20, 78 20, 78 42 Z"
                fill="#F59E0B"
                stroke="#D97706"
                strokeWidth="2.2"
              />
              <rect x="18" y="38" width="64" height="6.5" rx="3" fill="#D97706" />
              {/* Helmet Center Ridge */}
              <path d="M 47 20 L 53 20 L 53 38 L 47 38 Z" fill="#FBBF24" />

              {/* Metallic Head */}
              <rect
                x="28"
                y="42"
                width="44"
                height="32"
                rx="8"
                fill="#334155"
                stroke="#64748B"
                strokeWidth="1.5"
              />

              {/* Glowing Cyan Visor / Eyes */}
              <rect
                x="34"
                y="50"
                width="32"
                height="12"
                rx="4"
                fill="#0284C7"
              />
              {/* Glowing Pupils */}
              <circle cx="42" cy="56" r="3.5" fill="#38BDF8" />
              <circle cx="58" cy="56" r="3.5" fill="#38BDF8" />

              {/* Friendly Robot Smile */}
              <path
                d="M 44 68 Q 50 72 56 68"
                stroke="#38BDF8"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />

              {/* Tiny Architectural Blueprint Rolled Under Arm */}
              <rect
                x="68"
                y="60"
                width="14"
                height="6"
                rx="3"
                transform="rotate(35, 68, 60)"
                fill="#38BDF8"
                stroke="#0284C7"
                strokeWidth="1"
              />
            </svg>

            {/* Online Pulse Indicator */}
            <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-theme-surface rounded-full shadow-sm"></span>
          </button>

          {/* Tooltip Badge on Hover */}
          <div className="absolute right-16 top-2 hidden sm:group-hover:flex items-center px-3 py-1.5 rounded-xl bg-theme-surface/95 border border-gold-500/40 text-[11px] font-mono text-gold-400 shadow-xl whitespace-nowrap pointer-events-none theme-card">
            <Sparkles className="w-3 h-3 mr-1.5 text-gold-400" />
            <span>AI Civil Engineer Robo</span>
          </div>
        </div>
      </div>

      {/* Floating Chat Drawer */}
      <RoboChatDrawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        context={context}
      />
    </>
  );
};

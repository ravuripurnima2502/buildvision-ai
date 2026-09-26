import React, { useState } from 'react';
import {
  FLOOR_FINISHES,
  WALL_FINISHES,
  ROOF_FINISHES,
  FinishDefinition,
  getFinishPreviewDataUrl,
} from '../3d/FinishMaterials';
import { SurfaceCustomization } from '../../types/building';
import { Sparkles, Check, Layers } from 'lucide-react';

interface FinishSelectorProps {
  surfaceCustomization: SurfaceCustomization;
  onSelectFinish: (category: 'floor' | 'walls' | 'roof', finishId: string) => void;
}

export const FinishSelector: React.FC<FinishSelectorProps> = ({
  surfaceCustomization,
  onSelectFinish,
}) => {
  const [activeCategory, setActiveCategory] = useState<'floor' | 'walls' | 'roof'>('floor');

  const currentFinishes =
    activeCategory === 'floor'
      ? FLOOR_FINISHES
      : activeCategory === 'walls'
      ? WALL_FINISHES
      : ROOF_FINISHES;

  const selectedFinishId =
    activeCategory === 'floor'
      ? surfaceCustomization.floor.finish
      : activeCategory === 'walls'
      ? surfaceCustomization.walls.finish
      : surfaceCustomization.roof.finish;

  return (
    <div className="flex flex-col h-full text-slate-100 select-none">
      {/* Panel Header */}
      <div className="pb-3 border-b border-white/[0.08]">
        <div className="flex items-center space-x-2 text-gold-400">
          <Layers className="w-4 h-4 text-gold-400" />
          <h3 className="text-sm font-display font-bold text-white tracking-wide uppercase">
            Surface Materials &amp; Textures
          </h3>
        </div>
        <p className="text-[11px] text-slate-400 mt-1 leading-snug">
          Choose the architectural material texture, grain, and physical depth for building surfaces.
        </p>
      </div>

      {/* Surface Category Tabs */}
      <div className="flex p-1 bg-white/[0.03] rounded-xl border border-white/[0.08] my-3">
        {(['floor', 'walls', 'roof'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all cursor-pointer ${
              activeCategory === cat
                ? 'bg-gold-500 text-charcoal-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            {cat === 'walls' ? 'Wall Finish' : `${cat} Finish`}
          </button>
        ))}
      </div>

      {/* Material Finish Swatches List */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 max-h-[480px]">
        {currentFinishes.map((finish: FinishDefinition) => {
          const isSelected = selectedFinishId === finish.id;
          const previewUrl = getFinishPreviewDataUrl(finish.id);

          return (
            <div
              key={finish.id}
              onClick={() => onSelectFinish(activeCategory, finish.id)}
              className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex items-center space-x-3 ${
                isSelected
                  ? 'border-gold-400 bg-gold-500/10 shadow-gold-glow ring-1 ring-gold-400/40'
                  : 'border-white/[0.08] bg-white/[0.02] hover:border-gold-500/30 hover:bg-white/[0.04]'
              }`}
            >
              {/* Rich Visual Material Texture Preview Box (NOT flat color circle) */}
              <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-white/20 shadow-md bg-[#1E293B]">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt={finish.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-full"
                    style={{ backgroundColor: finish.defaultColor }}
                  />
                )}
                {/* Surface Sheen Highlight */}
                <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/20 pointer-events-none" />
                {isSelected && (
                  <div className="absolute inset-0 bg-gold-500/25 flex items-center justify-center">
                    <div className="w-5 h-5 rounded-full bg-gold-400 text-charcoal-950 flex items-center justify-center shadow-md">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  </div>
                )}
              </div>

              {/* Material Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white truncate font-display">
                    {finish.name}
                  </h4>
                  {isSelected && (
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-gold-400/20 text-gold-300 font-semibold uppercase tracking-wider">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {finish.description}
                </p>
                <div className="flex items-center space-x-3 mt-1.5 text-[9px] font-mono text-slate-400">
                  <span>Roughness: {(finish.roughness * 100).toFixed(0)}%</span>
                  <span>•</span>
                  <span>Metalness: {(finish.metalness * 100).toFixed(0)}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Informative Distinction Banner */}
      <div className="mt-3 p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[10px] text-gold-400 flex items-start space-x-2 font-mono">
        <Sparkles className="w-3.5 h-3.5 shrink-0 mt-0.5 text-gold-400" />
        <span>
          Finishes apply physical PBR surface textures (marble veins, wood grains, brick mortar). To paint or tint these surfaces, switch to the 🎨 Color panel.
        </span>
      </div>
    </div>
  );
};

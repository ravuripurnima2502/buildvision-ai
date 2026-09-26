import React, { useState } from 'react';
import { SurfaceCustomization } from '../../types/building';
import { getFinishDefinition, getFinishPreviewDataUrl } from '../3d/FinishMaterials';
import { Palette, RefreshCw, Check, Sparkles, Sliders } from 'lucide-react';

interface ColorCustomizerProps {
  surfaceCustomization: SurfaceCustomization;
  onSelectColor: (category: 'floor' | 'walls' | 'roof', colorHex: string) => void;
}

const COLOR_PRESETS = [
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Cream', hex: '#FFFDD0' },
  { name: 'Warm Beige', hex: '#F5F5DC' },
  { name: 'Sand', hex: '#E8DCC8' },
  { name: 'Light Grey', hex: '#E5E7EB' },
  { name: 'Charcoal', hex: '#334155' },
  { name: 'Terracotta', hex: '#C2410C' },
  { name: 'Warm Brown', hex: '#78350F' },
  { name: 'Sage Green', hex: '#84A98C' },
  { name: 'Olive', hex: '#556B2F' },
  { name: 'Sky Blue', hex: '#38BDF8' },
  { name: 'Deep Blue', hex: '#1E3A8A' },
];

export const ColorCustomizer: React.FC<ColorCustomizerProps> = ({
  surfaceCustomization,
  onSelectColor,
}) => {
  const [activeCategory, setActiveCategory] = useState<'walls' | 'roof' | 'floor'>('walls');

  const currentColor =
    activeCategory === 'walls'
      ? surfaceCustomization.walls.color
      : activeCategory === 'roof'
      ? surfaceCustomization.roof.color
      : surfaceCustomization.floor.color;

  const currentFinishId =
    activeCategory === 'walls'
      ? surfaceCustomization.walls.finish
      : activeCategory === 'roof'
      ? surfaceCustomization.roof.finish
      : surfaceCustomization.floor.finish;

  const currentFinishDef = getFinishDefinition(currentFinishId);
  const finishPreviewUrl = getFinishPreviewDataUrl(currentFinishId);

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (!val.startsWith('#')) val = '#' + val;
    if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) {
      if (val.length === 7) {
        onSelectColor(activeCategory, val.toUpperCase());
      }
    }
  };

  const handleReset = () => {
    const defaultColor = currentFinishDef?.defaultColor || '#FFFFFF';
    onSelectColor(activeCategory, defaultColor);
  };

  return (
    <div className="flex flex-col h-full text-slate-100 select-none">
      {/* Header */}
      <div className="pb-3 border-b border-white/[0.08]">
        <div className="flex items-center space-x-2 text-gold-400">
          <Palette className="w-4 h-4 text-gold-400" />
          <h3 className="text-sm font-display font-bold text-white tracking-wide uppercase">
            Color &amp; Architectural Paint
          </h3>
        </div>
        <p className="text-[11px] text-slate-400 mt-1 leading-snug">
          Choose the paint or appearance tint of your surfaces while preserving underlying material textures.
        </p>
      </div>

      {/* Surface Tabs: Walls | Roof | Floor */}
      <div className="flex p-1 bg-white/[0.03] rounded-xl border border-white/[0.08] my-3">
        {(['walls', 'roof', 'floor'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all cursor-pointer ${
              activeCategory === cat
                ? 'bg-gold-500 text-charcoal-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            {cat === 'walls' ? 'Wall Paint' : cat === 'roof' ? 'Roof Color' : 'Floor Tint'}
          </button>
        ))}
      </div>

      {/* Live Combined Finish + Color Appearance Card */}
      <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.08] mb-3">
        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-2">
          Combined 3D Surface Appearance:
        </span>
        <div className="flex items-center space-x-3">
          {/* Surface Preview with Texture + Color Blend */}
          <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-white/20 shadow-inner bg-[#0B1017]">
            {finishPreviewUrl && (
              <img
                src={finishPreviewUrl}
                alt="Finish texture"
                className="w-full h-full object-cover opacity-60"
              />
            )}
            <div
              className="absolute inset-0 mix-blend-multiply opacity-80"
              style={{ backgroundColor: currentColor }}
            />
            <div
              className="absolute inset-0 opacity-35"
              style={{ backgroundColor: currentColor }}
            />
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-white truncate font-display">
              {currentFinishDef?.name || 'Selected Finish'}
            </h4>
            <p className="text-[11px] text-gold-300 font-mono mt-0.5 font-semibold">
              Tint: {currentColor}
            </p>
            <p className="text-[10px] text-slate-400 mt-1 leading-tight">
              The texture remains fully visible with your customized paint hue applied over it.
            </p>
          </div>
        </div>
      </div>

      {/* Professional Color Picker & HEX Input */}
      <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.08] mb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono text-slate-300 flex items-center space-x-1.5">
            <Sliders className="w-3.5 h-3.5 text-gold-400" />
            <span>Custom Color Input:</span>
          </span>
          <button
            onClick={handleReset}
            className="text-[10px] font-mono text-slate-400 hover:text-gold-300 flex items-center space-x-1 cursor-pointer transition-colors"
            title="Reset to default finish color"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>

        <div className="flex items-center space-x-2.5">
          <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-white/20 shadow-md shrink-0 cursor-pointer">
            <input
              type="color"
              value={currentColor.startsWith('#') ? currentColor : '#FFFFFF'}
              onChange={(e) => onSelectColor(activeCategory, e.target.value.toUpperCase())}
              className="absolute -inset-4 w-20 h-20 cursor-pointer opacity-0"
            />
            <div className="w-full h-full" style={{ backgroundColor: currentColor }} />
          </div>

          <div className="flex-1 relative">
            <span className="absolute left-2.5 top-2 text-xs font-mono text-slate-500">HEX</span>
            <input
              type="text"
              value={currentColor}
              onChange={handleHexChange}
              placeholder="#FFFFFF"
              maxLength={7}
              className="w-full bg-[#080C14] border border-white/[0.1] rounded-xl pl-12 pr-3 py-1.5 text-xs text-white font-mono uppercase focus:outline-none focus:border-gold-500"
            />
          </div>
        </div>
      </div>

      {/* Quick Color Presets Grid */}
      <div className="flex-1 overflow-y-auto max-h-[300px]">
        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-2">
          Architectural Paint Swatches:
        </span>
        <div className="grid grid-cols-4 gap-2">
          {COLOR_PRESETS.map((preset) => {
            const isSelected = currentColor.toLowerCase() === preset.hex.toLowerCase();
            return (
              <button
                key={preset.name}
                onClick={() => onSelectColor(activeCategory, preset.hex)}
                className={`p-2 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer ${
                  isSelected
                    ? 'border-gold-400 bg-gold-500/15 ring-2 ring-gold-400/50 scale-105'
                    : 'border-white/[0.08] bg-white/[0.02] hover:border-gold-500/30 hover:bg-white/[0.04]'
                }`}
              >
                <div
                  className="w-7 h-7 rounded-lg border border-black/20 shadow-sm flex items-center justify-center mb-1"
                  style={{ backgroundColor: preset.hex }}
                >
                  {isSelected && (
                    <Check
                      className={`w-3.5 h-3.5 stroke-[3] ${
                        ['#FFFFFF', '#FFFDD0', '#F5F5DC', '#E8DCC8', '#E5E7EB', '#38BDF8'].includes(
                          preset.hex
                        )
                          ? 'text-charcoal-950'
                          : 'text-white'
                      }`}
                    />
                  )}
                </div>
                <span className="text-[9px] font-mono text-slate-300 truncate w-full text-center">
                  {preset.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Clarity Tip */}
      <div className="mt-3 p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[10px] text-gold-400 flex items-start space-x-2 font-mono">
        <Sparkles className="w-3.5 h-3.5 shrink-0 mt-0.5 text-gold-400" />
        <span>
          Color tints are applied live to the 3D surface shaders without resetting the building or losing material grooves.
        </span>
      </div>
    </div>
  );
};

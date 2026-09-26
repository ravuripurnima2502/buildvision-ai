import React from 'react';
import { useTheme, THEMES, ThemeId } from './ThemeContext';
import { Palette, Check, X, Sparkles } from 'lucide-react';

interface ThemeSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThemeSelectorModal: React.FC<ThemeSelectorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { theme, setTheme } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/80 backdrop-blur-md animate-fadeIn select-none">
      <div className="relative w-full max-w-lg rounded-3xl p-6 sm:p-8 border border-gold-500/40 shadow-2xl bg-[#0B1017]/95">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-gold-glow text-charcoal-950">
            <Palette className="w-5 h-5 stroke-[2.3]" />
          </div>
          <div>
            <span className="text-[10px] font-mono tracking-widest uppercase text-gold-400 font-semibold">
              ATMOSPHERIC RENDERING THEMES
            </span>
            <h2 className="text-xl font-display font-bold text-white">
              Studio Lighting &amp; Palette
            </h2>
          </div>
        </div>

        <p className="text-xs text-slate-400 mb-5 leading-relaxed">
          Switch between architectural palettes. The UI controls, HUD readouts, and ambient reflections synchronize instantly.
        </p>

        {/* Theme Options Grid */}
        <div className="space-y-2.5">
          {THEMES.map((t) => {
            const isSelected = theme === t.id;

            return (
              <div
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between group ${
                  isSelected
                    ? 'border-gold-500 shadow-gold-glow bg-gold-500/10'
                    : 'border-white/[0.08] hover:border-gold-500/40 bg-white/[0.02]'
                }`}
              >
                <div className="flex items-center space-x-3.5">
                  {/* Color Swatch Trio */}
                  <div className="flex items-center -space-x-1.5 shrink-0">
                    <span
                      className="w-5 h-5 rounded-full border border-black/40 shadow-sm"
                      style={{ backgroundColor: t.palette.bg }}
                    />
                    <span
                      className="w-5 h-5 rounded-full border border-black/40 shadow-sm"
                      style={{ backgroundColor: t.palette.surface }}
                    />
                    <span
                      className="w-5 h-5 rounded-full border border-black/40 shadow-sm"
                      style={{ backgroundColor: t.palette.accent }}
                    />
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-sm font-display font-bold text-white group-hover:text-gold-300 transition-colors">
                        {t.name}
                      </h4>
                      {t.id === 'white' && (
                        <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
                          Light Studio
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {t.subtitle}
                    </p>
                  </div>
                </div>

                {/* Selection Indicator */}
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border transition-all ${
                    isSelected
                      ? 'bg-gold-500 border-gold-400 text-charcoal-950 shadow-gold-glow'
                      : 'border-white/[0.2] opacity-40 group-hover:opacity-80'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>Persisted to browser cache</span>
          <button
            onClick={onClose}
            className="btn-gold px-5 py-2 text-xs font-bold cursor-pointer"
          >
            Apply &amp; Close
          </button>
        </div>
      </div>
    </div>
  );
};

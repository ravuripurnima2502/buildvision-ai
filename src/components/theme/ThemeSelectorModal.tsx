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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-3xl p-6 sm:p-7 border shadow-2xl glass-panel-gold theme-card">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-black/20 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-gold-glow text-charcoal-950">
            <Palette className="w-5 h-5 stroke-[2.3]" />
          </div>
          <div>
            <span className="text-[10px] font-mono tracking-widest uppercase text-gold-400">
              APPEARANCE & ATMOSPHERE
            </span>
            <h2 className="text-xl font-display font-bold text-theme-primary">
              Architectural Theme
            </h2>
          </div>
        </div>

        <p className="text-xs text-theme-secondary mb-5">
          Select a luxury material-inspired color theme. The entire interface will adapt while preserving realistic 3D building visualization.
        </p>

        {/* Theme Options Grid */}
        <div className="space-y-3">
          {THEMES.map((t) => {
            const isSelected = theme === t.id;

            return (
              <div
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between group ${
                  isSelected
                    ? 'border-gold-500 shadow-gold-glow bg-gold-500/10'
                    : 'border-theme-subtle hover:border-gold-500/40 bg-theme-surface/60'
                }`}
              >
                <div className="flex items-center space-x-3.5">
                  {/* Visual Color Swatch Dot Trio */}
                  <div className="flex items-center -space-x-1.5 shrink-0">
                    <span
                      className="w-5 h-5 rounded-full border border-black/30 shadow-sm"
                      style={{ backgroundColor: t.palette.bg }}
                    />
                    <span
                      className="w-5 h-5 rounded-full border border-black/30 shadow-sm"
                      style={{ backgroundColor: t.palette.surface }}
                    />
                    <span
                      className="w-5 h-5 rounded-full border border-black/30 shadow-sm"
                      style={{ backgroundColor: t.palette.accent }}
                    />
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-sm font-display font-bold text-theme-primary group-hover:text-gold-300 transition-colors">
                        {t.name}
                      </h4>
                      {t.id === 'white' && (
                        <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-500 border border-amber-500/30">
                          Light Studio
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-theme-secondary mt-0.5">
                      {t.subtitle}
                    </p>
                  </div>
                </div>

                {/* Selection Indicator */}
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border transition-all ${
                    isSelected
                      ? 'bg-gold-500 border-gold-400 text-charcoal-950 shadow-gold-glow'
                      : 'border-slate-600 opacity-40 group-hover:opacity-80'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="mt-6 pt-4 border-t border-theme-subtle flex items-center justify-between text-[11px] text-theme-secondary font-mono">
          <span>Preferences saved automatically</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-charcoal-950 font-bold text-xs transition-all shadow-gold-glow"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

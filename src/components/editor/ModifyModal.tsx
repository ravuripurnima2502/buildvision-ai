import React, { useState } from 'react';
import { BuildingSpecification } from '../../types/building';
import { applyDesignModification } from '../../engine/designModifier';
import { calculateEstimation } from '../../engine/estimator';
import { calculateChangeImpact } from '../../engine/impactCalculator';
import { ProjectVersion } from '../../types/project';
import { Sparkles, X, Wand2, Check, ArrowRight, MessageSquare, Plus, Layers, Maximize2, Trash2 } from 'lucide-react';

interface ModifyModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSpec: BuildingSpecification;
  currentVersionNumber: number;
  onApplyModification: (newVersion: ProjectVersion) => void;
}

const QUICK_PROMPTS = [
  { label: 'Add a Balcony', prompt: 'Add an expansive wrap-around cantilever balcony with glass railing', icon: Plus },
  { label: 'Enlarge Master Bedroom', prompt: 'Make the master bedroom larger with luxury suite dimensions', icon: Maximize2 },
  { label: 'Add Another Floor', prompt: 'Add another floor on top with a Penthouse Lounge and Open Sky Deck', icon: Layers },
  { label: 'Make Living Room Spacious', prompt: 'Make the living room more spacious with open concept glazing', icon: Maximize2 },
  { label: 'Relocate / Open Kitchen', prompt: 'Move the kitchen to create an open-concept flow facing the dining area', icon: Wand2 },
  { label: 'Convert Roof to Garden', prompt: 'Convert the flat roof into an eco-friendly rooftop sky garden with pergola', icon: Layers },
  { label: 'Remove Guest Bedroom', prompt: 'Remove the ground floor guest bedroom to expand circulation space', icon: Trash2 },
];

export const ModifyModal: React.FC<ModifyModalProps> = ({
  isOpen,
  onClose,
  currentSpec,
  currentVersionNumber,
  onApplyModification,
}) => {
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleApply = (instruction: string) => {
    if (!instruction.trim()) return;
    setIsProcessing(true);

    setTimeout(() => {
      // 1. AI Interprets and updates structured specification
      const result = applyDesignModification(currentSpec, instruction);

      // 2. Compute updated estimation
      const newEstimation = calculateEstimation(result.updatedSpec);

      // 3. Compute detailed Change Impact Delta
      const delta = calculateChangeImpact(currentSpec, result.updatedSpec, result.changeSummary);

      // 4. Create new Version
      const newVersion: ProjectVersion = {
        id: `v${currentVersionNumber + 1}`,
        versionNumber: currentVersionNumber + 1,
        title: `Revision: ${instruction.slice(0, 32)}...`,
        description: result.changeSummary,
        timestamp: new Date().toISOString(),
        buildingSpec: result.updatedSpec,
        estimation: newEstimation,
        deltaFromPrevious: delta,
      };

      setIsProcessing(false);
      onApplyModification(newVersion);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl rounded-2xl glass-panel-gold p-6 sm:p-8 border border-gold-500/30 blueprint-grid shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isProcessing}
          className="absolute top-5 right-5 text-slate-400 hover:text-gold-300 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="inline-flex items-center space-x-2 text-xs font-mono text-gold-400 uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Architectural Copilot</span>
          </div>
          <h2 className="text-2xl font-display font-bold text-white">
            Modify Building Design
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Describe design alterations in natural language. BuildVision AI will update the 3D model and immediately compute material, cost, and time impact.
          </p>
        </div>

        {/* Quick Suggestions Chips */}
        <div className="mb-4">
          <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-2">
            Suggested Client Alterations:
          </label>
          <div className="flex flex-wrap gap-2">
            {QUICK_PROMPTS.map((qp, i) => {
              const Icon = qp.icon;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setPrompt(qp.prompt)}
                  className="text-xs py-1.5 px-3 rounded-xl bg-charcoal-900/90 hover:bg-gold-500/20 text-slate-300 hover:text-gold-300 border border-slate-700/80 hover:border-gold-500/40 transition-all flex items-center space-x-1.5"
                >
                  <Icon className="w-3 h-3 text-gold-400" />
                  <span>{qp.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Natural Language Input */}
        <div className="space-y-3">
          <div className="relative">
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Make the master bedroom larger and add a wrap-around balcony with glass railing..."
              className="w-full bg-charcoal-900 border border-slate-700 rounded-xl p-3.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-gold-500"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-slate-500 font-mono">
              Creates Version {currentVersionNumber + 1}.0 with live Change Impact
            </span>

            <button
              onClick={() => handleApply(prompt)}
              disabled={isProcessing || !prompt.trim()}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-charcoal-950 text-xs font-bold shadow-gold-glow hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all flex items-center space-x-2"
            >
              {isProcessing ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-charcoal-950 border-t-transparent rounded-full animate-spin"></span>
                  <span>Modifying 3D Model...</span>
                </>
              ) : (
                <>
                  <span>Apply & Recalculate</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

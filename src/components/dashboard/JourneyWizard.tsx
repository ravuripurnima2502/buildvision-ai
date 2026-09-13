import React, { useState } from 'react';
import { JourneyType, Project, ProjectVersion } from '../../types/project';
import { generateStructuredBuilding } from '../../engine/buildingGenerator';
import { applyDesignModification } from '../../engine/designModifier';
import { calculateEstimation } from '../../engine/estimator';
import { calculateChangeImpact } from '../../engine/impactCalculator';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  X,
  Compass,
  Layers,
  Repeat,
  Check,
  Building,
  Ruler,
  Car,
  Home,
  CheckCircle2,
} from 'lucide-react';

interface JourneyWizardProps {
  journeyType: JourneyType;
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated: (project: Project) => void;
}

export const JourneyWizard: React.FC<JourneyWizardProps> = ({
  journeyType,
  isOpen,
  onClose,
  onProjectCreated,
}) => {
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);

  // Common Form Fields
  const [projectName, setProjectName] = useState('');
  const [purpose, setPurpose] = useState<'residential' | 'commercial' | 'office'>('residential');
  const [plotWidth, setPlotWidth] = useState(12); // meters
  const [plotLength, setPlotLength] = useState(16); // meters
  const [floorsCount, setFloorsCount] = useState(2);
  const [bedroomsCount, setBedroomsCount] = useState(3);
  const [hasParking, setHasParking] = useState(true);
  const [hasBalcony, setHasBalcony] = useState(true);
  const [hasGardenTerrace, setHasGardenTerrace] = useState(false);
  const [architecturalStyle, setArchitecturalStyle] = useState<'modern' | 'contemporary' | 'minimalist'>('modern');

  // Journey 2 Specific: User Natural Idea
  const [ideaPrompt, setIdeaPrompt] = useState(
    'A modern 2-floor family villa with a spacious living room, open kitchen, 3 bedrooms, covered parking for 2 cars, and a panoramic cantilevered balcony.'
  );

  // Journey 3 Specific: Existing Building & Proposed Addition
  const [existingFloors, setExistingFloors] = useState(1);
  const [selectedProposedChange, setSelectedProposedChange] = useState<
    'add_second_floor' | 'add_balcony' | 'extend_master_bedroom' | 'renovate_open_plan'
  >('add_second_floor');

  if (!isOpen) return null;

  const totalSteps = journeyType === 'already_built_changes' ? 3 : 3;

  const handleGenerate = () => {
    setIsGenerating(true);

    setTimeout(() => {
      let title = projectName.trim();
      let newProject: Project;

      if (journeyType === 'already_built_changes') {
        // Journey 3: Existing -> Proposed
        if (!title) title = 'Bungalow Vertical Addition';
        
        // 1. Create base existing structure
        const existingSpec = generateStructuredBuilding({
          name: `${title} (Existing Structure)`,
          purpose,
          plotWidth,
          plotLength,
          floorsCount: existingFloors,
          bedroomsCount: 2,
          hasParking: true,
          hasBalcony: false,
          architecturalStyle,
        });
        const estExisting = calculateEstimation(existingSpec);

        // 2. Create proposed version
        let modInstruction = 'Add another floor on top with a Penthouse Lounge and Open Sky Deck';
        if (selectedProposedChange === 'add_balcony') {
          modInstruction = 'Add an expansive wrap-around cantilever balcony with glass railing';
        } else if (selectedProposedChange === 'extend_master_bedroom') {
          modInstruction = 'Make the master bedroom larger and add luxury ensuite dressing';
        } else if (selectedProposedChange === 'renovate_open_plan') {
          modInstruction = 'Relocate kitchen to create an open-plan living and dining area';
        }

        const modResult = applyDesignModification(existingSpec, modInstruction);
        const estProposed = calculateEstimation(modResult.updatedSpec);
        const delta = calculateChangeImpact(existingSpec, modResult.updatedSpec, modResult.changeSummary);

        newProject = {
          id: `proj_${Date.now()}`,
          title,
          description: `Existing ${existingFloors}-floor property with proposed ${modResult.changeSummary.toLowerCase()}`,
          journeyType,
          userId: 'usr_active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          currentVersionId: 'v2',
          tags: ['Existing → Proposed', `${modResult.updatedSpec.floors.length} Floors`, 'Renovation'],
          existingBuildingSpec: existingSpec,
          versions: [
            {
              id: 'v1',
              versionNumber: 1,
              title: 'Existing Structure (As-Built)',
              description: 'Current baseline building configuration before proposed modifications.',
              timestamp: new Date(Date.now() - 86400000).toISOString(),
              buildingSpec: existingSpec,
              estimation: estExisting,
            },
            {
              id: 'v2',
              versionNumber: 2,
              title: 'Proposed Design Addition',
              description: modResult.changeSummary,
              timestamp: new Date().toISOString(),
              buildingSpec: modResult.updatedSpec,
              estimation: estProposed,
              deltaFromPrevious: delta,
            },
          ],
        };

      } else {
        // Journey 1 or 2
        if (!title) {
          title = journeyType === 'idea_to_structure' ? 'Architectural Concept Villa' : 'Engineered Modern Residence';
        }

        const spec = generateStructuredBuilding({
          name: title,
          purpose,
          plotWidth,
          plotLength,
          floorsCount,
          bedroomsCount,
          hasParking,
          hasBalcony,
          hasGardenTerrace,
          architecturalStyle,
          customNotes: journeyType === 'idea_to_structure' ? ideaPrompt : undefined,
        });
        const est = calculateEstimation(spec);

        newProject = {
          id: `proj_${Date.now()}`,
          title,
          description: journeyType === 'idea_to_structure'
            ? ideaPrompt
            : `${floorsCount} floors, ${bedroomsCount} bedrooms, ${hasParking ? 'parking, ' : ''}engineered for plot ${plotWidth}m x ${plotLength}m.`,
          journeyType,
          userId: 'usr_active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          currentVersionId: 'v1',
          tags: [`${floorsCount} Floors`, `${bedroomsCount} BHK`, architecturalStyle],
          versions: [
            {
              id: 'v1',
              versionNumber: 1,
              title: 'Initial Generated Blueprint',
              description: 'Generated from structural requirements and spatial constraints.',
              timestamp: new Date().toISOString(),
              buildingSpec: spec,
              estimation: est,
            },
          ],
        };
      }

      setIsGenerating(false);
      onProjectCreated(newProject);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl rounded-2xl glass-panel-gold p-6 sm:p-8 border border-gold-500/30 blueprint-grid shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isGenerating}
          className="absolute top-5 right-5 text-slate-400 hover:text-gold-300 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Wizard Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 text-xs font-mono text-gold-400 uppercase tracking-wider mb-1">
            {journeyType === 'structure_to_3d' && <Compass className="w-4 h-4" />}
            {journeyType === 'idea_to_structure' && <Layers className="w-4 h-4" />}
            {journeyType === 'already_built_changes' && <Repeat className="w-4 h-4 text-cyan-400" />}
            <span>
              {journeyType === 'structure_to_3d' && 'Option 1: Structure → 3D'}
              {journeyType === 'idea_to_structure' && 'Option 2: Idea → Structure → 3D'}
              {journeyType === 'already_built_changes' && 'Option 3: Already Built → Changes'}
            </span>
            <span className="text-slate-500">•</span>
            <span>Step {step} of {totalSteps}</span>
          </div>

          <h2 className="text-2xl font-display font-bold text-white">
            {journeyType === 'already_built_changes'
              ? 'Visualize Additions & Structural Changes'
              : 'Project Configuration & Requirements'}
          </h2>
        </div>

        {/* Loading / Generating State */}
        {isGenerating ? (
          <div className="py-14 text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center animate-bounce shadow-gold-glow">
              <Building className="w-7 h-7 text-charcoal-950" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-display font-bold text-white">
                Synthesizing Structured 3D Building Specification...
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Calculating coordinate grids • Placing load-bearing slabs • Computing material takeoff
              </p>
            </div>
          </div>
        ) : (
          <div>
            {/* STEP 1: Basic Identifiers & Scope */}
            {step === 1 && (
              <div className="space-y-5 animate-fadeIn">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
                    Project Title
                  </label>
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder={
                      journeyType === 'already_built_changes'
                        ? 'e.g. Existing Bungalow — Second Floor Proposal'
                        : 'e.g. Modern Minimalist Villa'
                    }
                    className="w-full bg-charcoal-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
                      Plot Width (meters)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min={8}
                        max={30}
                        value={plotWidth}
                        onChange={(e) => setPlotWidth(Number(e.target.value))}
                        className="w-full bg-charcoal-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold-500 font-mono"
                      />
                      <span className="absolute right-3 top-2.5 text-xs text-slate-500 font-mono">
                        ≈ {(plotWidth * 3.28084).toFixed(0)} ft
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
                      Plot Length (meters)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min={10}
                        max={40}
                        value={plotLength}
                        onChange={(e) => setPlotLength(Number(e.target.value))}
                        className="w-full bg-charcoal-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold-500 font-mono"
                      />
                      <span className="absolute right-3 top-2.5 text-xs text-slate-500 font-mono">
                        ≈ {(plotLength * 3.28084).toFixed(0)} ft
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
                    Building Purpose
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['residential', 'commercial', 'office'] as const).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPurpose(p)}
                        className={`py-2.5 px-3 rounded-xl border text-xs font-semibold capitalize transition-all ${
                          purpose === p
                            ? 'bg-gold-500/20 border-gold-500 text-gold-300 shadow-gold-glow'
                            : 'bg-charcoal-900 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Journey-Specific Inputs */}
            {step === 2 && (
              <div className="space-y-5 animate-fadeIn">
                {journeyType === 'already_built_changes' ? (
                  <>
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-cyan-300 mb-1.5">
                        Current Existing Structure Baseline
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setExistingFloors(1)}
                          className={`p-3 rounded-xl border text-left text-xs transition-all ${
                            existingFloors === 1
                              ? 'bg-cyan-950/40 border-cyan-500 text-white'
                              : 'bg-charcoal-900 border-slate-800 text-slate-400'
                          }`}
                        >
                          <span className="font-bold block text-sm">Ground Floor Only</span>
                          <span className="text-[11px] text-slate-400">Single-story existing house</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setExistingFloors(2)}
                          className={`p-3 rounded-xl border text-left text-xs transition-all ${
                            existingFloors === 2
                              ? 'bg-cyan-950/40 border-cyan-500 text-white'
                              : 'bg-charcoal-900 border-slate-800 text-slate-400'
                          }`}
                        >
                          <span className="font-bold block text-sm">G + 1 Existing</span>
                          <span className="text-[11px] text-slate-400">Two existing constructed floors</span>
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-gold-400 mb-1.5">
                        Select Proposed Addition / Alteration
                      </label>
                      <div className="space-y-2.5">
                        {[
                          {
                            id: 'add_second_floor',
                            title: 'Add Another Floor (Vertical Expansion)',
                            desc: 'Erect RCC columns and a penthouse lounge with an open rooftop sky deck.',
                          },
                          {
                            id: 'add_balcony',
                            title: 'Add Panoramic Cantilever Balcony',
                            desc: 'Extend upper floor master suite with safety-tempered glass balustrades.',
                          },
                          {
                            id: 'extend_master_bedroom',
                            title: 'Enlarge Master Bedroom Suite',
                            desc: 'Push exterior wall forward to create a walk-in wardrobe and ensuite bath.',
                          },
                          {
                            id: 'renovate_open_plan',
                            title: 'Open-Plan Layout Renovation',
                            desc: 'Remove dividing partitions to merge kitchen, dining, and central living room.',
                          },
                        ].map((item) => (
                          <div
                            key={item.id}
                            onClick={() => setSelectedProposedChange(item.id as any)}
                            className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start space-x-3 ${
                              selectedProposedChange === item.id
                                ? 'bg-gold-500/15 border-gold-500 text-white shadow-gold-glow'
                                : 'bg-charcoal-900 border-slate-800 text-slate-400 hover:border-slate-700'
                            }`}
                          >
                            <div className={`w-5 h-5 rounded-full mt-0.5 flex items-center justify-center shrink-0 border ${
                              selectedProposedChange === item.id ? 'border-gold-400 bg-gold-500 text-charcoal-950' : 'border-slate-600'
                            }`}>
                              {selectedProposedChange === item.id && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-200">{item.title}</p>
                              <p className="text-[11px] text-slate-400 mt-0.5">{item.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                ) : journeyType === 'idea_to_structure' ? (
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-gold-300 mb-1.5">
                      Describe Your Building Idea & Layout Preferences
                    </label>
                    <textarea
                      rows={4}
                      value={ideaPrompt}
                      onChange={(e) => setIdeaPrompt(e.target.value)}
                      placeholder="e.g. 2 floors, master bedroom on first floor with large balcony, open kitchen next to living room, parking for SUV..."
                      className="w-full bg-charcoal-900 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-gold-500"
                    />
                    <div className="flex flex-wrap gap-2 mt-2">
                      {[
                        'Add 2 car parking',
                        'Expansive terrace garden',
                        '3 spacious bedrooms',
                        'Open chef kitchen',
                      ].map((chip) => (
                        <button
                          key={chip}
                          type="button"
                          onClick={() => setIdeaPrompt(prev => `${prev} ${chip}.`)}
                          className="text-[11px] px-2.5 py-1 rounded-lg bg-charcoal-800 hover:bg-gold-500/20 text-slate-300 hover:text-gold-300 border border-slate-700 transition-colors"
                        >
                          + {chip}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
                        Number of Floors
                      </label>
                      <div className="flex space-x-3">
                        {[1, 2, 3].map((fl) => (
                          <button
                            key={fl}
                            type="button"
                            onClick={() => setFloorsCount(fl)}
                            className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                              floorsCount === fl
                                ? 'bg-gold-500/20 border-gold-500 text-gold-300 shadow-gold-glow'
                                : 'bg-charcoal-900 border-slate-800 text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            {fl} {fl === 1 ? 'Floor (Bungalow)' : 'Floors'}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
                        Bedrooms Required
                      </label>
                      <div className="flex space-x-3">
                        {[2, 3, 4, 5].map((bhk) => (
                          <button
                            key={bhk}
                            type="button"
                            onClick={() => setBedroomsCount(bhk)}
                            className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                              bedroomsCount === bhk
                                ? 'bg-gold-500/20 border-gold-500 text-gold-300 shadow-gold-glow'
                                : 'bg-charcoal-900 border-slate-800 text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            {bhk} BHK
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Amenities Toggles */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
                    Included Architectural Elements
                  </label>
                  <div className="grid grid-cols-3 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setHasParking(!hasParking)}
                      className={`p-2.5 rounded-xl border text-xs font-medium flex items-center justify-between transition-all ${
                        hasParking
                          ? 'bg-gold-500/15 border-gold-500/60 text-white'
                          : 'bg-charcoal-900 border-slate-800 text-slate-500'
                      }`}
                    >
                      <span className="flex items-center space-x-1.5">
                        <Car className="w-3.5 h-3.5 text-gold-400" />
                        <span>Parking</span>
                      </span>
                      {hasParking && <Check className="w-3 h-3 text-gold-400" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => setHasBalcony(!hasBalcony)}
                      className={`p-2.5 rounded-xl border text-xs font-medium flex items-center justify-between transition-all ${
                        hasBalcony
                          ? 'bg-gold-500/15 border-gold-500/60 text-white'
                          : 'bg-charcoal-900 border-slate-800 text-slate-500'
                      }`}
                    >
                      <span className="flex items-center space-x-1.5">
                        <Home className="w-3.5 h-3.5 text-gold-400" />
                        <span>Balconies</span>
                      </span>
                      {hasBalcony && <Check className="w-3 h-3 text-gold-400" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => setHasGardenTerrace(!hasGardenTerrace)}
                      className={`p-2.5 rounded-xl border text-xs font-medium flex items-center justify-between transition-all ${
                        hasGardenTerrace
                          ? 'bg-gold-500/15 border-gold-500/60 text-white'
                          : 'bg-charcoal-900 border-slate-800 text-slate-500'
                      }`}
                    >
                      <span className="flex items-center space-x-1.5">
                        <Layers className="w-3.5 h-3.5 text-gold-400" />
                        <span>Roof Garden</span>
                      </span>
                      {hasGardenTerrace && <Check className="w-3 h-3 text-gold-400" />}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Architectural Style & Confirmation */}
            {step === 3 && (
              <div className="space-y-5 animate-fadeIn">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
                    Architectural Style Expression
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'modern', title: 'Modern Clean', desc: 'Clean geometry, glass corners, and cantilevered slabs' },
                      { id: 'contemporary', title: 'Contemporary', desc: 'Deep warm wood accents and metallic louvers' },
                      { id: 'minimalist', title: 'Minimalist', desc: 'Sleek white facade with flush ribbon windows' },
                    ].map((st) => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => setArchitecturalStyle(st.id as any)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          architecturalStyle === st.id
                            ? 'bg-gold-500/20 border-gold-500 text-gold-300 shadow-gold-glow'
                            : 'bg-charcoal-900 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <span className="text-xs font-bold block">{st.title}</span>
                        <span className="text-[10px] text-slate-400 mt-1 block leading-tight">{st.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-charcoal-900/90 border border-gold-500/30 space-y-2">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-gold-400 flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-gold-400" />
                    <span>Synthesis Summary</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
                    <div>
                      <span className="text-slate-500">Plot Dimensions:</span> {plotWidth}m × {plotLength}m ({(plotWidth * plotLength * 10.764).toFixed(0)} sq.ft)
                    </div>
                    <div>
                      <span className="text-slate-500">Classification:</span> {purpose.toUpperCase()}
                    </div>
                    <div>
                      <span className="text-slate-500">Levels:</span> {journeyType === 'already_built_changes' ? `${existingFloors} (Existing) + Addition` : `${floorsCount} Floors`}
                    </div>
                    <div>
                      <span className="text-slate-500">Est. Calculations:</span> Real-time BOQ & Gantt
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Controls */}
            <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-charcoal-800 transition-colors flex items-center space-x-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
              )}

              <div className="flex items-center space-x-3">
                {step < totalSteps ? (
                  <button
                    type="button"
                    onClick={() => setStep(step + 1)}
                    className="px-6 py-2.5 rounded-xl bg-gold-500 text-charcoal-950 text-xs font-bold tracking-wide shadow-gold-glow hover:brightness-110 active:scale-95 transition-all flex items-center space-x-2"
                  >
                    <span>Proceed to Next Step</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleGenerate}
                    className="px-7 py-3 rounded-xl bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-charcoal-950 text-xs font-bold tracking-wide shadow-gold-glow hover:brightness-110 active:scale-95 transition-all flex items-center space-x-2"
                  >
                    <span>Synthesize 3D Building</span>
                    <Sparkles className="w-4 h-4 stroke-[2.5]" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

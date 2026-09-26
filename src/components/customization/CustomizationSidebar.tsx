import React, { useState } from 'react';
import { BuildingSpecification, Room, PlacedElement } from '../../types/building';
import { AddElementPanel } from './AddElementPanel';
import { FinishSelector } from './FinishSelector';
import { ColorCustomizer } from './ColorCustomizer';
import {
  Armchair,
  Layers,
  Palette,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  SlidersHorizontal,
} from 'lucide-react';

interface CustomizationSidebarProps {
  spec: BuildingSpecification;
  selectedRoom: Room | null;
  onSelectRoom: (room: Room) => void;
  onAddElement: (itemType: string, roomId?: string) => void;
  onRemoveElement: (elementId: string) => void;
  onUpdateTransform?: (elementId: string, transform: { rotation?: { x: number; y: number; z: number } }) => void;
  onSelectFinish: (category: 'floor' | 'walls' | 'roof', finishId: string) => void;
  onSelectColor: (category: 'floor' | 'walls' | 'roof', colorHex: string) => void;
  selectedElementId?: string | null;
  onSelectElement?: (element: PlacedElement | null) => void;
  isOpen?: boolean;
  onToggleOpen?: () => void;
  activeTab?: CustomizationTab;
  onChangeTab?: (tab: CustomizationTab) => void;
}

export type CustomizationTab = 'add_element' | 'finish' | 'color';

export const CustomizationSidebar: React.FC<CustomizationSidebarProps> = ({
  spec,
  selectedRoom,
  onSelectRoom,
  onAddElement,
  onRemoveElement,
  onUpdateTransform,
  onSelectFinish,
  onSelectColor,
  selectedElementId,
  onSelectElement,
  isOpen = true,
  onToggleOpen,
  activeTab: externalTab,
  onChangeTab,
}) => {
  const [internalTab, setInternalTab] = useState<CustomizationTab>('add_element');
  const [isExpanded, setIsExpanded] = useState(isOpen);

  React.useEffect(() => {
    setIsExpanded(isOpen);
  }, [isOpen]);

  const activeTab = externalTab !== undefined ? externalTab : internalTab;
  const setActiveTab = (tab: CustomizationTab) => {
    setInternalTab(tab);
    if (onChangeTab) onChangeTab(tab);
  };

  const surfaceCustomization = spec.surfaceCustomization || {
    floor: { finish: 'italian_white_marble', color: '#F8FAFC' },
    walls: { finish: 'smooth_plaster', color: '#1E293B' },
    roof: { finish: 'clay_roof_tile', color: '#B91C1C' },
  };

  const handleToggle = () => {
    const next = !isExpanded;
    setIsExpanded(next);
    if (onToggleOpen) onToggleOpen();
  };

  return (
    <>
      {/* Minimized Dock Bar on RIGHT */}
      {!isExpanded && (
        <div className="absolute top-[90px] right-6 z-30 flex flex-col space-y-2 select-none animate-fadeIn">
          <button
            onClick={handleToggle}
            className="p-3 rounded-2xl bg-[#0B1017]/95 backdrop-blur-2xl border border-gold-500/40 text-gold-400 hover:text-white hover:bg-gold-500/20 shadow-2xl transition-all cursor-pointer flex items-center space-x-2 group"
            title="Open Architectural Customization Studio"
          >
            <ChevronLeft className="w-4 h-4 text-gold-400 group-hover:-translate-x-0.5 transition-transform" />
            <SlidersHorizontal className="w-5 h-5 text-gold-400 group-hover:rotate-90 transition-transform duration-300" />
            <span className="text-xs font-display font-bold pr-1">Customize Studio</span>
          </button>
        </div>
      )}

      {/* Expanded Architectural Customization Drawer on RIGHT */}
      {isExpanded && (
        <div className="absolute top-[90px] right-6 z-30 w-[350px] max-w-[calc(100vw-3rem)] max-h-[calc(100vh-120px)] bg-[#0B1017]/95 backdrop-blur-2xl border border-gold-500/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-slideLeft select-none">
          {/* Main Top Header */}
          <div className="p-3.5 bg-white/[0.02] border-b border-white/[0.08] flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-xl bg-gold-500/15 border border-gold-400/40 flex items-center justify-center text-gold-400 shadow-sm">
                <SlidersHorizontal className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-display font-bold text-white tracking-wide">
                  Architectural Studio
                </h3>
                <p className="text-[10px] text-slate-400 font-mono">BIM Space Planner &amp; Materials</p>
              </div>
            </div>

            <button
              onClick={handleToggle}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-white/[0.08] rounded-xl transition-colors cursor-pointer"
              title="Collapse Panel"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* THREE INDEPENDENT CUSTOMIZATION SECTIONS AS MANDATED IN PROMPT */}
          <div className="grid grid-cols-3 p-1.5 bg-[#080C14] border-b border-white/[0.08] gap-1">
            {/* Section 1: Add Element */}
            <button
              onClick={() => setActiveTab('add_element')}
              className={`py-2 px-1.5 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                activeTab === 'add_element'
                  ? 'bg-gold-500 text-charcoal-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex items-center space-x-1">
                <Armchair className="w-3.5 h-3.5" />
                <span className="text-[11px] font-display">Add Element</span>
              </div>
              <span className={`text-[9px] font-mono mt-0.5 ${activeTab === 'add_element' ? 'text-charcoal-900/80 font-medium' : 'text-slate-500'}`}>
                Inside Rooms
              </span>
            </button>

            {/* Section 2: Finish */}
            <button
              onClick={() => setActiveTab('finish')}
              className={`py-2 px-1.5 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                activeTab === 'finish'
                  ? 'bg-gold-500 text-charcoal-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex items-center space-x-1">
                <Layers className="w-3.5 h-3.5" />
                <span className="text-[11px] font-display">Finish</span>
              </div>
              <span className={`text-[9px] font-mono mt-0.5 ${activeTab === 'finish' ? 'text-charcoal-900/80 font-medium' : 'text-slate-500'}`}>
                Materials
              </span>
            </button>

            {/* Section 3: Color / Paint */}
            <button
              onClick={() => setActiveTab('color')}
              className={`py-2 px-1.5 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                activeTab === 'color'
                  ? 'bg-gold-500 text-charcoal-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex items-center space-x-1">
                <Palette className="w-3.5 h-3.5" />
                <span className="text-[11px] font-display">Color</span>
              </div>
              <span className={`text-[9px] font-mono mt-0.5 ${activeTab === 'color' ? 'text-charcoal-900/80 font-medium' : 'text-slate-500'}`}>
                Paint &amp; Tint
              </span>
            </button>
          </div>

          {/* Active Tab Panel Content */}
          <div className="flex-1 p-3.5 overflow-y-auto flex flex-col min-h-0">
            {activeTab === 'add_element' && (
              <AddElementPanel
                spec={spec}
                selectedRoom={selectedRoom}
                onSelectRoom={onSelectRoom}
                onAddElement={onAddElement}
                onRemoveElement={onRemoveElement}
                onUpdateTransform={onUpdateTransform}
                selectedElementId={selectedElementId}
                onSelectElement={onSelectElement}
              />
            )}

            {activeTab === 'finish' && (
              <FinishSelector
                surfaceCustomization={surfaceCustomization}
                onSelectFinish={onSelectFinish}
              />
            )}

            {activeTab === 'color' && (
              <ColorCustomizer
                surfaceCustomization={surfaceCustomization}
                onSelectColor={onSelectColor}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

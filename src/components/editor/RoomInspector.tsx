import React from 'react';
import { Room } from '../../types/building';
import { formatArea } from '../../utils/formatting';
import { X, MessageSquare, Maximize2, Palette, Armchair, Layers } from 'lucide-react';

interface RoomInspectorProps {
  room: Room | null;
  onClose: () => void;
  onAskRobo: (room: Room) => void;
  onQuickModify: (room: Room) => void;
  onOpenAddElement?: (room: Room) => void;
  onOpenFinishSelector?: (room: Room) => void;
  onOpenColorCustomizer?: (room: Room) => void;
}

export const RoomInspector: React.FC<RoomInspectorProps> = ({
  room,
  onClose,
  onAskRobo,
  onQuickModify,
  onOpenAddElement,
  onOpenFinishSelector,
  onOpenColorCustomizer,
}) => {
  if (!room) return null;

  return (
    <div className="absolute top-[90px] right-6 xl:right-[390px] z-30 w-72 sm:w-80 bg-[#0B1017]/95 backdrop-blur-2xl border border-gold-500/40 rounded-2xl p-4 shadow-2xl animate-slideLeft select-none">
      {/* Header */}
      <div className="flex items-start justify-between pb-2.5 border-b border-white/[0.08]">
        <div>
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-gold-500/10 text-gold-400 border border-gold-500/30 font-semibold">
            {room.floorNumber === 0 ? 'Ground Floor' : `Level ${room.floorNumber}`}
          </span>
          <h3 className="text-sm font-display font-bold text-white mt-1 leading-snug">
            {room.name}
          </h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Spatial Metrics Telemetry */}
      <div className="py-2.5 space-y-1.5">
        <div className="flex items-center justify-between text-xs py-1.5 px-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          <span className="text-slate-400 font-mono">Net Carpet Area:</span>
          <span className="font-bold text-gold-300 font-mono">{formatArea(room.areaSqFt)}</span>
        </div>

        <div className="flex items-center justify-between text-xs py-1.5 px-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          <span className="text-slate-400 font-mono">CAD Clear Span:</span>
          <span className="font-semibold text-slate-200 font-mono">
            {room.width.toFixed(1)}m × {room.length.toFixed(1)}m
          </span>
        </div>

        <div className="flex items-center justify-between text-xs py-1.5 px-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          <span className="text-slate-400 font-mono">Clear Ceiling Height:</span>
          <span className="font-semibold text-slate-200 font-mono">{room.height.toFixed(1)}m (10.0 ft)</span>
        </div>

        <div className="flex items-center justify-between text-xs py-1.5 px-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          <span className="text-slate-400 font-mono">Joinery Openings:</span>
          <span className="font-semibold text-slate-200 font-mono">
            {room.openings.filter(o => o.type === 'door').length} Doors • {room.openings.filter(o => o.type === 'window').length} Glazing
          </span>
        </div>

        {/* Architectural Customization Actions: Add Element, Finish, Color */}
        <div className="pt-2">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5">
            Room Customization:
          </span>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              onClick={() => onOpenAddElement && onOpenAddElement(room)}
              className="py-2 px-1 rounded-xl bg-white/[0.04] hover:bg-gold-500/15 border border-white/[0.08] hover:border-gold-500/40 text-slate-200 hover:text-gold-300 flex flex-col items-center justify-center transition-all cursor-pointer"
            >
              <Armchair className="w-4 h-4 text-gold-400 mb-1" />
              <span className="text-[10px] font-bold">Add Element</span>
            </button>

            <button
              onClick={() => onOpenFinishSelector && onOpenFinishSelector(room)}
              className="py-2 px-1 rounded-xl bg-white/[0.04] hover:bg-gold-500/15 border border-white/[0.08] hover:border-gold-500/40 text-slate-200 hover:text-gold-300 flex flex-col items-center justify-center transition-all cursor-pointer"
            >
              <Layers className="w-4 h-4 text-gold-400 mb-1" />
              <span className="text-[10px] font-bold">Finish</span>
            </button>

            <button
              onClick={() => onOpenColorCustomizer && onOpenColorCustomizer(room)}
              className="py-2 px-1 rounded-xl bg-white/[0.04] hover:bg-gold-500/15 border border-white/[0.08] hover:border-gold-500/40 text-slate-200 hover:text-gold-300 flex flex-col items-center justify-center transition-all cursor-pointer"
            >
              <Palette className="w-4 h-4 text-gold-400 mb-1" />
              <span className="text-[10px] font-bold">Color</span>
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-2 border-t border-white/[0.08] space-y-1.5">
        <button
          onClick={() => onQuickModify(room)}
          className="w-full py-2 px-3 rounded-xl btn-gold text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span>Expand Room Envelope (+1.5m)</span>
        </button>

        <button
          onClick={() => onAskRobo(room)}
          className="w-full py-2 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-gold-300 hover:text-white text-xs font-semibold border border-gold-500/30 transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
        >
          <MessageSquare className="w-3.5 h-3.5 text-gold-400" />
          <span>Consult Civil Copilot on Room</span>
        </button>
      </div>
    </div>
  );
};

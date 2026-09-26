import React from 'react';
import { Room } from '../../types/building';
import { formatArea } from '../../utils/formatting';
import { X, MessageSquare, Maximize2, Palette, Sparkles, Box } from 'lucide-react';

interface RoomInspectorProps {
  room: Room | null;
  onClose: () => void;
  onAskRobo: (room: Room) => void;
  onQuickModify: (room: Room) => void;
  onChangeMaterial?: (room: Room, material: 'marble' | 'hardwood' | 'granite' | 'ceramic_tile' | 'polished_concrete' | 'terrace_tile') => void;
}

const FLOOR_MATERIALS = [
  { id: 'marble', label: 'Italian Statuario Marble', color: '#F8FAFC' },
  { id: 'hardwood', label: 'Burma Teak Hardwood', color: '#B45309' },
  { id: 'granite', label: 'Galaxy Black Granite', color: '#334155' },
  { id: 'ceramic_tile', label: 'Glazed Ceramic Tile', color: '#CBD5E1' },
  { id: 'terrace_tile', label: 'Terracotta Clay Tile', color: '#0F766E' },
] as const;

export const RoomInspector: React.FC<RoomInspectorProps> = ({
  room,
  onClose,
  onAskRobo,
  onQuickModify,
  onChangeMaterial,
}) => {
  if (!room) return null;

  return (
    <div className="absolute top-24 right-4 z-30 w-72 sm:w-80 bg-[#0B1017]/95 backdrop-blur-2xl border border-gold-500/40 rounded-2xl p-5 shadow-2xl animate-slideLeft select-none">
      {/* Header */}
      <div className="flex items-start justify-between pb-3 border-b border-white/[0.08]">
        <div>
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-gold-500/10 text-gold-400 border border-gold-500/30 font-semibold">
            {room.floorNumber === 0 ? 'Ground Floor' : `Level ${room.floorNumber}`}
          </span>
          <h3 className="text-base font-display font-bold text-white mt-1.5 leading-snug">
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
      <div className="py-3 space-y-2">
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

        {/* Floor Material Finish Palette */}
        {onChangeMaterial && (
          <div className="pt-2">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-400 font-mono flex items-center space-x-1.5">
                <Palette className="w-3.5 h-3.5 text-gold-400" />
                <span>Floor Finish:</span>
              </span>
              <span className="text-gold-300 font-semibold text-[11px] capitalize">
                {room.floorMaterial ? room.floorMaterial.replace('_', ' ') : 'Vitrified Tile'}
              </span>
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {FLOOR_MATERIALS.map((mat) => (
                <button
                  key={mat.id}
                  onClick={() => onChangeMaterial(room, mat.id)}
                  title={mat.label}
                  className={`h-7 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                    room.floorMaterial === mat.id
                      ? 'border-gold-400 ring-2 ring-gold-400/50 scale-105'
                      : 'border-white/[0.1] hover:border-gold-500/40'
                  }`}
                  style={{ backgroundColor: mat.color }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="pt-2 border-t border-white/[0.08] space-y-2">
        <button
          onClick={() => onQuickModify(room)}
          className="w-full py-2.5 px-3 rounded-xl btn-gold text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span>Expand Room Envelope (+1.5m)</span>
        </button>

        <button
          onClick={() => onAskRobo(room)}
          className="w-full py-2.5 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-gold-300 hover:text-white text-xs font-semibold border border-gold-500/30 transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
        >
          <MessageSquare className="w-3.5 h-3.5 text-gold-400" />
          <span>Consult Civil Copilot on Layout</span>
        </button>
      </div>
    </div>
  );
};

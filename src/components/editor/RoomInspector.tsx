import React from 'react';
import { Room } from '../../types/building';
import { formatArea } from '../../utils/formatting';
import { X, MessageSquare, Maximize2, Palette } from 'lucide-react';

interface RoomInspectorProps {
  room: Room | null;
  onClose: () => void;
  onAskRobo: (room: Room) => void;
  onQuickModify: (room: Room) => void;
  onChangeMaterial?: (room: Room, material: 'marble' | 'hardwood' | 'granite' | 'ceramic_tile' | 'polished_concrete' | 'terrace_tile') => void;
}

const FLOOR_MATERIALS = [
  { id: 'marble', label: 'Italian Marble', color: '#F1F5F9' },
  { id: 'hardwood', label: 'Teak Hardwood', color: '#B45309' },
  { id: 'granite', label: 'Polished Granite', color: '#334155' },
  { id: 'ceramic_tile', label: 'Ceramic Tile', color: '#CBD5E1' },
  { id: 'terrace_tile', label: 'Terrace Clay Tile', color: '#0F766E' },
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
    <div className="absolute top-20 right-4 z-30 w-72 sm:w-80 bg-charcoal-950/95 backdrop-blur-xl border border-gold-500/40 rounded-2xl p-5 shadow-2xl animate-slideLeft select-none">
      {/* Header */}
      <div className="flex items-start justify-between pb-3 border-b border-slate-800">
        <div>
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-gold-500/20 text-gold-300 border border-gold-500/30">
            {room.floorNumber === 0 ? 'Ground Floor' : `Floor ${room.floorNumber + 1}`}
          </span>
          <h3 className="text-base font-display font-bold text-white mt-1.5 leading-snug">
            {room.name}
          </h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-charcoal-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Spatial Metrics */}
      <div className="py-3 space-y-2.5">
        <div className="flex items-center justify-between text-xs py-1 px-2.5 rounded-lg bg-charcoal-900 border border-slate-800">
          <span className="text-slate-400 font-mono">Floor Area:</span>
          <span className="font-bold text-gold-300 font-mono">{formatArea(room.areaSqFt)}</span>
        </div>

        <div className="flex items-center justify-between text-xs py-1 px-2.5 rounded-lg bg-charcoal-900 border border-slate-800">
          <span className="text-slate-400 font-mono">Dimensions:</span>
          <span className="font-semibold text-slate-200 font-mono">
            {room.width.toFixed(1)}m × {room.length.toFixed(1)}m
          </span>
        </div>

        <div className="flex items-center justify-between text-xs py-1 px-2.5 rounded-lg bg-charcoal-900 border border-slate-800">
          <span className="text-slate-400 font-mono">Ceiling Height:</span>
          <span className="font-semibold text-slate-200 font-mono">{room.height.toFixed(1)}m (10 ft)</span>
        </div>

        <div className="flex items-center justify-between text-xs py-1 px-2.5 rounded-lg bg-charcoal-900 border border-slate-800">
          <span className="text-slate-400 font-mono">Openings:</span>
          <span className="font-semibold text-slate-200 font-mono">
            {room.openings.filter(o => o.type === 'door').length} Doors • {room.openings.filter(o => o.type === 'window').length} Windows
          </span>
        </div>

        {/* Floor Material Selector */}
        {onChangeMaterial && (
          <div className="pt-2">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-400 font-mono flex items-center space-x-1">
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
                  className={`h-7 rounded-lg border flex items-center justify-center transition-all ${
                    room.floorMaterial === mat.id
                      ? 'border-gold-400 ring-2 ring-gold-400/50 scale-105'
                      : 'border-slate-700 hover:border-slate-500'
                  }`}
                  style={{ backgroundColor: mat.color }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quick Action Buttons */}
      <div className="pt-2 border-t border-slate-800 space-y-2">
        <button
          onClick={() => onQuickModify(room)}
          className="w-full py-2 px-3 rounded-xl bg-gold-500 hover:bg-gold-400 text-charcoal-950 text-xs font-bold transition-all flex items-center justify-center space-x-1.5 shadow-gold-glow"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span>Expand this Room (+1.5m)</span>
        </button>

        <button
          onClick={() => onAskRobo(room)}
          className="w-full py-2 px-3 rounded-xl bg-charcoal-900 hover:bg-charcoal-800 text-gold-300 hover:text-gold-200 text-xs font-semibold border border-gold-500/30 transition-all flex items-center justify-center space-x-1.5"
        >
          <MessageSquare className="w-3.5 h-3.5 text-gold-400" />
          <span>Ask Civil Robo About This Space</span>
        </button>
      </div>
    </div>
  );
};

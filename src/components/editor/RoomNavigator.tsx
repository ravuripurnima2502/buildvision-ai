import React, { useState } from 'react';
import { BuildingSpecification, Room } from '../../types/building';
import {
  Compass,
  ChevronDown,
  ChevronUp,
  Home,
  Eye,
  Layers,
} from 'lucide-react';

interface RoomNavigatorProps {
  spec: BuildingSpecification;
  selectedRoomId: string | null;
  onSelectRoom: (room: Room | null) => void;
  onResetExterior: () => void;
  activeFloorNumber: number | 'all';
}

export const RoomNavigator: React.FC<RoomNavigatorProps> = ({
  spec,
  selectedRoomId,
  onSelectRoom,
  onResetExterior,
  activeFloorNumber,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  // Group rooms by floor
  const allRooms = spec.floors.flatMap(f => f.rooms);
  const visibleRooms = activeFloorNumber === 'all'
    ? allRooms
    : allRooms.filter(r => r.floorNumber === activeFloorNumber);

  const selectedRoom = allRooms.find(r => r.id === selectedRoomId);

  return (
    <div className="absolute top-24 left-4 z-20 pointer-events-auto select-none w-64 sm:w-72 transition-all">
      <div className="bg-[#0B1017]/90 backdrop-blur-xl border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden">
        {/* Navigation Header */}
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="px-3.5 py-2.5 flex items-center justify-between cursor-pointer hover:bg-white/[0.04] transition-colors border-b border-white/[0.06]"
        >
          <div className="flex items-center space-x-2">
            <Compass className="w-4 h-4 text-gold-400 stroke-[2.2]" />
            <span className="text-xs font-display font-bold text-white tracking-wide">
              Spatial Directory
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-gold-500/10 text-gold-400 border border-gold-500/20 font-semibold">
              {visibleRooms.length}
            </span>
          </div>

          <button className="text-slate-400 hover:text-white p-0.5 cursor-pointer">
            {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Collapsible Room Chips & Selector */}
        {isOpen && (
          <div className="p-2 space-y-1 max-h-64 overflow-y-auto">
            {/* Quick Exit to Exterior View */}
            <button
              onClick={() => {
                onSelectRoom(null);
                onResetExterior();
              }}
              className={`w-full px-2.5 py-1.5 rounded-xl text-left text-xs font-mono flex items-center justify-between transition-all cursor-pointer ${
                !selectedRoomId
                  ? 'bg-gold-500 text-charcoal-950 font-bold shadow-gold-glow'
                  : 'text-slate-400 hover:bg-white/[0.04] hover:text-white'
              }`}
            >
              <span className="flex items-center space-x-1.5">
                <Home className="w-3.5 h-3.5" />
                <span>Building Isometric</span>
              </span>
              <span className="text-[10px] opacity-75 font-mono">Exterior</span>
            </button>

            {/* Room List */}
            <div className="pt-1 space-y-1">
              {visibleRooms.map((room) => {
                const isSelected = selectedRoomId === room.id;
                const floorLabel = room.floorNumber === 0 ? 'GF' : `L${room.floorNumber}`;

                return (
                  <button
                    key={room.id}
                    onClick={() => onSelectRoom(room)}
                    className={`w-full px-2.5 py-1.5 rounded-xl text-left text-xs transition-all flex items-center justify-between group cursor-pointer ${
                      isSelected
                        ? 'bg-sky-500 text-charcoal-950 font-bold shadow-blueprint-glow'
                        : 'text-slate-300 hover:bg-white/[0.04] hover:text-gold-300'
                    }`}
                  >
                    <span className="truncate pr-2">{room.name}</span>
                    <div className="flex items-center space-x-1.5 flex-shrink-0">
                      <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                        isSelected ? 'bg-charcoal-950/25 text-charcoal-950 font-bold' : 'text-slate-400 bg-white/[0.04]'
                      }`}>
                        {floorLabel}
                      </span>
                      <span className={`text-[10px] font-mono ${
                        isSelected ? 'text-charcoal-950 font-bold' : 'text-slate-400'
                      }`}>
                        {Math.round(room.areaSqFt)}sf
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Currently Inspected Room Quick Telemetry */}
        {selectedRoom && (
          <div className="px-3 py-1.5 bg-[#080C14] border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-gold-400">
            <span className="flex items-center space-x-1.5 truncate">
              <Eye className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">Active: {selectedRoom.name}</span>
            </span>
            <button
              onClick={() => {
                onSelectRoom(null);
                onResetExterior();
              }}
              className="text-slate-400 hover:text-white underline cursor-pointer"
            >
              Reset
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

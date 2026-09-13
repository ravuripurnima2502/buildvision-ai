import React, { useState } from 'react';
import { BuildingSpecification, Room } from '../../types/building';
import {
  Compass,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Home,
  Layers,
  Sparkles,
  Eye,
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
    <div className="absolute top-20 left-4 z-20 pointer-events-auto select-none max-w-xs transition-all">
      <div className="bg-charcoal-900/90 backdrop-blur-xl border border-theme-subtle rounded-2xl shadow-xl overflow-hidden">
        {/* Navigation Header */}
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="px-3.5 py-2.5 flex items-center justify-between cursor-pointer hover:bg-theme-card/50 transition-colors border-b border-theme-subtle"
        >
          <div className="flex items-center space-x-2">
            <Compass className="w-4 h-4 text-gold-400" />
            <span className="text-xs font-display font-bold text-theme-heading tracking-wide">
              Room Explorer
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-gold-500/10 text-gold-400 border border-gold-500/20">
              {visibleRooms.length}
            </span>
          </div>

          <button className="text-theme-secondary hover:text-gold-400 p-0.5">
            {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Collapsible Room Chips & Selector */}
        {isOpen && (
          <div className="p-2 space-y-1 max-h-60 overflow-y-auto">
            {/* Quick Exit to Exterior View */}
            <button
              onClick={() => {
                onSelectRoom(null);
                onResetExterior();
              }}
              className={`w-full px-2.5 py-1.5 rounded-xl text-left text-xs font-mono flex items-center justify-between transition-all ${
                !selectedRoomId
                  ? 'bg-gold-500 text-charcoal-950 font-bold shadow-gold-glow'
                  : 'text-theme-secondary hover:bg-theme-card hover:text-theme-heading'
              }`}
            >
              <span className="flex items-center space-x-1.5">
                <Home className="w-3.5 h-3.5" />
                <span>Exterior Overview</span>
              </span>
              <span className="text-[10px] opacity-75">Full View</span>
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
                    className={`w-full px-2.5 py-1.5 rounded-xl text-left text-xs transition-all flex items-center justify-between group ${
                      isSelected
                        ? 'bg-cyan-500 text-charcoal-950 font-bold shadow-blueprint-glow'
                        : 'text-theme-primary hover:bg-theme-card hover:text-gold-400'
                    }`}
                  >
                    <span className="truncate pr-2">{room.name}</span>
                    <div className="flex items-center space-x-1 flex-shrink-0">
                      <span className={`text-[10px] font-mono px-1 rounded ${
                        isSelected ? 'bg-charcoal-950/20 text-charcoal-950' : 'text-theme-muted bg-theme-base'
                      }`}>
                        {floorLabel}
                      </span>
                      <span className={`text-[10px] font-mono ${
                        isSelected ? 'text-charcoal-950/80 font-bold' : 'text-theme-secondary'
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

        {/* Currently Inspected Room Quick Tip */}
        {selectedRoom && (
          <div className="px-3 py-1.5 bg-theme-base/60 border-t border-theme-subtle flex items-center justify-between text-[10px] font-mono text-gold-400">
            <span className="flex items-center space-x-1 truncate">
              <Eye className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">Viewing: {selectedRoom.name}</span>
            </span>
            <button
              onClick={() => {
                onSelectRoom(null);
                onResetExterior();
              }}
              className="text-theme-muted hover:text-red-400 underline ml-2 flex-shrink-0"
            >
              Exit
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

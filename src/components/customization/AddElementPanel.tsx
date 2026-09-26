import React, { useState, useMemo } from 'react';
import {
  FURNITURE_CATALOG,
  FurnitureCatalogItem,
  getCatalogCategories,
  getCatalogItemsForRoom,
} from '../3d/FurnitureCatalog';
import { BuildingSpecification, Room, PlacedElement } from '../../types/building';
import { buildRoomRegistry } from '../3d/RoomRegistry';
import {
  Armchair,
  Plus,
  Trash2,
  RotateCw,
  Move,
  Search,
  Sparkles,
  ChevronDown,
  Info,
  Layers,
} from 'lucide-react';

interface AddElementPanelProps {
  spec: BuildingSpecification;
  selectedRoom: Room | null;
  onSelectRoom: (room: Room) => void;
  onAddElement: (itemType: string, roomId?: string) => void;
  onRemoveElement: (elementId: string) => void;
  onUpdateTransform?: (elementId: string, transform: { rotation?: { x: number; y: number; z: number } }) => void;
  selectedElementId?: string | null;
  onSelectElement?: (element: PlacedElement | null) => void;
}

export const AddElementPanel: React.FC<AddElementPanelProps> = ({
  spec,
  selectedRoom,
  onSelectRoom,
  onAddElement,
  onRemoveElement,
  onUpdateTransform,
  selectedElementId,
  onSelectElement,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'catalog' | 'placed'>('catalog');

  // All rooms in the building
  const allRooms = useMemo(() => {
    return spec.floors.flatMap((f) => f.rooms);
  }, [spec.floors]);

  // Categories
  const categories = useMemo(() => ['All', ...getCatalogCategories()], []);

  // Filtered Catalog
  const filteredCatalog = useMemo(() => {
    let list = selectedRoom ? getCatalogItemsForRoom(selectedRoom.type) : FURNITURE_CATALOG;

    if (selectedCategory !== 'All') {
      list = list.filter((item) => item.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.aliases.some((a) => a.includes(q)) ||
          item.description.toLowerCase().includes(q)
      );
    }

    return list;
  }, [selectedCategory, searchQuery, selectedRoom]);

  // Placed elements in building
  const placedElements = spec.placedElements || [];
  const placedInSelectedRoom = selectedRoom
    ? placedElements.filter((el) => el.roomId === selectedRoom.id)
    : placedElements;

  return (
    <div className="flex flex-col h-full text-slate-100 select-none">
      {/* Panel Header */}
      <div className="pb-3 border-b border-white/[0.08]">
        <div className="flex items-center space-x-2 text-gold-400">
          <Armchair className="w-4 h-4 text-gold-400" />
          <h3 className="text-sm font-display font-bold text-white tracking-wide uppercase">
            Add Element &amp; Furnishings
          </h3>
        </div>
        <p className="text-[11px] text-slate-400 mt-1 leading-snug">
          Place furniture, appliances, and decorative items inside specific room boundaries.
        </p>
      </div>

      {/* Target Room Selector Dropdown */}
      <div className="my-3 p-2.5 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
        <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5">
          Target Room for Placement:
        </label>
        <div className="relative">
          <select
            value={selectedRoom?.id || ''}
            onChange={(e) => {
              const r = allRooms.find((rm) => rm.id === e.target.value);
              if (r) onSelectRoom(r);
            }}
            className="w-full bg-[#080C14] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white appearance-none focus:outline-none focus:border-gold-500 font-sans cursor-pointer"
          >
            <option value="">Select a room (or auto-place)</option>
            {allRooms.map((rm) => (
              <option key={rm.id} value={rm.id}>
                {rm.name} ({rm.floorNumber === 0 ? 'Ground' : `Floor ${rm.floorNumber}`}) • {Math.round(rm.areaSqFt)} sq.ft
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3 pointer-events-none" />
        </div>
      </div>

      {/* Mode Sub-tabs: Catalog vs Placed in Building */}
      <div className="flex p-1 bg-white/[0.03] rounded-xl border border-white/[0.08] mb-3">
        <button
          onClick={() => setActiveTab('catalog')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            activeTab === 'catalog'
              ? 'bg-gold-500 text-charcoal-950 font-bold shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Furniture Catalog ({filteredCatalog.length})
        </button>
        <button
          onClick={() => setActiveTab('placed')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            activeTab === 'placed'
              ? 'bg-gold-500 text-charcoal-950 font-bold shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Placed in Model ({placedElements.length})
        </button>
      </div>

      {/* VIEW 1: CATALOG BROWSER */}
      {activeTab === 'catalog' && (
        <div className="flex-1 flex flex-col min-h-0">
          {/* Search Box */}
          <div className="relative mb-2.5">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search fridge, sofa, bed, tv, wardrobe…"
              className="w-full bg-[#080C14] border border-white/[0.1] rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-gold-500"
            />
          </div>

          {/* Category Chips Horizontal Scroll */}
          <div className="flex space-x-1.5 overflow-x-auto pb-2 mb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-[10px] font-mono px-2.5 py-1 rounded-lg border whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'border-gold-400 bg-gold-500/20 text-gold-300 font-bold'
                    : 'border-white/[0.08] bg-white/[0.02] text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Catalog Item Cards Scroll Area */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[380px]">
            {filteredCatalog.map((item: FurnitureCatalogItem) => (
              <div
                key={item.id}
                className="p-2.5 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-gold-500/40 hover:bg-white/[0.04] transition-all flex items-center justify-between space-x-3 group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/[0.06] text-slate-300 border border-white/[0.06]">
                      {item.category}
                    </span>
                    <h4 className="text-xs font-bold text-white truncate font-display">
                      {item.name}
                    </h4>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 line-clamp-1 leading-snug">
                    {item.description}
                  </p>
                  <div className="flex items-center space-x-2 mt-1.5">
                    <span className="text-xs font-bold text-gold-300 font-mono">
                      ₹{item.estimatedCost.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      ({item.dimensions.width.toFixed(1)}m × {item.dimensions.length.toFixed(1)}m)
                    </span>
                  </div>
                </div>

                {/* Add to Room Action Button */}
                <button
                  onClick={() => onAddElement(item.id, selectedRoom?.id)}
                  className="px-3 py-2 rounded-xl btn-gold text-xs font-bold shrink-0 flex items-center space-x-1.5 cursor-pointer shadow-sm hover:scale-105 active:scale-95 transition-all"
                  title={`Add ${item.name} to ${selectedRoom?.name || 'room'}`}
                >
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Add</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 2: PLACED OBJECTS IN MODEL */}
      {activeTab === 'placed' && (
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[460px]">
          {placedInSelectedRoom.length === 0 ? (
            <div className="p-6 text-center rounded-2xl bg-white/[0.02] border border-dashed border-white/[0.08]">
              <Armchair className="w-8 h-8 text-slate-500 mx-auto mb-2 opacity-40" />
              <p className="text-xs text-slate-400 font-medium">No furniture placed yet.</p>
              <p className="text-[10px] text-slate-400 mt-1">
                Select items from the catalog or ask FloatingRobo to furnish rooms!
              </p>
            </div>
          ) : (
            placedInSelectedRoom.map((el: PlacedElement) => {
              const isSelected = selectedElementId === el.id;
              const room = allRooms.find((r) => r.id === el.roomId);

              return (
                <div
                  key={el.id}
                  onClick={() => onSelectElement && onSelectElement(el)}
                  className={`p-2.5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-gold-400 bg-gold-500/15 shadow-gold-glow'
                      : 'border-white/[0.08] bg-white/[0.02] hover:border-gold-500/30 hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white font-display">
                        {el.name || el.itemType}
                      </h4>
                      <span className="text-[10px] font-mono text-gold-400">
                        {room ? room.name : 'Interior Room'} • ₹{(el.estimatedCost || 0).toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      {/* Rotate 45deg button */}
                      {onUpdateTransform && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const currentRotY = el.rotation?.y || 0;
                            onUpdateTransform(el.id, {
                              rotation: {
                                x: el.rotation?.x || 0,
                                y: currentRotY + Math.PI / 4,
                                z: el.rotation?.z || 0,
                              },
                            });
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-gold-300 hover:bg-white/[0.06] transition-colors"
                          title="Rotate 45°"
                        >
                          <RotateCw className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {/* Delete button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveElement(el.id);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Delete element"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 mt-2 text-[9px] font-mono text-slate-400 bg-black/30 p-1.5 rounded-lg">
                    <span>Pos: ({el.position.x.toFixed(1)}, {el.position.z.toFixed(1)})</span>
                    <span>•</span>
                    <span>Floor Level: {el.position.y.toFixed(2)}m</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Helper Footer */}
      <div className="mt-3 p-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[10px] text-slate-400 flex items-center space-x-2 font-mono">
        <Info className="w-3.5 h-3.5 text-gold-400 shrink-0" />
        <span>You can also tell FloatingRobo: "Add a fridge in the kitchen" or "Hall lo sofa pettu".</span>
      </div>
    </div>
  );
};

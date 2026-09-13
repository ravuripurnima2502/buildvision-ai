import { BuildingSpecification, Floor, Room, RoomType } from '../types/building';

interface GenerationRequirements {
  name?: string;
  purpose?: 'residential' | 'commercial' | 'office' | 'mixed_use';
  plotWidth?: number;
  plotLength?: number;
  floorsCount?: number;
  bedroomsCount?: number;
  hasParking?: boolean;
  hasBalcony?: boolean;
  hasGardenTerrace?: boolean;
  architecturalStyle?: 'modern' | 'minimalist' | 'contemporary' | 'classic';
  customNotes?: string;
}

// Room color palette for architectural visual clarity
const ROOM_COLORS: Record<RoomType, string> = {
  living: '#3B82F6', // Elegant Architectural Blue
  master_bedroom: '#8B5CF6', // Royal Purple
  bedroom: '#6366F1', // Indigo
  kitchen: '#F59E0B', // Amber
  bathroom: '#06B6D4', // Cyan
  balcony: '#10B981', // Emerald Green
  parking: '#64748B', // Slate
  dining: '#EC4899', // Rose
  stairs: '#D97706', // Ocre Amber
  terrace: '#14B8A6', // Teal
  corridor: '#475569', // Slate
  study: '#0284C7', // Sky Blue
};

export function generateStructuredBuilding(req: GenerationRequirements): BuildingSpecification {
  const plotWidth = req.plotWidth || 12; // 12m (~40ft)
  const plotLength = req.plotLength || 16; // 16m (~52ft)
  const floorsCount = Math.max(req.floorsCount || 2, 1);
  const purpose = req.purpose || 'residential';
  const name = req.name || (floorsCount > 1 ? `Multi-Floor ${purpose === 'residential' ? 'Villa' : 'Building'}` : `Contemporary Urban Residence`);
  const style = req.architecturalStyle || 'modern';

  // Ground Floor Dimensions (leaving setback margin of 1m each side)
  const bldgWidth = Math.min(plotWidth - 2, 10);
  const bldgLength = Math.min(plotLength - 2, 14);
  const floorHeight = 3.0; // 3 meters ceiling height

  const floors: Floor[] = [];

  for (let f = 0; f < floorsCount; f++) {
    const isGround = f === 0;
    const floorElevation = f * (floorHeight + 0.2);
    const rooms: Room[] = [];

    const floorName = isGround ? 'Ground Floor' : f === 1 ? 'First Floor' : `Floor ${f + 1}`;

    if (isGround) {
      // Ground floor layout
      const halfW = bldgWidth / 2;
      const thirdL = bldgLength / 3;

      // 1. Front Portico / Parking
      if (req.hasParking !== false) {
        rooms.push({
          id: `f0_parking`,
          name: 'Covered Portico & Parking',
          type: 'parking',
          floorNumber: 0,
          x: -halfW / 2,
          z: bldgLength / 2 - thirdL / 2,
          width: halfW - 0.2,
          length: thirdL - 0.2,
          height: floorHeight,
          areaSqFt: (halfW * thirdL) * 10.764,
          color: ROOM_COLORS.parking,
          floorMaterial: 'polished_concrete',
          openings: [],
          furniture: [
            { id: 'f0_car1', type: 'car', x: 0, y: 0.1, z: 0, width: 1.8, length: 3.8, height: 1.4 }
          ]
        });
      }

      // 2. Grand Living Room
      const livingWidth = req.hasParking !== false ? halfW : bldgWidth;
      rooms.push({
        id: `f0_living`,
        name: 'Grand Foyer & Living Room',
        type: 'living',
        floorNumber: 0,
        x: req.hasParking !== false ? halfW / 2 : 0,
        z: bldgLength / 2 - thirdL / 2,
        width: livingWidth - 0.2,
        length: thirdL - 0.2,
        height: floorHeight,
        areaSqFt: (livingWidth * thirdL) * 10.764,
        color: ROOM_COLORS.living,
        floorMaterial: 'marble',
        openings: [
          { id: 'op_f0_door_main', type: 'door', wallSide: 'south', offset: livingWidth / 2, width: 1.2, height: 2.2 },
          { id: 'op_f0_win_living', type: 'window', wallSide: 'east', offset: thirdL / 2, width: 1.8, height: 1.4 }
        ],
        furniture: [
          { id: 'f0_sofa', type: 'sofa', x: 0, y: 0.1, z: 0, width: 2.2, length: 1.0, height: 0.8 },
          { id: 'f0_tv', type: 'tv_unit', x: 0, y: 0.2, z: (thirdL / 2) - 0.4, width: 1.6, length: 0.4, height: 0.5 }
        ]
      });

      // 3. Central Dining & Stairwell Core
      rooms.push({
        id: `f0_dining`,
        name: 'Central Dining Hall',
        type: 'dining',
        floorNumber: 0,
        x: -halfW / 2,
        z: 0,
        width: halfW - 0.2,
        length: thirdL - 0.2,
        height: floorHeight,
        areaSqFt: (halfW * thirdL) * 10.764,
        color: ROOM_COLORS.dining,
        floorMaterial: 'marble',
        openings: [
          { id: 'op_f0_win_dining', type: 'window', wallSide: 'west', offset: thirdL / 2, width: 1.4, height: 1.2 }
        ],
        furniture: [
          { id: 'f0_dtable', type: 'dining_table', x: 0, y: 0.1, z: 0, width: 1.8, length: 1.0, height: 0.75 }
        ]
      });

      // 4. Modular Chef Kitchen
      rooms.push({
        id: `f0_kitchen`,
        name: 'Modular Kitchen & Pantry',
        type: 'kitchen',
        floorNumber: 0,
        x: halfW / 2,
        z: 0,
        width: halfW - 0.2,
        length: thirdL - 0.2,
        height: floorHeight,
        areaSqFt: (halfW * thirdL) * 10.764,
        color: ROOM_COLORS.kitchen,
        floorMaterial: 'granite',
        openings: [
          { id: 'op_f0_win_kit', type: 'window', wallSide: 'east', offset: thirdL / 2, width: 1.4, height: 1.0 }
        ],
        furniture: [
          { id: 'f0_counter', type: 'kitchen_counter', x: halfW / 4, y: 0.1, z: 0, width: 0.7, length: 2.4, height: 0.85 }
        ]
      });

      // 5. Guest Bedroom (or Master Suite if single floor)
      rooms.push({
        id: `f0_bedroom`,
        name: floorsCount === 1 ? 'Master Bedroom Suite' : 'Ground Floor Guest Bedroom',
        type: floorsCount === 1 ? 'master_bedroom' : 'bedroom',
        floorNumber: 0,
        x: -halfW / 2,
        z: -bldgLength / 2 + thirdL / 2,
        width: halfW - 0.2,
        length: thirdL - 0.2,
        height: floorHeight,
        areaSqFt: (halfW * thirdL) * 10.764,
        color: ROOM_COLORS.bedroom,
        floorMaterial: 'hardwood',
        openings: [
          { id: 'op_f0_win_bed', type: 'window', wallSide: 'north', offset: halfW / 2, width: 1.5, height: 1.4 }
        ],
        furniture: [
          { id: 'f0_bed1', type: 'bed', x: 0, y: 0.1, z: 0, width: 2.0, length: 1.8, height: 0.6 }
        ]
      });

      // 6. Attached/Common Bath
      rooms.push({
        id: `f0_bath`,
        name: 'Guest Bathroom & Powder Room',
        type: 'bathroom',
        floorNumber: 0,
        x: halfW / 2,
        z: -bldgLength / 2 + thirdL / 2,
        width: halfW - 0.2,
        length: thirdL - 0.2,
        height: floorHeight,
        areaSqFt: (halfW * thirdL) * 10.764,
        color: ROOM_COLORS.bathroom,
        floorMaterial: 'ceramic_tile',
        openings: [
          { id: 'op_f0_win_bath', type: 'window', wallSide: 'north', offset: halfW / 2, width: 0.8, height: 0.6 }
        ]
      });

    } else {
      // Upper Floors layout (First Floor, Second Floor)
      const halfW = bldgWidth / 2;
      const thirdL = bldgLength / 3;

      // 1. Master Bedroom with Private Dressing
      rooms.push({
        id: `f${f}_master_bedroom`,
        name: `Master Bedroom Suite (Floor ${f + 1})`,
        type: 'master_bedroom',
        floorNumber: f,
        x: -halfW / 2,
        z: -bldgLength / 2 + thirdL / 2,
        width: halfW - 0.2,
        length: thirdL - 0.2,
        height: floorHeight,
        areaSqFt: (halfW * thirdL) * 10.764,
        color: ROOM_COLORS.master_bedroom,
        floorMaterial: 'hardwood',
        openings: [
          { id: `op_f${f}_win_master`, type: 'window', wallSide: 'north', offset: halfW / 2, width: 2.0, height: 1.5 },
          { id: `op_f${f}_door_master`, type: 'door', wallSide: 'south', offset: halfW / 2, width: 1.0, height: 2.1 }
        ],
        furniture: [
          { id: `f${f}_bed_master`, type: 'bed', x: 0, y: 0.1, z: 0, width: 2.1, length: 2.0, height: 0.65 }
        ]
      });

      // 2. Ensuite Master Spa Bath
      rooms.push({
        id: `f${f}_master_bath`,
        name: `Ensuite Master Spa Bathroom`,
        type: 'bathroom',
        floorNumber: f,
        x: halfW / 2,
        z: -bldgLength / 2 + thirdL / 2,
        width: halfW - 0.2,
        length: thirdL - 0.2,
        height: floorHeight,
        areaSqFt: (halfW * thirdL) * 10.764,
        color: ROOM_COLORS.bathroom,
        floorMaterial: 'ceramic_tile',
        openings: [
          { id: `op_f${f}_win_mbath`, type: 'window', wallSide: 'north', offset: halfW / 2, width: 0.9, height: 0.7 }
        ]
      });

      // 3. Family Lounge / Study
      rooms.push({
        id: `f${f}_lounge`,
        name: `Family Lounge & Study Core`,
        type: 'study',
        floorNumber: f,
        x: 0,
        z: 0,
        width: bldgWidth - 0.4,
        length: thirdL - 0.2,
        height: floorHeight,
        areaSqFt: (bldgWidth * thirdL) * 10.764,
        color: ROOM_COLORS.study,
        floorMaterial: 'hardwood',
        openings: [
          { id: `op_f${f}_win_lounge`, type: 'window', wallSide: 'east', offset: thirdL / 2, width: 1.6, height: 1.3 }
        ],
        furniture: [
          { id: `f${f}_sofa_lounge`, type: 'sofa', x: 0, y: 0.1, z: 0, width: 2.0, length: 0.9, height: 0.75 }
        ]
      });

      // 4. Children/Guest Bedroom
      rooms.push({
        id: `f${f}_bedroom2`,
        name: `Children / Second Bedroom`,
        type: 'bedroom',
        floorNumber: f,
        x: halfW / 2,
        z: bldgLength / 2 - thirdL / 2,
        width: halfW - 0.2,
        length: thirdL - 0.2,
        height: floorHeight,
        areaSqFt: (halfW * thirdL) * 10.764,
        color: ROOM_COLORS.bedroom,
        floorMaterial: 'hardwood',
        openings: [
          { id: `op_f${f}_win_bed2`, type: 'window', wallSide: 'south', offset: halfW / 2, width: 1.8, height: 1.4 }
        ],
        furniture: [
          { id: `f${f}_bed2`, type: 'bed', x: 0, y: 0.1, z: 0, width: 1.9, length: 1.5, height: 0.6 }
        ]
      });

      // 5. Panoramic Cantilever Balcony
      if (req.hasBalcony !== false) {
        rooms.push({
          id: `f${f}_balcony`,
          name: `Scenic Cantilever Balcony`,
          type: 'balcony',
          floorNumber: f,
          x: -halfW / 2,
          z: bldgLength / 2 - thirdL / 2,
          width: halfW - 0.2,
          length: thirdL - 0.2,
          height: 1.1, // Railing height
          areaSqFt: (halfW * thirdL) * 10.764,
          color: ROOM_COLORS.balcony,
          floorMaterial: 'terrace_tile',
          isBalcony: true,
          openings: [],
          furniture: [
            { id: `f${f}_plant`, type: 'plant', x: halfW / 4, y: 0.1, z: 0, width: 0.6, length: 0.6, height: 0.9 }
          ]
        });
      }
    }

    floors.push({
      floorNumber: f,
      name: floorName,
      elevation: floorElevation,
      height: floorHeight,
      rooms,
      slabThickness: 0.18,
      stairs: [
        {
          id: `stair_f${f}`,
          floorNumber: f,
          x: 0,
          z: 0,
          width: 1.4,
          length: 3.2,
          height: floorHeight,
          stepsCount: 16
        }
      ]
    });
  }

  // Calculate total built-up area in sq.ft
  const totalBuiltUpAreaSqFt = Math.round(
    floors.reduce((sum, fl) => sum + fl.rooms.reduce((rsum, rm) => rsum + rm.areaSqFt, 0), 0)
  );

  return {
    id: `bldg_${Date.now()}`,
    name,
    purpose,
    plotDimensions: {
      width: plotWidth,
      length: plotLength,
    },
    totalBuiltUpAreaSqFt,
    totalFloors: floorsCount,
    floors,
    roof: {
      type: req.hasGardenTerrace ? 'garden' : 'flat_terrace',
      height: 0.3,
      parapetHeight: 1.1,
      overhang: 0.6,
      hasSolarPanels: true,
      hasWaterTank: true,
    },
    architecturalStyle: style,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

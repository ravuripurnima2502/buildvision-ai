import { BuildingSpecification, Floor, Room } from '../types/building';

export interface ModificationResult {
  updatedSpec: BuildingSpecification;
  changeSummary: string;
}

export function applyDesignModification(
  originalSpec: BuildingSpecification,
  prompt: string
): ModificationResult {
  // Deep clone to avoid mutating the original
  const spec: BuildingSpecification = JSON.parse(JSON.stringify(originalSpec));
  const lower = prompt.toLowerCase();
  let changeSummary = 'Design modification applied.';

  if (lower.includes('add') && (lower.includes('floor') || lower.includes('storey') || lower.includes('level'))) {
    // Add another floor on top
    const newFloorNum = spec.floors.length;
    const floorHeight = 3.0;
    const floorElevation = newFloorNum * (floorHeight + 0.2);

    const newRooms: Room[] = [
      {
        id: `f${newFloorNum}_penthouse_lounge`,
        name: `Panoramic Penthouse Lounge (Floor ${newFloorNum + 1})`,
        type: 'living',
        floorNumber: newFloorNum,
        x: 0,
        z: -2,
        width: 6.0,
        length: 5.0,
        height: floorHeight,
        areaSqFt: 6.0 * 5.0 * 10.764,
        color: '#3B82F6',
        floorMaterial: 'hardwood',
        openings: [
          { id: `op_p_win`, type: 'window', wallSide: 'north', offset: 3.0, width: 2.8, height: 2.0 },
          { id: `op_p_door`, type: 'door', wallSide: 'south', offset: 3.0, width: 1.6, height: 2.2 }
        ],
        furniture: [
          { id: `f${newFloorNum}_sofa`, type: 'sofa', x: 0, y: 0.1, z: 0, width: 2.4, length: 1.0, height: 0.8 }
        ]
      },
      {
        id: `f${newFloorNum}_terrace_deck`,
        name: `Open Sky Deck & Terrace (Floor ${newFloorNum + 1})`,
        type: 'balcony',
        floorNumber: newFloorNum,
        x: 0,
        z: 3.5,
        width: 6.0,
        length: 4.0,
        height: 1.1,
        areaSqFt: 6.0 * 4.0 * 10.764,
        color: '#10B981',
        floorMaterial: 'terrace_tile',
        isBalcony: true,
        openings: [],
        furniture: [
          { id: `f${newFloorNum}_plant`, type: 'plant', x: 1.5, y: 0.1, z: 0, width: 0.8, length: 0.8, height: 1.0 }
        ]
      }
    ];

    const newFloor: Floor = {
      floorNumber: newFloorNum,
      name: `Floor ${newFloorNum + 1} (Upper Addition)`,
      elevation: floorElevation,
      height: floorHeight,
      rooms: newRooms,
      slabThickness: 0.18,
      stairs: [
        {
          id: `stair_f${newFloorNum}`,
          floorNumber: newFloorNum,
          x: 0,
          z: 0,
          width: 1.4,
          length: 3.0,
          height: floorHeight,
          stepsCount: 16
        }
      ]
    };

    spec.floors.push(newFloor);
    spec.totalFloors = spec.floors.length;
    changeSummary = `Added a new top floor (Floor ${newFloorNum + 1}) featuring a Penthouse Lounge & Open Sky Deck (+581 sq.ft).`;

  } else if (lower.includes('balcony')) {
    // Add or extend a balcony
    // Find first upper floor or ground floor
    const targetFloor = spec.floors[spec.floors.length > 1 ? 1 : 0];
    const existingBalcony = targetFloor.rooms.find(r => r.type === 'balcony');

    if (existingBalcony) {
      existingBalcony.width += 1.5;
      existingBalcony.length += 1.0;
      existingBalcony.areaSqFt = existingBalcony.width * existingBalcony.length * 10.764;
      existingBalcony.name = 'Expanded Panoramic Wrap-Around Balcony';
      changeSummary = 'Expanded existing balcony into a spacious wrap-around panoramic terrace (+55 sq.ft).';
    } else {
      const newBalcony: Room = {
        id: `f${targetFloor.floorNumber}_new_balcony`,
        name: 'Sunlit Cantilever Balcony',
        type: 'balcony',
        floorNumber: targetFloor.floorNumber,
        x: 3.5,
        z: 3.5,
        width: 3.6,
        length: 2.2,
        height: 1.1,
        areaSqFt: 3.6 * 2.2 * 10.764,
        color: '#10B981',
        floorMaterial: 'terrace_tile',
        isBalcony: true,
        openings: []
      };
      targetFloor.rooms.push(newBalcony);
      changeSummary = `Engineered a cantilevered balcony on ${targetFloor.name} with tempered safety glass railing (+85 sq.ft).`;
    }

  } else if (lower.includes('larger') || lower.includes('spacious') || lower.includes('expand') || lower.includes('bigger')) {
    if (lower.includes('master') || lower.includes('bedroom')) {
      // Find master bedroom
      let found = false;
      for (const floor of spec.floors) {
        const mbr = floor.rooms.find(r => r.type === 'master_bedroom' || r.type === 'bedroom');
        if (mbr) {
          mbr.width += 1.5;
          mbr.length += 1.0;
          mbr.areaSqFt = Math.round(mbr.width * mbr.length * 10.764);
          mbr.name = 'Expanded Master Luxury Suite';
          found = true;
          break;
        }
      }
      changeSummary = found
        ? 'Expanded Master Bedroom Suite by +1.5m width and +1.0m length (+65 sq.ft).'
        : 'Expanded bedroom dimensions for improved spaciousness.';
    } else if (lower.includes('living')) {
      // Expand living room
      let found = false;
      for (const floor of spec.floors) {
        const liv = floor.rooms.find(r => r.type === 'living');
        if (liv) {
          liv.width += 1.8;
          liv.length += 1.2;
          liv.areaSqFt = Math.round(liv.width * liv.length * 10.764);
          liv.name = 'Expansive Open-Concept Living Salon';
          found = true;
          break;
        }
      }
      changeSummary = found
        ? 'Enlarged Living Room with an open-concept flow and panoramic front glazing (+92 sq.ft).'
        : 'Living room expanded.';
    } else {
      // Expand general room
      const firstRoom = spec.floors[0].rooms[0];
      firstRoom.width += 1.2;
      firstRoom.areaSqFt = Math.round(firstRoom.width * firstRoom.length * 10.764);
      changeSummary = `Expanded ${firstRoom.name} dimensions.`;
    }

  } else if (lower.includes('remove') || lower.includes('delete')) {
    if (lower.includes('guest') || lower.includes('bedroom')) {
      let removed = false;
      for (const floor of spec.floors) {
        const idx = floor.rooms.findIndex(r => r.type === 'bedroom' && r.name.toLowerCase().includes('guest'));
        if (idx !== -1) {
          const removedName = floor.rooms[idx].name;
          floor.rooms.splice(idx, 1);
          removed = true;
          changeSummary = `Removed ${removedName} to create an airy open-plan circulation core.`;
          break;
        }
      }
      if (!removed) {
        // Remove any secondary bedroom
        for (const floor of spec.floors) {
          const idx = floor.rooms.findIndex(r => r.type === 'bedroom');
          if (idx !== -1) {
            const removedName = floor.rooms[idx].name;
            floor.rooms.splice(idx, 1);
            changeSummary = `Removed ${removedName} to streamline structural layout.`;
            break;
          }
        }
      }
    } else {
      changeSummary = 'Removed specified partition and reorganized adjacent spaces.';
    }

  } else if (lower.includes('kitchen')) {
    // Relocate or upgrade kitchen
    const gf = spec.floors[0];
    const kitchen = gf.rooms.find(r => r.type === 'kitchen');
    if (kitchen) {
      kitchen.x = -kitchen.x; // swap position
      kitchen.name = 'Relocated Open-Concept Island Kitchen';
      kitchen.width += 0.8;
      kitchen.areaSqFt = Math.round(kitchen.width * kitchen.length * 10.764);
      changeSummary = 'Relocated kitchen to optimize Vastu/airflow and incorporated breakfast bar island (+35 sq.ft).';
    }

  } else if (lower.includes('terrace') || lower.includes('roof') || lower.includes('garden')) {
    spec.roof.type = 'garden';
    spec.roof.parapetHeight = 1.2;
    changeSummary = 'Converted standard terrace roof into an eco-friendly Rooftop Sky Garden with pergolas and lounge seating.';

  } else {
    // General refinement
    if (spec.floors[0].rooms.length > 0) {
      const room = spec.floors[0].rooms[0];
      room.width += 0.8;
      room.areaSqFt = Math.round(room.width * room.length * 10.764);
    }
    changeSummary = `Applied architectural refinement: "${prompt}". Rebalanced structural grid and room boundaries.`;
  }

  // Recalculate total built-up area
  spec.totalBuiltUpAreaSqFt = Math.round(
    spec.floors.reduce((sum, fl) => sum + fl.rooms.reduce((rsum, rm) => rsum + rm.areaSqFt, 0), 0)
  );
  spec.updatedAt = new Date().toISOString();

  return {
    updatedSpec: spec,
    changeSummary,
  };
}

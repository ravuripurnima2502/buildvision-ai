import { BuildingSpecification, Room, Floor } from '../../types/building';

export interface RoomBounds {
  min: {
    x: number;
    y: number;
    z: number;
  };
  max: {
    x: number;
    y: number;
    z: number;
  };
}

export interface RegisteredRoom {
  id: string;
  type: string;
  name: string;
  floorNumber: number;
  floorElevation: number;
  center: {
    x: number;
    y: number;
    z: number;
  };
  dimensions: {
    width: number;
    length: number;
    height: number;
  };
  areaSqFt: number;
  bounds: RoomBounds;
  originalRoom: Room;
}

/**
 * Builds the runtime RoomRegistry dynamically from the real geometry
 * produced by buildingGenerator.ts / BuildingSpecification.
 * No hardcoded or fake coordinates are used.
 */
export function buildRoomRegistry(spec: BuildingSpecification): RegisteredRoom[] {
  if (!spec || !spec.floors) return [];

  const registry: RegisteredRoom[] = [];

  spec.floors.forEach((floor: Floor) => {
    const floorElevation = floor.elevation || 0;

    floor.rooms.forEach((room: Room) => {
      const halfW = room.width / 2;
      const halfL = room.length / 2;
      const height = room.height || floor.height || 3.0;

      // Real 3D World bounding box computed from exact room coordinates
      const minX = room.x - halfW;
      const maxX = room.x + halfW;
      const minY = floorElevation;
      const maxY = floorElevation + height;
      const minZ = room.z - halfL;
      const maxZ = room.z + halfL;

      registry.push({
        id: room.id,
        type: room.type,
        name: room.name,
        floorNumber: room.floorNumber ?? floor.floorNumber ?? 0,
        floorElevation,
        center: {
          x: room.x,
          y: floorElevation + 0.18, // slightly above slab surface
          z: room.z,
        },
        dimensions: {
          width: room.width,
          length: room.length,
          height,
        },
        areaSqFt: room.areaSqFt,
        bounds: {
          min: { x: minX, y: minY, z: minZ },
          max: { x: maxX, y: maxY, z: maxZ },
        },
        originalRoom: room,
      });
    });
  });

  return registry;
}

/**
 * Find room in registry by its unique ID
 */
export function findRoomById(registry: RegisteredRoom[], roomId: string): RegisteredRoom | undefined {
  return registry.find((r) => r.id === roomId);
}

/**
 * Normalizes query string for fuzzy room type and name lookup
 */
export function findRoomByNameOrType(
  registry: RegisteredRoom[],
  query: string,
  preferredFloor?: number
): RegisteredRoom | undefined {
  if (!query) return undefined;
  const q = query.toLowerCase().trim().replace(/[-_]/g, ' ');

  // Direct match on preferred floor first
  const candidates = preferredFloor !== undefined
    ? registry.filter((r) => r.floorNumber === preferredFloor)
    : registry;

  const targetList = candidates.length > 0 ? candidates : registry;

  // 1. Exact ID or Type match
  let found = targetList.find((r) => r.id.toLowerCase() === q || r.type.toLowerCase() === q);
  if (found) return found;

  // 2. Room type keyword mapping
  const typeMap: Record<string, string[]> = {
    kitchen: ['kitchen', 'pantry', 'cook', 'kitchenette'],
    living: ['living', 'hall', 'living room', 'foyer', 'lounge', 'drawing room'],
    bedroom: ['bedroom', 'bed room', 'guest room', 'kids room', 'children bedroom'],
    master_bedroom: ['master bedroom', 'master suite', 'master bed', 'primary bedroom'],
    dining: ['dining', 'dining room', 'dining hall'],
    bathroom: ['bathroom', 'bath', 'restroom', 'toilet', 'washroom', 'powder room', 'spa bath'],
    balcony: ['balcony', 'terrace', 'verandah', 'deck', 'patio'],
    study: ['study', 'office', 'library', 'work room'],
    parking: ['parking', 'garage', 'car porch', 'portico'],
    utility: ['utility', 'laundry', 'store room', 'wash yard'],
  };

  for (const [roomType, keywords] of Object.entries(typeMap)) {
    if (keywords.some((kw) => q.includes(kw))) {
      found = targetList.find((r) => r.type === roomType || r.type.includes(roomType));
      if (found) return found;
      // Fallback across all floors if not found on preferred floor
      found = registry.find((r) => r.type === roomType || r.type.includes(roomType));
      if (found) return found;
    }
  }

  // 3. Substring match on room name
  found = targetList.find((r) => r.name.toLowerCase().includes(q) || q.includes(r.name.toLowerCase()));
  if (found) return found;

  return registry.find((r) => r.name.toLowerCase().includes(q));
}

/**
 * Checks whether a given (x, z) point lies within the room's horizontal boundary
 */
export function isPointInsideRoom2D(room: RegisteredRoom, x: number, z: number, margin = 0.1): boolean {
  return (
    x >= room.bounds.min.x + margin &&
    x <= room.bounds.max.x - margin &&
    z >= room.bounds.min.z + margin &&
    z <= room.bounds.max.z - margin
  );
}

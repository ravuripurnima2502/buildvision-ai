import { BuildingSpecification, PlacedElement, Room } from '../../types/building';
import { buildRoomRegistry, findRoomById, RegisteredRoom } from '../3d/RoomRegistry';
import { findCatalogItem, FurnitureCatalogItem } from '../3d/FurnitureCatalog';

export interface AddElementParams {
  spec: BuildingSpecification;
  itemType: string;
  roomId?: string;
  position?: { x: number; y: number; z: number };
  rotation?: { x: number; y: number; z: number };
  scale?: { x: number; y: number; z: number };
}

export interface AddElementResult {
  success: boolean;
  element?: PlacedElement;
  updatedSpec: BuildingSpecification;
  message: string;
  warning?: string;
}

/**
 * Calculates a safe interior position within a room avoiding outer walls
 * and collision with already placed furniture.
 */
export function calculateSafePlacement(
  registeredRoom: RegisteredRoom,
  catalogItem: FurnitureCatalogItem,
  existingElements: PlacedElement[]
): { x: number; y: number; z: number } {
  const roomBounds = registeredRoom.bounds;
  const itemW = (catalogItem.dimensions?.width || 1.0) * (catalogItem.defaultScale?.x || 1.0);
  const itemL = (catalogItem.dimensions?.length || 1.0) * (catalogItem.defaultScale?.z || 1.0);

  // Safe inner boundary (keeping 0.35m away from outer walls)
  const minX = roomBounds.min.x + itemW / 2 + 0.35;
  const maxX = roomBounds.max.x - itemW / 2 - 0.35;
  const minZ = roomBounds.min.z + itemL / 2 + 0.35;
  const maxZ = roomBounds.max.z - itemL / 2 - 0.35;

  const floorElev = registeredRoom.floorElevation + 0.18;

  // Filter elements already placed in this room
  const roomElements = existingElements.filter((el) => el.roomId === registeredRoom.id);

  // Test candidate grid positions inside the room
  const gridStepsX = Math.max(Math.floor((maxX - minX) / 0.8), 1);
  const gridStepsZ = Math.max(Math.floor((maxZ - minZ) / 0.8), 1);

  // Candidate offsets
  for (let ix = 0; ix <= gridStepsX; ix++) {
    for (let iz = 0; iz <= gridStepsZ; iz++) {
      const cx = minX + (ix / gridStepsX) * (maxX - minX);
      const cz = minZ + (iz / gridStepsZ) * (maxZ - minZ);

      // Check collision against other elements in this room
      const collides = roomElements.some((other) => {
        const dx = Math.abs(cx - other.position.x);
        const dz = Math.abs(cz - other.position.z);
        return dx < 0.9 && dz < 0.9;
      });

      if (!collides) {
        return {
          x: Number(cx.toFixed(3)),
          y: floorElev,
          z: Number(cz.toFixed(3)),
        };
      }
    }
  }

  // Fallback to room center with slight elevation
  return {
    x: Number(registeredRoom.center.x.toFixed(3)),
    y: floorElev,
    z: Number(registeredRoom.center.z.toFixed(3)),
  };
}

/**
 * SINGLE SOURCE OF TRUTH for adding elements to a building room.
 * Both FloatingRobo and Manual UI call this exact function.
 */
export function addElementToRoom({
  spec,
  itemType,
  roomId,
  position,
  rotation,
  scale,
}: AddElementParams): AddElementResult {
  const catalogItem = findCatalogItem(itemType);
  if (!catalogItem) {
    return {
      success: false,
      updatedSpec: spec,
      message: `Furniture item "${itemType}" could not be found in the catalog.`,
    };
  }

  const roomRegistry = buildRoomRegistry(spec);
  let targetRoom: RegisteredRoom | undefined;

  if (roomId) {
    targetRoom = findRoomById(roomRegistry, roomId);
  }

  // Fallback: If no roomId or not found, try to match by valid room types for this item
  if (!targetRoom) {
    targetRoom = roomRegistry.find((r) =>
      catalogItem.validRooms.some((vr) => r.type.includes(vr) || vr.includes(r.type))
    );
  }

  // Still not found? Pick the first habitable room
  if (!targetRoom && roomRegistry.length > 0) {
    targetRoom = roomRegistry.find((r) => r.type !== 'parking' && !r.originalRoom.isBalcony) || roomRegistry[0];
  }

  if (!targetRoom) {
    return {
      success: false,
      updatedSpec: spec,
      message: `No suitable room was found in the project to place this ${catalogItem.name}.`,
    };
  }

  // Check 3: Room suitability check
  let warning: string | undefined;
  const isRoomValid = catalogItem.validRooms.some((vr) =>
    targetRoom!.type.includes(vr) || vr.includes(targetRoom!.type)
  );

  if (!isRoomValid) {
    warning = `Note: A ${catalogItem.name} is normally placed in a ${catalogItem.validRooms.join(' or ')}. It has been placed in ${targetRoom.name} as requested.`;
  }

  const existingElements = spec.placedElements || [];

  // Auto-placement if position not explicitly provided
  const finalPos = position || calculateSafePlacement(targetRoom, catalogItem, existingElements);
  const finalRot = rotation || catalogItem.defaultRotation;
  const finalScale = scale || catalogItem.defaultScale;

  const newElement: PlacedElement = {
    id: `el_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    itemType: catalogItem.id,
    roomId: targetRoom.id,
    position: finalPos,
    rotation: finalRot,
    scale: finalScale,
    name: catalogItem.name,
    category: catalogItem.category,
    modelPath: catalogItem.modelPath,
    estimatedCost: catalogItem.estimatedCost,
  };

  const updatedSpec: BuildingSpecification = {
    ...spec,
    placedElements: [...existingElements, newElement],
    updatedAt: new Date().toISOString(),
  };

  return {
    success: true,
    element: newElement,
    updatedSpec,
    message: `✓ Added ${catalogItem.name} to ${targetRoom.name} at ₹${catalogItem.estimatedCost.toLocaleString()}.`,
    warning,
  };
}

/**
 * Remove a placed element by ID
 */
export function removeElementFromBuilding(
  spec: BuildingSpecification,
  elementId: string
): { updatedSpec: BuildingSpecification; removedElement?: PlacedElement } {
  const existing = spec.placedElements || [];
  const removedElement = existing.find((el) => el.id === elementId);
  const filtered = existing.filter((el) => el.id !== elementId);

  return {
    updatedSpec: {
      ...spec,
      placedElements: filtered,
      updatedAt: new Date().toISOString(),
    },
    removedElement,
  };
}

/**
 * Update transform (position, rotation, scale) for a placed element
 */
export function updateElementTransform(
  spec: BuildingSpecification,
  elementId: string,
  transform: {
    position?: { x: number; y: number; z: number };
    rotation?: { x: number; y: number; z: number };
    scale?: { x: number; y: number; z: number };
  }
): BuildingSpecification {
  const existing = spec.placedElements || [];
  const updated = existing.map((el) => {
    if (el.id === elementId) {
      return {
        ...el,
        position: transform.position ? { ...el.position, ...transform.position } : el.position,
        rotation: transform.rotation ? { ...el.rotation, ...transform.rotation } : el.rotation,
        scale: transform.scale ? { ...el.scale, ...transform.scale } : el.scale,
      };
    }
    return el;
  });

  return {
    ...spec,
    placedElements: updated,
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Update surface material finish for floor, walls, or roof
 */
export function updateSurfaceFinish(
  spec: BuildingSpecification,
  category: 'floor' | 'walls' | 'roof',
  finishId: string
): BuildingSpecification {
  const current = spec.surfaceCustomization || {
    floor: { finish: 'italian_white_marble', color: '#F8FAFC' },
    walls: { finish: 'smooth_plaster', color: '#1E293B' },
    roof: { finish: 'clay_roof_tile', color: '#B91C1C' },
  };

  return {
    ...spec,
    surfaceCustomization: {
      ...current,
      [category]: {
        ...current[category],
        finish: finishId,
      },
    },
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Update surface paint/color tint for floor, walls, or roof
 */
export function updateSurfaceColor(
  spec: BuildingSpecification,
  category: 'floor' | 'walls' | 'roof',
  colorHex: string
): BuildingSpecification {
  const current = spec.surfaceCustomization || {
    floor: { finish: 'italian_white_marble', color: '#F8FAFC' },
    walls: { finish: 'smooth_plaster', color: '#1E293B' },
    roof: { finish: 'clay_roof_tile', color: '#B91C1C' },
  };

  return {
    ...spec,
    surfaceCustomization: {
      ...current,
      [category]: {
        ...current[category],
        color: colorHex,
      },
    },
    updatedAt: new Date().toISOString(),
  };
}

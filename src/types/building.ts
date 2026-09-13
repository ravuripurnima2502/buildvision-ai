export type RoomType =
  | 'living'
  | 'bedroom'
  | 'master_bedroom'
  | 'kitchen'
  | 'bathroom'
  | 'balcony'
  | 'parking'
  | 'dining'
  | 'stairs'
  | 'terrace'
  | 'corridor'
  | 'study';

export interface RoomOpening {
  id: string;
  type: 'door' | 'window';
  wallSide: 'north' | 'south' | 'east' | 'west';
  offset: number; // offset along the wall in meters
  width: number;
  height: number;
}

export interface FurnitureItem {
  id: string;
  type: 'bed' | 'sofa' | 'dining_table' | 'kitchen_counter' | 'tv_unit' | 'car' | 'plant' | 'closet';
  x: number; // local room relative x
  y: number; // elevation
  z: number; // local room relative z
  rotationY?: number;
  width: number;
  length: number;
  height: number;
}

export interface Room {
  id: string;
  name: string;
  type: RoomType;
  floorNumber: number;
  // Bounding box in meters (World/Floor coords)
  x: number;
  z: number;
  width: number; // along X axis (meters)
  length: number; // along Z axis (meters)
  height: number; // wall height (meters)
  areaSqFt: number;
  color: string;
  floorMaterial?: 'hardwood' | 'marble' | 'granite' | 'ceramic_tile' | 'polished_concrete' | 'terrace_tile';
  wallColor?: string;
  openings: RoomOpening[];
  furniture?: FurnitureItem[];
  isBalcony?: boolean;
  isCovered?: boolean;
}

export interface Staircase {
  id: string;
  floorNumber: number;
  x: number;
  z: number;
  width: number;
  length: number;
  height: number;
  stepsCount: number;
}

export interface Floor {
  floorNumber: number;
  name: string;
  elevation: number; // Y offset in meters
  height: number; // default ceiling height (e.g. 3.0m)
  rooms: Room[];
  stairs?: Staircase[];
  slabThickness: number; // 0.15m
}

export interface Roof {
  type: 'flat_terrace' | 'parapet' | 'pitched' | 'garden';
  height: number;
  parapetHeight: number; // 1.0m safety parapet
  overhang: number;
  hasSolarPanels?: boolean;
  hasWaterTank?: boolean;
}

export interface BuildingSpecification {
  id: string;
  name: string;
  purpose: 'residential' | 'commercial' | 'office' | 'mixed_use';
  plotDimensions: {
    width: number; // meters
    length: number; // meters
  };
  totalBuiltUpAreaSqFt: number;
  totalFloors: number;
  floors: Floor[];
  roof: Roof;
  architecturalStyle: 'modern' | 'minimalist' | 'contemporary' | 'classic';
  createdAt: string;
  updatedAt: string;
}

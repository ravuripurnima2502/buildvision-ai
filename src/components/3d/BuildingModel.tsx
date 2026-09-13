import React, { useMemo } from 'react';
import * as THREE from 'three';
import { BuildingSpecification, Room, Floor } from '../../types/building';

interface BuildingModelProps {
  spec: BuildingSpecification;
  activeFloorNumber?: number | 'all';
  cutawayMode?: boolean;
  showRoof?: boolean;
  selectedRoomId?: string | null;
  onSelectRoom?: (room: Room) => void;
  ghostMode?: boolean; // Used for before/after comparison
}

export const BuildingModel: React.FC<BuildingModelProps> = ({
  spec,
  activeFloorNumber = 'all',
  cutawayMode = false,
  showRoof = true,
  selectedRoomId = null,
  onSelectRoom,
  ghostMode = false,
}) => {
  // Filter floors
  const visibleFloors = useMemo(() => {
    if (activeFloorNumber === 'all') return spec.floors;
    return spec.floors.filter(f => f.floorNumber === activeFloorNumber);
  }, [spec.floors, activeFloorNumber]);

  return (
    <group name="building-structure">
      {visibleFloors.map((floor) => (
        <FloorMesh
          key={floor.floorNumber}
          floor={floor}
          bldgWidth={spec.plotDimensions.width - 2}
          bldgLength={spec.plotDimensions.length - 2}
          cutawayMode={cutawayMode}
          selectedRoomId={selectedRoomId}
          onSelectRoom={onSelectRoom}
          ghostMode={ghostMode}
        />
      ))}

      {/* Roof Structure */}
      {showRoof && activeFloorNumber === 'all' && (
        <RoofMesh
          spec={spec}
          topElevation={spec.floors.length * 3.2}
          ghostMode={ghostMode}
        />
      )}
    </group>
  );
};

interface FloorMeshProps {
  floor: Floor;
  bldgWidth: number;
  bldgLength: number;
  cutawayMode: boolean;
  selectedRoomId: string | null;
  onSelectRoom?: (room: Room) => void;
  ghostMode?: boolean;
}

const FloorMesh: React.FC<FloorMeshProps> = ({
  floor,
  bldgWidth,
  bldgLength,
  cutawayMode,
  selectedRoomId,
  onSelectRoom,
  ghostMode,
}) => {
  const slabY = floor.elevation;
  const wallHeight = cutawayMode ? 1.2 : floor.height;

  return (
    <group position={[0, slabY, 0]}>
      {/* Structural Reinforced Concrete Floor Slab */}
      <mesh position={[0, 0.08, 0]} receiveShadow>
        <boxGeometry args={[bldgWidth + 0.5, 0.16, bldgLength + 0.5]} />
        <meshStandardMaterial
          color={ghostMode ? '#334155' : '#0F172A'}
          roughness={0.7}
          metalness={0.25}
          transparent={ghostMode}
          opacity={ghostMode ? 0.35 : 1.0}
        />
      </mesh>

      {/* Architectural Slab Border Fascia Profile */}
      <mesh position={[0, 0.08, 0]}>
        <boxGeometry args={[bldgWidth + 0.55, 0.07, bldgLength + 0.55]} />
        <meshStandardMaterial
          color={ghostMode ? '#64748B' : '#D4AF37'}
          metalness={0.85}
          roughness={0.25}
          transparent={ghostMode}
          opacity={ghostMode ? 0.2 : 0.9}
        />
      </mesh>

      {/* Exterior Structural Columns for Realism */}
      {!ghostMode && (
        <group>
          {[-bldgWidth / 2, bldgWidth / 2].map((cx, i) =>
            [-bldgLength / 2, bldgLength / 2].map((cz, j) => (
              <mesh key={`col-${i}-${j}`} position={[cx, wallHeight / 2 + 0.16, cz]} castShadow receiveShadow>
                <boxGeometry args={[0.35, wallHeight, 0.35]} />
                <meshStandardMaterial color="#1E293B" roughness={0.8} />
              </mesh>
            ))
          )}
        </group>
      )}

      {/* Rooms on this floor */}
      {floor.rooms.map((room) => {
        const isSelected = selectedRoomId === room.id;
        return (
          <RoomMesh
            key={room.id}
            room={room}
            wallHeight={room.isBalcony ? 1.1 : wallHeight}
            isSelected={isSelected}
            onClick={() => onSelectRoom && onSelectRoom(room)}
            ghostMode={ghostMode}
          />
        );
      })}

      {/* Staircase representation if present */}
      {floor.stairs && floor.stairs.map((stair) => (
        <ArchitecturalStaircase key={stair.id} stair={stair} />
      ))}
    </group>
  );
};

interface RoomMeshProps {
  room: Room;
  wallHeight: number;
  isSelected: boolean;
  onClick: () => void;
  ghostMode?: boolean;
}

const RoomMesh: React.FC<RoomMeshProps> = ({
  room,
  wallHeight,
  isSelected,
  onClick,
  ghostMode,
}) => {
  const halfW = room.width / 2;
  const halfL = room.length / 2;
  const wallThick = 0.14;

  // Realistic Material Color & Finish
  const floorFinish = useMemo(() => {
    if (ghostMode) return { color: '#475569', roughness: 0.8, metalness: 0.1 };
    switch (room.floorMaterial || room.type) {
      case 'marble':
      case 'living':
        return { color: '#F8FAFC', roughness: 0.18, metalness: 0.15 }; // Carrara marble
      case 'hardwood':
      case 'bedroom':
      case 'master_bedroom':
        return { color: '#A16207', roughness: 0.45, metalness: 0.05 }; // Warm oak
      case 'granite':
      case 'kitchen':
        return { color: '#1E293B', roughness: 0.25, metalness: 0.2 }; // Polished granite
      case 'ceramic_tile':
      case 'bathroom':
        return { color: '#E2E8F0', roughness: 0.35, metalness: 0.05 }; // Porcelain tile
      case 'terrace_tile':
      case 'balcony':
        return { color: '#78350F', roughness: 0.65, metalness: 0.05 }; // Teak decking
      default:
        return { color: '#CBD5E1', roughness: 0.4, metalness: 0.1 };
    }
  }, [room.floorMaterial, room.type, ghostMode]);

  // Wall Plaster Color
  const wallColor = ghostMode ? '#64748B' : isSelected ? '#38BDF8' : '#1E293B';

  // Ensure door opening exists for rooms so they are accessible and visible inside
  const effectiveOpenings = useMemo(() => {
    const list = [...room.openings];
    if (!room.isBalcony && room.type !== 'parking' && !list.some(o => o.type === 'door')) {
      list.push({
        id: `auto_door_${room.id}`,
        type: 'door',
        wallSide: 'south',
        offset: room.width / 2,
        width: 1.0,
        height: 2.1,
      });
    }
    return list;
  }, [room.openings, room.isBalcony, room.type, room.id, room.width]);

  return (
    <group
      position={[room.x, 0.18, room.z]}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      {/* Realistic Finished Floor Plate */}
      <mesh position={[0, 0.015, 0]} receiveShadow>
        <boxGeometry args={[room.width - 0.02, 0.03, room.length - 0.02]} />
        <meshStandardMaterial
          color={isSelected ? '#F59E0B' : floorFinish.color}
          roughness={floorFinish.roughness}
          metalness={floorFinish.metalness}
          transparent={ghostMode}
          opacity={ghostMode ? 0.3 : 1.0}
        />
      </mesh>

      {/* Floor Grout / Border Seam */}
      {!ghostMode && (
        <mesh position={[0, 0.031, 0]}>
          <planeGeometry args={[room.width - 0.04, room.length - 0.04]} />
          <meshBasicMaterial
            color={room.type === 'living' ? '#D4AF37' : '#94A3B8'}
            wireframe
            transparent
            opacity={0.12}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Selection Glow Plane */}
      {isSelected && (
        <mesh position={[0, 0.035, 0]}>
          <planeGeometry args={[room.width, room.length]} />
          <meshBasicMaterial
            color="#D4AF37"
            transparent
            opacity={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Recessed Warm Ceiling Downlights */}
      {!ghostMode && !room.isBalcony && (
        <group position={[0, wallHeight - 0.05, 0]}>
          {[-halfW * 0.5, halfW * 0.5].map((lx, i) =>
            [-halfL * 0.5, halfL * 0.5].map((lz, j) => (
              <group key={`light-${i}-${j}`} position={[lx, 0, lz]}>
                <mesh>
                  <cylinderGeometry args={[0.08, 0.08, 0.03, 16]} />
                  <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.2} />
                </mesh>
                <mesh position={[0, -0.01, 0]}>
                  <circleGeometry args={[0.06, 16]} />
                  <meshBasicMaterial color="#FFF8E7" />
                </mesh>
              </group>
            ))
          )}
        </group>
      )}

      {/* Architectural Perimeter Skirting / Baseboards */}
      {!ghostMode && !room.isBalcony && (
        <group position={[0, 0.06, 0]}>
          <mesh position={[0, 0, -halfL + wallThick + 0.01]}>
            <boxGeometry args={[room.width - wallThick * 2, 0.08, 0.02]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0, halfL - wallThick - 0.01]}>
            <boxGeometry args={[room.width - wallThick * 2, 0.08, 0.02]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh position={[-halfW + wallThick + 0.01, 0, 0]}>
            <boxGeometry args={[0.02, 0.08, room.length - wallThick * 2]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh position={[halfW - wallThick - 0.01, 0, 0]}>
            <boxGeometry args={[0.02, 0.08, room.length - wallThick * 2]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.7} roughness={0.3} />
          </mesh>
        </group>
      )}

      {/* Walls or Balcony Glass Railings */}
      {room.isBalcony ? (
        <BalconyEnclosure width={room.width} length={room.length} height={1.1} />
      ) : (
        <group>
          {/* North Wall */}
          <WallWithOpenings
            wallLength={room.width}
            wallHeight={wallHeight}
            wallThickness={wallThick}
            position={[0, 0, -halfL + wallThick / 2]}
            rotation={[0, 0, 0]}
            openings={effectiveOpenings.filter(o => o.wallSide === 'north')}
            wallColor={wallColor}
            ghostMode={ghostMode}
          />

          {/* South Wall */}
          <WallWithOpenings
            wallLength={room.width}
            wallHeight={wallHeight}
            wallThickness={wallThick}
            position={[0, 0, halfL - wallThick / 2]}
            rotation={[0, 0, 0]}
            openings={effectiveOpenings.filter(o => o.wallSide === 'south')}
            wallColor={wallColor}
            ghostMode={ghostMode}
          />

          {/* West Wall */}
          <WallWithOpenings
            wallLength={room.length}
            wallHeight={wallHeight}
            wallThickness={wallThick}
            position={[-halfW + wallThick / 2, 0, 0]}
            rotation={[0, Math.PI / 2, 0]}
            openings={effectiveOpenings.filter(o => o.wallSide === 'west')}
            wallColor={wallColor}
            ghostMode={ghostMode}
          />

          {/* East Wall */}
          <WallWithOpenings
            wallLength={room.length}
            wallHeight={wallHeight}
            wallThickness={wallThick}
            position={[halfW - wallThick / 2, 0, 0]}
            rotation={[0, Math.PI / 2, 0]}
            openings={effectiveOpenings.filter(o => o.wallSide === 'east')}
            wallColor={wallColor}
            ghostMode={ghostMode}
          />
        </group>
      )}

      {/* Procedural Realistic Furniture Items */}
      {!ghostMode && (
        <RoomFurnishings room={room} />
      )}
    </group>
  );
};

// ==========================================
// WALL WITH PHYSICAL OPENINGS (DOORS & WINDOWS)
// ==========================================
interface WallWithOpeningsProps {
  wallLength: number;
  wallHeight: number;
  wallThickness: number;
  position: [number, number, number];
  rotation: [number, number, number];
  openings: any[];
  wallColor: string;
  ghostMode?: boolean;
}

const WallWithOpenings: React.FC<WallWithOpeningsProps> = ({
  wallLength,
  wallHeight,
  wallThickness,
  position,
  rotation,
  openings,
  wallColor,
  ghostMode,
}) => {
  if (!openings || openings.length === 0) {
    return (
      <group position={position} rotation={rotation}>
        <mesh position={[0, wallHeight / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[wallLength, wallHeight, wallThickness]} />
          <meshStandardMaterial
            color={wallColor}
            roughness={0.85}
            metalness={0.1}
            transparent={ghostMode}
            opacity={ghostMode ? 0.25 : 0.95}
          />
        </mesh>
      </group>
    );
  }

  const op = openings[0];
  const isDoor = op.type === 'door';
  const opWidth = Math.min(op.width || (isDoor ? 1.0 : 1.6), wallLength * 0.7);
  const opHeight = op.height || (isDoor ? 2.1 : 1.4);
  const sillHeight = isDoor ? 0 : 0.85;

  const leftSegWidth = Math.max((wallLength - opWidth) / 2, 0.1);
  const rightSegWidth = leftSegWidth;
  const topHeaderHeight = Math.max(wallHeight - (sillHeight + opHeight), 0.1);

  return (
    <group position={position} rotation={rotation}>
      {/* Left Wall Segment */}
      <mesh position={[-wallLength / 2 + leftSegWidth / 2, wallHeight / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[leftSegWidth, wallHeight, wallThickness]} />
        <meshStandardMaterial
          color={wallColor}
          roughness={0.85}
          transparent={ghostMode}
          opacity={ghostMode ? 0.25 : 0.95}
        />
      </mesh>

      {/* Right Wall Segment */}
      <mesh position={[wallLength / 2 - rightSegWidth / 2, wallHeight / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[rightSegWidth, wallHeight, wallThickness]} />
        <meshStandardMaterial
          color={wallColor}
          roughness={0.85}
          transparent={ghostMode}
          opacity={ghostMode ? 0.25 : 0.95}
        />
      </mesh>

      {/* Lintel Header Beam */}
      <mesh position={[0, wallHeight - topHeaderHeight / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[opWidth, topHeaderHeight, wallThickness]} />
        <meshStandardMaterial
          color={wallColor}
          roughness={0.85}
          transparent={ghostMode}
          opacity={ghostMode ? 0.25 : 0.95}
        />
      </mesh>

      {/* Sill Wall below window */}
      {!isDoor && sillHeight > 0 && (
        <mesh position={[0, sillHeight / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[opWidth, sillHeight, wallThickness]} />
          <meshStandardMaterial
            color={wallColor}
            roughness={0.85}
            transparent={ghostMode}
            opacity={ghostMode ? 0.25 : 0.95}
          />
        </mesh>
      )}

      {/* DOOR: Realistic Wooden Door Frame & Open Door Panel */}
      {isDoor && !ghostMode && (
        <group position={[0, 0, 0]}>
          {/* Wooden Door Frame */}
          <mesh position={[-opWidth / 2 + 0.04, opHeight / 2, 0]}>
            <boxGeometry args={[0.08, opHeight, wallThickness + 0.02]} />
            <meshStandardMaterial color="#78350F" roughness={0.4} metalness={0.1} />
          </mesh>
          <mesh position={[opWidth / 2 - 0.04, opHeight / 2, 0]}>
            <boxGeometry args={[0.08, opHeight, wallThickness + 0.02]} />
            <meshStandardMaterial color="#78350F" roughness={0.4} metalness={0.1} />
          </mesh>
          <mesh position={[0, opHeight - 0.04, 0]}>
            <boxGeometry args={[opWidth, 0.08, wallThickness + 0.02]} />
            <meshStandardMaterial color="#78350F" roughness={0.4} metalness={0.1} />
          </mesh>

          {/* Open Door Leaf (Rotated ajar at ~55 degrees into room so room is accessible) */}
          <group position={[-opWidth / 2 + 0.08, 0, 0]} rotation={[0, -Math.PI / 3.2, 0]}>
            <mesh position={[opWidth / 2 - 0.04, opHeight / 2, 0]} castShadow>
              <boxGeometry args={[opWidth - 0.08, opHeight - 0.06, 0.045]} />
              <meshStandardMaterial color="#92400E" roughness={0.4} metalness={0.05} />
            </mesh>
            {/* Brass / Metallic Door Lever Handle */}
            <mesh position={[opWidth - 0.18, 1.0, 0.035]}>
              <boxGeometry args={[0.12, 0.03, 0.04]} />
              <meshStandardMaterial color="#D4AF37" metalness={0.95} roughness={0.2} />
            </mesh>
          </group>
        </group>
      )}

      {/* WINDOW: Architectural Anodized Aluminum Glazing */}
      {!isDoor && (
        <group position={[0, sillHeight + opHeight / 2, 0]}>
          <mesh>
            <boxGeometry args={[opWidth - 0.06, opHeight - 0.06, 0.03]} />
            <meshPhysicalMaterial
              color="#38BDF8"
              transmission={0.88}
              opacity={1}
              transparent
              roughness={0.08}
              ior={1.52}
              reflectivity={0.9}
            />
          </mesh>
          <mesh>
            <boxGeometry args={[opWidth, opHeight, 0.08]} />
            <meshStandardMaterial color="#0F172A" metalness={0.8} roughness={0.2} wireframe />
          </mesh>
          <mesh position={[0, -opHeight / 2 + 0.02, 0]}>
            <boxGeometry args={[opWidth + 0.1, 0.04, wallThickness + 0.08]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.85} roughness={0.25} />
          </mesh>
        </group>
      )}
    </group>
  );
};

// ==========================================
// BALCONY ENCLOSURE
// ==========================================
const BalconyEnclosure: React.FC<{ width: number; length: number; height: number }> = ({
  width,
  length,
  height,
}) => {
  const halfW = width / 2;
  const halfL = length / 2;

  return (
    <group position={[0, height / 2, 0]}>
      {/* Front Tempered Glass Railing */}
      <mesh position={[0, 0, halfL]}>
        <boxGeometry args={[width, height, 0.03]} />
        <meshPhysicalMaterial
          color="#38BDF8"
          transmission={0.92}
          transparent
          opacity={0.8}
          roughness={0.08}
        />
      </mesh>
      {/* Top Brushed Gold Handrail */}
      <mesh position={[0, height / 2, halfL]}>
        <boxGeometry args={[width + 0.06, 0.06, 0.08]} />
        <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Left Glass Railing */}
      <mesh position={[-halfW, 0, 0]}>
        <boxGeometry args={[0.03, height, length]} />
        <meshPhysicalMaterial
          color="#38BDF8"
          transmission={0.92}
          transparent
          opacity={0.8}
          roughness={0.08}
        />
      </mesh>
      <mesh position={[-halfW, height / 2, 0]}>
        <boxGeometry args={[0.08, 0.06, length]} />
        <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Right Glass Railing */}
      <mesh position={[halfW, 0, 0]}>
        <boxGeometry args={[0.03, height, length]} />
        <meshPhysicalMaterial
          color="#38BDF8"
          transmission={0.92}
          transparent
          opacity={0.8}
          roughness={0.08}
        />
      </mesh>
      <mesh position={[halfW, height / 2, 0]}>
        <boxGeometry args={[0.08, 0.06, length]} />
        <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.2} />
      </mesh>
    </group>
  );
};

// ==========================================
// COMPREHENSIVE PROCEDURAL ROOM FURNISHINGS
// ==========================================
const RoomFurnishings: React.FC<{ room: Room }> = ({ room }) => {
  const { type, width, length } = room;

  switch (type) {
    case 'living':
      return <LivingRoomFurnishings width={width} length={length} />;
    case 'kitchen':
      return <KitchenFurnishings width={width} length={length} />;
    case 'dining':
      return <DiningFurnishings width={width} length={length} />;
    case 'bedroom':
    case 'master_bedroom':
      return <BedroomFurnishings width={width} length={length} isMaster={type === 'master_bedroom'} />;
    case 'bathroom':
      return <BathroomFurnishings width={width} length={length} />;
    case 'balcony':
      return <BalconyFurnishings width={width} length={length} />;
    case 'parking':
      return <ParkingFurnishings width={width} length={length} />;
    default:
      return null;
  }
};

// 1. LIVING ROOM FURNITURE
const LivingRoomFurnishings: React.FC<{ width: number; length: number }> = ({ width, length }) => {
  return (
    <group position={[0, 0, 0]}>
      {/* Designer Area Rug */}
      <mesh position={[0, 0.02, 0]}>
        <boxGeometry args={[Math.min(width * 0.75, 3.2), 0.015, Math.min(length * 0.7, 2.8)]} />
        <meshStandardMaterial color="#334155" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.025, 0]}>
        <boxGeometry args={[Math.min(width * 0.78, 3.3), 0.01, Math.min(length * 0.73, 2.9)]} />
        <meshStandardMaterial color="#D4AF37" metalness={0.6} roughness={0.4} wireframe />
      </mesh>

      {/* Contemporary Sectional L-Sofa */}
      <group position={[0, 0, -length * 0.15]}>
        {/* Main Sofa Cushion */}
        <mesh position={[0, 0.25, 0]} castShadow>
          <boxGeometry args={[2.2, 0.42, 0.9]} />
          <meshStandardMaterial color="#1E293B" roughness={0.7} />
        </mesh>
        {/* Chaise Extension */}
        <mesh position={[-0.85, 0.25, 0.55]} castShadow>
          <boxGeometry args={[0.85, 0.42, 1.2]} />
          <meshStandardMaterial color="#1E293B" roughness={0.7} />
        </mesh>
        {/* Backrest */}
        <mesh position={[0, 0.55, -0.38]} castShadow>
          <boxGeometry args={[2.2, 0.45, 0.2]} />
          <meshStandardMaterial color="#0F172A" roughness={0.6} />
        </mesh>
        {/* Throw Pillows */}
        <mesh position={[-0.6, 0.5, -0.22]} rotation={[0.2, 0.3, 0]} castShadow>
          <boxGeometry args={[0.38, 0.35, 0.12]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.5} roughness={0.4} />
        </mesh>
        <mesh position={[0.6, 0.5, -0.22]} rotation={[0.2, -0.3, 0]} castShadow>
          <boxGeometry args={[0.38, 0.35, 0.12]} />
          <meshStandardMaterial color="#38BDF8" roughness={0.5} />
        </mesh>
      </group>

      {/* Designer Glass-Top Coffee Table */}
      <group position={[0.1, 0, 0.3]}>
        {/* Smoked Glass Top */}
        <mesh position={[0, 0.35, 0]} castShadow>
          <boxGeometry args={[1.2, 0.04, 0.6]} />
          <meshPhysicalMaterial color="#0F172A" transmission={0.75} roughness={0.1} />
        </mesh>
        {/* Gold Metal Legs */}
        {[-0.52, 0.52].map((lx, i) =>
          [-0.24, 0.24].map((lz, j) => (
            <mesh key={`tbl-${i}-${j}`} position={[lx, 0.17, lz]}>
              <cylinderGeometry args={[0.025, 0.02, 0.34, 12]} />
              <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.2} />
            </mesh>
          ))
        )}
      </group>

      {/* Floating Entertainment Center & 4K OLED TV */}
      <group position={[0, 0, length * 0.42]}>
        {/* Console Cabinet */}
        <mesh position={[0, 0.3, 0]} castShadow>
          <boxGeometry args={[2.0, 0.35, 0.38]} />
          <meshStandardMaterial color="#0F172A" roughness={0.5} metalness={0.2} />
        </mesh>
        {/* Wall TV */}
        <mesh position={[0, 1.2, 0.1]} castShadow>
          <boxGeometry args={[1.6, 0.9, 0.04]} />
          <meshStandardMaterial color="#020617" roughness={0.1} metalness={0.7} />
        </mesh>
        {/* TV Screen Bezel */}
        <mesh position={[0, 1.2, 0.11]}>
          <boxGeometry args={[1.56, 0.86, 0.01]} />
          <meshBasicMaterial color="#1E293B" />
        </mesh>
        {/* Soundbar */}
        <mesh position={[0, 0.6, 0.1]} castShadow>
          <boxGeometry args={[1.0, 0.08, 0.08]} />
          <meshStandardMaterial color="#1E293B" metalness={0.8} />
        </mesh>
      </group>

      {/* Potted Architectural Fiddle-Leaf Plant */}
      <group position={[width * 0.36, 0, -length * 0.35]}>
        {/* Brass Pot */}
        <mesh position={[0, 0.25, 0]} castShadow>
          <cylinderGeometry args={[0.22, 0.16, 0.5, 16]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.85} roughness={0.25} />
        </mesh>
        {/* Lush Green Foliage */}
        <mesh position={[0, 0.65, 0]} castShadow>
          <sphereGeometry args={[0.35, 14, 14]} />
          <meshStandardMaterial color="#166534" roughness={0.8} />
        </mesh>
        <mesh position={[0.1, 0.85, 0.05]} castShadow>
          <sphereGeometry args={[0.24, 12, 12]} />
          <meshStandardMaterial color="#15803D" roughness={0.8} />
        </mesh>
      </group>
    </group>
  );
};

// 2. MODULAR CHEF KITCHEN
const KitchenFurnishings: React.FC<{ width: number; length: number }> = ({ width, length }) => {
  return (
    <group position={[0, 0, 0]}>
      {/* L-Shaped Modular Base Cabinetry */}
      <group position={[width * 0.15, 0, -length * 0.1]}>
        {/* Counter Base */}
        <mesh position={[0, 0.43, 0]} castShadow receiveShadow>
          <boxGeometry args={[width * 0.55, 0.86, 0.65]} />
          <meshStandardMaterial color="#0F172A" roughness={0.4} />
        </mesh>
        {/* Polished Black Granite Countertop */}
        <mesh position={[0, 0.88, 0]} castShadow receiveShadow>
          <boxGeometry args={[width * 0.58, 0.05, 0.72]} />
          <meshStandardMaterial color="#1E293B" roughness={0.15} metalness={0.3} />
        </mesh>
        {/* Undermount Double Sink */}
        <mesh position={[-0.4, 0.89, 0]}>
          <boxGeometry args={[0.65, 0.02, 0.45]} />
          <meshStandardMaterial color="#CBD5E1" metalness={0.9} roughness={0.15} />
        </mesh>
        {/* Gooseneck Chrome Faucet */}
        <mesh position={[-0.4, 1.05, -0.18]}>
          <cylinderGeometry args={[0.02, 0.02, 0.28, 12]} />
          <meshStandardMaterial color="#F1F5F9" metalness={0.98} roughness={0.05} />
        </mesh>

        {/* 4-Burner Induction / Gas Hob */}
        <mesh position={[0.5, 0.91, 0]}>
          <boxGeometry args={[0.7, 0.02, 0.5]} />
          <meshStandardMaterial color="#090D16" roughness={0.1} metalness={0.5} />
        </mesh>
        {/* Range Hood Extractor Chimney */}
        <mesh position={[0.5, 1.8, 0]} castShadow>
          <boxGeometry args={[0.75, 0.15, 0.45]} />
          <meshStandardMaterial color="#64748B" metalness={0.85} roughness={0.2} />
        </mesh>
        <mesh position={[0.5, 2.2, -0.1]}>
          <boxGeometry args={[0.25, 0.7, 0.25]} />
          <meshStandardMaterial color="#64748B" metalness={0.85} roughness={0.2} />
        </mesh>
      </group>

      {/* Upper Wall-Mounted Cabinetry */}
      <group position={[width * 0.15, 1.6, -length * 0.1]}>
        <mesh position={[0, 0.4, -0.15]} castShadow>
          <boxGeometry args={[width * 0.55, 0.65, 0.35]} />
          <meshStandardMaterial color="#1E293B" roughness={0.4} />
        </mesh>
        {/* Under-cabinet Task Light Strip */}
        <mesh position={[0, 0.06, -0.1]}>
          <boxGeometry args={[width * 0.52, 0.02, 0.05]} />
          <meshBasicMaterial color="#FEF3C7" />
        </mesh>
      </group>

      {/* Stainless Steel French-Door Refrigerator */}
      <group position={[-width * 0.32, 0, -length * 0.1]}>
        <mesh position={[0, 0.95, 0]} castShadow>
          <boxGeometry args={[0.85, 1.9, 0.75]} />
          <meshStandardMaterial color="#94A3B8" metalness={0.85} roughness={0.2} />
        </mesh>
        {/* Handles */}
        <mesh position={[-0.03, 0.95, 0.39]}>
          <boxGeometry args={[0.02, 0.7, 0.03]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0.03, 0.95, 0.39]}>
          <boxGeometry args={[0.02, 0.7, 0.03]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>
    </group>
  );
};

// 3. DINING AREA FURNITURE
const DiningFurnishings: React.FC<{ width: number; length: number }> = ({ width, length }) => {
  return (
    <group position={[0, 0, 0]}>
      {/* Solid Oak / Marble Dining Table */}
      <group position={[0, 0, 0]}>
        {/* Table Top */}
        <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.8, 0.06, 1.0]} />
          <meshStandardMaterial color="#92400E" roughness={0.35} metalness={0.1} />
        </mesh>
        {/* 4 Architectural Table Legs */}
        {[-0.8, 0.8].map((lx, i) =>
          [-0.4, 0.4].map((lz, j) => (
            <mesh key={`dleg-${i}-${j}`} position={[lx, 0.36, lz]}>
              <cylinderGeometry args={[0.035, 0.025, 0.72, 12]} />
              <meshStandardMaterial color="#D4AF37" metalness={0.85} roughness={0.2} />
            </mesh>
          ))
        )}
      </group>

      {/* 4 Upholstered Dining Chairs */}
      {[
        { x: -0.45, z: -0.75, rotY: 0 },
        { x: 0.45, z: -0.75, rotY: 0 },
        { x: -0.45, z: 0.75, rotY: Math.PI },
        { x: 0.45, z: 0.75, rotY: Math.PI },
      ].map((chair, idx) => (
        <group key={`chair-${idx}`} position={[chair.x, 0, chair.z]} rotation={[0, chair.rotY, 0]}>
          {/* Seat Cushion */}
          <mesh position={[0, 0.45, 0]} castShadow>
            <boxGeometry args={[0.45, 0.06, 0.42]} />
            <meshStandardMaterial color="#1E293B" roughness={0.7} />
          </mesh>
          {/* Backrest */}
          <mesh position={[0, 0.75, -0.18]} castShadow>
            <boxGeometry args={[0.42, 0.5, 0.04]} />
            <meshStandardMaterial color="#0F172A" roughness={0.7} />
          </mesh>
          {/* Chair Legs */}
          {[-0.18, 0.18].map((cx, i) =>
            [-0.18, 0.18].map((cz, j) => (
              <mesh key={`cleg-${i}-${j}`} position={[cx, 0.22, cz]}>
                <cylinderGeometry args={[0.018, 0.014, 0.44, 8]} />
                <meshStandardMaterial color="#D4AF37" metalness={0.9} />
              </mesh>
            ))
          )}
        </group>
      ))}

      {/* Hanging Modern Pendant Light */}
      <group position={[0, 2.2, 0]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.2, 0.04, 0.08]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.2} />
        </mesh>
        {[-0.4, 0, 0.4].map((px, i) => (
          <mesh key={`pend-${i}`} position={[px, -0.12, 0]}>
            <sphereGeometry args={[0.09, 16, 16]} />
            <meshBasicMaterial color="#FFFBEB" />
          </mesh>
        ))}
      </group>
    </group>
  );
};

// 4. BEDROOM / MASTER SUITE FURNITURE
const BedroomFurnishings: React.FC<{ width: number; length: number; isMaster?: boolean }> = ({
  width,
  length,
  isMaster,
}) => {
  return (
    <group position={[0, 0, 0]}>
      {/* Luxury King / Queen Bed */}
      <group position={[0, 0, -length * 0.15]}>
        {/* Padded Tufted Headboard */}
        <mesh position={[0, 0.65, -1.02]} castShadow>
          <boxGeometry args={[2.3, 1.2, 0.14]} />
          <meshStandardMaterial color={isMaster ? '#312E81' : '#1E293B'} roughness={0.6} />
        </mesh>
        {/* Headboard Gold Accent Trim */}
        <mesh position={[0, 1.25, -1.02]}>
          <boxGeometry args={[2.34, 0.04, 0.16]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Bed Frame Platform */}
        <mesh position={[0, 0.2, 0]} castShadow>
          <boxGeometry args={[2.1, 0.35, 2.0]} />
          <meshStandardMaterial color="#0F172A" roughness={0.6} />
        </mesh>
        {/* Crisp White Mattress */}
        <mesh position={[0, 0.45, 0]} castShadow>
          <boxGeometry args={[2.0, 0.25, 1.9]} />
          <meshStandardMaterial color="#F8FAFC" roughness={0.7} />
        </mesh>
        {/* Luxury Duvet Runner */}
        <mesh position={[0, 0.58, 0.4]} castShadow>
          <boxGeometry args={[2.02, 0.03, 0.9]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.5} roughness={0.4} />
        </mesh>
        {/* Twin Plush Pillows */}
        <mesh position={[-0.55, 0.62, -0.65]} rotation={[0.2, 0, 0]} castShadow>
          <boxGeometry args={[0.65, 0.14, 0.42]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.8} />
        </mesh>
        <mesh position={[0.55, 0.62, -0.65]} rotation={[0.2, 0, 0]} castShadow>
          <boxGeometry args={[0.65, 0.14, 0.42]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.8} />
        </mesh>

        {/* Dual Bedside Nightstands & Warm Lamps */}
        {[-1.35, 1.35].map((nx, i) => (
          <group key={`stand-${i}`} position={[nx, 0, -0.7]}>
            {/* Nightstand Table */}
            <mesh position={[0, 0.25, 0]} castShadow>
              <boxGeometry args={[0.48, 0.45, 0.42]} />
              <meshStandardMaterial color="#0F172A" roughness={0.5} />
            </mesh>
            {/* Handle */}
            <mesh position={[0, 0.25, 0.22]}>
              <boxGeometry args={[0.08, 0.02, 0.02]} />
              <meshStandardMaterial color="#D4AF37" metalness={0.9} />
            </mesh>
            {/* Bedside Lamp Base */}
            <mesh position={[0, 0.52, 0]}>
              <cylinderGeometry args={[0.06, 0.08, 0.12, 16]} />
              <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.2} />
            </mesh>
            {/* Lamp Shade with Warm Glow */}
            <mesh position={[0, 0.68, 0]}>
              <cylinderGeometry args={[0.12, 0.15, 0.2, 16]} />
              <meshStandardMaterial color="#FFFBEB" emissive="#FDE68A" emissiveIntensity={0.6} roughness={0.5} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Built-in Sliding Wardrobe Closet */}
      <group position={[width * 0.35, 0, length * 0.2]}>
        <mesh position={[0, 1.2, 0]} castShadow>
          <boxGeometry args={[0.65, 2.4, Math.min(length * 0.55, 2.2)]} />
          <meshStandardMaterial color="#1E293B" roughness={0.4} metalness={0.1} />
        </mesh>
        {/* Mirror Accent Strip */}
        <mesh position={[-0.33, 1.2, 0]}>
          <boxGeometry args={[0.01, 2.2, Math.min(length * 0.45, 1.8)]} />
          <meshPhysicalMaterial color="#CBD5E1" roughness={0.05} metalness={0.9} />
        </mesh>
      </group>
    </group>
  );
};

// 5. SPA BATHROOM FIXTURES
const BathroomFurnishings: React.FC<{ width: number; length: number }> = ({ width, length }) => {
  return (
    <group position={[0, 0, 0]}>
      {/* Floating Vanity & Ceramic Washbasin */}
      <group position={[-width * 0.22, 0, -length * 0.25]}>
        {/* Vanity Cabinet */}
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[0.9, 0.45, 0.52]} />
          <meshStandardMaterial color="#1E293B" roughness={0.4} />
        </mesh>
        {/* Integrated Porcelain Basin */}
        <mesh position={[0, 0.74, 0]}>
          <boxGeometry args={[0.82, 0.05, 0.46]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.1} metalness={0.1} />
        </mesh>
        {/* Chrome Mixer Tap */}
        <mesh position={[0, 0.88, -0.15]}>
          <cylinderGeometry args={[0.02, 0.02, 0.22, 12]} />
          <meshStandardMaterial color="#F1F5F9" metalness={0.98} roughness={0.05} />
        </mesh>
        {/* Backlit LED Vanity Mirror */}
        <mesh position={[0, 1.45, -0.24]}>
          <boxGeometry args={[0.75, 0.9, 0.02]} />
          <meshPhysicalMaterial color="#E2E8F0" roughness={0.05} metalness={0.95} />
        </mesh>
        <mesh position={[0, 1.45, -0.25]}>
          <boxGeometry args={[0.8, 0.95, 0.01]} />
          <meshBasicMaterial color="#FDE68A" />
        </mesh>
      </group>

      {/* Wall-Mounted Ceramic Toilet Commode */}
      <group position={[width * 0.28, 0, -length * 0.25]}>
        <mesh position={[0, 0.42, 0]} castShadow>
          <boxGeometry args={[0.42, 0.4, 0.55]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.1} />
        </mesh>
        {/* Toilet Seat */}
        <mesh position={[0, 0.63, 0.02]}>
          <boxGeometry args={[0.4, 0.04, 0.52]} />
          <meshStandardMaterial color="#F8FAFC" roughness={0.2} />
        </mesh>
        {/* Flush Plate on Wall */}
        <mesh position={[0, 0.95, -0.24]}>
          <boxGeometry args={[0.22, 0.14, 0.02]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* Walk-in Shower Enclosure */}
      <group position={[0, 0, length * 0.25]}>
        {/* Tempered Clear Glass Screen */}
        <mesh position={[-0.2, 1.1, 0]}>
          <boxGeometry args={[0.02, 2.2, Math.min(length * 0.45, 1.6)]} />
          <meshPhysicalMaterial color="#38BDF8" transmission={0.95} transparent opacity={0.7} roughness={0.05} />
        </mesh>
        {/* Overhead Rainfall Shower Head */}
        <mesh position={[width * 0.2, 2.1, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.03, 16]} />
          <meshStandardMaterial color="#CBD5E1" metalness={0.95} roughness={0.1} />
        </mesh>
        <mesh position={[width * 0.2, 2.2, -0.2]}>
          <boxGeometry args={[0.03, 0.03, 0.4]} />
          <meshStandardMaterial color="#CBD5E1" metalness={0.95} roughness={0.1} />
        </mesh>
      </group>
    </group>
  );
};

// 6. BALCONY FURNITURE
const BalconyFurnishings: React.FC<{ width: number; length: number }> = ({ width, length }) => {
  return (
    <group position={[0, 0, 0]}>
      {/* Pair of Outdoor Woven Lounge Armchairs & Table */}
      <group position={[0, 0, 0]}>
        {/* Round Glass Coffee Table */}
        <mesh position={[0, 0.3, 0]}>
          <cylinderGeometry args={[0.35, 0.35, 0.03, 16]} />
          <meshPhysicalMaterial color="#38BDF8" transmission={0.85} roughness={0.1} />
        </mesh>
        <mesh position={[0, 0.15, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.28, 12]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.85} />
        </mesh>

        {/* 2 Armchairs */}
        {[-0.65, 0.65].map((cx, i) => (
          <group key={`bchair-${i}`} position={[cx, 0, 0]}>
            <mesh position={[0, 0.22, 0]} castShadow>
              <boxGeometry args={[0.5, 0.35, 0.5]} />
              <meshStandardMaterial color="#1E293B" roughness={0.8} />
            </mesh>
            <mesh position={[0, 0.5, -0.22]} castShadow>
              <boxGeometry args={[0.5, 0.4, 0.06]} />
              <meshStandardMaterial color="#0F172A" roughness={0.8} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
};

// 7. PARKING BAY VEHICLE
const ParkingFurnishings: React.FC<{ width: number; length: number }> = ({ width, length }) => {
  return (
    <group position={[0, 0, 0]}>
      {/* Modern SUV Vehicle */}
      <group position={[0, 0.1, 0]}>
        {/* Car Chassis Body */}
        <mesh position={[0, 0.45, 0]} castShadow>
          <boxGeometry args={[1.85, 0.65, 4.0]} />
          <meshStandardMaterial color="#0284C7" metalness={0.75} roughness={0.18} />
        </mesh>
        {/* Cabin Glass Dome */}
        <mesh position={[0, 0.95, -0.2]} castShadow>
          <boxGeometry args={[1.55, 0.55, 2.2]} />
          <meshPhysicalMaterial color="#0F172A" transmission={0.65} roughness={0.08} metalness={0.4} />
        </mesh>
        {/* LED Headlights */}
        <mesh position={[-0.6, 0.48, 1.99]}>
          <boxGeometry args={[0.35, 0.1, 0.04]} />
          <meshBasicMaterial color="#FFFBEB" />
        </mesh>
        <mesh position={[0.6, 0.48, 1.99]}>
          <boxGeometry args={[0.35, 0.1, 0.04]} />
          <meshBasicMaterial color="#FFFBEB" />
        </mesh>
        {/* Wheels */}
        {[-0.95, 0.95].map((wx, i) =>
          [-1.2, 1.2].map((wz, j) => (
            <mesh key={`whl-${i}-${j}`} position={[wx, 0.32, wz]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.32, 0.32, 0.22, 18]} />
              <meshStandardMaterial color="#111827" roughness={0.9} />
            </mesh>
          ))
        )}
      </group>
    </group>
  );
};

// ==========================================
// ARCHITECTURAL STAIRCASE WITH HANDRAILS
// ==========================================
const ArchitecturalStaircase: React.FC<{ stair: any }> = ({ stair }) => {
  const steps = 14;
  const stepHeight = stair.height / steps;
  const stepDepth = stair.length / steps;

  return (
    <group position={[stair.x, 0.18, stair.z]}>
      {/* Steps with Hardwood Treads & Risers */}
      {Array.from({ length: steps }).map((_, i) => (
        <group key={i} position={[0, (i + 0.5) * stepHeight, (i - steps / 2 + 0.5) * stepDepth]}>
          {/* Tread */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[stair.width, stepHeight * 0.4, stepDepth]} />
            <meshStandardMaterial color="#92400E" roughness={0.35} metalness={0.1} />
          </mesh>
          {/* Riser */}
          <mesh position={[0, -stepHeight * 0.3, stepDepth / 2 - 0.02]} castShadow receiveShadow>
            <boxGeometry args={[stair.width, stepHeight * 0.7, 0.03]} />
            <meshStandardMaterial color="#0F172A" roughness={0.6} />
          </mesh>
        </group>
      ))}

      {/* Safety Handrail along staircase slope */}
      <group position={[stair.width / 2 - 0.05, stair.height / 2 + 0.85, 0]}>
        <mesh rotation={[Math.atan2(stair.height, stair.length), 0, 0]}>
          <cylinderGeometry args={[0.03, 0.03, Math.hypot(stair.height, stair.length), 12]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>
    </group>
  );
};

const RoofMesh: React.FC<{ spec: BuildingSpecification; topElevation: number; ghostMode?: boolean }> = ({
  spec,
  topElevation,
  ghostMode,
}) => {
  const bldgWidth = spec.plotDimensions.width - 2;
  const bldgLength = spec.plotDimensions.length - 2;
  const isGarden = spec.roof.type === 'garden';

  return (
    <group position={[0, topElevation, 0]}>
      {/* Roof Slab */}
      <mesh position={[0, 0.08, 0]} receiveShadow>
        <boxGeometry args={[bldgWidth + 0.6, 0.16, bldgLength + 0.6]} />
        <meshStandardMaterial
          color={isGarden ? '#065F46' : '#1E293B'}
          roughness={0.7}
          transparent={ghostMode}
          opacity={ghostMode ? 0.3 : 1.0}
        />
      </mesh>

      {/* Safety Parapet Wall */}
      <group position={[0, 0.6, 0]}>
        {/* North */}
        <mesh position={[0, 0, -bldgLength / 2 - 0.2]}>
          <boxGeometry args={[bldgWidth + 0.6, 1.0, 0.15]} />
          <meshStandardMaterial color="#334155" roughness={0.8} />
        </mesh>
        {/* South */}
        <mesh position={[0, 0, bldgLength / 2 + 0.2]}>
          <boxGeometry args={[bldgWidth + 0.6, 1.0, 0.15]} />
          <meshStandardMaterial color="#334155" roughness={0.8} />
        </mesh>
        {/* West */}
        <mesh position={[-bldgWidth / 2 - 0.2, 0, 0]}>
          <boxGeometry args={[0.15, 1.0, bldgLength + 0.6]} />
          <meshStandardMaterial color="#334155" roughness={0.8} />
        </mesh>
        {/* East */}
        <mesh position={[bldgWidth / 2 + 0.2, 0, 0]}>
          <boxGeometry args={[0.15, 1.0, bldgLength + 0.6]} />
          <meshStandardMaterial color="#334155" roughness={0.8} />
        </mesh>
      </group>

      {/* Solar Panels on Roof */}
      {spec.roof.hasSolarPanels && !ghostMode && (
        <group position={[-2, 0.3, -2]} rotation={[-Math.PI / 12, 0, 0]}>
          <mesh castShadow>
            <boxGeometry args={[3.2, 0.08, 2.0]} />
            <meshStandardMaterial color="#1E3A8A" metalness={0.9} roughness={0.1} />
          </mesh>
          <mesh position={[0, 0.05, 0]}>
            <boxGeometry args={[3.25, 0.02, 2.05]} />
            <meshStandardMaterial color="#CBD5E1" metalness={0.8} roughness={0.2} wireframe />
          </mesh>
        </group>
      )}

      {/* Overhead Water Tank */}
      {spec.roof.hasWaterTank && !ghostMode && (
        <group position={[2.5, 0.9, -2.5]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.9, 0.9, 1.4, 24]} />
            <meshStandardMaterial color="#0284C7" metalness={0.6} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.8, 0]}>
            <coneGeometry args={[0.95, 0.4, 24]} />
            <meshStandardMaterial color="#0369A1" metalness={0.5} roughness={0.3} />
          </mesh>
        </group>
      )}
    </group>
  );
};

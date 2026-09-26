import React, { useRef } from 'react';
import * as THREE from 'three';
import { PlacedElement } from '../../types/building';

interface FurnitureObjectProps {
  item: PlacedElement;
  isSelected: boolean;
  onSelect: (item: PlacedElement) => void;
}

export const FurnitureObject: React.FC<FurnitureObjectProps> = ({
  item,
  isSelected,
  onSelect,
}) => {
  const groupRef = useRef<THREE.Group>(null);

  const pos: [number, number, number] = [
    item.position?.x ?? 0,
    item.position?.y ?? 0.18,
    item.position?.z ?? 0,
  ];

  const rot: [number, number, number] = [
    item.rotation?.x ?? 0,
    item.rotation?.y ?? 0,
    item.rotation?.z ?? 0,
  ];

  const sca: [number, number, number] = [
    item.scale?.x ?? 1,
    item.scale?.y ?? 1,
    item.scale?.z ?? 1,
  ];

  return (
    <group
      ref={groupRef}
      position={pos}
      rotation={rot}
      scale={sca}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(item);
      }}
    >
      {/* Dynamic 3D Architectural Model by Item Type */}
      <ProceduralFurnitureMesh itemType={item.itemType} isSelected={isSelected} />

      {/* Selection Bounding Box & Halo Glow */}
      {isSelected && (
        <group>
          <mesh position={[0, 0.45, 0]}>
            <boxGeometry args={[1.2, 0.95, 1.2]} />
            <meshBasicMaterial color="#F59E0B" wireframe transparent opacity={0.65} />
          </mesh>
          <mesh position={[0, 0.01, 0]}>
            <circleGeometry args={[0.9, 24]} />
            <meshBasicMaterial color="#F59E0B" transparent opacity={0.25} side={THREE.DoubleSide} />
          </mesh>
        </group>
      )}
    </group>
  );
};

/**
 * High-fidelity procedural 3D furniture meshes for all catalog items.
 * Guaranteed 100% reliable rendering without network or missing GLTF failures.
 */
const ProceduralFurnitureMesh: React.FC<{ itemType: string; isSelected: boolean }> = ({
  itemType,
  isSelected,
}) => {
  const highlightColor = isSelected ? '#FBBF24' : undefined;

  switch (itemType) {
    case 'refrigerator':
      return (
        <group position={[0, 0, 0]}>
          {/* Main Steel Body */}
          <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.85, 1.8, 0.75]} />
            <meshStandardMaterial
              color={highlightColor || '#E2E8F0'}
              metalness={0.7}
              roughness={0.25}
            />
          </mesh>
          {/* Top Freezer Door Seam */}
          <mesh position={[0, 1.25, 0.385]} castShadow>
            <boxGeometry args={[0.82, 0.02, 0.02]} />
            <meshStandardMaterial color="#64748B" metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Handles */}
          <mesh position={[0.35, 1.1, 0.4]} castShadow>
            <boxGeometry args={[0.04, 0.45, 0.04]} />
            <meshStandardMaterial color="#0F172A" metalness={0.9} roughness={0.1} />
          </mesh>
          <mesh position={[0.35, 0.5, 0.4]} castShadow>
            <boxGeometry args={[0.04, 0.45, 0.04]} />
            <meshStandardMaterial color="#0F172A" metalness={0.9} roughness={0.1} />
          </mesh>
          {/* Digital Dispenser Panel */}
          <mesh position={[-0.2, 1.15, 0.38]}>
            <boxGeometry args={[0.18, 0.28, 0.02]} />
            <meshStandardMaterial color="#0284C7" roughness={0.2} metalness={0.8} />
          </mesh>
        </group>
      );

    case 'sofa':
      return (
        <group position={[0, 0, 0]}>
          {/* Main Seating Base */}
          <mesh position={[0, 0.22, 0]} castShadow receiveShadow>
            <boxGeometry args={[2.2, 0.4, 0.95]} />
            <meshStandardMaterial color={highlightColor || '#1E293B'} roughness={0.75} />
          </mesh>
          {/* L-Extension Chaise */}
          <mesh position={[-0.8, 0.22, 0.45]} castShadow receiveShadow>
            <boxGeometry args={[0.75, 0.4, 0.9]} />
            <meshStandardMaterial color={highlightColor || '#1E293B'} roughness={0.75} />
          </mesh>
          {/* Backrest */}
          <mesh position={[0, 0.52, -0.38]} castShadow>
            <boxGeometry args={[2.2, 0.48, 0.22]} />
            <meshStandardMaterial color={highlightColor || '#0F172A'} roughness={0.65} />
          </mesh>
          {/* Left & Right Armrests */}
          <mesh position={[-1.02, 0.42, 0]} castShadow>
            <boxGeometry args={[0.2, 0.38, 0.95]} />
            <meshStandardMaterial color="#0F172A" roughness={0.65} />
          </mesh>
          <mesh position={[1.02, 0.42, 0]} castShadow>
            <boxGeometry args={[0.2, 0.38, 0.95]} />
            <meshStandardMaterial color="#0F172A" roughness={0.65} />
          </mesh>
          {/* Accent Throw Pillows */}
          <mesh position={[-0.5, 0.48, -0.22]} rotation={[0.2, 0.2, 0]} castShadow>
            <boxGeometry args={[0.38, 0.35, 0.12]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.4} roughness={0.4} />
          </mesh>
          <mesh position={[0.5, 0.48, -0.22]} rotation={[0.2, -0.2, 0]} castShadow>
            <boxGeometry args={[0.38, 0.35, 0.12]} />
            <meshStandardMaterial color="#38BDF8" roughness={0.5} />
          </mesh>
        </group>
      );

    case 'bed':
      return (
        <group position={[0, 0, 0]}>
          {/* Wooden Bed Base Frame */}
          <mesh position={[0, 0.18, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.9, 0.32, 2.05]} />
            <meshStandardMaterial color="#78350F" roughness={0.5} />
          </mesh>
          {/* High Resilience Quilted Mattress */}
          <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.8, 0.25, 1.95]} />
            <meshStandardMaterial color={highlightColor || '#F8FAFC'} roughness={0.8} />
          </mesh>
          {/* Channel-Tufted Headboard */}
          <mesh position={[0, 0.72, -0.98]} castShadow>
            <boxGeometry args={[2.0, 0.9, 0.18]} />
            <meshStandardMaterial color={highlightColor || '#1E293B'} roughness={0.7} />
          </mesh>
          {/* Pillows */}
          <mesh position={[-0.45, 0.55, -0.65]} rotation={[0.25, 0, 0]} castShadow>
            <boxGeometry args={[0.65, 0.18, 0.45]} />
            <meshStandardMaterial color="#E2E8F0" roughness={0.9} />
          </mesh>
          <mesh position={[0.45, 0.55, -0.65]} rotation={[0.25, 0, 0]} castShadow>
            <boxGeometry args={[0.65, 0.18, 0.45]} />
            <meshStandardMaterial color="#E2E8F0" roughness={0.9} />
          </mesh>
          {/* Throw Blanket */}
          <mesh position={[0, 0.53, 0.5]} castShadow>
            <boxGeometry args={[1.82, 0.04, 0.75]} />
            <meshStandardMaterial color="#D4AF37" roughness={0.6} />
          </mesh>
        </group>
      );

    case 'wardrobe':
      return (
        <group position={[0, 0, 0]}>
          {/* Wardrobe Body */}
          <mesh position={[0, 1.15, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.75, 2.3, 0.6]} />
            <meshStandardMaterial color={highlightColor || '#0F172A'} roughness={0.5} />
          </mesh>
          {/* Tinted Glass Door Profiles */}
          {[-0.42, 0.42].map((dx, i) => (
            <mesh key={i} position={[dx, 1.15, 0.31]}>
              <boxGeometry args={[0.82, 2.2, 0.02]} />
              <meshStandardMaterial color="#1E293B" metalness={0.6} roughness={0.2} />
            </mesh>
          ))}
          {/* Vertical Brushed Gold Handles */}
          {[-0.05, 0.05].map((hx, i) => (
            <mesh key={i} position={[hx, 1.15, 0.33]} castShadow>
              <boxGeometry args={[0.03, 1.2, 0.03]} />
              <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.15} />
            </mesh>
          ))}
        </group>
      );

    case 'dining_table':
      return (
        <group position={[0, 0, 0]}>
          {/* Solid Wood Tabletop */}
          <mesh position={[0, 0.74, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.8, 0.06, 0.95]} />
            <meshStandardMaterial color={highlightColor || '#92400E'} roughness={0.4} />
          </mesh>
          {/* Four Legs */}
          {[-0.8, 0.8].map((lx, i) =>
            [-0.38, 0.38].map((lz, j) => (
              <mesh key={`dl-${i}-${j}`} position={[lx, 0.36, lz]} castShadow>
                <boxGeometry args={[0.07, 0.72, 0.07]} />
                <meshStandardMaterial color="#451A03" roughness={0.5} />
              </mesh>
            ))
          )}
          {/* Surrounding Chairs (Simplified preview) */}
          {[-0.5, 0, 0.5].map((cx, i) => (
            <group key={`ch-${i}`} position={[cx, 0, 0.55]}>
              <mesh position={[0, 0.44, 0]} castShadow>
                <boxGeometry args={[0.38, 0.05, 0.38]} />
                <meshStandardMaterial color="#D4AF37" roughness={0.6} />
              </mesh>
              <mesh position={[0, 0.72, 0.16]} castShadow>
                <boxGeometry args={[0.38, 0.5, 0.04]} />
                <meshStandardMaterial color="#D4AF37" roughness={0.6} />
              </mesh>
            </group>
          ))}
        </group>
      );

    case 'tv':
      return (
        <group position={[0, 0, 0]}>
          {/* Display Bezel Frame */}
          <mesh position={[0, 0.75, 0]} castShadow>
            <boxGeometry args={[1.45, 0.84, 0.04]} />
            <meshStandardMaterial color="#020617" roughness={0.1} metalness={0.8} />
          </mesh>
          {/* OLED Screen Surface */}
          <mesh position={[0, 0.75, 0.022]}>
            <planeGeometry args={[1.4, 0.79]} />
            <meshBasicMaterial color={highlightColor || '#0369A1'} />
          </mesh>
          {/* Tabletop Stand Pedestal */}
          <mesh position={[0, 0.34, 0]} castShadow>
            <cylinderGeometry args={[0.03, 0.03, 0.25, 12]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.22, 0]}>
            <boxGeometry args={[0.55, 0.02, 0.25]} />
            <meshStandardMaterial color="#0F172A" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>
      );

    case 'tv_unit':
      return (
        <group position={[0, 0, 0]}>
          <mesh position={[0, 0.32, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.95, 0.38, 0.42]} />
            <meshStandardMaterial color={highlightColor || '#0F172A'} roughness={0.5} />
          </mesh>
          {/* Fluted Wood Texture Accent Line */}
          <mesh position={[0, 0.32, 0.215]}>
            <boxGeometry args={[1.9, 0.32, 0.02]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.6} roughness={0.3} />
          </mesh>
        </group>
      );

    case 'washing_machine':
      return (
        <group position={[0, 0, 0]}>
          {/* Main White/Silver Cube Housing */}
          <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.62, 0.85, 0.62]} />
            <meshStandardMaterial color={highlightColor || '#F1F5F9'} roughness={0.3} metalness={0.4} />
          </mesh>
          {/* Front Load Circular Glass Door */}
          <mesh position={[0, 0.42, 0.315]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.22, 0.22, 0.04, 24]} />
            <meshStandardMaterial color="#0284C7" metalness={0.8} roughness={0.1} />
          </mesh>
          <mesh position={[0, 0.42, 0.33]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.16, 0.16, 0.03, 24]} />
            <meshBasicMaterial color="#0F172A" />
          </mesh>
          {/* Top Control Dial & LED Indicator */}
          <mesh position={[0.18, 0.78, 0.315]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.03, 16]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>
      );

    case 'microwave':
      return (
        <group position={[0, 0.2, 0]}>
          <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.55, 0.35, 0.4]} />
            <meshStandardMaterial color={highlightColor || '#1E293B'} metalness={0.7} roughness={0.2} />
          </mesh>
          <mesh position={[-0.08, 0.2, 0.205]}>
            <boxGeometry args={[0.34, 0.28, 0.02]} />
            <meshStandardMaterial color="#0284C7" metalness={0.5} roughness={0.1} />
          </mesh>
          {/* Control Keypad */}
          <mesh position={[0.18, 0.2, 0.205]}>
            <boxGeometry args={[0.12, 0.28, 0.02]} />
            <meshStandardMaterial color="#0F172A" roughness={0.5} />
          </mesh>
        </group>
      );

    case 'flower_vase':
      return (
        <group position={[0, 0, 0]}>
          {/* Ribbed Ceramic Vase Pot */}
          <mesh position={[0, 0.25, 0]} castShadow>
            <cylinderGeometry args={[0.12, 0.18, 0.45, 18]} />
            <meshStandardMaterial color={highlightColor || '#D4AF37'} metalness={0.8} roughness={0.25} />
          </mesh>
          {/* Green Stems & Leaves */}
          <mesh position={[0, 0.55, 0]} castShadow>
            <sphereGeometry args={[0.22, 12, 12]} />
            <meshStandardMaterial color="#10B981" roughness={0.8} />
          </mesh>
          {/* Blossom Petals */}
          {[-0.08, 0.08].map((fx, i) =>
            [-0.08, 0.08].map((fz, j) => (
              <mesh key={`fl-${i}-${j}`} position={[fx, 0.65, fz]}>
                <sphereGeometry args={[0.06, 8, 8]} />
                <meshStandardMaterial color="#F43F5E" roughness={0.6} />
              </mesh>
            ))
          )}
        </group>
      );

    case 'coffee_table':
    case 'center_table':
      return (
        <group position={[0, 0, 0]}>
          <mesh position={[0, 0.38, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.1, 0.05, 0.65]} />
            <meshStandardMaterial color={highlightColor || '#F8FAFC'} roughness={0.15} metalness={0.1} />
          </mesh>
          {[-0.48, 0.48].map((lx, i) =>
            [-0.26, 0.26].map((lz, j) => (
              <mesh key={`cl-${i}-${j}`} position={[lx, 0.18, lz]} castShadow>
                <cylinderGeometry args={[0.02, 0.015, 0.36, 12]} />
                <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.2} />
              </mesh>
            ))
          )}
        </group>
      );

    case 'floor_lamp':
      return (
        <group position={[0, 0, 0]}>
          {/* Base */}
          <mesh position={[0, 0.03, 0]}>
            <cylinderGeometry args={[0.2, 0.22, 0.05, 18]} />
            <meshStandardMaterial color="#0F172A" metalness={0.8} roughness={0.3} />
          </mesh>
          {/* Tall Stem */}
          <mesh position={[0, 0.9, 0]} castShadow>
            <cylinderGeometry args={[0.02, 0.02, 1.75, 12]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Lamp Shade */}
          <mesh position={[0, 1.75, 0]} castShadow>
            <coneGeometry args={[0.28, 0.35, 18, 1, true]} />
            <meshStandardMaterial color="#FFF8E7" roughness={0.7} side={THREE.DoubleSide} />
          </mesh>
          {/* Warm Glowing Bulb inside */}
          <mesh position={[0, 1.72, 0]}>
            <sphereGeometry args={[0.07, 12, 12]} />
            <meshBasicMaterial color="#FEF08A" />
          </mesh>
        </group>
      );

    case 'bookshelf':
      return (
        <group position={[0, 0, 0]}>
          <mesh position={[0, 0.95, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.15, 1.9, 0.36]} />
            <meshStandardMaterial color={highlightColor || '#451A03'} roughness={0.6} />
          </mesh>
          {/* Shelves */}
          {[-0.5, -0.1, 0.3, 0.7].map((sy, i) => (
            <mesh key={i} position={[0, 0.95 + sy, 0.02]}>
              <boxGeometry args={[1.05, 0.03, 0.32]} />
              <meshStandardMaterial color="#D4AF37" metalness={0.5} roughness={0.4} />
            </mesh>
          ))}
        </group>
      );

    case 'toilet':
      return (
        <group position={[0, 0, 0]}>
          {/* Ceramic Commode Bowl */}
          <mesh position={[0, 0.24, 0]} castShadow>
            <boxGeometry args={[0.4, 0.42, 0.58]} />
            <meshStandardMaterial color={highlightColor || '#F8FAFC'} roughness={0.2} />
          </mesh>
          {/* Seat Lid */}
          <mesh position={[0, 0.46, 0.02]}>
            <boxGeometry args={[0.38, 0.03, 0.52]} />
            <meshStandardMaterial color="#E2E8F0" roughness={0.3} />
          </mesh>
        </group>
      );

    case 'wash_basin':
      return (
        <group position={[0, 0, 0]}>
          {/* Vanity Base */}
          <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.68, 0.8, 0.48]} />
            <meshStandardMaterial color={highlightColor || '#0F172A'} roughness={0.5} />
          </mesh>
          {/* Ceramic Basin Top */}
          <mesh position={[0, 0.82, 0]} castShadow>
            <cylinderGeometry args={[0.24, 0.18, 0.14, 20]} />
            <meshStandardMaterial color="#F8FAFC" roughness={0.15} />
          </mesh>
          {/* Tall Chrome Mixer Tap */}
          <mesh position={[0, 0.94, -0.15]} castShadow>
            <cylinderGeometry args={[0.015, 0.015, 0.18, 12]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.95} roughness={0.1} />
          </mesh>
        </group>
      );

    default:
      // Generic Architectural Block placeholder with gold chamfer edges
      return (
        <group position={[0, 0, 0]}>
          <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.8, 0.8, 0.8]} />
            <meshStandardMaterial color={highlightColor || '#334155'} roughness={0.6} />
          </mesh>
          <mesh position={[0, 0.4, 0]}>
            <boxGeometry args={[0.82, 0.82, 0.82]} />
            <meshBasicMaterial color="#D4AF37" wireframe transparent opacity={0.35} />
          </mesh>
        </group>
      );
  }
};

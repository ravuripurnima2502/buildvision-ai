import React, { useEffect, useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { BuildingSpecification, Room } from '../../types/building';

export interface WalkthroughStop {
  id: string;
  name: string;
  roomType?: string;
  description: string;
  dimensions?: string;
  areaSqFt?: number;
  floorName?: string;
  cameraPosition: [number, number, number];
  targetPosition: [number, number, number];
  fov?: number;
}

export function generateWalkthroughStops(spec?: BuildingSpecification): WalkthroughStop[] {
  if (!spec || !spec.floors || spec.floors.length === 0) {
    return DEFAULT_WALKTHROUGH_STOPS;
  }

  const plotL = spec.plotDimensions.length;
  const stops: WalkthroughStop[] = [];

  // 1. Exterior Front Approach
  stops.push({
    id: 'stop_exterior_front',
    name: 'Exterior Approach & Front Facade',
    description: 'Viewing the modern architectural elevation, portico, and structural geometry.',
    floorName: 'Ground Level',
    cameraPosition: [0, 2.6, Math.max(plotL * 0.9, 13)],
    targetPosition: [0, 2.0, 2],
    fov: 46,
  });

  // 2. Main Entrance Portico
  stops.push({
    id: 'stop_entrance_portico',
    name: 'Covered Portico & Main Entrance',
    description: 'Arriving at the main entrance doorway with covered portico and architectural columns.',
    floorName: 'Ground Floor',
    cameraPosition: [1.2, 1.65, Math.max(plotL * 0.42, 6.5)],
    targetPosition: [1.2, 1.65, 1.5],
    fov: 62,
  });

  const gf = spec.floors[0];
  if (gf) {
    // 3. Living Room
    const living = gf.rooms.find(r => r.type === 'living');
    if (living) {
      const elev = gf.elevation + 0.18;
      stops.push({
        id: 'stop_living',
        name: living.name || 'Grand Living Room',
        roomType: 'living',
        description: 'Spacious living room featuring designer sectional sofa, coffee table, and media wall.',
        dimensions: `${(living.width * 3.281).toFixed(1)} × ${(living.length * 3.281).toFixed(1)} ft`,
        areaSqFt: living.areaSqFt,
        floorName: 'Ground Floor',
        cameraPosition: [living.x - living.width * 0.28, elev + 1.65, living.z + living.length * 0.28],
        targetPosition: [living.x + living.width * 0.15, elev + 1.35, living.z - living.length * 0.18],
        fov: 68,
      });
    }

    // 4. Dining Area
    const dining = gf.rooms.find(r => r.type === 'dining');
    if (dining) {
      const elev = gf.elevation + 0.18;
      stops.push({
        id: 'stop_dining',
        name: dining.name || 'Central Dining Area',
        roomType: 'dining',
        description: 'Warm family dining room with solid wood table, upholstered seating, and modern pendant lighting.',
        dimensions: `${(dining.width * 3.281).toFixed(1)} × ${(dining.length * 3.281).toFixed(1)} ft`,
        areaSqFt: dining.areaSqFt,
        floorName: 'Ground Floor',
        cameraPosition: [dining.x - dining.width * 0.25, elev + 1.65, dining.z + dining.length * 0.25],
        targetPosition: [dining.x + dining.width * 0.1, elev + 1.25, dining.z - dining.length * 0.1],
        fov: 66,
      });
    }

    // 5. Modular Kitchen
    const kitchen = gf.rooms.find(r => r.type === 'kitchen');
    if (kitchen) {
      const elev = gf.elevation + 0.18;
      stops.push({
        id: 'stop_kitchen',
        name: kitchen.name || 'Modular Chef Kitchen',
        roomType: 'kitchen',
        description: 'Contemporary kitchen with polished granite countertops, double sink, cooktop, and storage.',
        dimensions: `${(kitchen.width * 3.281).toFixed(1)} × ${(kitchen.length * 3.281).toFixed(1)} ft`,
        areaSqFt: kitchen.areaSqFt,
        floorName: 'Ground Floor',
        cameraPosition: [kitchen.x + kitchen.width * 0.28, elev + 1.65, kitchen.z + kitchen.length * 0.28],
        targetPosition: [kitchen.x - kitchen.width * 0.15, elev + 1.35, kitchen.z - kitchen.length * 0.18],
        fov: 68,
      });
    }

    // 6. Ground Floor Bedroom Suite
    const bed = gf.rooms.find(r => r.type === 'bedroom' || r.type === 'master_bedroom');
    if (bed) {
      const elev = gf.elevation + 0.18;
      stops.push({
        id: 'stop_gf_bed',
        name: bed.name || 'Ground Floor Bedroom Suite',
        roomType: 'bedroom',
        description: 'Private bedroom with king bed, tufted headboard, nightstands, and built-in wardrobe.',
        dimensions: `${(bed.width * 3.281).toFixed(1)} × ${(bed.length * 3.281).toFixed(1)} ft`,
        areaSqFt: bed.areaSqFt,
        floorName: 'Ground Floor',
        cameraPosition: [bed.x + bed.width * 0.26, elev + 1.65, bed.z + bed.length * 0.26],
        targetPosition: [bed.x - bed.width * 0.15, elev + 1.3, bed.z - bed.length * 0.18],
        fov: 68,
      });
    }

    // 7. Bathroom
    const bath = gf.rooms.find(r => r.type === 'bathroom');
    if (bath) {
      const elev = gf.elevation + 0.18;
      stops.push({
        id: 'stop_gf_bath',
        name: bath.name || 'Ensuite Spa Bathroom',
        roomType: 'bathroom',
        description: 'Modern bathroom fitted with floating vanity, LED backlit mirror, toilet, and walk-in glass shower.',
        dimensions: `${(bath.width * 3.281).toFixed(1)} × ${(bath.length * 3.281).toFixed(1)} ft`,
        areaSqFt: bath.areaSqFt,
        floorName: 'Ground Floor',
        cameraPosition: [bath.x, elev + 1.65, bath.z + bath.length * 0.3],
        targetPosition: [bath.x, elev + 1.3, bath.z - bath.length * 0.2],
        fov: 65,
      });
    }
  }

  // 8. Architectural Staircase Core
  stops.push({
    id: 'stop_stairs',
    name: 'Architectural Staircase Core',
    description: 'Solid oak cantilevered steps with steel stringer spine and gold safety handrail connecting levels.',
    floorName: 'Vertical Circulation',
    cameraPosition: [0, 2.2, 0.5],
    targetPosition: [0, 4.2, -1.8],
    fov: 65,
  });

  // Upper Floor(s)
  if (spec.floors.length > 1) {
    const f1 = spec.floors[1];
    const elev = f1.elevation + 0.18;

    // 9. First Floor Lounge or Study
    const lounge = f1.rooms.find(r => r.type === 'living' || r.type === 'study') || f1.rooms[0];
    if (lounge) {
      stops.push({
        id: 'stop_upper_lounge',
        name: lounge.name || 'First Floor Family Lounge',
        roomType: 'living',
        description: 'Upper level entertainment lounge offering privacy and quiet retreat from the main floor.',
        dimensions: `${(lounge.width * 3.281).toFixed(1)} × ${(lounge.length * 3.281).toFixed(1)} ft`,
        areaSqFt: lounge.areaSqFt,
        floorName: 'First Floor',
        cameraPosition: [lounge.x - lounge.width * 0.25, elev + 1.65, lounge.z + lounge.length * 0.25],
        targetPosition: [lounge.x + lounge.width * 0.15, elev + 1.35, lounge.z - lounge.length * 0.15],
        fov: 68,
      });
    }

    // 10. Master Bedroom Suite
    const masterBed = f1.rooms.find(r => r.type === 'master_bedroom' || r.type === 'bedroom');
    if (masterBed) {
      stops.push({
        id: 'stop_master_suite',
        name: masterBed.name || 'Executive Master Suite',
        roomType: 'master_bedroom',
        description: 'Generous master bedroom with designer upholstered headboard, private dressing area, and terrace view.',
        dimensions: `${(masterBed.width * 3.281).toFixed(1)} × ${(masterBed.length * 3.281).toFixed(1)} ft`,
        areaSqFt: masterBed.areaSqFt,
        floorName: 'First Floor',
        cameraPosition: [masterBed.x + masterBed.width * 0.25, elev + 1.65, masterBed.z + masterBed.length * 0.25],
        targetPosition: [masterBed.x - masterBed.width * 0.15, elev + 1.35, masterBed.z - masterBed.length * 0.18],
        fov: 68,
      });
    }

    // 11. Balcony & Skyline
    const balcony = f1.rooms.find(r => r.isBalcony || r.type === 'balcony');
    if (balcony) {
      stops.push({
        id: 'stop_balcony',
        name: balcony.name || 'Cantilever Balcony Deck',
        roomType: 'balcony',
        description: 'Open-air balcony with teak deck planks and tempered glass railings overlooking the landscape.',
        dimensions: `${(balcony.width * 3.281).toFixed(1)} × ${(balcony.length * 3.281).toFixed(1)} ft`,
        areaSqFt: balcony.areaSqFt,
        floorName: 'First Floor',
        cameraPosition: [balcony.x, elev + 1.6, balcony.z - 0.2],
        targetPosition: [balcony.x, elev + 1.5, balcony.z + 8.0],
        fov: 70,
      });
    }
  }

  // 12. Panoramic Isometric Overview
  stops.push({
    id: 'stop_exterior_hero',
    name: 'Panoramic Architectural Overview',
    description: 'High-elevation 3D perspective revealing total massing, roof solar array, and boundary setbacks.',
    floorName: 'Full Building Overview',
    cameraPosition: [18, 14, 18],
    targetPosition: [0, 3.2, 0],
    fov: 42,
  });

  return stops;
}

export const DEFAULT_WALKTHROUGH_STOPS: WalkthroughStop[] = [
  {
    id: 'stop_gate',
    name: '1. Front Gate & Approach',
    description: 'Entering the boundary setback with view of the grand exterior facade.',
    dimensions: '40.0 × 52.0 ft Plot',
    floorName: 'Ground Level',
    cameraPosition: [0, 2.5, 14],
    targetPosition: [0, 2.0, 4],
    fov: 46,
  },
  {
    id: 'stop_entrance',
    name: '2. Grand Portico & Foyer',
    description: 'Arriving at the main teak entrance doorway and covered portico.',
    dimensions: '12.5 × 16.8 ft',
    floorName: 'Ground Floor',
    cameraPosition: [2, 1.8, 8],
    targetPosition: [2, 1.8, 3],
    fov: 62,
  },
  {
    id: 'stop_living',
    name: '3. Grand Living Room',
    description: 'High-ceiling living room with plush lounge seating and entertainment core.',
    dimensions: '14.2 × 18.5 ft',
    areaSqFt: 263,
    floorName: 'Ground Floor',
    cameraPosition: [1.5, 1.65, 4],
    targetPosition: [1.5, 1.45, 0],
    fov: 68,
  },
  {
    id: 'stop_kitchen',
    name: '4. Modular Chef Kitchen',
    description: 'Contemporary granite kitchen island with induction hob, sink, and cabinets.',
    dimensions: '11.0 × 14.5 ft',
    areaSqFt: 160,
    floorName: 'Ground Floor',
    cameraPosition: [2.5, 1.6, 0],
    targetPosition: [-2.0, 1.4, 0],
    fov: 68,
  },
  {
    id: 'stop_dining',
    name: '5. Central Dining Hall',
    description: 'Warm family dining room with solid wood table and designer pendant lights.',
    dimensions: '11.5 × 14.0 ft',
    areaSqFt: 161,
    floorName: 'Ground Floor',
    cameraPosition: [-1.8, 1.65, 0],
    targetPosition: [1.5, 1.4, 0],
    fov: 66,
  },
  {
    id: 'stop_bedroom1',
    name: '6. Ground Floor Bedroom Suite',
    description: 'Well-ventilated guest bedroom with private bathroom access and wardrobe.',
    dimensions: '13.0 × 15.0 ft',
    areaSqFt: 195,
    floorName: 'Ground Floor',
    cameraPosition: [-2.5, 1.65, -4],
    targetPosition: [-2.5, 1.35, -6],
    fov: 68,
  },
  {
    id: 'stop_bathroom',
    name: '7. Ensuite Spa Bathroom',
    description: 'Porcelain tiled bathroom with vanity mirror, toilet, and walk-in shower.',
    dimensions: '8.0 × 10.0 ft',
    areaSqFt: 80,
    floorName: 'Ground Floor',
    cameraPosition: [2.5, 1.65, -4],
    targetPosition: [2.5, 1.35, -6],
    fov: 65,
  },
  {
    id: 'stop_stairs',
    name: '8. Architectural Staircase Core',
    description: 'Floating cantilevered staircase leading up to the private family floor.',
    floorName: 'Stairwell',
    cameraPosition: [0, 2.2, 0.5],
    targetPosition: [0, 4.2, -1.8],
    fov: 65,
  },
  {
    id: 'stop_upper_lounge',
    name: '9. First Floor Family Lounge',
    description: 'Cozy upper-level family entertainment room and reading nook.',
    dimensions: '14.0 × 16.0 ft',
    areaSqFt: 224,
    floorName: 'First Floor',
    cameraPosition: [0, 4.8, 2],
    targetPosition: [0, 4.5, -2],
    fov: 68,
  },
  {
    id: 'stop_master_suite',
    name: '10. Master Bedroom Suite',
    description: 'Expansive master bedroom with direct access to private balcony.',
    dimensions: '15.0 × 17.5 ft',
    areaSqFt: 262,
    floorName: 'First Floor',
    cameraPosition: [-2.5, 4.8, -3],
    targetPosition: [-2.5, 4.5, 3],
    fov: 68,
  },
  {
    id: 'stop_balcony',
    name: '11. Cantilever Balcony & Skyline View',
    description: 'Open-air balcony with tempered glass railings overlooking the streetscape.',
    dimensions: '6.0 × 14.0 ft',
    areaSqFt: 84,
    floorName: 'First Floor',
    cameraPosition: [-2.5, 4.6, 5],
    targetPosition: [0, 4.5, 12],
    fov: 70,
  },
  {
    id: 'stop_exterior_hero',
    name: '12. Panoramic Architectural Overview',
    description: 'Full 3D isometric overview showing all levels, solar roof, and structural geometry.',
    floorName: 'Overview',
    cameraPosition: [18, 14, 18],
    targetPosition: [0, 3, 0],
    fov: 42,
  },
];

export const WALKTHROUGH_STOPS = DEFAULT_WALKTHROUGH_STOPS;

interface WalkthroughControllerProps {
  currentStopIndex: number;
  isWalkthroughActive: boolean;
  controlsRef: React.MutableRefObject<any>;
  spec?: BuildingSpecification;
  onStopChange?: (stop: WalkthroughStop) => void;
  isAutoPlay?: boolean;
  onAdvanceStop?: () => void;
}

export const WalkthroughController: React.FC<WalkthroughControllerProps> = ({
  currentStopIndex,
  isWalkthroughActive,
  controlsRef,
  spec,
  onStopChange,
  isAutoPlay = false,
  onAdvanceStop,
}) => {
  const { camera } = useThree();
  const targetCamPos = useRef(new THREE.Vector3());
  const targetLookAt = useRef(new THREE.Vector3());
  const targetFov = useRef<number>(45);

  const stops = useMemo(() => generateWalkthroughStops(spec), [spec]);

  // Handle current stop updates
  useEffect(() => {
    if (!isWalkthroughActive) return;
    const stop = stops[currentStopIndex] || stops[0];
    if (!stop) return;

    targetCamPos.current.set(...stop.cameraPosition);
    targetLookAt.current.set(...stop.targetPosition);
    targetFov.current = stop.fov || 65;

    if (controlsRef.current) {
      controlsRef.current.target.copy(targetLookAt.current);
    }

    if (onStopChange) {
      onStopChange(stop);
    }
  }, [currentStopIndex, isWalkthroughActive, stops, controlsRef, onStopChange]);

  // Auto-play timer (holding 6 seconds per room)
  useEffect(() => {
    if (!isWalkthroughActive || !isAutoPlay) return;

    const timer = setTimeout(() => {
      if (onAdvanceStop) {
        onAdvanceStop();
      }
    }, 6000);

    return () => clearTimeout(timer);
  }, [currentStopIndex, isWalkthroughActive, isAutoPlay, onAdvanceStop]);

  useFrame((_, delta) => {
    if (!isWalkthroughActive) return;

    // Slow, luxurious, gentle camera gliding
    const lerpSpeed = Math.min(delta * 1.35, 0.045);
    camera.position.lerp(targetCamPos.current, lerpSpeed);

    if ((camera as THREE.PerspectiveCamera).fov !== targetFov.current) {
      const pCam = camera as THREE.PerspectiveCamera;
      pCam.fov = THREE.MathUtils.lerp(pCam.fov, targetFov.current, lerpSpeed);
      pCam.updateProjectionMatrix();
    }

    if (controlsRef.current) {
      controlsRef.current.target.lerp(targetLookAt.current, lerpSpeed);
      controlsRef.current.update();
    }
  });

  return null;
};

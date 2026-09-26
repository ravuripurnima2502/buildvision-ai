import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Sky } from '@react-three/drei';
import * as THREE from 'three';
import {
  VillaMaterials,
  HeroLivingRoom,
  HeroDiningAndKitchen,
  HeroStaircase,
  HeroMasterBedroom,
  HeroBathroom,
  HeroBalcony,
  HeroLandscapingAndPool,
} from './VillaFurnishings';

export type HeroRoomKey = 'exterior' | 'living' | 'kitchen' | 'bedroom' | 'bathroom';
export type HeroFloorKey = 'ALL' | '2F' | '1F' | 'GF';
export type HeroLightingKey = 'sunset' | 'night' | 'day';

interface HeroVillaCanvasProps {
  activeRoom: HeroRoomKey;
  activeFloor: HeroFloorKey;
  lightingMode: HeroLightingKey;
  isAutoRotate: boolean;
  isWalkthroughActive: boolean;
  walkthroughProgress: number; // 0 to 1
  onRoomSelect?: (room: HeroRoomKey) => void;
}

// Camera Waypoints for smooth cinematic transitions
const CAMERA_WAYPOINTS: Record<HeroRoomKey, { pos: [number, number, number]; target: [number, number, number] }> = {
  exterior: { pos: [14.5, 9.2, 16.5], target: [0, 2.2, 1.2] },
  living: { pos: [5.2, 1.8, 6.8], target: [3.2, 1.1, 2.5] },
  kitchen: { pos: [-1.4, 2.0, 5.5], target: [-2.6, 1.3, 1.5] },
  bedroom: { pos: [4.8, 4.6, 5.8], target: [3.0, 3.8, 1.8] },
  bathroom: { pos: [-1.8, 4.5, 4.2], target: [-2.8, 3.8, 0.6] },
};

// Walkthrough Keyframe Path
const WALKTHROUGH_KEYS = [
  { pos: new THREE.Vector3(14.5, 9.2, 16.5), target: new THREE.Vector3(0, 2.2, 1.2), label: 'Villa Exterior' },
  { pos: new THREE.Vector3(0.5, 1.9, 7.5), target: new THREE.Vector3(0, 1.5, 3.0), label: 'Grand Entrance' },
  { pos: new THREE.Vector3(5.2, 1.8, 6.8), target: new THREE.Vector3(3.2, 1.1, 2.5), label: 'Living Room' },
  { pos: new THREE.Vector3(-1.4, 2.0, 5.5), target: new THREE.Vector3(-2.6, 1.3, 1.5), label: 'Kitchen & Dining' },
  { pos: new THREE.Vector3(0.8, 2.4, 2.0), target: new THREE.Vector3(-0.3, 2.2, -1.5), label: 'Architectural Stairs' },
  { pos: new THREE.Vector3(4.8, 4.6, 5.8), target: new THREE.Vector3(3.0, 3.8, 1.8), label: 'Master Suite' },
  { pos: new THREE.Vector3(-1.8, 4.5, 4.2), target: new THREE.Vector3(-2.8, 3.8, 0.6), label: 'Ensuite Bathroom' },
  { pos: new THREE.Vector3(-4.8, 4.8, 7.5), target: new THREE.Vector3(-3.2, 3.8, 4.2), label: 'Cantilever Balcony' },
  { pos: new THREE.Vector3(14.5, 9.2, 16.5), target: new THREE.Vector3(0, 2.2, 1.2), label: 'Villa Overview' },
];

// Smooth Camera Controller
const VillaCameraController: React.FC<{
  activeRoom: HeroRoomKey;
  isWalkthroughActive: boolean;
  walkthroughProgress: number;
  controlsRef: React.MutableRefObject<any>;
}> = ({ activeRoom, isWalkthroughActive, walkthroughProgress, controlsRef }) => {
  const { camera } = useThree();
  const currentPos = useRef(new THREE.Vector3(14.5, 9.2, 16.5));
  const currentTarget = useRef(new THREE.Vector3(0, 2.2, 1.2));
  const destPos = useRef(new THREE.Vector3());
  const destTarget = useRef(new THREE.Vector3());

  useFrame((_, delta) => {
    if (isWalkthroughActive) {
      // Calculate interpolated point along multi-stop walkthrough path
      const totalStops = WALKTHROUGH_KEYS.length - 1;
      const progressScaled = Math.min(Math.max(walkthroughProgress, 0), 1) * totalStops;
      const index = Math.min(Math.floor(progressScaled), totalStops - 1);
      const subAlpha = progressScaled - index;

      const p0 = WALKTHROUGH_KEYS[index].pos;
      const p1 = WALKTHROUGH_KEYS[index + 1].pos;
      const t0 = WALKTHROUGH_KEYS[index].target;
      const t1 = WALKTHROUGH_KEYS[index + 1].target;

      destPos.current.lerpVectors(p0, p1, subAlpha);
      destTarget.current.lerpVectors(t0, t1, subAlpha);

      const lerpFactor = Math.min(delta * 4.0, 0.15);
      camera.position.lerp(destPos.current, lerpFactor);
      if (controlsRef.current) {
        controlsRef.current.target.lerp(destTarget.current, lerpFactor);
        controlsRef.current.update();
      }
    } else {
      // Room Focus Waypoint
      const wp = CAMERA_WAYPOINTS[activeRoom] || CAMERA_WAYPOINTS.exterior;
      destPos.current.set(...wp.pos);
      destTarget.current.set(...wp.target);

      const lerpFactor = Math.min(delta * 3.5, 0.12);
      camera.position.lerp(destPos.current, lerpFactor);
      if (controlsRef.current) {
        controlsRef.current.target.lerp(destTarget.current, lerpFactor);
        controlsRef.current.update();
      }
    }
  });

  return null;
};

// Two-Storey Modern Cutaway Villa Model Component
const ModernVillaModel: React.FC<{
  activeRoom: HeroRoomKey;
  activeFloor: HeroFloorKey;
}> = ({ activeRoom, activeFloor }) => {
  const f1GroupRef = useRef<THREE.Group>(null);
  const roofGroupRef = useRef<THREE.Group>(null);

  // Animate floor separation / cutaway explosion
  useFrame((_, delta) => {
    let targetF1Elevation = 0;
    let targetRoofElevation = 0;

    if (activeFloor === 'GF') {
      // Elevate upper floor to create dramatic architectural sectional cutaway into Ground Floor
      targetF1Elevation = 3.8;
      targetRoofElevation = 7.6;
    } else if (activeFloor === '1F' || activeFloor === '2F') {
      // Elevate roof slightly to expose upper rooms
      targetF1Elevation = 0;
      targetRoofElevation = 3.6;
    } else {
      targetF1Elevation = 0;
      targetRoofElevation = 0;
    }

    if (f1GroupRef.current) {
      f1GroupRef.current.position.y = THREE.MathUtils.lerp(
        f1GroupRef.current.position.y,
        targetF1Elevation,
        Math.min(delta * 4.0, 0.15)
      );
    }
    if (roofGroupRef.current) {
      roofGroupRef.current.position.y = THREE.MathUtils.lerp(
        roofGroupRef.current.position.y,
        targetRoofElevation,
        Math.min(delta * 4.0, 0.15)
      );
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* ================================================= */}
      {/* 1. GROUND FLOOR STRUCTURE & CUTAWAY ROOMS        */}
      {/* ================================================= */}
      <group name="ground-floor-level">
        {/* Ground Floor Base Structural Concrete Slab */}
        <mesh position={[0, 0.05, 0]} receiveShadow>
          <boxGeometry args={[14.2, 0.14, 13.5]} />
          <meshStandardMaterial color="#0B1321" roughness={0.8} />
        </mesh>
        {/* Architectural Gold Ground Trim Profile */}
        <mesh position={[0, 0.05, 0]}>
          <boxGeometry args={[14.3, 0.06, 13.6]} />
          <meshStandardMaterial color={VillaMaterials.slabBorder} metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Structural Load-Bearing Columns */}
        {[
          [-6.8, -6.4], [-6.8, 0], [-6.8, 6.4],
          [6.8, -6.4], [6.8, 0], [6.8, 6.4],
          [0.2, -6.4], [0.2, 6.4]
        ].map(([cx, cz], i) => (
          <mesh key={`col-gf-${i}`} position={[cx, 1.6, cz]} castShadow receiveShadow>
            <boxGeometry args={[0.35, 3.1, 0.35]} />
            <meshStandardMaterial color="#1E293B" roughness={0.7} />
          </mesh>
        ))}

        {/* Exterior Back Wall & Solid Perimeter (North & West) */}
        <mesh position={[0, 1.6, -6.5]} castShadow receiveShadow>
          <boxGeometry args={[14.0, 3.1, 0.22]} />
          <meshStandardMaterial color={VillaMaterials.facadeDark} roughness={0.7} />
        </mesh>
        <mesh position={[-6.8, 1.6, -1.0]} castShadow receiveShadow>
          <boxGeometry args={[0.22, 3.1, 11.0]} />
          <meshStandardMaterial color={VillaMaterials.facadeDark} roughness={0.7} />
        </mesh>

        {/* Warm Cedar Timber Accent Panels on Side */}
        <mesh position={[6.8, 1.6, -2.5]}>
          <boxGeometry args={[0.24, 3.1, 6.0]} />
          <meshStandardMaterial color={VillaMaterials.facadeWood} roughness={0.6} />
        </mesh>

        {/* Panoramic Cutaway Glass Facade (Living Room South Glass) */}
        <mesh position={[3.2, 1.6, 5.8]}>
          <boxGeometry args={[5.8, 3.0, 0.04]} />
          <meshPhysicalMaterial
            color={VillaMaterials.glass}
            transmission={0.92}
            roughness={0.06}
            transparent
            opacity={0.35}
            ior={1.5}
          />
        </mesh>
        {/* Minimalist Dark Anodized Aluminum Mullions */}
        <mesh position={[3.2, 1.6, 5.82]}>
          <boxGeometry args={[5.8, 3.0, 0.06]} />
          <meshStandardMaterial color="#020617" wireframe />
        </mesh>

        {/* Ground Floor Furnished Rooms */}
        <HeroLivingRoom isHighlighted={activeRoom === 'living'} />
        <HeroDiningAndKitchen isHighlighted={activeRoom === 'kitchen'} />
        <HeroStaircase />
      </group>

      {/* ================================================= */}
      {/* 2. INTERMEDIATE CANTILEVER SLAB                   */}
      {/* ================================================= */}
      <group ref={f1GroupRef} name="first-floor-level">
        {/* Intermediate Structural Floor Slab */}
        <mesh position={[0, 3.18, 0]} receiveShadow castShadow>
          <boxGeometry args={[14.6, 0.18, 14.0]} />
          <meshStandardMaterial color="#0B1321" roughness={0.8} />
        </mesh>
        {/* Luxury Gold Fascia Edge Profile */}
        <mesh position={[0, 3.18, 0]}>
          <boxGeometry args={[14.7, 0.08, 14.1]} />
          <meshStandardMaterial color={VillaMaterials.slabBorder} metalness={0.9} roughness={0.2} />
        </mesh>

        {/* First Floor Columns */}
        {[
          [-6.8, -6.4], [-6.8, 0],
          [6.8, -6.4], [6.8, 0], [6.8, 5.4],
          [0.2, -6.4]
        ].map(([cx, cz], i) => (
          <mesh key={`col-f1-${i}`} position={[cx, 4.75, cz]} castShadow receiveShadow>
            <boxGeometry args={[0.32, 3.0, 0.32]} />
            <meshStandardMaterial color="#1E293B" roughness={0.7} />
          </mesh>
        ))}

        {/* Upper Master Bedroom Cantilevered Volume (East Box) */}
        <mesh position={[3.0, 4.75, -0.5]} castShadow receiveShadow>
          <boxGeometry args={[6.2, 3.0, 7.8]} />
          <meshStandardMaterial color={VillaMaterials.facadeDark} roughness={0.6} />
        </mesh>

        {/* Master Suite Panoramic Floor-to-Ceiling Glass Window */}
        <mesh position={[3.0, 4.75, 4.8]}>
          <boxGeometry args={[5.6, 2.6, 0.04]} />
          <meshPhysicalMaterial
            color={VillaMaterials.glass}
            transmission={0.92}
            roughness={0.06}
            transparent
            opacity={0.35}
            ior={1.5}
          />
        </mesh>
        <mesh position={[3.0, 4.75, 4.82]}>
          <boxGeometry args={[5.6, 2.6, 0.06]} />
          <meshStandardMaterial color="#020617" wireframe />
        </mesh>

        {/* First Floor Furnished Rooms */}
        <HeroMasterBedroom isHighlighted={activeRoom === 'bedroom'} />
        <HeroBathroom isHighlighted={activeRoom === 'bathroom'} />
        <HeroBalcony isHighlighted={false} />
      </group>

      {/* ================================================= */}
      {/* 3. ROOF SLAB & ARCHITECTURAL PERGOLA LOUVERS      */}
      {/* ================================================= */}
      <group ref={roofGroupRef} name="roof-level">
        {/* Cantilevered Modern Flat Roof Slab */}
        <mesh position={[0, 6.36, 0]} castShadow receiveShadow>
          <boxGeometry args={[15.0, 0.2, 14.4]} />
          <meshStandardMaterial color="#0B1321" roughness={0.7} />
        </mesh>
        {/* Golden Roof Border Profile */}
        <mesh position={[0, 6.36, 0]}>
          <boxGeometry args={[15.1, 0.08, 14.5]} />
          <meshStandardMaterial color={VillaMaterials.slabBorder} metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Architectural Pergola Timber & Gold Louver Blades */}
        {[-4.2, -2.8, -1.4, 0, 1.4, 2.8, 4.2].map((lx, i) => (
          <mesh key={`louver-${i}`} position={[lx, 6.75, 3.2]} castShadow>
            <boxGeometry args={[0.08, 0.28, 6.5]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.85} roughness={0.25} />
          </mesh>
        ))}

        {/* Rooftop Solar PV Panels Representation */}
        <group position={[0, 6.5, -3.2]}>
          {[-2.5, 0, 2.5].map((sx, i) => (
            <mesh key={`solar-${i}`} position={[sx, 0.05, 0]} rotation={[-0.15, 0, 0]}>
              <boxGeometry args={[2.2, 0.04, 3.2]} />
              <meshStandardMaterial color="#0369A1" metalness={0.9} roughness={0.1} />
            </mesh>
          ))}
        </group>
      </group>

      {/* ================================================= */}
      {/* 4. BASE LANDSCAPING, POOL & CARPORT               */}
      {/* ================================================= */}
      <HeroLandscapingAndPool />

      {/* Ground Contact Shadow */}
      <ContactShadows
        position={[0, -0.12, 0]}
        opacity={0.8}
        scale={30}
        blur={2.5}
        far={10}
        resolution={1024}
        color="#000000"
      />
    </group>
  );
};

export const HeroVillaCanvas: React.FC<HeroVillaCanvasProps> = ({
  activeRoom,
  activeFloor,
  lightingMode,
  isAutoRotate,
  isWalkthroughActive,
  walkthroughProgress,
  onRoomSelect,
}) => {
  const controlsRef = useRef<any>(null);

  // Lighting parameters
  const isNight = lightingMode === 'night';
  const isSunset = lightingMode === 'sunset';

  const bgColor = isNight ? '#030712' : isSunset ? '#090E18' : '#080C14';
  const ambientColor = isNight ? '#1E293B' : isSunset ? '#FED7AA' : '#FFF8E7';
  const ambientIntensity = isNight ? 0.4 : isSunset ? 0.75 : 0.85;

  const sunPos: [number, number, number] = isNight
    ? [-20, 25, -20]
    : isSunset
    ? [28, 11, 22] // Warm low-angle golden twilight sun
    : [20, 30, 20];

  const sunColor = isNight ? '#93C5FD' : isSunset ? '#F97316' : '#FFF8E7';
  const sunIntensity = isNight ? 0.4 : isSunset ? 1.9 : 1.5;

  return (
    <div className="w-full h-full relative select-none">
      <Canvas
        camera={{ position: [14.5, 9.2, 16.5], fov: 42 }}
        shadows
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={[bgColor]} />

        {/* Ambient & Studio Directional Lighting */}
        <ambientLight intensity={ambientIntensity} color={ambientColor} />
        <directionalLight
          position={sunPos}
          intensity={sunIntensity}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-left={-16}
          shadow-camera-right={16}
          shadow-camera-top={16}
          shadow-camera-bottom={-16}
          shadow-camera-near={0.5}
          shadow-camera-far={60}
          shadow-bias={-0.0001}
          color={sunColor}
        />
        {/* Soft Cool Architectural Fill Light */}
        <directionalLight
          position={[-15, 18, -15]}
          intensity={isSunset ? 0.6 : 0.4}
          color={isSunset ? '#38BDF8' : '#60A5FA'}
        />

        {/* Dynamic Architectural Sky */}
        <Sky
          distance={450000}
          sunPosition={sunPos}
          inclination={isSunset ? 0.12 : 0.6}
          azimuth={0.25}
          mieCoefficient={isSunset ? 0.025 : 0.005}
          mieDirectionalG={0.8}
          rayleigh={isSunset ? 3.0 : 0.5}
          turbidity={isSunset ? 12 : 8}
        />

        {/* The Two-Storey Cutaway Modern Villa */}
        <ModernVillaModel activeRoom={activeRoom} activeFloor={activeFloor} />

        {/* Camera Transition & Walkthrough Handler */}
        <VillaCameraController
          activeRoom={activeRoom}
          isWalkthroughActive={isWalkthroughActive}
          walkthroughProgress={walkthroughProgress}
          controlsRef={controlsRef}
        />

        {/* Interactive OrbitControls */}
        <OrbitControls
          ref={controlsRef}
          enabled={!isWalkthroughActive}
          enableDamping
          dampingFactor={0.06}
          maxPolarAngle={Math.PI / 2.05} // Prevent camera from going beneath ground
          minDistance={2.5}
          maxDistance={40}
          autoRotate={isAutoRotate && !isWalkthroughActive}
          autoRotateSpeed={0.9}
        />
      </Canvas>
    </div>
  );
};

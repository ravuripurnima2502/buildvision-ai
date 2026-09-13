import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Grid, ContactShadows, Sky } from '@react-three/drei';
import * as THREE from 'three';
import { BuildingSpecification, Room } from '../../types/building';
import { BuildingModel } from './BuildingModel';
import { WalkthroughController, WalkthroughStop, generateWalkthroughStops } from './WalkthroughController';
import { RoomHUDLabel } from './RoomHUDLabel';
import { useTheme } from '../theme/ThemeContext';
import { Sparkles } from 'lucide-react';

interface BuildingCanvasProps {
  spec: BuildingSpecification;
  activeFloorNumber?: number | 'all';
  cutawayMode?: boolean;
  showRoof?: boolean;
  selectedRoomId?: string | null;
  onSelectRoom?: (room: Room) => void;
  // Walkthrough
  isWalkthroughActive?: boolean;
  walkthroughStopIndex?: number;
  onAdvanceWalkthrough?: () => void;
  // Comparison
  comparisonSpec?: BuildingSpecification | null;
  compareMode?: 'none' | 'ghost' | 'side_by_side';
  autoRotate?: boolean;
  lightingMode?: 'day' | 'sunset' | 'night';
}

// Internal Camera Lerper for Room Focus
const RoomFocusController: React.FC<{
  selectedRoom: Room | null;
  spec: BuildingSpecification;
  isWalkthroughActive: boolean;
  controlsRef: React.MutableRefObject<any>;
}> = ({ selectedRoom, spec, isWalkthroughActive, controlsRef }) => {
  const { camera } = useThree();
  const targetCamPos = useRef(new THREE.Vector3());
  const targetLookAt = useRef(new THREE.Vector3());
  const isTransitioning = useRef(false);

  useEffect(() => {
    if (isWalkthroughActive) {
      isTransitioning.current = false;
      return;
    }

    if (selectedRoom) {
      // Find room floor
      const floor = spec.floors.find(f => f.floorNumber === selectedRoom.floorNumber) || spec.floors[0];
      const floorElev = floor ? floor.elevation + 0.18 : 0.18;

      // Position camera at human eye height (1.65m) looking across the room
      targetLookAt.current.set(selectedRoom.x, floorElev + 1.35, selectedRoom.z);
      targetCamPos.current.set(
        selectedRoom.x - selectedRoom.width * 0.35,
        floorElev + 1.65,
        selectedRoom.z + selectedRoom.length * 0.35
      );
      isTransitioning.current = true;

      // Update OrbitControls target
      if (controlsRef.current) {
        controlsRef.current.target.copy(targetLookAt.current);
      }
    } else {
      // Return to overall view
      targetCamPos.current.set(16, 14, 16);
      targetLookAt.current.set(0, 2.5, 0);
      isTransitioning.current = true;

      if (controlsRef.current) {
        controlsRef.current.target.copy(targetLookAt.current);
      }
    }
  }, [selectedRoom, spec, isWalkthroughActive, controlsRef]);

  useFrame((_, delta) => {
    if (isWalkthroughActive || !isTransitioning.current) return;

    const lerpSpeed = Math.min(delta * 2.2, 0.08);
    camera.position.lerp(targetCamPos.current, lerpSpeed);

    if (controlsRef.current) {
      controlsRef.current.target.lerp(targetLookAt.current, lerpSpeed);
      controlsRef.current.update();
    }

    if (camera.position.distanceTo(targetCamPos.current) < 0.1) {
      isTransitioning.current = false;
    }
  });

  return null;
};

export const BuildingCanvas: React.FC<BuildingCanvasProps> = ({
  spec,
  activeFloorNumber = 'all',
  cutawayMode = false,
  showRoof = true,
  selectedRoomId = null,
  onSelectRoom,
  isWalkthroughActive = false,
  walkthroughStopIndex = 0,
  onAdvanceWalkthrough,
  comparisonSpec = null,
  compareMode = 'none',
  autoRotate = false,
  lightingMode = 'day',
}) => {
  const controlsRef = useRef<any>(null);
  const { theme } = useTheme();

  // Active Walkthrough Stop HUD State
  const [currentWalkthroughStop, setCurrentWalkthroughStop] = useState<WalkthroughStop | null>(null);

  const plotW = spec.plotDimensions.width;
  const plotL = spec.plotDimensions.length;

  // Selected Room Object
  const selectedRoom = selectedRoomId
    ? spec.floors.flatMap(f => f.rooms).find(r => r.id === selectedRoomId) || null
    : null;

  // Smart Roof Visibility: auto-hide roof when inspecting a room or inside room during tour
  const isInsideRoom = isWalkthroughActive
    ? !currentWalkthroughStop?.id.includes('exterior')
    : !!selectedRoom;
  const effectiveShowRoof = isInsideRoom ? false : showRoof;

  // Architectural Lighting Configurations
  const isNight = lightingMode === 'night';
  const isSunset = lightingMode === 'sunset';

  let defaultBg = '#080C14';
  let gridCell = '#1E293B';
  let gridSection = '#D4AF37';

  if (theme === 'white') {
    defaultBg = '#E2E8F0';
    gridCell = '#CBD5E1';
    gridSection = '#B89228';
  } else if (theme === 'blueprint') {
    defaultBg = '#06101E';
    gridCell = '#0D254C';
    gridSection = '#38BDF8';
  } else if (theme === 'gradient') {
    defaultBg = '#0A0617';
    gridCell = '#1F113D';
    gridSection = '#C084FC';
  } else if (theme === 'sandstone') {
    defaultBg = '#120E0A';
    gridCell = '#2A1F16';
    gridSection = '#D97706';
  }

  const bgColor = isNight ? '#030712' : isSunset ? '#160B18' : defaultBg;
  const ambientColor = isNight ? '#1E293B' : isSunset ? '#FED7AA' : theme === 'white' ? '#FFFFFF' : '#FAF5E4';
  const ambientIntensity = isNight ? 0.35 : isSunset ? 0.65 : theme === 'white' ? 0.9 : 0.75;
  const sunColor = isNight ? '#93C5FD' : isSunset ? '#F97316' : '#FFF8E7';
  const sunIntensity = isNight ? 0.5 : isSunset ? 1.8 : 1.4;
  const sunPos: [number, number, number] = isNight
    ? [-20, 25, -20]
    : isSunset
    ? [35, 12, 18]
    : [25, 35, 20];

  return (
    <div className="w-full h-full relative bg-theme-base select-none">
      {/* Floating Room HUD Badge */}
      <RoomHUDLabel
        isVisible={isWalkthroughActive || !!selectedRoom}
        roomName={
          isWalkthroughActive
            ? currentWalkthroughStop?.name || 'Walkthrough'
            : selectedRoom?.name || ''
        }
        dimensions={
          isWalkthroughActive
            ? currentWalkthroughStop?.dimensions
            : selectedRoom
            ? `${(selectedRoom.width * 3.281).toFixed(1)} × ${(selectedRoom.length * 3.281).toFixed(1)} ft`
            : undefined
        }
        areaSqFt={
          isWalkthroughActive
            ? currentWalkthroughStop?.areaSqFt
            : selectedRoom?.areaSqFt
        }
        floorName={
          isWalkthroughActive
            ? currentWalkthroughStop?.floorName
            : selectedRoom
            ? selectedRoom.floorNumber === 0 ? 'Ground Floor' : `Floor ${selectedRoom.floorNumber}`
            : undefined
        }
        description={
          isWalkthroughActive
            ? currentWalkthroughStop?.description
            : selectedRoom
            ? 'Interactive Room Inspection — Use mouse or gestures to orbit and inspect finishes.'
            : undefined
        }
      />

      <Canvas
        camera={{ position: [16, 14, 16], fov: 45 }}
        shadows
        gl={{ antialias: true, alpha: false }}
      >
        <color attach="background" args={[bgColor]} />

        {/* Ambient & Architectural Studio Lighting */}
        <ambientLight intensity={ambientIntensity} color={ambientColor} />
        <directionalLight
          position={sunPos}
          intensity={sunIntensity}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-left={-20}
          shadow-camera-right={20}
          shadow-camera-top={20}
          shadow-camera-bottom={-20}
          shadow-camera-near={0.5}
          shadow-camera-far={80}
          shadow-bias={-0.0001}
          color={sunColor}
        />
        {/* Fill Light */}
        <directionalLight
          position={[-15, 20, -20]}
          intensity={isNight ? 0.2 : isSunset ? 0.5 : 0.4}
          color={isSunset ? '#E879F9' : '#38BDF8'}
        />
        <hemisphereLight
          groundColor="#0F172A"
          color={isSunset ? '#F59E0B' : '#D4AF37'}
          intensity={isNight ? 0.15 : 0.3}
        />

        {/* Architectural Night Lights */}
        {isNight && (
          <>
            <pointLight position={[0, 2, 0]} intensity={3.5} distance={16} color="#FBBF24" />
            <pointLight position={[0, 5.5, 0]} intensity={3.0} distance={16} color="#F59E0B" />
          </>
        )}

        {/* Warm Interior Room Spotlights for Visual Clarity */}
        <group name="interior-lights">
          {spec.floors.map((floor) => (
            floor.rooms.map((room) => (
              <pointLight
                key={`int-light-${room.id}`}
                position={[room.x, floor.elevation + 2.2, room.z]}
                intensity={isNight ? 2.5 : isSunset ? 1.6 : 0.75}
                distance={7}
                decay={2}
                color="#FFF8E7"
              />
            ))
          ))}
        </group>

        <Suspense fallback={null}>
          {/* Subtle architectural sky environment */}
          <Sky
            distance={450000}
            sunPosition={sunPos}
            inclination={isSunset ? 0.1 : 0.6}
            azimuth={0.25}
            mieCoefficient={isSunset ? 0.02 : 0.005}
            mieDirectionalG={0.8}
            rayleigh={isSunset ? 2.5 : 0.5}
            turbidity={isSunset ? 12 : 10}
          />

          {/* Plot Boundary Grid & Setback Marks */}
          <group position={[0, -0.02, 0]}>
            <Grid
              renderOrder={-1}
              position={[0, 0, 0]}
              args={[60, 60]}
              cellSize={1}
              cellThickness={0.5}
              cellColor={gridCell}
              sectionSize={5}
              sectionThickness={1.2}
              sectionColor={gridSection}
              fadeDistance={45}
              fadeStrength={1.5}
            />

            {/* Plot Setback Boundary (Gold Border Line) */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
              <planeGeometry args={[plotW, plotL]} />
              <meshBasicMaterial color="#D4AF37" wireframe transparent opacity={0.4} />
            </mesh>
          </group>

          {/* Contact Ground Shadows */}
          <ContactShadows
            position={[0, -0.01, 0]}
            opacity={0.65}
            scale={40}
            blur={2.0}
            far={10}
            resolution={1024}
            color="#020617"
          />

          {/* Main Proposed Building */}
          {compareMode === 'side_by_side' && comparisonSpec ? (
            <group position={[plotW * 0.65, 0, 0]}>
              <BuildingModel
                spec={spec}
                activeFloorNumber={activeFloorNumber}
                cutawayMode={cutawayMode}
                showRoof={effectiveShowRoof}
                selectedRoomId={selectedRoomId}
                onSelectRoom={onSelectRoom}
              />
            </group>
          ) : (
            <BuildingModel
              spec={spec}
              activeFloorNumber={activeFloorNumber}
              cutawayMode={cutawayMode}
              showRoof={effectiveShowRoof}
              selectedRoomId={selectedRoomId}
              onSelectRoom={onSelectRoom}
            />
          )}

          {/* Ghosted or Side-by-Side Comparison Model */}
          {comparisonSpec && compareMode === 'ghost' && (
            <BuildingModel
              spec={comparisonSpec}
              activeFloorNumber={activeFloorNumber}
              cutawayMode={cutawayMode}
              showRoof={effectiveShowRoof}
              ghostMode={true}
            />
          )}

          {comparisonSpec && compareMode === 'side_by_side' && (
            <group position={[-plotW * 0.65, 0, 0]}>
              <BuildingModel
                spec={comparisonSpec}
                activeFloorNumber={activeFloorNumber}
                cutawayMode={cutawayMode}
                showRoof={effectiveShowRoof}
                ghostMode={false}
              />
            </group>
          )}

          {/* Walkthrough Animated Camera Controller */}
          <WalkthroughController
            currentStopIndex={walkthroughStopIndex}
            isWalkthroughActive={isWalkthroughActive}
            controlsRef={controlsRef}
            spec={spec}
            onStopChange={setCurrentWalkthroughStop}
            onAdvanceStop={onAdvanceWalkthrough}
          />

          {/* Interactive Room Focus Controller */}
          <RoomFocusController
            selectedRoom={selectedRoom}
            spec={spec}
            isWalkthroughActive={isWalkthroughActive}
            controlsRef={controlsRef}
          />

          {/* Orbit Controls */}
          <OrbitControls
            ref={controlsRef}
            enabled={!isWalkthroughActive}
            enableDamping
            dampingFactor={0.06}
            maxPolarAngle={Math.PI / 2.05} // Do not clip under ground
            minDistance={1.5}
            maxDistance={55}
            autoRotate={autoRotate}
            autoRotateSpeed={0.8}
            target={[0, 2.5, 0]}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

import React from 'react';
import * as THREE from 'three';

// Realistic material palettes for luxury architectural rendering
export const VillaMaterials = {
  facadeDark: '#131A26', // Charcoal architectural paneling
  facadeWood: '#8C552E', // Warm cedar architectural slats
  concrete: '#273142',   // Refined architectural concrete
  slabBorder: '#D4AF37', // Brushed architectural gold fascia
  marbleFloor: '#E9EEF5',// Carrara white marble
  oakFloor: '#9A6335',   // Warm European oak planks
  tileFloor: '#CBD5E1',  // Polished stone tile
  glass: '#38BDF8',      // Clear architectural glazing
  glassBalustrade: '#67E8F9',
  goldAccent: '#F59E0B',
  interiorLight: '#FFF5E0',
  cushionWarm: '#E2E8F0', // Soft off-white fabric
  cushionDark: '#334155',
  poolWater: '#0284C7',
  poolGlow: '#38BDF8',
  grass: '#14422D',
  plantGreen: '#166534',
};

// ==========================================
// 1. GROUND FLOOR: LIVING ROOM FURNISHINGS
// ==========================================
export const HeroLivingRoom: React.FC<{ isHighlighted?: boolean }> = ({ isHighlighted }) => {
  return (
    <group position={[3.2, 0.12, 2.8]}>
      {/* Carrara Marble Finished Floor Slab */}
      <mesh position={[0, 0.02, 0]} receiveShadow>
        <boxGeometry args={[5.8, 0.04, 6.2]} />
        <meshStandardMaterial
          color={isHighlighted ? '#FBBF24' : VillaMaterials.marbleFloor}
          roughness={0.2}
          metalness={0.15}
        />
      </mesh>

      {/* Luxury Designer Area Rug */}
      <mesh position={[0, 0.05, 0.2]}>
        <boxGeometry args={[4.2, 0.02, 3.8]} />
        <meshStandardMaterial color="#475569" roughness={0.9} />
      </mesh>

      {/* L-Shaped Sectional Contemporary Sofa */}
      <group position={[0.2, 0.06, 0.5]}>
        {/* Main Sofa Base */}
        <mesh position={[0, 0.22, 0.9]} castShadow>
          <boxGeometry args={[3.2, 0.44, 1.1]} />
          <meshStandardMaterial color={VillaMaterials.cushionWarm} roughness={0.8} />
        </mesh>
        {/* Sofa Backrest */}
        <mesh position={[0, 0.52, 1.35]} castShadow>
          <boxGeometry args={[3.2, 0.45, 0.25]} />
          <meshStandardMaterial color={VillaMaterials.cushionWarm} roughness={0.8} />
        </mesh>
        {/* Chaise Extension (L-Section) */}
        <mesh position={[-1.15, 0.22, -0.1]} castShadow>
          <boxGeometry args={[0.9, 0.44, 1.8]} />
          <meshStandardMaterial color={VillaMaterials.cushionWarm} roughness={0.8} />
        </mesh>
        {/* Scatter Accent Cushions */}
        <mesh position={[0.8, 0.48, 1.15]}>
          <boxGeometry args={[0.45, 0.35, 0.15]} />
          <meshStandardMaterial color="#D4AF37" roughness={0.6} />
        </mesh>
        <mesh position={[-0.4, 0.48, 1.15]}>
          <boxGeometry args={[0.45, 0.35, 0.15]} />
          <meshStandardMaterial color="#0284C7" roughness={0.6} />
        </mesh>
      </group>

      {/* Round Marble & Brass Coffee Table Set */}
      <group position={[0.2, 0.06, 0.1]}>
        <mesh position={[0, 0.2, 0]} castShadow>
          <cylinderGeometry args={[0.65, 0.65, 0.06, 24]} />
          <meshStandardMaterial color="#0F172A" roughness={0.3} metalness={0.4} />
        </mesh>
        <mesh position={[0, 0.1, 0]}>
          <cylinderGeometry args={[0.55, 0.55, 0.2, 24]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Art Book & Decorative Ceramic Bowl on table */}
        <mesh position={[0.1, 0.24, 0.1]}>
          <boxGeometry args={[0.28, 0.03, 0.2]} />
          <meshStandardMaterial color="#FAF5E4" />
        </mesh>
      </group>

      {/* Floating Low Wood Media Console with Backlit Feature Wall */}
      <group position={[0, 0.06, -2.6]}>
        <mesh position={[0, 0.25, 0]} castShadow>
          <boxGeometry args={[3.8, 0.45, 0.45]} />
          <meshStandardMaterial color="#1E293B" roughness={0.4} />
        </mesh>
        {/* Brass Inset Trim */}
        <mesh position={[0, 0.25, 0.23]}>
          <boxGeometry args={[3.82, 0.04, 0.02]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Large Format OLED Screen */}
        <mesh position={[0, 1.25, -0.05]}>
          <boxGeometry args={[2.6, 1.45, 0.04]} />
          <meshStandardMaterial color="#020617" roughness={0.1} metalness={0.9} />
        </mesh>
        {/* Ambient Backlight behind TV */}
        <pointLight position={[0, 1.25, 0.1]} intensity={0.8} distance={2.5} color="#38BDF8" />
      </group>

      {/* Contemporary Curved Arc Floor Lamp */}
      <group position={[2.2, 0.06, 1.8]}>
        <mesh position={[0, 0.04, 0]}>
          <cylinderGeometry args={[0.25, 0.25, 0.05, 16]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0, 1.1, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 2.1, 12]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[-0.4, 2.1, -0.2]}>
          <sphereGeometry args={[0.18, 16, 16]} />
          <meshStandardMaterial color="#FFF8E7" emissive="#FFF8E7" emissiveIntensity={0.6} />
        </mesh>
      </group>

      {/* Warm Ambient Ceiling Spotlights */}
      <pointLight position={[0, 2.6, 0]} intensity={1.8} distance={6} decay={2} color="#FFF5E0" />
    </group>
  );
};

// ==========================================
// 2. GROUND FLOOR: DINING AREA & KITCHEN
// ==========================================
export const HeroDiningAndKitchen: React.FC<{ isHighlighted?: boolean }> = ({ isHighlighted }) => {
  return (
    <group position={[-2.8, 0.12, 1.5]}>
      {/* Polished Granite / Marble Kitchen Flooring */}
      <mesh position={[0, 0.02, 0]} receiveShadow>
        <boxGeometry args={[5.2, 0.04, 7.8]} />
        <meshStandardMaterial
          color={isHighlighted ? '#FBBF24' : '#1E293B'}
          roughness={0.25}
          metalness={0.3}
        />
      </mesh>

      {/* Modern Waterfall Island Counter */}
      <group position={[0.2, 0.06, 0.8]}>
        {/* Waterfall Island Body */}
        <mesh position={[0, 0.52, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.2, 0.95, 1.2]} />
          <meshStandardMaterial color="#0F172A" roughness={0.3} />
        </mesh>
        {/* White Calacatta Marble Countertop */}
        <mesh position={[0, 1.02, 0]}>
          <boxGeometry args={[3.3, 0.08, 1.25]} />
          <meshStandardMaterial color="#F8FAFC" roughness={0.15} metalness={0.1} />
        </mesh>
        {/* Under-counter Gold Accent Strip */}
        <mesh position={[0, 0.97, 0.62]}>
          <boxGeometry args={[3.25, 0.03, 0.02]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* 3 High-End Minimalist Barstools */}
        {[-0.9, 0, 0.9].map((bx, i) => (
          <group key={`stool-${i}`} position={[bx, 0, 0.95]}>
            {/* Stool Legs */}
            <mesh position={[0, 0.35, 0]}>
              <cylinderGeometry args={[0.015, 0.02, 0.7, 8]} />
              <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.2} />
            </mesh>
            {/* Stool Padded Seat */}
            <mesh position={[0, 0.72, 0]} castShadow>
              <cylinderGeometry args={[0.22, 0.22, 0.06, 16]} />
              <meshStandardMaterial color="#334155" roughness={0.7} />
            </mesh>
          </group>
        ))}

        {/* 3 Modern Linear Glass & Brass Pendants */}
        {[-0.9, 0, 0.9].map((px, i) => (
          <group key={`pend-${i}`} position={[px, 2.5, 0]}>
            <mesh position={[0, -0.4, 0]}>
              <cylinderGeometry args={[0.005, 0.005, 0.8, 8]} />
              <meshStandardMaterial color="#D4AF37" metalness={0.9} />
            </mesh>
            <mesh position={[0, -0.85, 0]}>
              <cylinderGeometry args={[0.1, 0.1, 0.25, 16]} />
              <meshPhysicalMaterial color="#38BDF8" transmission={0.9} transparent roughness={0.1} />
            </mesh>
            <mesh position={[0, -0.85, 0]}>
              <sphereGeometry args={[0.05, 12, 12]} />
              <meshBasicMaterial color="#FFF8E7" />
            </mesh>
          </group>
        ))}
      </group>

      {/* Back Kitchen Cabinet Wall & Integrated Appliances */}
      <group position={[0.2, 0.06, -2.6]}>
        <mesh position={[0, 1.4, 0]} castShadow>
          <boxGeometry args={[4.4, 2.7, 0.6]} />
          <meshStandardMaterial color="#0F172A" roughness={0.5} />
        </mesh>
        {/* Recessed Cooking Counter with Oven / Hood */}
        <mesh position={[0, 0.95, 0.35]}>
          <boxGeometry args={[2.4, 0.06, 0.65]} />
          <meshStandardMaterial color="#334155" roughness={0.2} metalness={0.7} />
        </mesh>
        {/* Warm Under-cabinet LED Strip */}
        <mesh position={[0, 1.8, 0.32]}>
          <boxGeometry args={[4.0, 0.02, 0.04]} />
          <meshBasicMaterial color="#FEF08A" />
        </mesh>
      </group>

      {/* 6-Seat Dining Table Suite */}
      <group position={[0.2, 0.06, 2.6]}>
        {/* Smoked Glass & Wood Dining Table */}
        <mesh position={[0, 0.72, 0]} castShadow>
          <boxGeometry args={[2.2, 0.06, 1.2]} />
          <meshStandardMaterial color="#78350F" roughness={0.3} />
        </mesh>
        {/* Brass Crossed Base Legs */}
        <mesh position={[-0.8, 0.36, 0]}>
          <boxGeometry args={[0.06, 0.7, 0.9]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0.8, 0.36, 0]}>
          <boxGeometry args={[0.06, 0.7, 0.9]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Dining Chairs */}
        {[-0.6, 0.6].map((cx, i) => (
          <React.Fragment key={`chairs-${i}`}>
            <mesh position={[cx, 0.44, 0.75]} castShadow>
              <boxGeometry args={[0.42, 0.45, 0.42]} />
              <meshStandardMaterial color="#334155" roughness={0.8} />
            </mesh>
            <mesh position={[cx, 0.44, -0.75]} castShadow>
              <boxGeometry args={[0.42, 0.45, 0.42]} />
              <meshStandardMaterial color="#334155" roughness={0.8} />
            </mesh>
          </React.Fragment>
        ))}
      </group>

      {/* Kitchen Lighting */}
      <pointLight position={[0.2, 2.5, 0.8]} intensity={1.6} distance={5} decay={2} color="#FFF8E7" />
    </group>
  );
};

// ==========================================
// 3. ARCHITECTURAL FLOATING STAIRCASE
// ==========================================
export const HeroStaircase: React.FC = () => {
  const steps = 14;
  return (
    <group position={[-0.3, 0.12, -1.8]}>
      {/* Vertical Golden Slat Privacy Divider */}
      {[-0.6, -0.4, -0.2, 0, 0.2, 0.4, 0.6].map((sx, i) => (
        <mesh key={`slat-${i}`} position={[sx, 2.8, 0.8]}>
          <boxGeometry args={[0.04, 5.6, 0.06]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.85} roughness={0.25} />
        </mesh>
      ))}

      {/* Floating Cantilevered Oak Steps */}
      {Array.from({ length: steps }).map((_, idx) => {
        const stepY = (idx + 1) * 0.22;
        const stepZ = (idx - steps / 2) * 0.28;
        return (
          <group key={`step-${idx}`} position={[0, stepY, stepZ]}>
            {/* Solid Timber Step Tread */}
            <mesh castShadow receiveShadow>
              <boxGeometry args={[1.2, 0.08, 0.32]} />
              <meshStandardMaterial color="#A16207" roughness={0.35} metalness={0.1} />
            </mesh>
            {/* Hidden Under-Step LED Glow */}
            <mesh position={[0, -0.045, 0.12]}>
              <boxGeometry args={[1.1, 0.01, 0.02]} />
              <meshBasicMaterial color="#FEF08A" />
            </mesh>
          </group>
        );
      })}

      {/* Continuous Tempered Glass Railing & Golden Cap */}
      <mesh position={[0.62, 1.8, 0]} rotation={[0.65, 0, 0]}>
        <boxGeometry args={[0.02, 0.9, 4.4]} />
        <meshPhysicalMaterial color="#38BDF8" transmission={0.92} transparent opacity={0.6} />
      </mesh>
      <mesh position={[0.62, 2.28, 0]} rotation={[0.65, 0, 0]}>
        <boxGeometry args={[0.04, 0.06, 4.45]} />
        <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.2} />
      </mesh>
    </group>
  );
};

// ==========================================
// 4. FIRST FLOOR: MASTER BEDROOM SUITE
// ==========================================
export const HeroMasterBedroom: React.FC<{ isHighlighted?: boolean }> = ({ isHighlighted }) => {
  return (
    <group position={[3.0, 3.28, 2.2]}>
      {/* Luxury Oak Hardwood Flooring */}
      <mesh position={[0, 0.02, 0]} receiveShadow>
        <boxGeometry args={[5.6, 0.04, 5.8]} />
        <meshStandardMaterial
          color={isHighlighted ? '#FBBF24' : VillaMaterials.oakFloor}
          roughness={0.4}
          metalness={0.1}
        />
      </mesh>

      {/* King Size Floating Bed Platform */}
      <group position={[0, 0.06, -0.6]}>
        {/* Bed Base Plinth */}
        <mesh position={[0, 0.22, 0]} castShadow>
          <boxGeometry args={[2.5, 0.38, 2.6]} />
          <meshStandardMaterial color="#1E293B" roughness={0.5} />
        </mesh>
        {/* Luxury Mattress with Plump Duvet */}
        <mesh position={[0, 0.52, 0.1]} castShadow>
          <boxGeometry args={[2.3, 0.28, 2.3]} />
          <meshStandardMaterial color="#F8FAFC" roughness={0.9} />
        </mesh>
        {/* Folded Designer Bed Runner Throw */}
        <mesh position={[0, 0.56, 0.8]}>
          <boxGeometry args={[2.32, 0.04, 0.65]} />
          <meshStandardMaterial color="#0284C7" roughness={0.7} />
        </mesh>
        {/* Pillows */}
        <mesh position={[-0.6, 0.72, -0.7]}>
          <boxGeometry args={[0.7, 0.18, 0.45]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.9} />
        </mesh>
        <mesh position={[0.6, 0.72, -0.7]}>
          <boxGeometry args={[0.7, 0.18, 0.45]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.9} />
        </mesh>

        {/* Fluted Vertical Timber & Gold Headboard Feature Wall */}
        <mesh position={[0, 1.25, -1.25]}>
          <boxGeometry args={[4.2, 2.1, 0.12]} />
          <meshStandardMaterial color="#334155" roughness={0.6} />
        </mesh>
        {/* Brass Inlay Headboard Profiles */}
        {[-1.6, -0.8, 0.8, 1.6].map((hx, i) => (
          <mesh key={`hb-${i}`} position={[hx, 1.25, -1.18]}>
            <boxGeometry args={[0.03, 2.1, 0.02]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.2} />
          </mesh>
        ))}

        {/* Floating Nightstands with Bedside Glowing Lamps */}
        {[-1.55, 1.55].map((nx, i) => (
          <group key={`nightstand-${i}`} position={[nx, 0.35, -0.8]}>
            <mesh castShadow>
              <boxGeometry args={[0.6, 0.25, 0.45]} />
              <meshStandardMaterial color="#0F172A" roughness={0.4} />
            </mesh>
            {/* Lamp base */}
            <mesh position={[0, 0.25, 0]}>
              <cylinderGeometry args={[0.08, 0.1, 0.2, 16]} />
              <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.2} />
            </mesh>
            {/* Lamp Shade with Emissive Glow */}
            <mesh position={[0, 0.46, 0]}>
              <cylinderGeometry args={[0.14, 0.18, 0.22, 16]} />
              <meshStandardMaterial color="#FEF08A" emissive="#FEF08A" emissiveIntensity={0.8} />
            </mesh>
            <pointLight position={[0, 0.46, 0]} intensity={0.6} distance={2.5} color="#FEF08A" />
          </group>
        ))}
      </group>

      {/* Sliding Glass Wardrobe with Internal Illumination */}
      <group position={[2.5, 0.06, 0]}>
        <mesh position={[0, 1.35, 0]} castShadow>
          <boxGeometry args={[0.6, 2.6, 3.4]} />
          <meshStandardMaterial color="#0F172A" roughness={0.3} />
        </mesh>
        {/* Smoked Tint Glass Sliding Doors */}
        <mesh position={[-0.31, 1.35, 0]}>
          <boxGeometry args={[0.02, 2.5, 3.3]} />
          <meshPhysicalMaterial color="#38BDF8" transmission={0.7} roughness={0.2} transparent />
        </mesh>
      </group>

      {/* Warm Bedroom Overhead Spot */}
      <pointLight position={[0, 2.6, 0]} intensity={1.6} distance={6} decay={2} color="#FFF5E0" />
    </group>
  );
};

// ==========================================
// 5. FIRST FLOOR: LUXURY ENSUITE BATHROOM
// ==========================================
export const HeroBathroom: React.FC<{ isHighlighted?: boolean }> = ({ isHighlighted }) => {
  return (
    <group position={[-2.8, 3.28, 0.5]}>
      {/* Large Format Porcelain Tile Floor */}
      <mesh position={[0, 0.02, 0]} receiveShadow>
        <boxGeometry args={[5.2, 0.04, 4.4]} />
        <meshStandardMaterial
          color={isHighlighted ? '#FBBF24' : '#E2E8F0'}
          roughness={0.25}
          metalness={0.15}
        />
      </mesh>

      {/* Freestanding Oval Sculptural Bathtub */}
      <group position={[-1.2, 0.06, 0.8]}>
        <mesh position={[0, 0.32, 0]} castShadow>
          <cylinderGeometry args={[0.6, 0.45, 0.58, 24]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.1} />
        </mesh>
        {/* Floor-mounted Tall Gold Tub Filler Faucet */}
        <mesh position={[0.68, 0.55, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.9, 12]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.95} roughness={0.15} />
        </mesh>
      </group>

      {/* Floating Double Vanity with Vessel Sinks */}
      <group position={[1.4, 0.06, -1.6]}>
        <mesh position={[0, 0.55, 0]} castShadow>
          <boxGeometry args={[2.0, 0.35, 0.6]} />
          <meshStandardMaterial color="#1E293B" roughness={0.3} />
        </mesh>
        {/* Vanity White Quartz Top */}
        <mesh position={[0, 0.74, 0]}>
          <boxGeometry args={[2.05, 0.04, 0.62]} />
          <meshStandardMaterial color="#F8FAFC" roughness={0.15} />
        </mesh>
        {/* Two Vessel Sinks & Gold Faucets */}
        {[-0.5, 0.5].map((sx, i) => (
          <React.Fragment key={`sink-${i}`}>
            <mesh position={[sx, 0.84, 0]} castShadow>
              <cylinderGeometry args={[0.22, 0.18, 0.16, 20]} />
              <meshStandardMaterial color="#FFFFFF" roughness={0.1} />
            </mesh>
            <mesh position={[sx, 0.96, -0.18]}>
              <cylinderGeometry args={[0.015, 0.015, 0.22, 10]} />
              <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.2} />
            </mesh>
          </React.Fragment>
        ))}

        {/* LED Backlit Floating Circular Mirror */}
        <mesh position={[0, 1.45, -0.28]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.55, 0.55, 0.03, 32]} />
          <meshStandardMaterial color="#0284C7" metalness={0.9} roughness={0.05} />
        </mesh>
        {/* Mirror Halo Light */}
        <pointLight position={[0, 1.45, -0.1]} intensity={0.9} distance={2} color="#38BDF8" />
      </group>

      {/* Walk-in Frameless Glass Shower Partition */}
      <group position={[-1.2, 0.06, -1.2]}>
        <mesh position={[0, 1.25, 0]}>
          <boxGeometry args={[0.03, 2.4, 1.4]} />
          <meshPhysicalMaterial color="#38BDF8" transmission={0.94} transparent opacity={0.5} roughness={0.05} />
        </mesh>
        {/* Gold Overhead Rain Shower Head */}
        <mesh position={[0.4, 2.3, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.02, 20]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      <pointLight position={[0, 2.6, 0]} intensity={1.4} distance={5} color="#FFF8E7" />
    </group>
  );
};

// ==========================================
// 6. FIRST FLOOR: CANTILEVERED GLASS BALCONY
// ==========================================
export const HeroBalcony: React.FC<{ isHighlighted?: boolean }> = ({ isHighlighted }) => {
  return (
    <group position={[-3.6, 3.28, 4.4]}>
      {/* Teak Wood Decking Slab */}
      <mesh position={[0, 0.02, 0]} receiveShadow>
        <boxGeometry args={[4.2, 0.06, 2.4]} />
        <meshStandardMaterial
          color={isHighlighted ? '#FBBF24' : '#78350F'}
          roughness={0.65}
          metalness={0.05}
        />
      </mesh>

      {/* Front Frameless Tempered Glass Balustrade */}
      <mesh position={[0, 0.55, 1.18]}>
        <boxGeometry args={[4.2, 1.05, 0.03]} />
        <meshPhysicalMaterial
          color={VillaMaterials.glassBalustrade}
          transmission={0.92}
          transparent
          opacity={0.7}
          roughness={0.08}
        />
      </mesh>
      {/* Top Brushed Gold Handrail */}
      <mesh position={[0, 1.08, 1.18]}>
        <boxGeometry args={[4.25, 0.04, 0.06]} />
        <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Side Glass Balustrade */}
      <mesh position={[-2.08, 0.55, 0]}>
        <boxGeometry args={[0.03, 1.05, 2.4]} />
        <meshPhysicalMaterial
          color={VillaMaterials.glassBalustrade}
          transmission={0.92}
          transparent
          opacity={0.7}
          roughness={0.08}
        />
      </mesh>
      <mesh position={[-2.08, 1.08, 0]}>
        <boxGeometry args={[0.06, 0.04, 2.45]} />
        <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Modern Outdoor Lounge Armchairs & Side Table */}
      <group position={[0.6, 0.06, 0]}>
        <mesh position={[0, 0.28, 0]} castShadow>
          <boxGeometry args={[0.7, 0.5, 0.7]} />
          <meshStandardMaterial color="#1E293B" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.38, 0]}>
          <boxGeometry args={[0.62, 0.12, 0.62]} />
          <meshStandardMaterial color="#FAF5E4" roughness={0.9} />
        </mesh>
      </group>
      {/* Small Concrete Planter with Olive Tree */}
      <group position={[-1.2, 0.06, 0]}>
        <mesh position={[0, 0.35, 0]}>
          <cylinderGeometry args={[0.28, 0.22, 0.65, 16]} />
          <meshStandardMaterial color="#475569" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.9, 0]}>
          <sphereGeometry args={[0.42, 12, 12]} />
          <meshStandardMaterial color="#15803D" roughness={0.8} />
        </mesh>
      </group>
    </group>
  );
};

// ==========================================
// 7. LUXURY LANDSCAPING, REFLECTING POOL & PARKING
// ==========================================
export const HeroLandscapingAndPool: React.FC = () => {
  return (
    <group position={[0, -0.1, 0]}>
      {/* Vast Architectural Base Podium */}
      <mesh position={[0, -0.1, 0]} receiveShadow>
        <boxGeometry args={[22, 0.2, 22]} />
        <meshStandardMaterial color="#0B1321" roughness={0.9} />
      </mesh>

      {/* Infinity Swimming Pool with Glowing Water Basin */}
      <group position={[0, -0.05, 8.2]}>
        {/* Pool Interior Tiled Basin */}
        <mesh position={[0, -0.3, 0]} receiveShadow>
          <boxGeometry args={[11, 0.5, 4.2]} />
          <meshStandardMaterial color="#082F49" roughness={0.3} metalness={0.4} />
        </mesh>
        {/* Translucent Animated Water Surface */}
        <mesh position={[0, -0.08, 0]}>
          <boxGeometry args={[10.9, 0.04, 4.1]} />
          <meshPhysicalMaterial
            color="#0284C7"
            transmission={0.85}
            transparent
            opacity={0.85}
            roughness={0.06}
            ior={1.33}
          />
        </mesh>
        {/* Pool Coping Edges with Gold Strip */}
        <mesh position={[0, 0.02, -2.15]}>
          <boxGeometry args={[11.4, 0.04, 0.2]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.85} roughness={0.2} />
        </mesh>
        {/* Submerged Pool Underwater Glow Spotlights */}
        {[-3.5, 0, 3.5].map((px, i) => (
          <pointLight
            key={`pool-light-${i}`}
            position={[px, -0.2, 0]}
            intensity={2.0}
            distance={5}
            color="#38BDF8"
          />
        ))}
      </group>

      {/* Sunken Terrace Deck with Concrete Stepping Stones */}
      <group position={[6.5, 0.02, 7.5]}>
        {/* Floating Stepping Pavers */}
        {[-1.2, 0, 1.2].map((stepZ, i) => (
          <mesh key={`paver-${i}`} position={[0, 0.02, stepZ]} receiveShadow>
            <boxGeometry args={[1.6, 0.08, 0.9]} />
            <meshStandardMaterial color="#334155" roughness={0.8} />
          </mesh>
        ))}
      </group>

      {/* Modern Covered Carport / Portico with Luxury Vehicle */}
      <group position={[-7.5, 0, 2.5]}>
        {/* Parking Bay Floor */}
        <mesh position={[0, 0.01, 0]} receiveShadow>
          <boxGeometry args={[4.2, 0.02, 6.5]} />
          <meshStandardMaterial color="#1E293B" roughness={0.7} />
        </mesh>
        {/* Sleek Executive Vehicle Model */}
        <group position={[0, 0.1, 0]}>
          {/* Car Body Shell */}
          <mesh position={[0, 0.5, 0]} castShadow>
            <boxGeometry args={[1.9, 0.65, 4.2]} />
            <meshStandardMaterial color="#020617" metalness={0.9} roughness={0.15} />
          </mesh>
          {/* Car Cabin Greenhouse & Tinted Glass */}
          <mesh position={[0, 0.98, -0.2]}>
            <boxGeometry args={[1.65, 0.48, 2.2]} />
            <meshPhysicalMaterial color="#38BDF8" transmission={0.9} roughness={0.1} transparent />
          </mesh>
          {/* Headlights with Warm Glow */}
          <mesh position={[-0.7, 0.55, 2.11]}>
            <boxGeometry args={[0.3, 0.12, 0.02]} />
            <meshBasicMaterial color="#38BDF8" />
          </mesh>
          <mesh position={[0.7, 0.55, 2.11]}>
            <boxGeometry args={[0.3, 0.12, 0.02]} />
            <meshBasicMaterial color="#38BDF8" />
          </mesh>
        </group>
      </group>

      {/* Exterior Architectural Manicured Shrubbery & Warm Up-lights */}
      {[-8.5, 8.5].map((gx, i) => (
        <group key={`garden-${i}`} position={[gx, 0.1, -3]}>
          <mesh position={[0, 0.4, 0]}>
            <boxGeometry args={[1.8, 0.7, 5.5]} />
            <meshStandardMaterial color="#14532D" roughness={0.85} />
          </mesh>
          {/* Exterior Up-light */}
          <pointLight position={[0, 0.8, 0]} intensity={1.2} distance={4} color="#FBBF24" />
        </group>
      ))}
    </group>
  );
};

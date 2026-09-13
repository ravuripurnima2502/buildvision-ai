import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows } from '@react-three/drei';

export const Hero3DPreview: React.FC = () => {
  return (
    <div className="w-full h-full min-h-[380px] relative rounded-2xl overflow-hidden border border-gold-500/20 shadow-gold-glow">
      <Canvas
        camera={{ position: [14, 11, 14], fov: 42 }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={['#080C14']} />
        <ambientLight intensity={0.7} color="#FAF5E4" />
        <directionalLight position={[15, 25, 12]} intensity={1.5} color="#FFF8E7" castShadow />
        <directionalLight position={[-10, 15, -10]} intensity={0.5} color="#38BDF8" />

        <Suspense fallback={null}>
          <group position={[0, -1.5, 0]}>
            {/* Ground Slab */}
            <mesh position={[0, -0.05, 0]} receiveShadow>
              <boxGeometry args={[14, 0.1, 14]} />
              <meshStandardMaterial color="#0F172A" roughness={0.8} />
            </mesh>
            <mesh position={[0, -0.05, 0]}>
              <boxGeometry args={[14.1, 0.05, 14.1]} />
              <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.2} />
            </mesh>

            {/* Level 0: Ground Floor Modern Residence */}
            <group position={[0, 0, 0]}>
              {/* Main Foyer & Living Volume */}
              <mesh position={[-2, 1.5, 1]} castShadow>
                <boxGeometry args={[5.5, 3.0, 6.0]} />
                <meshStandardMaterial color="#1E293B" roughness={0.4} />
              </mesh>
              {/* Panoramic Glass Facade */}
              <mesh position={[-2, 1.5, 4.02]}>
                <boxGeometry args={[4.8, 2.4, 0.05]} />
                <meshPhysicalMaterial color="#38BDF8" transmission={0.9} roughness={0.1} transparent />
              </mesh>
              {/* Dining & Garage Volume */}
              <mesh position={[3.2, 1.5, 0]} castShadow>
                <boxGeometry args={[4.5, 3.0, 7.5]} />
                <meshStandardMaterial color="#0F172A" roughness={0.6} />
              </mesh>
            </group>

            {/* Intermediate Slab */}
            <mesh position={[0, 3.08, 0]}>
              <boxGeometry args={[12.5, 0.16, 12.5]} />
              <meshStandardMaterial color="#D4AF37" metalness={0.8} roughness={0.2} />
            </mesh>

            {/* Level 1: Upper Cantilever Suite */}
            <group position={[0, 3.16, 0]}>
              {/* Cantilever Master Suite Box */}
              <mesh position={[1, 1.5, -0.5]} castShadow>
                <boxGeometry args={[7.0, 3.0, 7.0]} />
                <meshStandardMaterial color="#1E293B" roughness={0.4} />
              </mesh>
              {/* Glass Corner Window */}
              <mesh position={[1, 1.5, 3.02]}>
                <boxGeometry args={[5.5, 2.2, 0.05]} />
                <meshPhysicalMaterial color="#38BDF8" transmission={0.9} roughness={0.1} transparent />
              </mesh>
              {/* Cantilever Balcony Deck */}
              <mesh position={[-3.2, 0.1, 1.5]} castShadow>
                <boxGeometry args={[4.2, 0.15, 3.8]} />
                <meshStandardMaterial color="#0F766E" roughness={0.5} />
              </mesh>
              {/* Glass Railing */}
              <mesh position={[-3.2, 0.65, 3.35]}>
                <boxGeometry args={[4.2, 0.95, 0.04]} />
                <meshPhysicalMaterial color="#38BDF8" transmission={0.9} transparent opacity={0.6} />
              </mesh>
            </group>

            {/* Roof Slab & Pergola */}
            <group position={[0, 6.24, 0]}>
              <mesh position={[0, 0.08, 0]}>
                <boxGeometry args={[11, 0.16, 10]} />
                <meshStandardMaterial color="#0F172A" roughness={0.7} />
              </mesh>
              {/* Golden Architectural Pergola Louvers */}
              {[-3, -1.8, -0.6, 0.6, 1.8, 3].map((pos, i) => (
                <mesh key={i} position={[pos, 1.2, 0]}>
                  <boxGeometry args={[0.08, 0.2, 6]} />
                  <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.2} />
                </mesh>
              ))}
            </group>

            {/* Contact Shadows */}
            <ContactShadows position={[0, 0, 0]} opacity={0.7} scale={20} blur={2.5} far={8} color="#000000" />
          </group>

          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={1.2}
            maxPolarAngle={Math.PI / 2.1}
            minPolarAngle={Math.PI / 3.5}
          />
        </Suspense>
      </Canvas>

      {/* Luxury Overlay Badge */}
      <div className="absolute top-4 left-4 bg-charcoal-900/80 backdrop-blur-md border border-gold-500/30 px-3 py-1.5 rounded-full flex items-center space-x-2 text-xs text-gold-300 font-mono">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span>LIVE 3D BIM PREVIEW</span>
      </div>
      <div className="absolute bottom-4 right-4 bg-charcoal-900/80 backdrop-blur-md border border-slate-700/60 px-3 py-1.5 rounded-lg text-xs text-slate-300 font-mono">
        Drag to Rotate • 60 FPS
      </div>
    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import {
  HeroVillaCanvas,
  HeroRoomKey,
  HeroFloorKey,
  HeroLightingKey,
} from './hero/HeroVillaCanvas';
import {
  RotateCcw,
  Maximize2,
  Minimize2,
  Play,
  Pause,
  Sun,
  Moon,
  Sunset,
  Sparkles,
  Layers,
  Compass,
  Info,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Rotate3d,
} from 'lucide-react';

interface RoomThumbnailItem {
  id: HeroRoomKey;
  label: string;
  floor: string;
  area: string;
  dimensions: string;
  img: string;
  description: string;
}

const ROOM_ITEMS: RoomThumbnailItem[] = [
  {
    id: 'exterior',
    label: 'Exterior & Pool',
    floor: 'Overall',
    area: '3,200 sq ft',
    dimensions: '14 × 16 m',
    img: '/thumbnails/exterior.jpg',
    description: 'Modern two-storey luxury villa with cantilevered volumes and infinity pool.',
  },
  {
    id: 'living',
    label: 'Living Room',
    floor: 'Ground Floor',
    area: '480 sq ft',
    dimensions: '20 × 24 ft',
    img: '/thumbnails/living.jpg',
    description: 'Double-height open living space with Carrara marble and panoramic glazing.',
  },
  {
    id: 'kitchen',
    label: 'Kitchen & Dining',
    floor: 'Ground Floor',
    area: '420 sq ft',
    dimensions: '18 × 23 ft',
    img: '/thumbnails/kitchen.jpg',
    description: 'Calacatta waterfall island counter with integrated appliances and bar seating.',
  },
  {
    id: 'bedroom',
    label: 'Master Suite',
    floor: 'First Floor (2F)',
    area: '360 sq ft',
    dimensions: '18 × 20 ft',
    img: '/thumbnails/bedroom.jpg',
    description: 'Upper cantilevered master suite with European oak flooring and ambient headboard.',
  },
  {
    id: 'bathroom',
    label: 'Luxury Ensuite',
    floor: 'First Floor (2F)',
    area: '180 sq ft',
    dimensions: '12 × 15 ft',
    img: '/thumbnails/bathroom.jpg',
    description: 'Sculptural freestanding soaking tub, floating double vanity and frameless glass.',
  },
];

export const Hero3DPreview: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // States
  const [activeRoom, setActiveRoom] = useState<HeroRoomKey>('exterior');
  const [activeFloor, setActiveFloor] = useState<HeroFloorKey>('ALL');
  const [lightingMode, setLightingMode] = useState<HeroLightingKey>('sunset');
  const [isAutoRotate, setIsAutoRotate] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Walkthrough State
  const [isWalkthroughActive, setIsWalkthroughActive] = useState(false);
  const [walkthroughProgress, setWalkthroughProgress] = useState(0);

  // Handle Fullscreen toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.warn('Fullscreen request failed:', err);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch((err) => {
        console.warn('Exit fullscreen failed:', err);
      });
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Walkthrough Animation Loop
  useEffect(() => {
    if (!isWalkthroughActive) return;

    let animFrame: number;
    let startTime: number | null = null;
    const duration = 24000; // 24 seconds for complete cinematic tour

    const loop = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = (elapsed % duration) / duration;
      setWalkthroughProgress(progress);

      // Auto-update room HUD label based on current progress phase
      if (progress < 0.15) {
        setActiveRoom('exterior');
      } else if (progress < 0.35) {
        setActiveRoom('living');
      } else if (progress < 0.55) {
        setActiveRoom('kitchen');
      } else if (progress < 0.75) {
        setActiveRoom('bedroom');
      } else if (progress < 0.9) {
        setActiveRoom('bathroom');
      } else {
        setActiveRoom('exterior');
      }

      animFrame = requestAnimationFrame(loop);
    };

    animFrame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animFrame);
    };
  }, [isWalkthroughActive]);

  const currentRoomInfo = ROOM_ITEMS.find((r) => r.id === activeRoom) || ROOM_ITEMS[0];

  const handleSelectRoom = (roomId: HeroRoomKey) => {
    if (isWalkthroughActive) setIsWalkthroughActive(false);
    setActiveRoom(roomId);
    if (roomId === 'bedroom' || roomId === 'bathroom') {
      setActiveFloor('2F');
    } else if (roomId === 'living' || roomId === 'kitchen') {
      setActiveFloor('GF');
    } else {
      setActiveFloor('ALL');
    }
  };

  const handleSelectFloor = (floorId: HeroFloorKey) => {
    if (isWalkthroughActive) setIsWalkthroughActive(false);
    setActiveFloor(floorId);
    if (floorId === 'GF') {
      if (activeRoom === 'bedroom' || activeRoom === 'bathroom') {
        setActiveRoom('living');
      }
    } else if (floorId === '2F' || floorId === '1F') {
      if (activeRoom === 'living' || activeRoom === 'kitchen') {
        setActiveRoom('bedroom');
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className={`w-full relative rounded-2xl overflow-hidden border border-white/[0.08] bg-[#070A0F] shadow-card-elevated transition-all ${
        isFullscreen ? 'h-screen fixed inset-0 z-50 rounded-none' : 'h-[500px] sm:h-[540px] lg:h-[580px]'
      }`}
    >
      {/* 3D WebGL Canvas */}
      <HeroVillaCanvas
        activeRoom={activeRoom}
        activeFloor={activeFloor}
        lightingMode={lightingMode}
        isAutoRotate={isAutoRotate}
        isWalkthroughActive={isWalkthroughActive}
        walkthroughProgress={walkthroughProgress}
        onRoomSelect={handleSelectRoom}
      />

      {/* ======================================================== */}
      {/* TOP HEADER OVERLAYS                                     */}
      {/* ======================================================== */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
        {/* Live Status Badge */}
        <div className="flex items-center space-x-2 pointer-events-auto">
          <div className="bg-[#0B1017]/85 backdrop-blur-xl border border-white/[0.08] px-3 py-1.5 rounded-xl flex items-center space-x-2 text-xs text-slate-200 font-mono shadow-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-semibold text-slate-100 tracking-wide text-[11px]">LIVE 3D BIM PREVIEW</span>
            <span className="text-slate-600">•</span>
            <span className="text-[11px] text-slate-400 hidden sm:inline">Modern Villa Cutaway</span>
          </div>

          {/* Active Room Title HUD */}
          <div className="hidden md:flex items-center bg-[#0B1017]/85 backdrop-blur-xl border border-white/[0.08] px-3 py-1.5 rounded-xl text-xs text-slate-300 font-mono">
            <span className="text-gold-400 font-semibold mr-1.5">{currentRoomInfo.label}</span>
            <span className="text-slate-600 mr-1.5">|</span>
            <span className="text-slate-400">{currentRoomInfo.area}</span>
          </div>
        </div>

        {/* 3D Control Bar: Rotate, Zoom, Lighting, Fullscreen */}
        <div className="flex items-center space-x-1 sm:space-x-1.5 pointer-events-auto bg-[#0B1017]/85 backdrop-blur-xl border border-white/[0.08] p-1.5 rounded-xl shadow-lg">
          {/* Lighting Mode Selector */}
          <button
            onClick={() => {
              if (lightingMode === 'sunset') setLightingMode('night');
              else if (lightingMode === 'night') setLightingMode('day');
              else setLightingMode('sunset');
            }}
            title={`Lighting: ${lightingMode.toUpperCase()} (Click to toggle)`}
            className="p-1.5 rounded-lg hover:bg-white/[0.08] text-slate-300 hover:text-gold-300 transition-colors cursor-pointer"
          >
            {lightingMode === 'sunset' ? (
              <Sunset className="w-4 h-4 text-amber-400" />
            ) : lightingMode === 'night' ? (
              <Moon className="w-4 h-4 text-cyan-400" />
            ) : (
              <Sun className="w-4 h-4 text-yellow-300" />
            )}
          </button>

          {/* Auto Rotate Toggle */}
          <button
            onClick={() => setIsAutoRotate(!isAutoRotate)}
            title={isAutoRotate ? 'Disable Auto Rotate' : 'Enable 360° Architectural Orbit'}
            className={`p-1.5 rounded-lg transition-all cursor-pointer ${
              isAutoRotate ? 'bg-gold-500/20 text-gold-300 border border-gold-500/40' : 'text-slate-300 hover:bg-white/[0.08]'
            }`}
          >
            <Rotate3d className="w-4 h-4" />
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen 3D BIM Studio'}
            className="p-1.5 rounded-lg hover:bg-white/[0.08] text-slate-300 hover:text-gold-300 transition-colors cursor-pointer"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* RIGHT SIDE: VERTICAL FLOOR SELECTOR                      */}
      {/* ======================================================== */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex flex-col items-center space-y-2 select-none">
        <div className="bg-[#0B1017]/85 backdrop-blur-xl border border-white/[0.08] p-1.5 rounded-2xl shadow-xl flex flex-col space-y-1.5">
          <div className="text-[9px] font-mono uppercase tracking-widest text-slate-400 text-center py-0.5">
            Floors
          </div>

          {/* 2F Button */}
          <button
            onClick={() => handleSelectFloor('2F')}
            className={`w-10 h-10 rounded-xl font-mono text-xs font-bold transition-all flex flex-col items-center justify-center cursor-pointer ${
              activeFloor === '2F'
                ? 'btn-gold shadow-gold-glow scale-105'
                : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
            }`}
            title="Second Floor (2F) - Master Suite, Ensuite Bath, Balcony"
          >
            <span>2F</span>
            <span className="text-[8px] font-normal leading-none opacity-80">Upper</span>
          </button>

          {/* 1F Button */}
          <button
            onClick={() => handleSelectFloor('1F')}
            className={`w-10 h-10 rounded-xl font-mono text-xs font-bold transition-all flex flex-col items-center justify-center cursor-pointer ${
              activeFloor === '1F'
                ? 'btn-gold shadow-gold-glow scale-105'
                : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
            }`}
            title="First Floor (1F) - Bedrooms & Terrace Level"
          >
            <span>1F</span>
            <span className="text-[8px] font-normal leading-none opacity-80">Mid</span>
          </button>

          {/* GF Button */}
          <button
            onClick={() => handleSelectFloor('GF')}
            className={`w-10 h-10 rounded-xl font-mono text-xs font-bold transition-all flex flex-col items-center justify-center cursor-pointer ${
              activeFloor === 'GF'
                ? 'btn-gold shadow-gold-glow scale-105'
                : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
            }`}
            title="Ground Floor (GF) - Living, Dining, Kitchen, Stairs, Parking & Pool"
          >
            <span>GF</span>
            <span className="text-[8px] font-normal leading-none opacity-80">Ground</span>
          </button>

          <div className="w-full h-px bg-white/[0.08] my-0.5"></div>

          {/* ALL Button */}
          <button
            onClick={() => handleSelectFloor('ALL')}
            className={`w-10 h-8 rounded-xl font-mono text-[10px] font-bold transition-all flex items-center justify-center cursor-pointer ${
              activeFloor === 'ALL'
                ? 'bg-gold-500/20 text-gold-300 border border-gold-500/40 shadow-gold-glow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
            }`}
            title="View Full Two-Storey Structure"
          >
            ALL
          </button>
        </div>

        {/* Start Walkthrough Action Button */}
        <button
          onClick={() => setIsWalkthroughActive(!isWalkthroughActive)}
          className={`px-3 py-2 rounded-xl text-xs font-bold font-mono tracking-wider flex items-center space-x-1.5 shadow-xl transition-all cursor-pointer ${
            isWalkthroughActive
              ? 'bg-rose-500/90 text-white shadow-rose-500/20 animate-pulse'
              : 'btn-gold shadow-gold-glow'
          }`}
          title="Start Architectural 3D Walkthrough"
        >
          {isWalkthroughActive ? (
            <>
              <Pause className="w-3.5 h-3.5 fill-current" />
              <span className="hidden sm:inline">Pause</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span className="hidden sm:inline">Tour</span>
            </>
          )}
        </button>
      </div>

      {/* ======================================================== */}
      {/* BOTTOM: HORIZONTAL ROOM PREVIEW THUMBNAILS STRIP        */}
      {/* ======================================================== */}
      <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 z-10 select-none">
        <div className="bg-[#0B1017]/85 backdrop-blur-xl border border-white/[0.08] p-2 sm:p-2.5 rounded-2xl shadow-2xl flex items-center justify-between gap-2 overflow-x-auto scrollbar-none">
          {/* Thumbnails Row */}
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-max">
            {ROOM_ITEMS.map((item) => {
              const isSelected = activeRoom === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectRoom(item.id)}
                  className={`group relative flex items-center space-x-2.5 px-2 py-1.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-gold-500/15 border-gold-500/60 shadow-gold-glow'
                      : 'bg-white/[0.02] border-white/[0.06] hover:border-white/[0.15] hover:bg-white/[0.05]'
                  }`}
                >
                  {/* Thumbnail Image Container */}
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg overflow-hidden shrink-0 border border-white/[0.08] relative">
                    <img
                      src={item.img}
                      alt={item.label}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-gold-500/20 border-2 border-gold-400 rounded-lg pointer-events-none"></div>
                    )}
                  </div>

                  {/* Room Label & Floor Subtitle */}
                  <div className="text-left pr-2 hidden sm:block">
                    <p
                      className={`text-xs font-semibold leading-tight transition-colors ${
                        isSelected ? 'text-gold-300' : 'text-slate-200 group-hover:text-white'
                      }`}
                    >
                      {item.label}
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono leading-tight mt-0.5">
                      {item.floor}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick Walkthrough / Gesture Hint */}
          <div className="hidden lg:flex items-center text-[11px] font-mono text-slate-400 pl-3 border-l border-white/[0.08] shrink-0">
            <span>Click Room or Drag to Orbit</span>
          </div>
        </div>
      </div>
    </div>
  );
};

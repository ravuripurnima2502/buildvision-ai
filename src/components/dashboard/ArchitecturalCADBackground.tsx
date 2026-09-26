import React, { useEffect, useRef } from 'react';
import { useTheme } from '../theme/ThemeContext';

export const ArchitecturalCADBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Damped Mouse Parallax
    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Theme Color Palettes
    const getColors = () => {
      if (theme === 'white') {
        return {
          base: '#F8FAFC',
          gridMajor: 'rgba(15, 23, 42, 0.08)',
          gridMinor: 'rgba(15, 23, 42, 0.03)',
          cyanLine: 'rgba(2, 132, 199, 0.4)',
          goldLine: 'rgba(184, 146, 40, 0.45)',
          floorPlan: 'rgba(51, 65, 85, 0.25)',
          wireframe: 'rgba(15, 23, 42, 0.15)',
          text: 'rgba(71, 85, 105, 0.45)',
          scanLine: 'rgba(2, 132, 199, 0.15)',
          node: 'rgba(184, 146, 40, 0.7)',
        };
      }
      if (theme === 'blueprint') {
        return {
          base: '#081325',
          gridMajor: 'rgba(56, 189, 248, 0.16)',
          gridMinor: 'rgba(56, 189, 248, 0.05)',
          cyanLine: 'rgba(56, 189, 248, 0.45)',
          goldLine: 'rgba(212, 175, 55, 0.4)',
          floorPlan: 'rgba(56, 189, 248, 0.28)',
          wireframe: 'rgba(56, 189, 248, 0.2)',
          text: 'rgba(125, 211, 252, 0.35)',
          scanLine: 'rgba(56, 189, 248, 0.18)',
          node: 'rgba(56, 189, 248, 0.8)',
        };
      }
      // Default: Midnight luxury
      return {
        base: '#070A0F',
        gridMajor: 'rgba(212, 175, 55, 0.07)',
        gridMinor: 'rgba(255, 255, 255, 0.02)',
        cyanLine: 'rgba(56, 189, 248, 0.32)',
        goldLine: 'rgba(212, 175, 55, 0.35)',
        floorPlan: 'rgba(56, 189, 248, 0.18)',
        wireframe: 'rgba(148, 163, 184, 0.12)',
        text: 'rgba(148, 163, 184, 0.3)',
        scanLine: 'rgba(56, 189, 248, 0.12)',
        node: 'rgba(212, 175, 55, 0.65)',
      };
    };

    // Animation Timers & States
    let scanY = 0;
    let traceSweep = 0;
    let pulseAngle = 0;

    const render = () => {
      // Smooth Parallax Interpolation
      mouseX += (targetMouseX - mouseX) * 0.025;
      mouseY += (targetMouseY - mouseY) * 0.025;

      const pX = ((mouseX - width / 2) / width) * 22;
      const pY = ((mouseY - height / 2) / height) * 22;

      ctx.clearRect(0, 0, width, height);

      const colors = getColors();

      // =========================================================
      // LAYER 1: BASE BACKGROUND
      // =========================================================
      ctx.fillStyle = colors.base;
      ctx.fillRect(0, 0, width, height);

      // =========================================================
      // LAYER 2: ARCHITECTURAL ENGINEERING GRID & CROSSHAIRS
      // =========================================================
      // Minor Grid (25px)
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = colors.gridMinor;
      ctx.beginPath();
      const minorStep = 25;
      for (let x = (pX % minorStep); x < width; x += minorStep) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = (pY % minorStep); y < height; y += minorStep) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // Major Grid (125px)
      ctx.lineWidth = 1;
      ctx.strokeStyle = colors.gridMajor;
      ctx.beginPath();
      const majorStep = 125;
      for (let x = (pX % majorStep); x < width; x += majorStep) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = (pY % majorStep); y < height; y += majorStep) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // Grid Intersection Crosses (+)
      ctx.strokeStyle = colors.goldLine;
      ctx.lineWidth = 1;
      for (let x = (pX % majorStep); x < width; x += majorStep) {
        for (let y = (pY % majorStep); y < height; y += majorStep) {
          ctx.beginPath();
          ctx.moveTo(x - 4, y);
          ctx.lineTo(x + 4, y);
          ctx.moveTo(x, y - 4);
          ctx.lineTo(x, y + 4);
          ctx.stroke();
        }
      }

      // =========================================================
      // LAYER 3: FAINT ARCHITECTURAL FLOOR PLAN
      // =========================================================
      const fpx = width * 0.12 + pX * 0.4;
      const fpy = height * 0.22 + pY * 0.4;

      ctx.save();
      ctx.strokeStyle = colors.floorPlan;
      ctx.lineWidth = 1.2;

      // Outer Residence Footprint Walls
      ctx.strokeRect(fpx, fpy, 320, 240);
      // Double Wall Thickness
      ctx.strokeRect(fpx + 4, fpy + 4, 312, 232);

      // Living Room & Kitchen Internal Partitions
      ctx.beginPath();
      ctx.moveTo(fpx + 180, fpy);
      ctx.lineTo(fpx + 180, fpy + 150);
      ctx.moveTo(fpx, fpy + 150);
      ctx.lineTo(fpx + 320, fpy + 150);
      ctx.stroke();

      // Door Swing Arc in Living Room
      ctx.beginPath();
      ctx.arc(fpx + 180, fpy + 150, 32, 0, Math.PI / 2);
      ctx.moveTo(fpx + 180, fpy + 150);
      ctx.lineTo(fpx + 180, fpy + 182);
      ctx.stroke();

      // Architectural Staircase Steps
      ctx.lineWidth = 0.8;
      for (let i = 0; i < 7; i++) {
        const stepY = fpy + 160 + i * 10;
        ctx.beginPath();
        ctx.moveTo(fpx + 220, stepY);
        ctx.lineTo(fpx + 270, stepY);
        ctx.stroke();
      }

      // Floor Plan Room Dimension Strings
      ctx.font = '8px "JetBrains Mono", monospace';
      ctx.fillStyle = colors.text;
      ctx.fillText('LIVING ROOM [5.40m × 6.80m]', fpx + 14, fpy + 30);
      ctx.fillText('KITCHEN & DINING [4.20m × 5.40m]', fpx + 190, fpy + 30);
      ctx.fillText('STAIRWELL CORE', fpx + 215, fpy + 155);

      // Dimension Leader Lines with Ticks
      ctx.strokeStyle = colors.cyanLine;
      ctx.beginPath();
      ctx.moveTo(fpx, fpy - 12);
      ctx.lineTo(fpx + 320, fpy - 12);
      ctx.moveTo(fpx, fpy - 16);
      ctx.lineTo(fpx, fpy - 8);
      ctx.moveTo(fpx + 320, fpy - 16);
      ctx.lineTo(fpx + 320, fpy - 8);
      ctx.stroke();
      ctx.fillText('< 16.00 m >', fpx + 130, fpy - 16);

      ctx.restore();

      // =========================================================
      // LAYER 4: STRUCTURAL DRAWINGS & RC COLUMNS
      // =========================================================
      ctx.save();
      ctx.fillStyle = colors.goldLine;
      const colPositions = [
        [fpx, fpy],
        [fpx + 160, fpy],
        [fpx + 320, fpy],
        [fpx, fpy + 120],
        [fpx + 180, fpy + 120],
        [fpx + 320, fpy + 120],
        [fpx, fpy + 240],
        [fpx + 160, fpy + 240],
        [fpx + 320, fpy + 240],
      ];

      colPositions.forEach(([cx, cy], i) => {
        // Reinforced Concrete Column Pad
        ctx.fillRect(cx - 3, cy - 3, 6, 6);
        // Column Footing Outline (dashed)
        ctx.strokeStyle = colors.gridMajor;
        ctx.strokeRect(cx - 9, cy - 9, 18, 18);
        if (i === 0 || i === 4) {
          ctx.font = '7px "JetBrains Mono", monospace';
          ctx.fillStyle = colors.text;
          ctx.fillText(`C${i + 1} 400×400`, cx + 8, cy + 4);
        }
      });
      ctx.restore();

      // =========================================================
      // LAYER 5: LARGE DISTANT AXONOMETRIC BUILDING WIREFRAME
      // =========================================================
      const bwx = width * 0.72 + pX * 0.25;
      const bwy = height * 0.3 + pY * 0.25;

      ctx.save();
      ctx.strokeStyle = colors.wireframe;
      ctx.lineWidth = 1;

      // Isometric 3-Storey Villa Massing Lines
      const isoDraw = (ox: number, oy: number, w: number, d: number, h: number) => {
        const x1 = ox;
        const y1 = oy;
        const x2 = ox + w * 0.866;
        const y2 = oy + w * 0.5;
        const x3 = ox - d * 0.866;
        const y3 = oy + d * 0.5;
        const x4 = ox + (w - d) * 0.866;
        const y4 = oy + (w + d) * 0.5;

        // Base
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x4, y4);
        ctx.lineTo(x3, y3);
        ctx.closePath();
        ctx.stroke();

        // Extruded Top
        ctx.beginPath();
        ctx.moveTo(x1, y1 - h);
        ctx.lineTo(x2, y2 - h);
        ctx.lineTo(x4, y4 - h);
        ctx.lineTo(x3, y3 - h);
        ctx.closePath();
        ctx.stroke();

        // Vertical Edges
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x1, y1 - h);
        ctx.moveTo(x2, y2);
        ctx.lineTo(x2, y2 - h);
        ctx.moveTo(x3, y3);
        ctx.lineTo(x3, y3 - h);
        ctx.moveTo(x4, y4);
        ctx.lineTo(x4, y4 - h);
        ctx.stroke();
      };

      // Draw multi-tier volumetric structure
      isoDraw(bwx, bwy + 120, 160, 140, 120);
      isoDraw(bwx + 30, bwy + 40, 110, 90, 80);

      // Floor Level Elevation Callouts
      ctx.font = '8px "JetBrains Mono", monospace';
      ctx.fillStyle = colors.text;
      ctx.fillText('LEVEL 02 [+6.40m]', bwx + 155, bwy - 40);
      ctx.fillText('LEVEL 01 [+3.20m]', bwx + 155, bwy + 20);
      ctx.fillText('GROUND LVL [±0.00m]', bwx + 155, bwy + 100);

      ctx.restore();

      // =========================================================
      // LAYER 6: CAD & BIM TECHNICAL ANNOTATIONS & TITLE STAMP
      // =========================================================
      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.fillStyle = colors.text;

      // Structural Grid Axis Markers (Circled)
      const axes = ['A', 'B', 'C', 'D'];
      axes.forEach((axis, idx) => {
        const ax = fpx + idx * 105;
        const ay = fpy - 35;
        ctx.strokeStyle = colors.goldLine;
        ctx.beginPath();
        ctx.arc(ax, ay, 9, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillText(axis, ax - 3, ay + 3);
      });

      // Technical Title Block Stamp (bottom-left)
      const tbx = width * 0.05 + pX * 0.2;
      const tby = height * 0.86 + pY * 0.2;
      ctx.strokeStyle = colors.gridMajor;
      ctx.strokeRect(tbx, tby, 260, 65);
      ctx.fillText('PROJECT: BUILDVISION LUXURY VILLA // LOD-350', tbx + 10, tby + 16);
      ctx.fillText('COORDINATES: UTM-32N // E: 421890 N: 1805210', tbx + 10, tby + 32);
      ctx.fillText('SYSTEM STATUS: STRUCTURAL ANALYSIS PASS', tbx + 10, tby + 48);

      // =========================================================
      // LAYER 7: SUBTLE ANIMATED SCANNING LINE & DRAWING TRACES
      // =========================================================
      // Vertical Scanning Sweep
      scanY = (scanY + 0.8) % height;
      ctx.fillStyle = colors.scanLine;
      ctx.fillRect(0, scanY, width, 1.5);

      // Slow Animated Drawing Sweep Line
      traceSweep = (traceSweep + 0.0009) % 1;
      ctx.strokeStyle = colors.cyanLine;
      ctx.lineWidth = 1.2;
      ctx.setLineDash([8, 8]);
      ctx.beginPath();
      ctx.moveTo(0, height * 0.48 + pY * 0.5);
      ctx.lineTo(width * traceSweep, height * 0.48 + pY * 0.5);
      ctx.stroke();
      ctx.setLineDash([]);

      // Subtle Breathing Glow Node
      pulseAngle += 0.04;
      const glowAlpha = 0.5 + Math.sin(pulseAngle) * 0.3;
      ctx.fillStyle = colors.node;
      ctx.globalAlpha = glowAlpha;
      ctx.beginPath();
      ctx.arc(width * traceSweep, height * 0.48 + pY * 0.5, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1.0;

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-80"
    />
  );
};

import * as THREE from 'three';

export type FinishCategory = 'floor' | 'wall' | 'roof';

export interface FinishDefinition {
  id: string;
  name: string;
  category: FinishCategory;
  description: string;
  defaultColor: string;
  roughness: number;
  metalness: number;
  previewDataUrl?: string;
  repeat: [number, number];
}

export const FLOOR_FINISHES: FinishDefinition[] = [
  {
    id: 'italian_white_marble',
    name: 'Italian Statuario White Marble',
    category: 'floor',
    description: 'Polished white Carrara marble with distinctive grey-gold organic vein networks and crystalline sheen.',
    defaultColor: '#F8FAFC',
    roughness: 0.15,
    metalness: 0.1,
    repeat: [3, 3],
  },
  {
    id: 'black_galaxy_marble',
    name: 'Black Galaxy Marble',
    category: 'floor',
    description: 'Deep obsidian black marble with reflective golden bronzite specks and high specular reflectivity.',
    defaultColor: '#0F172A',
    roughness: 0.18,
    metalness: 0.25,
    repeat: [3, 3],
  },
  {
    id: 'glossy_vitrified_tile',
    name: 'Glossy Vitrified Nano Tile',
    category: 'floor',
    description: 'Ultra-reflective 4ft × 2ft rectified double-charged tiles with subtle porcelain cloud patterns.',
    defaultColor: '#F1F5F9',
    roughness: 0.12,
    metalness: 0.08,
    repeat: [4, 4],
  },
  {
    id: 'matte_vitrified_tile',
    name: 'Matte Anti-Skid Vitrified Tile',
    category: 'floor',
    description: 'Contemporary honed satin vitrified ceramic with non-reflective grip and soft diffusion.',
    defaultColor: '#E2E8F0',
    roughness: 0.55,
    metalness: 0.04,
    repeat: [4, 4],
  },
  {
    id: 'oak_wood',
    name: 'European White Oak Hardwood',
    category: 'floor',
    description: 'Quarter-sawn oak flooring planks with natural cathedral grain patterns and warm satin polyurethane finish.',
    defaultColor: '#C49758',
    roughness: 0.42,
    metalness: 0.02,
    repeat: [4, 4],
  },
  {
    id: 'teak_wood',
    name: 'Seasoned Burma Teak Wood',
    category: 'floor',
    description: 'Dense architectural Burma teak with rich amber-gold heartwood streaks and water-repellent oil luster.',
    defaultColor: '#92400E',
    roughness: 0.38,
    metalness: 0.05,
    repeat: [4, 4],
  },
  {
    id: 'granite',
    name: 'Flamed Steel Grey Granite',
    category: 'floor',
    description: 'Granular igneous granite with crystalline quartz inclusions and high scratch resistance.',
    defaultColor: '#334155',
    roughness: 0.35,
    metalness: 0.2,
    repeat: [3, 3],
  },
  {
    id: 'exposed_concrete',
    name: 'Polished Architectural Concrete',
    category: 'floor',
    description: 'Seamless diamond-honed concrete floor with visible micro-aggregate and industrial sheen.',
    defaultColor: '#64748B',
    roughness: 0.48,
    metalness: 0.15,
    repeat: [2, 2],
  },
  {
    id: 'epoxy_coating',
    name: 'Seamless Metallic Epoxy Coating',
    category: 'floor',
    description: 'Heavy-duty resinous epoxy floor with swirling pearlescent pigments and zero-grout joint finish.',
    defaultColor: '#1E293B',
    roughness: 0.1,
    metalness: 0.3,
    repeat: [2, 2],
  },
  {
    id: 'ceramic_tile',
    name: 'Glazed Subway & Mosaic Ceramic',
    category: 'floor',
    description: 'Classic glazed ceramic tiles with clean recessed waterproof polymer grout lines.',
    defaultColor: '#E0E7FF',
    roughness: 0.3,
    metalness: 0.05,
    repeat: [6, 6],
  },
];

export const WALL_FINISHES: FinishDefinition[] = [
  {
    id: 'smooth_plaster',
    name: 'Smooth Gypsum Plaster',
    category: 'wall',
    description: 'Silky smooth double-coat plaster finish ready for premium interior luxury emulsions.',
    defaultColor: '#1E293B',
    roughness: 0.85,
    metalness: 0.05,
    repeat: [2, 2],
  },
  {
    id: 'textured_paint',
    name: 'Textured Stucco Sand Finish',
    category: 'wall',
    description: 'Exterior weather-shield acrylic texture with subtle sand granules for acoustic and thermal diffusion.',
    defaultColor: '#334155',
    roughness: 0.92,
    metalness: 0.02,
    repeat: [4, 4],
  },
  {
    id: 'stone_cladding',
    name: 'Stacked Slate & Quartzite Cladding',
    category: 'wall',
    description: 'Horizontal split-face natural ledge stone strips creating rich organic shadows and depth.',
    defaultColor: '#475569',
    roughness: 0.8,
    metalness: 0.15,
    repeat: [4, 4],
  },
  {
    id: 'exposed_concrete',
    name: 'Architectural Board-Formed Concrete',
    category: 'wall',
    description: 'Fair-faced reinforced concrete with distinctive timber formwork grain and snap-tie recesses.',
    defaultColor: '#64748B',
    roughness: 0.75,
    metalness: 0.1,
    repeat: [3, 3],
  },
  {
    id: 'brick_finish',
    name: 'Exposed Wire-Cut Brick Masonry',
    category: 'wall',
    description: 'Rustic terracotta red clay brickwork laid in running bond with deep raked mortar pointing.',
    defaultColor: '#9A3412',
    roughness: 0.88,
    metalness: 0.05,
    repeat: [5, 5],
  },
  {
    id: 'decorative_texture',
    name: 'Italian Travertine Venetian Plaster',
    category: 'wall',
    description: 'Hand-troweled lime marble plaster with two-tone burnished luster and soft horizontal striations.',
    defaultColor: '#D4AF37',
    roughness: 0.45,
    metalness: 0.2,
    repeat: [3, 3],
  },
];

export const ROOF_FINISHES: FinishDefinition[] = [
  {
    id: 'clay_roof_tile',
    name: 'Mangalore Interlocking Clay Tile',
    category: 'roof',
    description: 'Traditional kiln-baked terracotta tiles with curved rain channels and earthy natural red hue.',
    defaultColor: '#B91C1C',
    roughness: 0.7,
    metalness: 0.05,
    repeat: [6, 6],
  },
  {
    id: 'rcc',
    name: 'Waterproofed RCC Terrace Slab',
    category: 'roof',
    description: 'Engineered reinforced concrete roof slab sealed with elastomeric UV-reflective terrace coating.',
    defaultColor: '#1E293B',
    roughness: 0.82,
    metalness: 0.1,
    repeat: [2, 2],
  },
  {
    id: 'metal_sheet',
    name: 'Standing Seam Zinc-Aluminium Metal',
    category: 'roof',
    description: 'High-tensile industrial architectural metal roofing with vertical standing ribs and corrosion-resistant coating.',
    defaultColor: '#334155',
    roughness: 0.35,
    metalness: 0.8,
    repeat: [6, 6],
  },
  {
    id: 'concrete_roof_tile',
    name: 'Flat Contemporary Concrete Tile',
    category: 'roof',
    description: 'Modern minimalist charcoal interlocking concrete tiles with smooth water-shedding profiles.',
    defaultColor: '#0F172A',
    roughness: 0.65,
    metalness: 0.15,
    repeat: [5, 5],
  },
  {
    id: 'shingles',
    name: 'Architectural Asphalt Shingles',
    category: 'roof',
    description: 'Multi-layer dimensional fiberglass asphalt shingles with deep textured shadow lines.',
    defaultColor: '#475569',
    roughness: 0.9,
    metalness: 0.08,
    repeat: [5, 5],
  },
  {
    id: 'slate',
    name: 'Natural Riven Dark Slate',
    category: 'roof',
    description: 'Quarried metamorphic dark grey slate with natural cleaved edges and timeless durability.',
    defaultColor: '#1E293B',
    roughness: 0.5,
    metalness: 0.25,
    repeat: [4, 4],
  },
];

// Texture Caches to avoid duplicate memory allocation and memory leaks
const textureCache = new Map<string, THREE.CanvasTexture>();
const normalCache = new Map<string, THREE.CanvasTexture>();
const roughnessCache = new Map<string, THREE.CanvasTexture>();
const previewCache = new Map<string, string>();

/**
 * Creates dynamic PBR Canvas Textures (Diffuse Map, Normal Map, Roughness Map)
 * for each material finish definition.
 */
export function getPBRTextureSet(finishId: string): {
  map: THREE.CanvasTexture;
  normalMap: THREE.CanvasTexture;
  roughnessMap: THREE.CanvasTexture;
} {
  const cachedMap = textureCache.get(finishId);
  const cachedNorm = normalCache.get(finishId);
  const cachedRough = roughnessCache.get(finishId);

  if (cachedMap && cachedNorm && cachedRough) {
    return { map: cachedMap, normalMap: cachedNorm, roughnessMap: cachedRough };
  }

  const canvasSize = 512;
  const diffuseCanvas = document.createElement('canvas');
  diffuseCanvas.width = canvasSize;
  diffuseCanvas.height = canvasSize;
  const ctx = diffuseCanvas.getContext('2d')!;

  const normalCanvas = document.createElement('canvas');
  normalCanvas.width = canvasSize;
  normalCanvas.height = canvasSize;
  const nCtx = normalCanvas.getContext('2d')!;

  const roughCanvas = document.createElement('canvas');
  roughCanvas.width = canvasSize;
  roughCanvas.height = canvasSize;
  const rCtx = roughCanvas.getContext('2d')!;

  // Fill base defaults
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, canvasSize, canvasSize);

  nCtx.fillStyle = '#8080FF'; // Flat normal RGB(128, 128, 255)
  nCtx.fillRect(0, 0, canvasSize, canvasSize);

  rCtx.fillStyle = '#808080';
  rCtx.fillRect(0, 0, canvasSize, canvasSize);

  drawProceduralPattern(finishId, ctx, nCtx, rCtx, canvasSize);

  // Generate Three.js textures
  const map = new THREE.CanvasTexture(diffuseCanvas);
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;

  const normalMap = new THREE.CanvasTexture(normalCanvas);
  normalMap.wrapS = THREE.RepeatWrapping;
  normalMap.wrapT = THREE.RepeatWrapping;

  const roughnessMap = new THREE.CanvasTexture(roughCanvas);
  roughnessMap.wrapS = THREE.RepeatWrapping;
  roughnessMap.wrapT = THREE.RepeatWrapping;

  // Cache textures
  textureCache.set(finishId, map);
  normalCache.set(finishId, normalMap);
  roughnessCache.set(finishId, roughnessMap);

  // Also cache preview data URL
  if (!previewCache.has(finishId)) {
    previewCache.set(finishId, diffuseCanvas.toDataURL('image/jpeg', 0.85));
  }

  return { map, normalMap, roughnessMap };
}

/**
 * Procedural PBR Pattern synthesis generator
 */
function drawProceduralPattern(
  id: string,
  ctx: CanvasRenderingContext2D,
  nCtx: CanvasRenderingContext2D,
  rCtx: CanvasRenderingContext2D,
  size: number
) {
  switch (id) {
    case 'italian_white_marble': {
      // Marble Statuario White base with organic veining
      ctx.fillStyle = '#F8FAFC';
      ctx.fillRect(0, 0, size, size);

      // Veins
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#94A3B8';
      ctx.beginPath();
      ctx.moveTo(40, 0);
      ctx.bezierCurveTo(120, 160, 200, 220, 320, 512);
      ctx.moveTo(180, 0);
      ctx.bezierCurveTo(240, 120, 380, 300, 512, 380);
      ctx.stroke();

      // Gold subtle veins
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = '#EAB308';
      ctx.beginPath();
      ctx.moveTo(60, 0);
      ctx.bezierCurveTo(140, 180, 220, 240, 340, 512);
      ctx.stroke();

      // Normal bump on veins
      nCtx.lineWidth = 4;
      nCtx.strokeStyle = '#6B7280';
      nCtx.beginPath();
      nCtx.moveTo(40, 0);
      nCtx.bezierCurveTo(120, 160, 200, 220, 320, 512);
      nCtx.stroke();

      // High gloss roughness
      rCtx.fillStyle = '#222222';
      rCtx.fillRect(0, 0, size, size);
      break;
    }

    case 'black_galaxy_marble': {
      ctx.fillStyle = '#090D16';
      ctx.fillRect(0, 0, size, size);

      // Gold and silver specks
      for (let i = 0; i < 600; i++) {
        const x = Math.random() * size;
        const y = Math.random() * size;
        const r = Math.random() * 2 + 0.5;
        ctx.fillStyle = Math.random() > 0.5 ? '#FBBF24' : '#E2E8F0';
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      rCtx.fillStyle = '#1A1A1A';
      rCtx.fillRect(0, 0, size, size);
      break;
    }

    case 'glossy_vitrified_tile':
    case 'matte_vitrified_tile':
    case 'ceramic_tile': {
      const tileDiv = id === 'ceramic_tile' ? 8 : 4;
      const step = size / tileDiv;

      ctx.fillStyle = id === 'glossy_vitrified_tile' ? '#F8FAFC' : '#E2E8F0';
      ctx.fillRect(0, 0, size, size);

      // Tile grout lines
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = id === 'glossy_vitrified_tile' ? '#CBD5E1' : '#94A3B8';
      nCtx.lineWidth = 3;
      nCtx.strokeStyle = '#5050C0';

      for (let x = 0; x <= size; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, size);
        ctx.stroke();

        nCtx.beginPath();
        nCtx.moveTo(x, 0);
        nCtx.lineTo(x, size);
        nCtx.stroke();
      }

      for (let y = 0; y <= size; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(size, y);
        ctx.stroke();

        nCtx.beginPath();
        nCtx.moveTo(0, y);
        nCtx.lineTo(size, y);
        nCtx.stroke();
      }

      rCtx.fillStyle = id === 'glossy_vitrified_tile' ? '#151515' : '#888888';
      rCtx.fillRect(0, 0, size, size);
      break;
    }

    case 'oak_wood':
    case 'teak_wood': {
      const isTeak = id === 'teak_wood';
      ctx.fillStyle = isTeak ? '#78350F' : '#B45309';
      ctx.fillRect(0, 0, size, size);

      // Wood grain lines
      const planks = 6;
      const pHeight = size / planks;

      for (let p = 0; p < planks; p++) {
        const yBase = p * pHeight;

        // Plank joint line
        ctx.lineWidth = 2;
        ctx.strokeStyle = isTeak ? '#451A03' : '#78350F';
        ctx.beginPath();
        ctx.moveTo(0, yBase);
        ctx.lineTo(size, yBase);
        ctx.stroke();

        // Grains inside plank
        for (let g = 0; g < 14; g++) {
          const gy = yBase + (g / 14) * pHeight;
          ctx.lineWidth = 1;
          ctx.strokeStyle = isTeak ? '#92400E' : '#D97706';
          ctx.beginPath();
          ctx.moveTo(0, gy);
          ctx.bezierCurveTo(size * 0.3, gy + 3, size * 0.7, gy - 3, size, gy);
          ctx.stroke();
        }
      }

      rCtx.fillStyle = '#606060';
      rCtx.fillRect(0, 0, size, size);
      break;
    }

    case 'stone_cladding': {
      ctx.fillStyle = '#475569';
      ctx.fillRect(0, 0, size, size);

      // Stacked stone layers
      const rows = 12;
      const rH = size / rows;
      for (let r = 0; r < rows; r++) {
        const y = r * rH;
        ctx.fillStyle = r % 2 === 0 ? '#334155' : '#64748B';
        ctx.fillRect(0, y, size, rH);

        ctx.strokeStyle = '#1E293B';
        ctx.lineWidth = 3;
        ctx.strokeRect(0, y, size, rH);

        // Vertical stones
        for (let s = 1; s <= 4; s++) {
          const sx = (s * size) / 4 + ((r % 3) * 20);
          ctx.beginPath();
          ctx.moveTo(sx, y);
          ctx.lineTo(sx, y + rH);
          ctx.stroke();

          nCtx.lineWidth = 4;
          nCtx.strokeStyle = '#3030A0';
          nCtx.beginPath();
          nCtx.moveTo(sx, y);
          nCtx.lineTo(sx, y + rH);
          nCtx.stroke();
        }
      }
      rCtx.fillStyle = '#999999';
      rCtx.fillRect(0, 0, size, size);
      break;
    }

    case 'brick_finish': {
      ctx.fillStyle = '#9A3412';
      ctx.fillRect(0, 0, size, size);

      const rows = 16;
      const rowH = size / rows;
      const brickW = size / 4;

      ctx.strokeStyle = '#D4D4D8';
      ctx.lineWidth = 3;

      for (let r = 0; r <= rows; r++) {
        const y = r * rowH;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(size, y);
        ctx.stroke();

        const offset = (r % 2) * (brickW / 2);
        for (let x = offset; x <= size; x += brickW) {
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x, y + rowH);
          ctx.stroke();
        }
      }
      rCtx.fillStyle = '#AAAAAA';
      rCtx.fillRect(0, 0, size, size);
      break;
    }

    case 'clay_roof_tile': {
      ctx.fillStyle = '#B91C1C';
      ctx.fillRect(0, 0, size, size);

      // Corrugated Spanish barrel tile ridges
      const waves = 10;
      const wWidth = size / waves;

      for (let w = 0; w < waves; w++) {
        const wx = w * wWidth;
        const grad = ctx.createLinearGradient(wx, 0, wx + wWidth, 0);
        grad.addColorStop(0, '#7F1D1D');
        grad.addColorStop(0.5, '#EF4444');
        grad.addColorStop(1, '#991B1B');

        ctx.fillStyle = grad;
        ctx.fillRect(wx, 0, wWidth, size);

        // Tile overlap steps
        for (let y = 0; y < size; y += 40) {
          ctx.strokeStyle = '#450A0A';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(wx, y);
          ctx.lineTo(wx + wWidth, y);
          ctx.stroke();
        }
      }
      rCtx.fillStyle = '#777777';
      rCtx.fillRect(0, 0, size, size);
      break;
    }

    case 'metal_sheet': {
      ctx.fillStyle = '#334155';
      ctx.fillRect(0, 0, size, size);

      // Standing Seam Ribs
      const ribs = 8;
      const rStep = size / ribs;

      for (let i = 0; i < ribs; i++) {
        const rx = i * rStep;
        // Raised seam rib
        ctx.fillStyle = '#1E293B';
        ctx.fillRect(rx, 0, 6, size);
        ctx.fillStyle = '#64748B';
        ctx.fillRect(rx + 6, 0, 4, size);

        nCtx.fillStyle = '#5050E0';
        nCtx.fillRect(rx, 0, 10, size);
      }
      rCtx.fillStyle = '#333333';
      rCtx.fillRect(0, 0, size, size);
      break;
    }

    default: {
      // Smooth plaster / concrete fallback with subtle organic grain
      ctx.fillStyle = '#E2E8F0';
      ctx.fillRect(0, 0, size, size);

      // Light speckling
      for (let i = 0; i < 400; i++) {
        const x = Math.random() * size;
        const y = Math.random() * size;
        ctx.fillStyle = Math.random() > 0.5 ? '#CBD5E1' : '#94A3B8';
        ctx.fillRect(x, y, 1.5, 1.5);
      }
      rCtx.fillStyle = '#888888';
      rCtx.fillRect(0, 0, size, size);
      break;
    }
  }
}

/**
 * Returns a high-res data URL preview image for a material finish definition.
 */
export function getFinishPreviewDataUrl(finishId: string): string {
  if (previewCache.has(finishId)) {
    return previewCache.get(finishId)!;
  }
  // Force generation
  getPBRTextureSet(finishId);
  return previewCache.get(finishId) || '';
}

/**
 * Find definition by ID across all categories
 */
export function getFinishDefinition(id: string): FinishDefinition | undefined {
  return (
    FLOOR_FINISHES.find((f) => f.id === id) ||
    WALL_FINISHES.find((f) => f.id === id) ||
    ROOF_FINISHES.find((f) => f.id === id)
  );
}

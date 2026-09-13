import { BuildingSpecification } from '../types/building';
import { EstimationSummary, MaterialItem, CostCategory, TimelinePhase } from '../types/estimation';

export interface ConstructionRates {
  cement: number; // per 50kg bag (INR)
  steel: number;   // per kg (INR)
  bricks: number;   // per brick/block (INR)
  sand: number;    // per cu.ft (INR)
  aggregate: number; // per cu.ft (INR)
  flooring: number; // per sq.ft (INR)
  paint: number;  // per liter (INR)
  doors: number; // per flush/teak door unit
  windows: number; // per UPVC/Aluminium window unit
}

export const DEFAULT_RATES: ConstructionRates = {
  cement: 380,
  steel: 68,
  bricks: 9,
  sand: 55,
  aggregate: 45,
  flooring: 75,
  paint: 280,
  doors: 8500,
  windows: 6500,
};

export function calculateEstimation(
  spec: BuildingSpecification,
  customRates: Partial<ConstructionRates> = {}
): EstimationSummary {
  const rates: ConstructionRates = { ...DEFAULT_RATES, ...customRates };
  const totalArea = Math.max(spec.totalBuiltUpAreaSqFt, 300);
  const floorsCount = Math.max(spec.floors.length, 1);

  // Count total doors and windows across all rooms
  let totalDoors = 0;
  let totalWindows = 0;
  spec.floors.forEach(floor => {
    floor.rooms.forEach(room => {
      room.openings.forEach(op => {
        if (op.type === 'door') totalDoors++;
        if (op.type === 'window') totalWindows++;
      });
    });
  });
  if (totalDoors === 0) totalDoors = spec.floors.reduce((acc, f) => acc + f.rooms.length * 1.5, 0);
  if (totalWindows === 0) totalWindows = spec.floors.reduce((acc, f) => acc + f.rooms.length * 1.2, 0);

  // Structural engineering standard rule-of-thumb ratios (IS 456 / NBC Standards)
  const cementBags = Math.round(totalArea * 0.42); // 0.42 bags per sq.ft
  const steelKg = Math.round(totalArea * 3.8); // 3.8 kg per sq.ft
  const bricksCount = Math.round(totalArea * 18.5); // 18.5 bricks per sq.ft
  const sandCuFt = Math.round(totalArea * 1.75); // 1.75 cu.ft per sq.ft
  const aggregateCuFt = Math.round(totalArea * 1.35); // 1.35 cu.ft per sq.ft
  const flooringSqFt = Math.round(totalArea * 1.15); // 1.15x for cut wastage & skirting
  const paintLiters = Math.round(totalArea * 0.18);

  const materials: MaterialItem[] = [
    {
      id: 'mat_cement',
      name: 'OPC/PPC Grade 53 Cement',
      category: 'structural',
      quantity: cementBags,
      unit: 'bags (50kg)',
      unitRate: rates.cement,
      totalCost: cementBags * rates.cement,
      description: 'Used for RCC foundation, plinth beams, columns, roof slabs, and masonry mortar.',
    },
    {
      id: 'mat_steel',
      name: 'Fe550D TMT Reinforcement Steel',
      category: 'structural',
      quantity: steelKg,
      unit: 'kg',
      unitRate: rates.steel,
      totalCost: steelKg * rates.steel,
      description: 'High-ductility earthquake-resistant rebars for columns, beams, and slabs.',
    },
    {
      id: 'mat_bricks',
      name: 'Autoclaved Aerated (AAC) Blocks / Red Clay Bricks',
      category: 'masonry',
      quantity: bricksCount,
      unit: 'pcs',
      unitRate: rates.bricks,
      totalCost: bricksCount * rates.bricks,
      description: 'Exterior 9-inch load-bearing/curtain walls and interior 4-inch partition walls.',
    },
    {
      id: 'mat_sand',
      name: 'Manufactured Sand (M-Sand) & Plastering Sand',
      category: 'aggregates',
      quantity: sandCuFt,
      unit: 'cu.ft',
      unitRate: rates.sand,
      totalCost: sandCuFt * rates.sand,
      description: 'Zone-II graded sand for concrete mix and double-coat wall plastering.',
    },
    {
      id: 'mat_aggregate',
      name: 'Coarse Blue Metal Aggregate (20mm & 10mm)',
      category: 'aggregates',
      quantity: aggregateCuFt,
      unit: 'cu.ft',
      unitRate: rates.aggregate,
      totalCost: aggregateCuFt * rates.aggregate,
      description: 'Machine-crushed granite aggregate for M20/M25 design-mix concrete.',
    },
    {
      id: 'mat_flooring',
      name: 'Vitrified Nano-Polished Tiles / Granite',
      category: 'finishing',
      quantity: flooringSqFt,
      unit: 'sq.ft',
      unitRate: rates.flooring,
      totalCost: flooringSqFt * rates.flooring,
      description: 'Living, bedroom, and kitchen flooring with matching wall skirting.',
    },
    {
      id: 'mat_paint',
      name: 'Premium Weathercoat & Interior Silk Paint',
      category: 'finishing',
      quantity: paintLiters,
      unit: 'liters',
      unitRate: rates.paint,
      totalCost: paintLiters * rates.paint,
      description: '1 coat primer + 2 coats premium emulsion with anti-fungal treatment.',
    },
    {
      id: 'mat_doors',
      name: 'Engineered Flush / Solid Core Wood Doors',
      category: 'openings',
      quantity: Math.max(Math.round(totalDoors), 3),
      unit: 'units',
      unitRate: rates.doors,
      totalCost: Math.max(Math.round(totalDoors), 3) * rates.doors,
      description: 'Main teak veneer entrance door and water-resistant internal doors with hardware.',
    },
    {
      id: 'mat_windows',
      name: 'UPVC 3-Track Sliding Windows with Bug Mesh',
      category: 'openings',
      quantity: Math.max(Math.round(totalWindows), 4),
      unit: 'units',
      unitRate: rates.windows,
      totalCost: Math.max(Math.round(totalWindows), 4) * rates.windows,
      description: 'Acoustic-damped double-glazed UPVC frames with toughened safety glass.',
    },
  ];

  const directMaterialCost = materials.reduce((sum, item) => sum + item.totalCost, 0);

  // Category splits based on comprehensive construction benchmarks
  const totalCost = Math.round(directMaterialCost * 1.78);

  const costBreakdown: CostCategory[] = [
    {
      id: 'cat_structure',
      name: 'Substructure & RCC Frame',
      amount: Math.round(totalCost * 0.40),
      percentage: 40,
      color: '#D4AF37', // Gold
      iconName: 'Building',
      description: 'Excavation, footings, plinth beam, columns, shear walls, and floor slabs.',
    },
    {
      id: 'cat_masonry',
      name: 'Masonry & Plastering',
      amount: Math.round(totalCost * 0.16),
      percentage: 16,
      color: '#F59E0B', // Amber
      iconName: 'Layers',
      description: 'Internal & external wall blockwork, sill slabs, and internal/external plaster.',
    },
    {
      id: 'cat_mep',
      name: 'MEP (Electrical & Plumbing)',
      amount: Math.round(totalCost * 0.14),
      percentage: 14,
      color: '#38BDF8', // Cyan
      iconName: 'Zap',
      description: 'Concealed copper wiring, distribution boards, CPVC water lines, and drainage.',
    },
    {
      id: 'cat_finishing',
      name: 'Finishing & Flooring',
      amount: Math.round(totalCost * 0.18),
      percentage: 18,
      color: '#A855F7', // Purple
      iconName: 'Paintbrush',
      description: 'Vitrified tile flooring, wall putty, acrylic emulsion paint, and false ceilings.',
    },
    {
      id: 'cat_openings',
      name: 'Doors, Windows & Railings',
      amount: Math.round(totalCost * 0.08),
      percentage: 8,
      color: '#10B981', // Emerald
      iconName: 'DoorOpen',
      description: 'Teakwood main door, flush internal doors, UPVC window frames, and SS balcony glass railings.',
    },
    {
      id: 'cat_misc',
      name: 'Permits, Site Prep & Quality Testing',
      amount: Math.round(totalCost * 0.04),
      percentage: 4,
      color: '#94A3B8', // Silver
      iconName: 'ShieldCheck',
      description: 'Soil testing, structural engineering vetting, municipal permits, and safety setup.',
    },
  ];

  // Timeline computation based on floor count and square footage
  const baseWeeks = 4;
  const foundationWeeks = 4;
  const superstructureWeeks = floorsCount * 3;
  const masonryWeeks = floorsCount * 2.5;
  const mepWeeks = 3;
  const finishingWeeks = 4;
  const handoverWeeks = 2;

  let currentWeek = 1;
  const timelinePhases: TimelinePhase[] = [
    {
      id: 'phase_planning',
      name: '1. Architectural Approvals & Site Setup',
      durationWeeks: baseWeeks,
      startWeek: currentWeek,
      endWeek: (currentWeek += baseWeeks) - 1,
      progressPercentage: 100,
      description: 'Soil boring test, municipal sanction drawings, temporary water & power installation.',
      keyDeliverables: ['Structural CAD Set', 'Soil Report', 'Sanction Letter'],
    },
    {
      id: 'phase_foundation',
      name: '2. Earthwork & Deep RCC Foundation',
      durationWeeks: foundationWeeks,
      startWeek: currentWeek,
      endWeek: (currentWeek += foundationWeeks) - 1,
      progressPercentage: 60,
      description: 'Excavation to hard rock/strata, PCC bed, isolated column footings, and plinth beam tie-up.',
      keyDeliverables: ['Footing Concrete Pour', 'Anti-termite Treatment', 'Plinth Beam Curing'],
    },
    {
      id: 'phase_superstructure',
      name: `3. RCC Superstructure (${floorsCount} Floor Slabs)`,
      durationWeeks: superstructureWeeks,
      startWeek: currentWeek,
      endWeek: (currentWeek += superstructureWeeks) - 1,
      progressPercentage: 20,
      description: 'Shuttering, column reinforcement cage binding, beam-slab formwork, and Ready-Mix-Concrete pours.',
      keyDeliverables: ['Column Castings', 'Intermediate Slab Pours', 'Terrace Slab Waterproofing'],
    },
    {
      id: 'phase_masonry',
      name: '4. Blockwork & Double-Coat Plastering',
      durationWeeks: Math.round(masonryWeeks),
      startWeek: currentWeek,
      endWeek: (currentWeek += Math.round(masonryWeeks)) - 1,
      progressPercentage: 0,
      description: 'Precision AAC block laying, lintel band concrete casting, electrical chase cutting, and cement plastering.',
      keyDeliverables: ['Room Partitioning', 'Lintels & Sunshades', 'Plaster Surface Curing'],
    },
    {
      id: 'phase_mep',
      name: '5. Concealed Electrical & Plumbing (MEP)',
      durationWeeks: mepWeeks,
      startWeek: currentWeek,
      endWeek: (currentWeek += mepWeeks) - 1,
      progressPercentage: 0,
      description: 'Fire-retardant electrical conduits, sanitary drain stacks, overhead tank plumbing, and solar conduit lines.',
      keyDeliverables: ['Pressure Leak Testing', 'Conduit Inspection', 'Earthing Pit'],
    },
    {
      id: 'phase_finishing',
      name: '6. Tiling, False Ceiling & Prime Painting',
      durationWeeks: finishingWeeks,
      startWeek: currentWeek,
      endWeek: (currentWeek += finishingWeeks) - 1,
      progressPercentage: 0,
      description: 'Large-format tile laying with laser leveling, bathroom anti-skid tiling, POP cornice, and primer application.',
      keyDeliverables: ['Floor Tile Alignment', 'Bathroom Waterproof Testing', 'Base Wall Putty'],
    },
    {
      id: 'phase_handover',
      name: '7. Final Polish, Fixtures & Client Handover',
      durationWeeks: handoverWeeks,
      startWeek: currentWeek,
      endWeek: (currentWeek += handoverWeeks) - 1,
      progressPercentage: 0,
      description: 'Sanitaryware fitting, modular switchplate install, deep chemical cleaning, snag-list resolution, and key handover.',
      keyDeliverables: ['Electrical Load Test', 'Snag-Free Certificate', 'Client Key Handover'],
    },
  ];

  const totalWeeks = timelinePhases[timelinePhases.length - 1].endWeek;
  const totalDays = totalWeeks * 7;

  return {
    materials,
    costBreakdown,
    totalCost,
    timelinePhases,
    totalWeeks,
    totalDays,
    currency: 'INR',
    lastCalculated: new Date().toISOString(),
  };
}

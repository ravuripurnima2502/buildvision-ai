export interface FurnitureCatalogItem {
  id: string;
  name: string;
  category: 'Furniture' | 'Appliance' | 'Decor' | 'Sanitary' | 'Lighting';
  modelPath?: string;
  dimensions: {
    width: number;  // X axis span in meters
    length: number; // Z axis span in meters
    height: number; // Y axis span in meters
  };
  defaultScale: {
    x: number;
    y: number;
    z: number;
  };
  defaultRotation: {
    x: number;
    y: number;
    z: number;
  };
  validRooms: string[];
  estimatedCost: number;
  aliases: string[];
  description: string;
  iconName: string;
}

export const FURNITURE_CATALOG: FurnitureCatalogItem[] = [
  // ================= KITCHEN =================
  {
    id: 'refrigerator',
    name: 'French Door Refrigerator',
    category: 'Appliance',
    dimensions: { width: 0.9, length: 0.85, height: 1.85 },
    defaultScale: { x: 1, y: 1, z: 1 },
    defaultRotation: { x: 0, y: 0, z: 0 },
    validRooms: ['kitchen', 'utility', 'dining'],
    estimatedCost: 45000,
    aliases: ['refrigerator', 'fridge', 'freeze', 'freezer', 'fridge lagao', 'fridge pettu'],
    description: 'Energy-star multi-door inverter refrigerator with brushed steel finish.',
    iconName: 'Refrigerator',
  },
  {
    id: 'kitchen_cabinet',
    name: 'Modular Base & Wall Cabinets',
    category: 'Furniture',
    dimensions: { width: 1.8, length: 0.65, height: 0.88 },
    defaultScale: { x: 1, y: 1, z: 1 },
    defaultRotation: { x: 0, y: 0, z: 0 },
    validRooms: ['kitchen', 'utility'],
    estimatedCost: 38000,
    aliases: ['kitchen cabinet', 'cabinet', 'cupboard', 'kitchen shelf', 'kitchen counter'],
    description: 'Acrylic high-gloss modular cabinets with soft-close drawers and quartz countertop.',
    iconName: 'LayoutGrid',
  },
  {
    id: 'microwave',
    name: 'Convection Microwave Oven',
    category: 'Appliance',
    dimensions: { width: 0.55, length: 0.42, height: 0.35 },
    defaultScale: { x: 1, y: 1, z: 1 },
    defaultRotation: { x: 0, y: 0, z: 0 },
    validRooms: ['kitchen', 'dining'],
    estimatedCost: 14500,
    aliases: ['microwave', 'micro wave', 'microwave oven'],
    description: '32L digital convection microwave with grill and auto-cook menus.',
    iconName: 'Flame',
  },
  {
    id: 'oven',
    name: 'Built-in Electric Oven',
    category: 'Appliance',
    dimensions: { width: 0.6, length: 0.6, height: 0.6 },
    defaultScale: { x: 1, y: 1, z: 1 },
    defaultRotation: { x: 0, y: 0, z: 0 },
    validRooms: ['kitchen'],
    estimatedCost: 32000,
    aliases: ['oven', 'baking oven', 'stove oven', 'built-in oven'],
    description: 'Stainless steel built-in culinary oven with rotisserie and catalytic cleaning.',
    iconName: 'Flame',
  },
  {
    id: 'sink',
    name: 'Double Bowl Kitchen Sink',
    category: 'Sanitary',
    dimensions: { width: 1.0, length: 0.5, height: 0.4 },
    defaultScale: { x: 1, y: 1, z: 1 },
    defaultRotation: { x: 0, y: 0, z: 0 },
    validRooms: ['kitchen', 'utility'],
    estimatedCost: 12500,
    aliases: ['sink', 'kitchen sink', 'wash sink', 'double sink'],
    description: 'Sound-damped 304 stainless steel sink with swivel gooseneck pull-out mixer.',
    iconName: 'Droplet',
  },
  {
    id: 'water_purifier',
    name: 'RO + UV Water Purifier',
    category: 'Appliance',
    dimensions: { width: 0.4, length: 0.28, height: 0.52 },
    defaultScale: { x: 1, y: 1, z: 1 },
    defaultRotation: { x: 0, y: 0, z: 0 },
    validRooms: ['kitchen', 'utility'],
    estimatedCost: 18500,
    aliases: ['water purifier', 'purifier', 'ro', 'aquaguard', 'water filter', 'filter'],
    description: 'Multi-stage RO + UV + TDS controller water purifier with copper alkaline cartridge.',
    iconName: 'ShieldCheck',
  },

  // ================= LIVING / HALL =================
  {
    id: 'sofa',
    name: 'Contemporary Sectional Sofa',
    category: 'Furniture',
    dimensions: { width: 2.3, length: 1.1, height: 0.85 },
    defaultScale: { x: 1, y: 1, z: 1 },
    defaultRotation: { x: 0, y: 0, z: 0 },
    validRooms: ['living', 'lounge', 'study'],
    estimatedCost: 36000,
    aliases: ['sofa', 'couch', 'settee', 'sectional', 'l-sofa', 'sofa pettu', 'sofa add karo'],
    description: 'High-density foam sectional sofa upholstered in stain-resistant velvet fabric.',
    iconName: 'Armchair',
  },
  {
    id: 'coffee_table',
    name: 'Tempered Glass Coffee Table',
    category: 'Furniture',
    dimensions: { width: 1.1, length: 0.6, height: 0.42 },
    defaultScale: { x: 1, y: 1, z: 1 },
    defaultRotation: { x: 0, y: 0, z: 0 },
    validRooms: ['living', 'lounge'],
    estimatedCost: 11000,
    aliases: ['coffee table', 'center table', 'tea table'],
    description: 'Beveled tempered smoked glass coffee table with brushed champagne gold legs.',
    iconName: 'Coffee',
  },
  {
    id: 'tv',
    name: '65-inch 4K OLED Smart TV',
    category: 'Appliance',
    dimensions: { width: 1.45, length: 0.1, height: 0.85 },
    defaultScale: { x: 1, y: 1, z: 1 },
    defaultRotation: { x: 0, y: 0, z: 0 },
    validRooms: ['living', 'bedroom', 'master_bedroom', 'lounge'],
    estimatedCost: 65000,
    aliases: ['tv', 'television', 'oled tv', 'smart tv', 'screen', 'led tv'],
    description: 'Ultra-slim 65" 4K OLED HDR display with integrated Dolby Atmos soundbar.',
    iconName: 'Tv',
  },
  {
    id: 'tv_unit',
    name: 'Floating Architectural TV Console',
    category: 'Furniture',
    dimensions: { width: 2.0, length: 0.4, height: 0.45 },
    defaultScale: { x: 1, y: 1, z: 1 },
    defaultRotation: { x: 0, y: 0, z: 0 },
    validRooms: ['living', 'bedroom', 'master_bedroom', 'lounge'],
    estimatedCost: 22000,
    aliases: ['tv unit', 'tv stand', 'tv cabinet', 'entertainment unit', 'console'],
    description: 'Wall-mounted fluted oak TV media console with concealed cable management.',
    iconName: 'Tv2',
  },
  {
    id: 'floor_lamp',
    name: 'Arched Brass Floor Lamp',
    category: 'Lighting',
    dimensions: { width: 0.5, length: 0.5, height: 1.85 },
    defaultScale: { x: 1, y: 1, z: 1 },
    defaultRotation: { x: 0, y: 0, z: 0 },
    validRooms: ['living', 'bedroom', 'master_bedroom', 'study', 'lounge'],
    estimatedCost: 8500,
    aliases: ['floor lamp', 'standing lamp', 'tall lamp', 'lamp'],
    description: 'Minimalist curved brushed brass floor lamp with dimmable warm ambient LED.',
    iconName: 'Sun',
  },
  {
    id: 'flower_vase',
    name: 'Ceramic Designer Flower Vase',
    category: 'Decor',
    dimensions: { width: 0.35, length: 0.35, height: 0.65 },
    defaultScale: { x: 1, y: 1, z: 1 },
    defaultRotation: { x: 0, y: 0, z: 0 },
    validRooms: ['living', 'dining', 'bedroom', 'master_bedroom', 'foyer', 'balcony'],
    estimatedCost: 4500,
    aliases: ['flower vase', 'vase', 'flowers', 'plant vase', 'flower pot', 'potted plant'],
    description: 'Artisan handcrafted ribbed ceramic vase with fresh blooming indoor foliage.',
    iconName: 'Sparkles',
  },
  {
    id: 'center_table',
    name: 'Marble Top Center Table',
    category: 'Furniture',
    dimensions: { width: 1.2, length: 0.7, height: 0.45 },
    defaultScale: { x: 1, y: 1, z: 1 },
    defaultRotation: { x: 0, y: 0, z: 0 },
    validRooms: ['living', 'lounge'],
    estimatedCost: 17500,
    aliases: ['center table'],
    description: 'Natural Carrara white marble tabletop with geometric steel pedestal frame.',
    iconName: 'Table',
  },
  {
    id: 'bookshelf',
    name: 'Architectural Open Bookshelf',
    category: 'Furniture',
    dimensions: { width: 1.2, length: 0.38, height: 1.95 },
    defaultScale: { x: 1, y: 1, z: 1 },
    defaultRotation: { x: 0, y: 0, z: 0 },
    validRooms: ['living', 'study', 'bedroom', 'lounge'],
    estimatedCost: 19500,
    aliases: ['bookshelf', 'book shelf', 'bookcase', 'storage rack', 'library rack'],
    description: 'Tall 5-tier asymmetrical bookshelf crafted in smoked walnut and matte black steel.',
    iconName: 'BookOpen',
  },

  // ================= BEDROOM =================
  {
    id: 'bed',
    name: 'King Size Upholstered Bed',
    category: 'Furniture',
    dimensions: { width: 2.1, length: 2.15, height: 1.1 },
    defaultScale: { x: 1, y: 1, z: 1 },
    defaultRotation: { x: 0, y: 0, z: 0 },
    validRooms: ['bedroom', 'master_bedroom'],
    estimatedCost: 42000,
    aliases: ['bed', 'king bed', 'queen bed', 'cot', 'double bed', 'bed pettu', 'bed lagao'],
    description: 'Luxury king-size bed with channel-tufted velvet headboard and hydraulic storage.',
    iconName: 'BedDouble',
  },
  {
    id: 'wardrobe',
    name: 'Floor-to-Ceiling Wardrobe',
    category: 'Furniture',
    dimensions: { width: 1.8, length: 0.65, height: 2.4 },
    defaultScale: { x: 1, y: 1, z: 1 },
    defaultRotation: { x: 0, y: 0, z: 0 },
    validRooms: ['bedroom', 'master_bedroom', 'dressing'],
    estimatedCost: 48000,
    aliases: ['wardrobe', 'closet', 'almirah', 'cupboard', 'almarah', 'wardrobe add cheyyi'],
    description: '4-door sliding wardrobe with tinted glass profile doors and sensor LED strips.',
    iconName: 'Columns',
  },
  {
    id: 'bedside_table',
    name: 'Dual Drawer Nightstand',
    category: 'Furniture',
    dimensions: { width: 0.5, length: 0.45, height: 0.5 },
    defaultScale: { x: 1, y: 1, z: 1 },
    defaultRotation: { x: 0, y: 0, z: 0 },
    validRooms: ['bedroom', 'master_bedroom'],
    estimatedCost: 7500,
    aliases: ['bedside table', 'nightstand', 'side table', 'bed side table'],
    description: 'Modern bedside table with wireless charging dock and soft-glide drawers.',
    iconName: 'Box',
  },
  {
    id: 'dressing_table',
    name: 'Vanity Dressing Table with Mirror',
    category: 'Furniture',
    dimensions: { width: 1.1, length: 0.45, height: 1.7 },
    defaultScale: { x: 1, y: 1, z: 1 },
    defaultRotation: { x: 0, y: 0, z: 0 },
    validRooms: ['bedroom', 'master_bedroom', 'dressing'],
    estimatedCost: 21000,
    aliases: ['dressing table', 'vanity', 'dresser', 'makeup table'],
    description: 'Full-length LED backlit vanity mirror table with velvet-lined jewelry compartments.',
    iconName: 'Sparkles',
  },
  {
    id: 'chair',
    name: 'Ergonomic Lounge / Study Chair',
    category: 'Furniture',
    dimensions: { width: 0.65, length: 0.65, height: 0.95 },
    defaultScale: { x: 1, y: 1, z: 1 },
    defaultRotation: { x: 0, y: 0, z: 0 },
    validRooms: ['bedroom', 'master_bedroom', 'study', 'balcony', 'living'],
    estimatedCost: 9500,
    aliases: ['chair', 'armchair', 'study chair', 'desk chair', 'lounge chair'],
    description: 'Ergonomic swivel armchair with breathable mesh lumbar support and leather accents.',
    iconName: 'Armchair',
  },
  {
    id: 'study_table',
    name: 'Executive Workstation Desk',
    category: 'Furniture',
    dimensions: { width: 1.4, length: 0.7, height: 0.76 },
    defaultScale: { x: 1, y: 1, z: 1 },
    defaultRotation: { x: 0, y: 0, z: 0 },
    validRooms: ['study', 'bedroom', 'master_bedroom'],
    estimatedCost: 16500,
    aliases: ['study table', 'desk', 'work desk', 'study desk', 'office table', 'table'],
    description: 'Teak wood executive study desk with cable organizer port and lockable pedestal.',
    iconName: 'Table',
  },
  {
    id: 'lamp',
    name: 'Minimalist Bedside Lamp',
    category: 'Lighting',
    dimensions: { width: 0.25, length: 0.25, height: 0.45 },
    defaultScale: { x: 1, y: 1, z: 1 },
    defaultRotation: { x: 0, y: 0, z: 0 },
    validRooms: ['bedroom', 'master_bedroom', 'study'],
    estimatedCost: 3500,
    aliases: ['lamp', 'table lamp', 'bed lamp', 'reading lamp', 'night lamp'],
    description: 'Touch-sensitive 3-step dimmable bedside warm accent lamp.',
    iconName: 'Sun',
  },

  // ================= DINING =================
  {
    id: 'dining_table',
    name: '6-Seater Solid Teak Dining Table',
    category: 'Furniture',
    dimensions: { width: 1.9, length: 1.0, height: 0.76 },
    defaultScale: { x: 1, y: 1, z: 1 },
    defaultRotation: { x: 0, y: 0, z: 0 },
    validRooms: ['dining', 'living'],
    estimatedCost: 34000,
    aliases: ['dining table', 'dining', 'dinner table', 'eating table', 'dining pettu', 'dining add karo'],
    description: 'Solid seasoned Burma teakwood dining table with water-resistant matte PU polish.',
    iconName: 'Utensils',
  },
  {
    id: 'dining_chairs',
    name: 'Upholstered Dining Chairs (Set of 6)',
    category: 'Furniture',
    dimensions: { width: 0.48, length: 0.52, height: 0.9 },
    defaultScale: { x: 1, y: 1, z: 1 },
    defaultRotation: { x: 0, y: 0, z: 0 },
    validRooms: ['dining'],
    estimatedCost: 24000,
    aliases: ['dining chairs', 'dining chair', 'chairs'],
    description: 'Set of 6 matching ergonomic dining chairs upholstered in easy-clean fabric.',
    iconName: 'Armchair',
  },
  {
    id: 'crockery_cabinet',
    name: 'Glass Front Crockery Showcase',
    category: 'Furniture',
    dimensions: { width: 1.3, length: 0.45, height: 1.85 },
    defaultScale: { x: 1, y: 1, z: 1 },
    defaultRotation: { x: 0, y: 0, z: 0 },
    validRooms: ['dining', 'living'],
    estimatedCost: 26000,
    aliases: ['crockery cabinet', 'china cabinet', 'showcase', 'display cabinet'],
    description: 'Tempered fluted glass front crockery display cabinet with integrated warm spotlights.',
    iconName: 'Layers',
  },

  // ================= BATHROOM =================
  {
    id: 'wash_basin',
    name: 'Countertop Ceramic Wash Basin',
    category: 'Sanitary',
    dimensions: { width: 0.65, length: 0.48, height: 0.4 },
    defaultScale: { x: 1, y: 1, z: 1 },
    defaultRotation: { x: 0, y: 0, z: 0 },
    validRooms: ['bathroom', 'dining'],
    estimatedCost: 9500,
    aliases: ['wash basin', 'basin', 'hand wash', 'sink basin'],
    description: 'Vitreous china countertop basin with waterfall chrome tall basin mixer.',
    iconName: 'Droplet',
  },
  {
    id: 'mirror',
    name: 'Smart Anti-Fog LED Bathroom Mirror',
    category: 'Decor',
    dimensions: { width: 0.7, length: 0.05, height: 0.9 },
    defaultScale: { x: 1, y: 1, z: 1 },
    defaultRotation: { x: 0, y: 0, z: 0 },
    validRooms: ['bathroom', 'dressing', 'bedroom'],
    estimatedCost: 6800,
    aliases: ['mirror', 'wall mirror', 'bathroom mirror', 'vanity mirror'],
    description: 'Backlit defogger touch-button bathroom mirror with color temperature control.',
    iconName: 'Sparkles',
  },
  {
    id: 'toilet',
    name: 'Wall-Hung Rimless Water Closet',
    category: 'Sanitary',
    dimensions: { width: 0.42, length: 0.58, height: 0.4 },
    defaultScale: { x: 1, y: 1, z: 1 },
    defaultRotation: { x: 0, y: 0, z: 0 },
    validRooms: ['bathroom'],
    estimatedCost: 16000,
    aliases: ['toilet', 'commode', 'wc', 'water closet', 'pot'],
    description: 'Concealed cistern wall-hung European water closet with soft-close UF seat cover.',
    iconName: 'Droplet',
  },
  {
    id: 'shower',
    name: 'Thermostatic Rain Shower Enclosure',
    category: 'Sanitary',
    dimensions: { width: 1.0, length: 1.0, height: 2.1 },
    defaultScale: { x: 1, y: 1, z: 1 },
    defaultRotation: { x: 0, y: 0, z: 0 },
    validRooms: ['bathroom'],
    estimatedCost: 28000,
    aliases: ['shower', 'shower enclosure', 'rain shower', 'shower cubicle'],
    description: '10mm toughened glass walk-in shower partition with ceiling-mounted rain shower.',
    iconName: 'Droplets',
  },
  {
    id: 'bath_cabinet',
    name: 'Moisture-Proof Vanity Cabinet',
    category: 'Furniture',
    dimensions: { width: 0.8, length: 0.5, height: 0.75 },
    defaultScale: { x: 1, y: 1, z: 1 },
    defaultRotation: { x: 0, y: 0, z: 0 },
    validRooms: ['bathroom'],
    estimatedCost: 13500,
    aliases: ['storage cabinet', 'bath cabinet', 'vanity cabinet'],
    description: 'Marine-grade waterproof PVC vanity storage cabinet with soft-close doors.',
    iconName: 'Box',
  },

  // ================= UTILITY =================
  {
    id: 'washing_machine',
    name: 'Front Load Inverter Washing Machine',
    category: 'Appliance',
    dimensions: { width: 0.65, length: 0.65, height: 0.85 },
    defaultScale: { x: 1, y: 1, z: 1 },
    defaultRotation: { x: 0, y: 0, z: 0 },
    validRooms: ['utility', 'bathroom', 'balcony', 'kitchen'],
    estimatedCost: 32000,
    aliases: ['washing machine', 'washer', 'laundry machine', 'dryer', 'washing machine lagao'],
    description: '9kg AI Direct Drive steam washing machine with 5-star energy rating.',
    iconName: 'Disc',
  },
  {
    id: 'storage_rack',
    name: 'Heavy Duty Utility Storage Rack',
    category: 'Furniture',
    dimensions: { width: 1.0, length: 0.45, height: 1.8 },
    defaultScale: { x: 1, y: 1, z: 1 },
    defaultRotation: { x: 0, y: 0, z: 0 },
    validRooms: ['utility', 'parking', 'balcony'],
    estimatedCost: 7500,
    aliases: ['storage rack', 'utility rack', 'utility shelf', 'rack'],
    description: 'Powder-coated rust-proof galvanised steel 5-tier storage shelving unit.',
    iconName: 'Layers',
  },
];

/**
 * Searches and normalizes user query to catalog item.
 * Supports exact IDs, names, and comprehensive aliases.
 */
export function findCatalogItem(query: string): FurnitureCatalogItem | undefined {
  if (!query) return undefined;
  const q = query.toLowerCase().trim().replace(/[-_]/g, ' ');

  // 1. Direct ID match
  let found = FURNITURE_CATALOG.find((item) => item.id.toLowerCase() === q || item.id.replace('_', ' ') === q);
  if (found) return found;

  // 2. Direct Name match
  found = FURNITURE_CATALOG.find((item) => item.name.toLowerCase() === q);
  if (found) return found;

  // 3. Alias match
  found = FURNITURE_CATALOG.find((item) =>
    item.aliases.some((alias) => q === alias || q.includes(alias) || alias.includes(q))
  );
  if (found) return found;

  // 4. Substring in Name
  return FURNITURE_CATALOG.find((item) => item.name.toLowerCase().includes(q) || q.includes(item.name.toLowerCase()));
}

/**
 * Get all furniture items appropriate for a specific room type
 */
export function getCatalogItemsForRoom(roomType: string): FurnitureCatalogItem[] {
  if (!roomType) return FURNITURE_CATALOG;
  const normalized = roomType.toLowerCase().trim();

  const matched = FURNITURE_CATALOG.filter((item) =>
    item.validRooms.some((vr) => normalized.includes(vr) || vr.includes(normalized))
  );

  // If none matched strictly, return all sorted by relevance
  return matched.length > 0 ? matched : FURNITURE_CATALOG;
}

/**
 * Get list of all unique categories
 */
export function getCatalogCategories(): string[] {
  return Array.from(new Set(FURNITURE_CATALOG.map((item) => item.category)));
}

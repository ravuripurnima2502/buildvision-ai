import { Project } from '../types/project';
import { generateStructuredBuilding } from '../engine/buildingGenerator';
import { calculateEstimation } from '../engine/estimator';
import { applyDesignModification } from '../engine/designModifier';
import { calculateChangeImpact } from '../engine/impactCalculator';

// 1. Modern Family Residence (3 Floors, 4 Bedrooms, Balconies, Parking)
const baseSpecFamily = generateStructuredBuilding({
  name: 'Modern Family Residence',
  purpose: 'residential',
  plotWidth: 14,
  plotLength: 18,
  floorsCount: 3,
  bedroomsCount: 4,
  hasParking: true,
  hasBalcony: true,
  hasGardenTerrace: true,
  architecturalStyle: 'contemporary',
});
const estFamilyV1 = calculateEstimation(baseSpecFamily);

// Version 2 for Modern Family: Added extended cantilever balcony
const modFamily = applyDesignModification(baseSpecFamily, 'Add an expansive wrap-around cantilever balcony to the first floor');
const estFamilyV2 = calculateEstimation(modFamily.updatedSpec);
const deltaFamilyV2 = calculateChangeImpact(baseSpecFamily, modFamily.updatedSpec, modFamily.changeSummary);

export const SAMPLE_PROJECT_MODERN_FAMILY: Project = {
  id: 'proj_modern_family_residence',
  title: 'Modern Family Residence',
  description: 'Contemporary 3-floor luxury villa with 4 bedrooms, double-height foyer, twin panoramic balconies, and rooftop sky garden.',
  journeyType: 'idea_to_structure',
  userId: 'demo_user',
  createdAt: '2026-09-01T10:00:00.000Z',
  updatedAt: '2026-09-10T14:30:00.000Z',
  currentVersionId: 'v2',
  tags: ['3 Floors', '4 Bedrooms', 'Cantilever Balcony', 'Solar Terrace'],
  versions: [
    {
      id: 'v1',
      versionNumber: 1,
      title: 'Original Concept Blueprint',
      description: 'Initial structural layout based on 14m x 18m plot boundary and client brief.',
      timestamp: '2026-09-01T10:00:00.000Z',
      buildingSpec: baseSpecFamily,
      estimation: estFamilyV1,
    },
    {
      id: 'v2',
      versionNumber: 2,
      title: 'Added Wrap-Around Balcony',
      description: 'Extended cantilever balcony on First Floor master bedroom with safety glass balustrades.',
      timestamp: '2026-09-10T14:30:00.000Z',
      buildingSpec: modFamily.updatedSpec,
      estimation: estFamilyV2,
      deltaFromPrevious: deltaFamilyV2,
    },
  ],
};

// 2. Urban Compact Residence (2 Floors, 3 Bedrooms, 2 Baths)
const baseSpecUrban = generateStructuredBuilding({
  name: 'Urban Compact Residence',
  purpose: 'residential',
  plotWidth: 10,
  plotLength: 14,
  floorsCount: 2,
  bedroomsCount: 3,
  hasParking: true,
  hasBalcony: true,
  architecturalStyle: 'minimalist',
});
const estUrban = calculateEstimation(baseSpecUrban);

export const SAMPLE_PROJECT_URBAN_COMPACT: Project = {
  id: 'proj_urban_compact',
  title: 'Urban Compact Residence',
  description: 'Smart space-optimized 2-floor residence designed for narrow urban plots with zero dead space.',
  journeyType: 'structure_to_3d',
  userId: 'demo_user',
  createdAt: '2026-09-05T09:00:00.000Z',
  updatedAt: '2026-09-08T16:00:00.000Z',
  currentVersionId: 'v1',
  tags: ['2 Floors', '3 Bedrooms', 'Space Optimized', 'Minimalist'],
  versions: [
    {
      id: 'v1',
      versionNumber: 1,
      title: 'Base Compact Layout',
      description: 'Optimized 2-floor layout maximizing natural daylighting and ventilation.',
      timestamp: '2026-09-05T09:00:00.000Z',
      buildingSpec: baseSpecUrban,
      estimation: estUrban,
    },
  ],
};

// 3. Existing House — Second Floor Proposal (Journey 3: Already Built -> Changes/Add Floor)
const existingBungalowSpec = generateStructuredBuilding({
  name: 'Existing Ground Floor Bungalow',
  purpose: 'residential',
  plotWidth: 12,
  plotLength: 15,
  floorsCount: 1,
  bedroomsCount: 2,
  hasParking: true,
  hasBalcony: false,
  architecturalStyle: 'modern',
});
const estExisting = calculateEstimation(existingBungalowSpec);

// Proposed change: Add an entire second floor on top of the existing bungalow!
const proposedAddition = applyDesignModification(existingBungalowSpec, 'Add another floor on top with a Penthouse Lounge and Open Sky Deck');
const estProposed = calculateEstimation(proposedAddition.updatedSpec);
const deltaProposed = calculateChangeImpact(existingBungalowSpec, proposedAddition.updatedSpec, 'Proposed Second Floor Addition: Penthouse Suite, Sky Lounge & Sun Deck');

export const SAMPLE_PROJECT_EXISTING_PROPOSAL: Project = {
  id: 'proj_existing_second_floor',
  title: 'Existing House — Second Floor Proposal',
  description: 'Visualizing vertical expansion: Adding a lightweight RCC second floor and sky deck atop an existing single-story structure.',
  journeyType: 'already_built_changes',
  userId: 'demo_user',
  createdAt: '2026-09-02T11:00:00.000Z',
  updatedAt: '2026-09-11T18:20:00.000Z',
  currentVersionId: 'v2',
  tags: ['Vertical Expansion', 'Add Floor', 'Before vs After', 'Renovation'],
  existingBuildingSpec: existingBungalowSpec,
  versions: [
    {
      id: 'v1',
      versionNumber: 1,
      title: 'Existing Structure (As-Built)',
      description: 'Current single-story bungalow with ground floor living, kitchen, and 2 bedrooms.',
      timestamp: '2026-09-02T11:00:00.000Z',
      buildingSpec: existingBungalowSpec,
      estimation: estExisting,
    },
    {
      id: 'v2',
      versionNumber: 2,
      title: 'Proposed 2nd Floor Addition',
      description: 'Superstructure addition: Upper lounge, private terrace, reinforced structural columns, and staircase extension.',
      timestamp: '2026-09-11T18:20:00.000Z',
      buildingSpec: proposedAddition.updatedSpec,
      estimation: estProposed,
      deltaFromPrevious: deltaProposed,
    },
  ],
};

export const INITIAL_DEMO_PROJECTS: Project[] = [
  SAMPLE_PROJECT_MODERN_FAMILY,
  SAMPLE_PROJECT_URBAN_COMPACT,
  SAMPLE_PROJECT_EXISTING_PROPOSAL,
];

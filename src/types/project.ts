import { BuildingSpecification } from './building';
import { EstimationSummary } from './estimation';

export type JourneyType =
  | 'structure_to_3d'         // Option 1: Don't have an idea -> Requirements to 3D
  | 'idea_to_structure'       // Option 2: Have an idea -> Idea to Structure to 3D
  | 'already_built_changes';  // Option 3: Already built -> Changes/Additional Floor

export interface MaterialDelta {
  item: string;
  deltaQuantity: string;
  isIncrease: boolean;
}

export interface ChangeImpactDelta {
  areaDeltaSqFt: number;
  costDelta: number;
  timeDeltaDays: number;
  materialDeltas: MaterialDelta[];
  summaryDescription: string;
  changedComponents: string[];
}

export interface ProjectVersion {
  id: string;
  versionNumber: number;
  title: string;
  description: string;
  timestamp: string;
  buildingSpec: BuildingSpecification;
  estimation: EstimationSummary;
  deltaFromPrevious?: ChangeImpactDelta;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  journeyType: JourneyType;
  userId: string;
  createdAt: string;
  updatedAt: string;
  currentVersionId: string;
  versions: ProjectVersion[];
  tags: string[];
  // For Journey 3 (Already Built), we preserve the original base structure
  existingBuildingSpec?: BuildingSpecification;
}

export interface User {
  id: string;
  email: string;
  name: string;
  company?: string;
  createdAt: string;
}

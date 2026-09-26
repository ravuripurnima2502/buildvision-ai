export interface MaterialItem {
  id: string;
  name: string;
  category: 'structural' | 'masonry' | 'finishing' | 'openings' | 'aggregates' | 'furniture';
  quantity: number;
  unit: string;
  unitRate: number; // in standard currency (e.g. INR ₹)
  totalCost: number;
  description: string;
}

export interface CostCategory {
  id: string;
  name: string;
  amount: number;
  percentage: number;
  color: string;
  iconName: string;
  description: string;
}

export interface TimelinePhase {
  id: string;
  name: string;
  durationWeeks: number;
  startWeek: number;
  endWeek: number;
  progressPercentage: number;
  description: string;
  keyDeliverables: string[];
}

export interface EstimationSummary {
  materials: MaterialItem[];
  costBreakdown: CostCategory[];
  totalCost: number;
  timelinePhases: TimelinePhase[];
  totalWeeks: number;
  totalDays: number;
  currency: string;
  lastCalculated: string;
}

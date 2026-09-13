export interface RoboContext {
  projectName: string;
  totalFloors: number;
  totalAreaSqFt: number;
  selectedFloor: number;
  selectedRoomName?: string;
  selectedRoomArea?: number;
  selectedRoomType?: string;
  estimatedCost: number;
  estimatedWeeks: number;
  lastChangeSummary?: string;
}

export interface RoboMessage {
  id: string;
  sender: 'user' | 'robo';
  text: string;
  timestamp: string;
  suggestedQuestions?: string[];
  civilTip?: string;
}

export interface RoboContext {
  projectName: string;
  totalFloors: number;
  totalAreaSqFt: number;
  selectedFloor: number;
  selectedRoomId?: string;
  selectedRoomName?: string;
  selectedRoomArea?: number;
  selectedRoomType?: string;
  estimatedCost: number;
  estimatedWeeks: number;
  lastChangeSummary?: string;
  currentSpec?: any;
  onAddElement?: (itemType: string, roomId?: string) => any;
}

export interface RoboMessage {
  id: string;
  sender: 'user' | 'robo';
  text: string;
  timestamp: string;
  suggestedQuestions?: string[];
  civilTip?: string;
}

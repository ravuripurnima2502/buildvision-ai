import { BuildingSpecification } from '../types/building';
import { ChangeImpactDelta, MaterialDelta } from '../types/project';
import { calculateEstimation } from './estimator';

export function calculateChangeImpact(
  previousSpec: BuildingSpecification,
  newSpec: BuildingSpecification,
  changeDescription: string
): ChangeImpactDelta {
  const prevEst = calculateEstimation(previousSpec);
  const newEst = calculateEstimation(newSpec);

  const areaDeltaSqFt = Math.round(newSpec.totalBuiltUpAreaSqFt - previousSpec.totalBuiltUpAreaSqFt);
  const costDelta = Math.round(newEst.totalCost - prevEst.totalCost);
  const timeDeltaDays = Math.round((newEst.totalWeeks - prevEst.totalWeeks) * 7);

  // Compare key materials
  const materialDeltas: MaterialDelta[] = [];
  const keyMatIds = ['mat_cement', 'mat_steel', 'mat_bricks', 'mat_flooring', 'mat_paint', 'mat_doors', 'mat_windows'];

  keyMatIds.forEach(id => {
    const prevItem = prevEst.materials.find(m => m.id === id);
    const newItem = newEst.materials.find(m => m.id === id);
    if (prevItem && newItem) {
      const diff = newItem.quantity - prevItem.quantity;
      if (Math.abs(diff) > 0) {
        const sign = diff > 0 ? '+' : '';
        materialDeltas.push({
          item: newItem.name.split('(')[0].trim(),
          deltaQuantity: `${sign}${diff.toLocaleString()} ${newItem.unit}`,
          isIncrease: diff > 0,
        });
      }
    }
  });

  // Pinpoint changed components
  const changedComponents: string[] = [];
  if (newSpec.floors.length !== previousSpec.floors.length) {
    const floorDiff = newSpec.floors.length - previousSpec.floors.length;
    changedComponents.push(floorDiff > 0 ? `Added ${floorDiff} Floor(s)` : `Removed ${Math.abs(floorDiff)} Floor(s)`);
  }

  // Check room changes
  const prevRoomMap = new Map(previousSpec.floors.flatMap(f => f.rooms).map(r => [r.name, r]));
  const newRoomMap = new Map(newSpec.floors.flatMap(f => f.rooms).map(r => [r.name, r]));

  newRoomMap.forEach((room, name) => {
    if (!prevRoomMap.has(name)) {
      changedComponents.push(`Added ${room.name} (${Math.round(room.areaSqFt)} sq.ft)`);
    } else {
      const oldRoom = prevRoomMap.get(name)!;
      const areaDiff = Math.round(room.areaSqFt - oldRoom.areaSqFt);
      if (Math.abs(areaDiff) >= 10) {
        changedComponents.push(`${room.name} resized by ${areaDiff > 0 ? '+' : ''}${areaDiff} sq.ft`);
      }
    }
  });

  prevRoomMap.forEach((room, name) => {
    if (!newRoomMap.has(name)) {
      changedComponents.push(`Removed ${room.name}`);
    }
  });

  if (changedComponents.length === 0) {
    changedComponents.push('Architectural adjustments & layout optimization');
  }

  return {
    areaDeltaSqFt,
    costDelta,
    timeDeltaDays,
    materialDeltas,
    summaryDescription: changeDescription,
    changedComponents,
  };
}

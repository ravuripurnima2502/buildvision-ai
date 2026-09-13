import React, { useState, useEffect, useMemo } from 'react';
import { Project, ProjectVersion } from '../../types/project';
import { Room, BuildingSpecification } from '../../types/building';
import { EditorHeader } from './EditorHeader';
import { BuildingCanvas } from '../3d/BuildingCanvas';
import { ViewControls } from './ViewControls';
import { RoomNavigator } from './RoomNavigator';
import { RoomInspector } from './RoomInspector';
import { ModifyModal } from './ModifyModal';
import { ChangeImpactDrawer } from './ChangeImpactDrawer';
import { EstimationView } from '../estimation/EstimationView';
import { ClientPresentation } from '../presentation/ClientPresentation';
import { VersionHistoryModal } from '../history/VersionHistoryModal';
import { RoboContext } from '../../types/robo';
import { calculateEstimation } from '../../engine/estimator';
import { generateWalkthroughStops } from '../3d/WalkthroughController';

interface WorkspaceViewProps {
  project: Project;
  onUpdateProject: (updated: Project) => void;
  onBackToDashboard: () => void;
  onOpenThemeSelector: () => void;
  onUpdateRoboContext: (ctx: RoboContext) => void;
}

export const WorkspaceView: React.FC<WorkspaceViewProps> = ({
  project,
  onUpdateProject,
  onBackToDashboard,
  onOpenThemeSelector,
  onUpdateRoboContext,
}) => {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'3d_viewer' | 'estimation' | 'presentation'>('3d_viewer');

  // 3D Visual Controls
  const [activeFloorNumber, setActiveFloorNumber] = useState<number | 'all'>('all');
  const [cutawayMode, setCutawayMode] = useState(false);
  const [showRoof, setShowRoof] = useState(true);
  const [autoRotate, setAutoRotate] = useState(false);

  // Walkthrough
  const [isWalkthroughActive, setIsWalkthroughActive] = useState(false);
  const [walkthroughStopIndex, setWalkthroughStopIndex] = useState(0);

  // Comparison mode (for Journey 3 or modified versions)
  const [compareMode, setCompareMode] = useState<'none' | 'ghost' | 'side_by_side'>('none');

  // Architectural Lighting Mode
  const [lightingMode, setLightingMode] = useState<'day' | 'sunset' | 'night'>('day');

  // Selected Room
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  // Modals and Drawers
  const [isModifyModalOpen, setIsModifyModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isImpactDrawerOpen, setIsImpactDrawerOpen] = useState(false);

  // Active Version & Specs
  const currentVersion = project.versions.find(v => v.id === project.currentVersionId) || project.versions[project.versions.length - 1];
  const spec = currentVersion.buildingSpec;
  const estimation = currentVersion.estimation;
  const delta = currentVersion.deltaFromPrevious;

  // Auto-play Walkthrough & Spec-Aware Stops
  const [isAutoPlayWalkthrough, setIsAutoPlayWalkthrough] = useState(false);
  const walkthroughStops = useMemo(() => generateWalkthroughStops(spec), [spec]);

  // Comparison Spec: If Journey 3, compare against existingBuildingSpec, or previous version
  const comparisonSpec = project.existingBuildingSpec
    ? project.existingBuildingSpec
    : project.versions.length > 1
    ? project.versions[project.versions.length - 2].buildingSpec
    : null;

  // Handle Design Modification
  const handleApplyModification = (newVersion: ProjectVersion) => {
    const updatedVersions = [...project.versions, newVersion];
    const updatedProject: Project = {
      ...project,
      currentVersionId: newVersion.id,
      versions: updatedVersions,
      updatedAt: new Date().toISOString(),
    };
    onUpdateProject(updatedProject);

    // Automatically reveal the Change Impact Drawer to show the unique feature!
    setIsImpactDrawerOpen(true);
  };

  // Handle Version Switch
  const handleSelectVersion = (versionId: string) => {
    const updatedProject: Project = {
      ...project,
      currentVersionId: versionId,
      updatedAt: new Date().toISOString(),
    };
    onUpdateProject(updatedProject);
  };

  // Handle Rate Update in Material BOQ
  const handleUpdateRate = (matId: string, newRate: number) => {
    const key = matId.replace('mat_', '');
    const updatedEst = calculateEstimation(spec, { [key]: newRate });
    const updatedVersions = project.versions.map(v => {
      if (v.id === project.currentVersionId) {
        return { ...v, estimation: updatedEst };
      }
      return v;
    });
    onUpdateProject({
      ...project,
      versions: updatedVersions,
    });
  };

  const handleResetRates = () => {
    const defaultEst = calculateEstimation(spec);
    const updatedVersions = project.versions.map(v => {
      if (v.id === project.currentVersionId) {
        return { ...v, estimation: defaultEst };
      }
      return v;
    });
    onUpdateProject({
      ...project,
      versions: updatedVersions,
    });
  };

  const handleChangeMaterial = (
    room: Room,
    material: 'marble' | 'hardwood' | 'granite' | 'ceramic_tile' | 'polished_concrete' | 'terrace_tile'
  ) => {
    const updatedSpec = JSON.parse(JSON.stringify(spec));
    for (const f of updatedSpec.floors) {
      const r = f.rooms.find((rm: Room) => rm.id === room.id);
      if (r) {
        r.floorMaterial = material;
        break;
      }
    }
    const updatedEst = calculateEstimation(updatedSpec);
    const updatedVersions = project.versions.map(v => {
      if (v.id === project.currentVersionId) {
        return { ...v, buildingSpec: updatedSpec, estimation: updatedEst };
      }
      return v;
    });
    onUpdateProject({
      ...project,
      versions: updatedVersions,
    });
    setSelectedRoom(prev => prev ? { ...prev, floorMaterial: material } : null);
  };

  // Context for Floating Civil Robo
  const roboContext: RoboContext = {
    projectName: project.title,
    totalFloors: spec.floors.length,
    totalAreaSqFt: spec.totalBuiltUpAreaSqFt,
    selectedFloor: typeof activeFloorNumber === 'number' ? activeFloorNumber : 0,
    selectedRoomName: selectedRoom?.name,
    selectedRoomArea: selectedRoom?.areaSqFt,
    selectedRoomType: selectedRoom?.type,
    estimatedCost: estimation.totalCost,
    estimatedWeeks: estimation.totalWeeks,
    lastChangeSummary: delta?.summaryDescription,
  };

  useEffect(() => {
    onUpdateRoboContext(roboContext);
  }, [
    project.title,
    spec.floors.length,
    spec.totalBuiltUpAreaSqFt,
    activeFloorNumber,
    selectedRoom?.name,
    selectedRoom?.areaSqFt,
    selectedRoom?.type,
    estimation.totalCost,
    estimation.totalWeeks,
    delta?.summaryDescription,
  ]);

  return (
    <div className="h-screen w-screen flex flex-col bg-charcoal-950 text-slate-100 overflow-hidden select-none">
      {/* Top Header */}
      <EditorHeader
        project={project}
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        onOpenModifyModal={() => setIsModifyModalOpen(true)}
        onOpenVersionHistory={() => setIsHistoryModalOpen(true)}
        onBackToDashboard={onBackToDashboard}
        hasDeltas={!!delta}
        onToggleImpactDrawer={() => setIsImpactDrawerOpen(!isImpactDrawerOpen)}
        onOpenThemeSelector={onOpenThemeSelector}
      />

      {/* Main Viewport */}
      <div className="flex-1 relative w-full h-[calc(100vh-64px)] overflow-hidden">
        {/* TAB 1: Interactive 3D Studio */}
        {activeTab === '3d_viewer' && (
          <>
            <BuildingCanvas
              spec={spec}
              activeFloorNumber={activeFloorNumber}
              cutawayMode={cutawayMode}
              showRoof={showRoof}
              selectedRoomId={selectedRoom?.id || null}
              onSelectRoom={(room) => setSelectedRoom(room)}
              isWalkthroughActive={isWalkthroughActive}
              walkthroughStopIndex={walkthroughStopIndex}
              onAdvanceWalkthrough={() => {
                setWalkthroughStopIndex(prev => (prev + 1) % walkthroughStops.length);
              }}
              comparisonSpec={compareMode !== 'none' ? comparisonSpec : null}
              compareMode={compareMode}
              autoRotate={autoRotate}
              lightingMode={lightingMode}
            />

            {/* Room Navigator for Direct Room-by-Room Inspection */}
            <RoomNavigator
              spec={spec}
              selectedRoomId={selectedRoom?.id || null}
              onSelectRoom={(room) => {
                setSelectedRoom(room);
                if (isWalkthroughActive) setIsWalkthroughActive(false);
              }}
              onResetExterior={() => setSelectedRoom(null)}
              activeFloorNumber={activeFloorNumber}
            />

            {/* On-Canvas View & Navigation Controls */}
            <ViewControls
              floors={spec.floors}
              activeFloorNumber={activeFloorNumber}
              onChangeFloor={setActiveFloorNumber}
              cutawayMode={cutawayMode}
              onToggleCutaway={() => setCutawayMode(!cutawayMode)}
              showRoof={showRoof}
              onToggleRoof={() => setShowRoof(!showRoof)}
              isWalkthroughActive={isWalkthroughActive}
              walkthroughStopIndex={walkthroughStopIndex}
              stops={walkthroughStops}
              isAutoPlay={isAutoPlayWalkthrough}
              onToggleAutoPlay={() => setIsAutoPlayWalkthrough(!isAutoPlayWalkthrough)}
              onToggleWalkthrough={() => {
                setIsWalkthroughActive(!isWalkthroughActive);
                if (autoRotate) setAutoRotate(false);
              }}
              onNextStop={() => setWalkthroughStopIndex(prev => Math.min(prev + 1, walkthroughStops.length - 1))}
              onPrevStop={() => setWalkthroughStopIndex(prev => Math.max(prev - 1, 0))}
              hasComparison={!!comparisonSpec}
              compareMode={compareMode}
              onChangeCompareMode={setCompareMode}
              autoRotate={autoRotate}
              onToggleAutoRotate={() => setAutoRotate(!autoRotate)}
              lightingMode={lightingMode}
              onChangeLightingMode={setLightingMode}
            />

            {/* Room Inspector (Visible when a room is clicked) */}
            <RoomInspector
              room={selectedRoom}
              onClose={() => setSelectedRoom(null)}
              onAskRobo={(r) => {
                // Robo automatically receives context
              }}
              onQuickModify={(r) => {
                setIsModifyModalOpen(true);
              }}
              onChangeMaterial={handleChangeMaterial}
            />
          </>
        )}

        {/* TAB 2: BOQ, Cost & Time Estimation */}
        {activeTab === 'estimation' && (
          <div className="w-full h-full overflow-y-auto">
            <EstimationView
              estimation={estimation}
              spec={spec}
              onUpdateRate={handleUpdateRate}
              onResetRates={handleResetRates}
            />
          </div>
        )}

        {/* TAB 3: Client Presentation Mode */}
        {activeTab === 'presentation' && (
          <ClientPresentation
            project={project}
            onExit={() => setActiveTab('3d_viewer')}
          />
        )}
      </div>

      {/* Design Modification Modal */}
      <ModifyModal
        isOpen={isModifyModalOpen}
        onClose={() => setIsModifyModalOpen(false)}
        currentSpec={spec}
        currentVersionNumber={currentVersion.versionNumber}
        onApplyModification={handleApplyModification}
      />

      {/* Version History Modal */}
      <VersionHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        project={project}
        onSelectVersion={handleSelectVersion}
      />

      {/* Change Impact Drawer */}
      {delta && (
        <ChangeImpactDrawer
          isOpen={isImpactDrawerOpen}
          onClose={() => setIsImpactDrawerOpen(false)}
          delta={delta}
          isCompareActive={compareMode !== 'none'}
          onToggleCompareView={() => {
            setCompareMode(prev => prev === 'none' ? 'ghost' : 'none');
          }}
        />
      )}
    </div>
  );
};

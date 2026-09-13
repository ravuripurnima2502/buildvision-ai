import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './components/auth/AuthContext';
import { Navbar } from './components/landing/Navbar';
import { LandingPage } from './components/landing/LandingPage';
import { DashboardHome } from './components/dashboard/DashboardHome';
import { WorkspaceView } from './components/editor/WorkspaceView';
import { AuthModal } from './components/auth/AuthModal';
import { JourneyWizard } from './components/dashboard/JourneyWizard';
import { Project, JourneyType } from './types/project';
import { ThemeProvider } from './components/theme/ThemeContext';
import { ThemeSelectorModal } from './components/theme/ThemeSelectorModal';
import { FloatingRobo } from './components/robo/FloatingRobo';
import { RoboContext } from './types/robo';
import {
  loadProjects,
  saveProject,
  deleteProject,
  duplicateProject,
  getProjectById,
} from './utils/storage';

const MainContent: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  const [currentView, setCurrentView] = useState<'landing' | 'dashboard' | 'workspace'>(
    isAuthenticated ? 'dashboard' : 'landing'
  );

  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

  // Theme Selector Modal
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);

  // Workspace Robo Context sync
  const [workspaceRoboContext, setWorkspaceRoboContext] = useState<RoboContext | null>(null);

  // Auth Modal
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Direct Wizard from Landing Page
  const [activeJourney, setActiveJourney] = useState<JourneyType | null>(null);

  useEffect(() => {
    setProjects(loadProjects());
  }, []);

  // Update view when auth state changes
  useEffect(() => {
    if (isAuthenticated && currentView === 'landing') {
      setCurrentView('dashboard');
    }
  }, [isAuthenticated]);

  const handleOpenAuth = (mode: 'login' | 'register' = 'login') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleStartBuilding = () => {
    if (!isAuthenticated) {
      handleOpenAuth('register');
    } else {
      setCurrentView('dashboard');
    }
  };

  const handleSelectJourneyFromLanding = (journey: JourneyType) => {
    if (!isAuthenticated) {
      handleOpenAuth('register');
    } else {
      setActiveJourney(journey);
    }
  };

  const handleOpenProject = (id: string) => {
    setActiveProjectId(id);
    setCurrentView('workspace');
  };

  const handleDuplicateProject = (id: string) => {
    const duplicated = duplicateProject(id);
    if (duplicated) {
      setProjects(loadProjects());
    }
  };

  const handleDeleteProject = (id: string) => {
    deleteProject(id);
    setProjects(loadProjects());
    if (activeProjectId === id) {
      setActiveProjectId(null);
      setCurrentView('dashboard');
    }
  };

  const handleRenameProject = (id: string, newTitle: string) => {
    const proj = getProjectById(id);
    if (proj) {
      proj.title = newTitle;
      proj.updatedAt = new Date().toISOString();
      saveProject(proj);
      setProjects(loadProjects());
    }
  };

  const handleProjectCreated = (newProject: Project) => {
    saveProject(newProject);
    setProjects(loadProjects());
    setActiveProjectId(newProject.id);
    setCurrentView('workspace');
  };

  const handleUpdateActiveProject = (updated: Project) => {
    saveProject(updated);
    setProjects(loadProjects());
  };

  const activeProject = activeProjectId ? projects.find(p => p.id === activeProjectId) : null;

  const currentVersion = activeProject
    ? activeProject.versions.find(v => v.id === activeProject.currentVersionId) || activeProject.versions[0]
    : null;

  // Active Robo Context computation
  const activeRoboContext: RoboContext = (currentView === 'workspace' && workspaceRoboContext)
    ? workspaceRoboContext
    : activeProject && currentVersion
    ? {
        projectName: activeProject.title,
        totalFloors: currentVersion.buildingSpec.floors.length,
        totalAreaSqFt: currentVersion.buildingSpec.totalBuiltUpAreaSqFt,
        selectedFloor: 0,
        estimatedCost: currentVersion.estimation.totalCost,
        estimatedWeeks: currentVersion.estimation.totalWeeks,
      }
    : {
        projectName: currentView === 'dashboard' ? 'BuildVision AI Dashboard' : 'BuildVision AI Platform',
        totalFloors: 2,
        totalAreaSqFt: 2400,
        selectedFloor: 0,
        estimatedCost: 5500000,
        estimatedWeeks: 24,
      };

  return (
    <div className="min-h-screen bg-theme-base text-theme-primary flex flex-col selection:bg-gold-500/30 selection:text-gold-200 transition-colors duration-300">
      {/* Navigation Header (Hidden in Workspace for full immersion) */}
      {currentView !== 'workspace' && (
        <Navbar
          onOpenAuth={handleOpenAuth}
          currentView={currentView}
          onNavigate={(view) => setCurrentView(view)}
          onOpenThemeSelector={() => setIsThemeModalOpen(true)}
        />
      )}

      {/* Main Views */}
      <main className="flex-1">
        {currentView === 'landing' && (
          <LandingPage
            onStartBuilding={handleStartBuilding}
            onSelectJourney={handleSelectJourneyFromLanding}
          />
        )}

        {currentView === 'dashboard' && (
          <DashboardHome
            projects={projects}
            onOpenProject={handleOpenProject}
            onDuplicateProject={handleDuplicateProject}
            onDeleteProject={handleDeleteProject}
            onRenameProject={handleRenameProject}
            onProjectCreated={handleProjectCreated}
          />
        )}

        {currentView === 'workspace' && activeProject && (
          <WorkspaceView
            project={activeProject}
            onUpdateProject={handleUpdateActiveProject}
            onBackToDashboard={() => setCurrentView('dashboard')}
            onOpenThemeSelector={() => setIsThemeModalOpen(true)}
            onUpdateRoboContext={setWorkspaceRoboContext}
          />
        )}
      </main>

      {/* Permanently Mounted Floating AI Civil Engineer Robo */}
      <FloatingRobo context={activeRoboContext} />

      {/* Architectural Theme Selector Modal */}
      <ThemeSelectorModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
      />

      {/* Direct Journey Wizard from Landing */}
      {activeJourney && (
        <JourneyWizard
          journeyType={activeJourney}
          isOpen={!!activeJourney}
          onClose={() => setActiveJourney(null)}
          onProjectCreated={(project) => {
            setActiveJourney(null);
            handleProjectCreated(project);
          }}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

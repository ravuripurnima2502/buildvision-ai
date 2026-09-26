import React, { useState, useEffect, useMemo } from 'react';
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

  // Single Source of Truth for Route: Current URL Hash
  const [currentHash, setCurrentHash] = useState<string>(() => window.location.hash || '#/');

  // Projects State from localStorage (key: buildvision_projects)
  const [projects, setProjects] = useState<Project[]>(() => loadProjects());
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

  // Theme Selector Modal
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);

  // Workspace Robo Context sync
  const [workspaceRoboContext, setWorkspaceRoboContext] = useState<RoboContext | null>(null);

  // Auth Modal (Simple local profile dialog)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot_password'>('login');

  // Direct Wizard Journey from Landing Page
  const [activeJourney, setActiveJourney] = useState<JourneyType | null>(null);

  // Listen to hash changes cleanly
  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash || '#/');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Parse current route
  const { routePath, projectQueryId } = useMemo(() => {
    const raw = currentHash.replace(/^#\/?/, '');
    const [pathPart, queryPart] = raw.split('?');
    const params = new URLSearchParams(queryPart || '');
    return {
      routePath: (pathPart || '').toLowerCase(),
      projectQueryId: params.get('project'),
    };
  }, [currentHash]);

  // Refresh projects on mount or project list change
  useEffect(() => {
    setProjects(loadProjects());
  }, []);

  // Determine current active view: 'landing' | 'dashboard' | 'workspace'
  const currentView = useMemo<'landing' | 'dashboard' | 'workspace'>(() => {
    if (routePath.startsWith('workspace')) {
      return 'workspace';
    }
    if (
      routePath.startsWith('dashboard') ||
      routePath.startsWith('projects') ||
      routePath.startsWith('create') ||
      routePath.startsWith('estimation') ||
      routePath.startsWith('history')
    ) {
      return 'dashboard';
    }
    return 'landing';
  }, [routePath]);

  // Sync activeProjectId from URL if in workspace
  useEffect(() => {
    if (currentView === 'workspace') {
      if (projectQueryId) {
        const proj = getProjectById(projectQueryId);
        if (proj) {
          setActiveProjectId(proj.id);
        } else if (projects.length > 0) {
          setActiveProjectId(projects[0].id);
        }
      } else if (!activeProjectId && projects.length > 0) {
        setActiveProjectId(projects[0].id);
      }
    }
  }, [currentView, projectQueryId, projects, activeProjectId]);

  const handleOpenAuth = (mode: 'login' | 'register' | 'forgot_password' = 'login') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleStartBuilding = () => {
    window.location.hash = '#/dashboard';
  };

  const handleSelectJourneyFromLanding = (journey: JourneyType) => {
    setActiveJourney(journey);
  };

  const handleOpenProject = (id: string) => {
    const proj = getProjectById(id);
    if (proj) {
      setActiveProjectId(proj.id);
      window.location.hash = `#/workspace?project=${proj.id}`;
    }
  };

  const handleDuplicateProject = (id: string) => {
    const duplicated = duplicateProject(id);
    if (duplicated) {
      setProjects(loadProjects());
    }
  };

  const handleDeleteProject = (id: string) => {
    deleteProject(id);
    const updated = loadProjects();
    setProjects(updated);
    if (activeProjectId === id) {
      setActiveProjectId(updated.length > 0 ? updated[0].id : null);
      if (updated.length === 0) {
        window.location.hash = '#/dashboard';
      }
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
    const taggedProject: Project = { ...newProject, userId: user?.id || 'usr_local' };
    saveProject(taggedProject);
    setProjects(loadProjects());
    setActiveProjectId(taggedProject.id);
    window.location.hash = `#/workspace?project=${taggedProject.id}`;
  };

  const handleUpdateActiveProject = (updated: Project) => {
    saveProject(updated);
    setProjects(loadProjects());
  };

  const activeProject = activeProjectId
    ? projects.find(p => p.id === activeProjectId) || projects[0] || null
    : projects[0] || null;

  const currentVersion = activeProject
    ? activeProject.versions.find(v => v.id === activeProject.currentVersionId) || activeProject.versions[0]
    : null;

  // Active Robo Context
  const activeRoboContext: RoboContext =
    currentView === 'workspace' && workspaceRoboContext
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
          totalAreaSqFt: 3200,
          selectedFloor: 0,
          estimatedCost: 6800000,
          estimatedWeeks: 28,
        };

  return (
    <div className="min-h-screen bg-theme-base text-theme-primary flex flex-col selection:bg-gold-500/30 selection:text-gold-200 transition-colors duration-300">
      {/* Navigation Header (Hidden in Workspace for full BIM immersion) */}
      {currentView !== 'workspace' && (
        <Navbar
          onOpenAuth={handleOpenAuth}
          currentView={currentView}
          onNavigate={(view) => {
            window.location.hash = view === 'dashboard' ? '#/dashboard' : '#/';
          }}
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
            onBackToDashboard={() => {
              window.location.hash = '#/dashboard';
            }}
            onOpenThemeSelector={() => setIsThemeModalOpen(true)}
            onUpdateRoboContext={setWorkspaceRoboContext}
          />
        )}
      </main>

      {/* Floating AI Civil Engineer Robo */}
      <FloatingRobo context={activeRoboContext} />

      {/* Architectural Theme Selector Modal */}
      <ThemeSelectorModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
      />

      {/* Profile / Account Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
      />

      {/* Direct Journey Wizard from Landing / Dashboard */}
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

import { Project } from '../types/project';
import { INITIAL_DEMO_PROJECTS } from '../demo/sampleProjects';

const STORAGE_KEY_PROJECTS = 'buildvision_ai_projects_v1';
const STORAGE_KEY_USER = 'buildvision_ai_user_session';

export function loadProjects(): Project[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROJECTS);
    if (!raw) {
      saveProjects(INITIAL_DEMO_PROJECTS);
      return INITIAL_DEMO_PROJECTS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      saveProjects(INITIAL_DEMO_PROJECTS);
      return INITIAL_DEMO_PROJECTS;
    }
    return parsed;
  } catch (err) {
    console.error('Error loading projects from localStorage:', err);
    return INITIAL_DEMO_PROJECTS;
  }
}

export function saveProjects(projects: Project[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(projects));
  } catch (err) {
    console.error('Error saving projects to localStorage:', err);
  }
}

export function getProjectById(id: string): Project | undefined {
  const projects = loadProjects();
  return projects.find(p => p.id === id);
}

export function saveProject(project: Project): void {
  const projects = loadProjects();
  const index = projects.findIndex(p => p.id === project.id);
  if (index >= 0) {
    projects[index] = project;
  } else {
    projects.unshift(project);
  }
  saveProjects(projects);
}

export function deleteProject(id: string): void {
  const projects = loadProjects().filter(p => p.id !== id);
  saveProjects(projects);
}

export function duplicateProject(id: string): Project | undefined {
  const original = getProjectById(id);
  if (!original) return undefined;

  const clone: Project = JSON.parse(JSON.stringify(original));
  clone.id = `proj_${Date.now()}`;
  clone.title = `${original.title} (Copy)`;
  clone.createdAt = new Date().toISOString();
  clone.updatedAt = new Date().toISOString();

  saveProject(clone);
  return clone;
}

export function loadStoredUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USER);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveStoredUser(user: any) {
  if (!user) {
    localStorage.removeItem(STORAGE_KEY_USER);
  } else {
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
  }
}

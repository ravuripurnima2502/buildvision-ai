import { Project, User } from '../types/project';
import { INITIAL_DEMO_PROJECTS } from '../demo/sampleProjects';

const STORAGE_KEY_PROJECTS = 'buildvision_projects';
const STORAGE_KEY_USER = 'buildvision_user';

/**
 * Load all projects from browser localStorage.
 * Initializes with starter architectural projects if storage is empty.
 */
export function loadProjects(_userId?: string): Project[] {
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

/**
 * Save projects list to browser localStorage.
 */
export function saveProjects(projects: Project[], _userId?: string): void {
  try {
    localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(projects));
  } catch (err) {
    console.error('Error saving projects to localStorage:', err);
  }
}

/**
 * Retrieve a project by its unique ID.
 */
export function getProjectById(id: string, _userId?: string): Project | undefined {
  if (!id) return undefined;
  const projects = loadProjects();
  return projects.find(p => p.id === id);
}

/**
 * Save or update a single project in localStorage.
 */
export function saveProject(project: Project, _userId?: string): void {
  const projects = loadProjects();
  const index = projects.findIndex(p => p.id === project.id);

  if (index >= 0) {
    projects[index] = { ...project, updatedAt: new Date().toISOString() };
  } else {
    projects.unshift({ ...project, updatedAt: new Date().toISOString() });
  }

  saveProjects(projects);
}

/**
 * Delete a project by ID from localStorage.
 */
export function deleteProject(id: string, _userId?: string): void {
  if (!id) return;
  const projects = loadProjects().filter(p => p.id !== id);
  saveProjects(projects);
}

/**
 * Duplicate an existing project in localStorage.
 */
export function duplicateProject(id: string, _userId?: string): Project | undefined {
  if (!id) return undefined;
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

/**
 * Retrieve current active user profile from localStorage.
 */
export function loadStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USER);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Save user profile to localStorage (or remove if null).
 */
export function saveStoredUser(user: User | null): void {
  try {
    if (!user) {
      localStorage.removeItem(STORAGE_KEY_USER);
    } else {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    }
  } catch (err) {
    console.error('Error saving user to localStorage:', err);
  }
}

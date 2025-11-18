import { Workflow } from '../types';

const WORKFLOW_STORAGE_KEY = 'weavy-workflow';

/**
 * Load saved workflow from localStorage
 * @returns Saved workflow or null if not found
 */
export function loadWorkflow(): Workflow | null {
  try {
    const saved = localStorage.getItem(WORKFLOW_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Error loading workflow from localStorage:', error);
  }
  return null;
}

/**
 * Save workflow to localStorage
 * @param workflow - The workflow to save
 */
export function saveWorkflow(workflow: Workflow): void {
  try {
    localStorage.setItem(WORKFLOW_STORAGE_KEY, JSON.stringify(workflow));
  } catch (error) {
    console.error('Error saving workflow to localStorage:', error);
  }
}

/**
 * Clear saved workflow from localStorage
 */
export function clearWorkflow(): void {
  try {
    localStorage.removeItem(WORKFLOW_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing workflow from localStorage:', error);
  }
}

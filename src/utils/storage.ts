import { StoredStoryReference } from '../types';

const STORAGE_KEY = 'romantic_created_stories';

export function getStoredStories(): StoredStoryReference[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.warn('Failed to load stored stories from localStorage', e);
    return [];
  }
}

export function saveStoryReference(storyRef: StoredStoryReference): void {
  try {
    const existing = getStoredStories();
    const index = existing.findIndex((s) => s.id === storyRef.id || s.editorToken === storyRef.editorToken);
    let updated: StoredStoryReference[];
    if (index >= 0) {
      updated = [...existing];
      updated[index] = { ...updated[index], ...storyRef, updatedAt: new Date().toISOString() };
    } else {
      updated = [storyRef, ...existing];
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Failed to save story reference to localStorage', e);
  }
}

export function removeStoryReference(idOrToken: string): void {
  try {
    const existing = getStoredStories();
    const updated = existing.filter((s) => s.id !== idOrToken && s.editorToken !== idOrToken);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Failed to delete story reference from localStorage', e);
  }
}

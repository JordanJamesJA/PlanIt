import { STORAGE_KEY } from '@/constants/config';

/**
 * Unified storage layer.
 * Uses window.storage when available (Claude.ai artifact env),
 * falls back to localStorage for local development.
 */

async function load() {
  try {
    // Claude.ai persistent storage
    if (typeof window !== 'undefined' && window.storage) {
      const result = await window.storage.get(STORAGE_KEY);
      return result?.value ? JSON.parse(result.value) : null;
    }
    // Local dev fallback
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.warn('[storage] load failed:', err);
    return null;
  }
}

async function save(state) {
  try {
    const serialized = JSON.stringify(state);
    if (typeof window !== 'undefined' && window.storage) {
      await window.storage.set(STORAGE_KEY, serialized);
    } else {
      localStorage.setItem(STORAGE_KEY, serialized);
    }
  } catch (err) {
    console.warn('[storage] save failed:', err);
  }
}

export const storage = { load, save };

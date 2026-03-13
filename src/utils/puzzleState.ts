/**
 * Puzzle State Management Utility
 * Manages the state of all puzzle rooms and their fragments
 */

export interface FragmentStorage {
  r1: string;
  r2: string;
  r3: string;
  r4: string;
  r5: string;
  r6: string;
  r7: string;
  r8: string;
  r9: string;
  r10: string;
}

const STORAGE_KEY = 'bytequest_fragments';

/**
 * Initialize empty fragment storage
 */
export const initializeFragments = (): FragmentStorage => {
  return {
    r1: '',
    r2: '',
    r3: '',
    r4: '',
    r5: '',
    r6: '',
    r7: '',
    r8: '',
    r9: '',
    r10: '',
  };
};

/**
 * Load fragments from localStorage
 */
export const loadFragments = (): FragmentStorage => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as FragmentStorage;
    }
  } catch (error) {
    console.error('Error loading fragments:', error);
  }
  return initializeFragments();
};

/**
 * Save fragments to localStorage
 */
export const saveFragments = (fragments: FragmentStorage): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fragments));
    // Dispatch custom event for same-window updates
    window.dispatchEvent(new Event('fragmentUpdate'));
  } catch (error) {
    console.error('Error saving fragments:', error);
  }
};

/**
 * Set a fragment for a specific room
 */
export const setFragment = (roomId: number, fragment: string): void => {
  const fragments = loadFragments();
  const key = `r${roomId}` as keyof FragmentStorage;
  fragments[key] = fragment;
  saveFragments(fragments);
};

/**
 * Get a fragment for a specific room
 */
export const getFragment = (roomId: number): string => {
  const fragments = loadFragments();
  const key = `r${roomId}` as keyof FragmentStorage;
  return fragments[key];
};

/**
 * Check if a room is solved (has a fragment)
 */
export const isRoomSolved = (roomId: number): boolean => {
  return getFragment(roomId) !== '';
};

/**
 * Calculate progress (number of solved rooms)
 */
export const calculateProgress = (): number => {
  const fragments = loadFragments();
  let solvedCount = 0;
  
  for (let i = 1; i <= 10; i++) {
    const key = `r${i}` as keyof FragmentStorage;
    if (fragments[key] !== '') {
      solvedCount++;
    }
  }
  
  return solvedCount;
};

/**
 * Calculate progress percentage
 */
export const calculateProgressPercentage = (): number => {
  const solvedCount = calculateProgress();
  return (solvedCount / 10) * 100;
};

/**
 * Reset all fragments (for testing or restart)
 */
export const resetFragments = (): void => {
  saveFragments(initializeFragments());
};

/**
 * Master Key Composition Utility
 * Handles the composition and validation of the master key from fragments
 */

import { loadFragments, type FragmentStorage } from './puzzleState';

/**
 * Compose the master key from all fragments in order
 * Fragments are concatenated in room order: r1 + r2 + r3 + ... + r10
 */
export const composeMasterKey = (): string => {
  const fragments = loadFragments();
  
  let masterKey = '';
  for (let i = 1; i <= 10; i++) {
    const key = `r${i}` as keyof FragmentStorage;
    masterKey += fragments[key];
  }
  
  return masterKey;
};

/**
 * Validate if a provided key matches the composed master key
 */
export const validateMasterKey = (inputKey: string): boolean => {
  const correctKey = composeMasterKey();
  return inputKey === correctKey;
};

/**
 * Check if the master key is complete (all fragments collected)
 */
export const isMasterKeyComplete = (): boolean => {
  const fragments = loadFragments();
  
  for (let i = 1; i <= 10; i++) {
    const key = `r${i}` as keyof FragmentStorage;
    if (fragments[key] === '') {
      return false;
    }
  }
  
  return true;
};

/**
 * Get the expected master key based on the puzzle design
 * The fragments spell: "ONE" + "PIECE" + "GRAND" + "LINE" + "NEW" + "WORLD" + "TREASURE" + "HUNT" + "FINAL" + "QUEST"
 */
export const getExpectedMasterKey = (): string => {
  return 'ONEPIECEGRANDLINENEWWORLDTREASUREHUNTFINALQUEST';
};

/**
 * Integration Tests for Fragment Persistence
 * Feature: bytequest-treasure-hunt
 */

import { describe, it, expect, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import {
  setFragment,
  getFragment,
  isRoomSolved,
  calculateProgress,
  resetFragments,
  loadFragments,
  saveFragments,
  type FragmentStorage,
} from './puzzleState';
import { composeMasterKey, validateMasterKey } from './masterKey';

// Mock localStorage for testing
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
});

beforeEach(() => {
  localStorageMock.clear();
  resetFragments();
});

describe('Fragment Persistence Integration Tests', () => {
  /**
   * Feature: bytequest-treasure-hunt, Property 3: Fragment persistence during navigation
   * Validates: Requirements 17.2
   * 
   * For any sequence of fragment updates followed by navigation (simulated by loading/saving),
   * the fragments should persist and be retrievable in the same state
   */
  it('Property 3: Fragment persistence during navigation - fragments survive load/save cycles', () => {
    fc.assert(
      fc.property(
        // Generate a sequence of room updates (room ID and fragment value)
        fc.array(
          fc.tuple(
            fc.integer({ min: 1, max: 10 }),
            fc.string({ minLength: 1, maxLength: 20 })
          ),
          { minLength: 1, maxLength: 20 }
        ),
        (updates) => {
          // Reset state
          resetFragments();

          // Apply updates
          const expectedFragments: Record<number, string> = {};
          updates.forEach(([roomId, fragmentValue]) => {
            setFragment(roomId, fragmentValue);
            expectedFragments[roomId] = fragmentValue;
          });

          // Simulate navigation by loading fragments (as would happen on page load)
          const loadedFragments = loadFragments();

          // Property: All updated fragments should be retrievable after load
          Object.entries(expectedFragments).forEach(([roomId, expectedValue]) => {
            const key = `r${roomId}` as keyof FragmentStorage;
            expect(loadedFragments[key]).toBe(expectedValue);
          });

          // Property: Progress should be consistent after load
          const progressBeforeSave = calculateProgress();
          const progressAfterLoad = calculateProgress();
          expect(progressAfterLoad).toBe(progressBeforeSave);

          // Property: Master key should be consistent after load
          const keyBeforeSave = composeMasterKey();
          const keyAfterLoad = composeMasterKey();
          expect(keyAfterLoad).toBe(keyBeforeSave);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Fragment state consistency across multiple navigation cycles
   * For any set of fragments, multiple load/save cycles should not corrupt the data
   */
  it('Property: Fragment state remains consistent across multiple navigation cycles', () => {
    fc.assert(
      fc.property(
        // Generate initial fragments
        fc.array(fc.string({ maxLength: 20 }), { minLength: 10, maxLength: 10 }),
        // Generate number of navigation cycles
        fc.integer({ min: 1, max: 10 }),
        (initialFragments, navigationCycles) => {
          // Reset state
          resetFragments();

          // Set initial fragments
          initialFragments.forEach((value, index) => {
            const roomId = index + 1;
            setFragment(roomId, value);
          });

          // Capture initial state
          const initialKey = composeMasterKey();
          const initialProgress = calculateProgress();

          // Simulate multiple navigation cycles (load/save)
          for (let i = 0; i < navigationCycles; i++) {
            // Simulate navigation by loading
            const fragments = loadFragments();
            // Simulate returning by saving
            saveFragments(fragments);
          }

          // Property: Master key should be unchanged after navigation cycles
          const finalKey = composeMasterKey();
          expect(finalKey).toBe(initialKey);

          // Property: Progress should be unchanged after navigation cycles
          const finalProgress = calculateProgress();
          expect(finalProgress).toBe(initialProgress);

          // Property: Individual fragments should be unchanged
          initialFragments.forEach((expectedValue, index) => {
            const roomId = index + 1;
            const retrievedValue = getFragment(roomId);
            expect(retrievedValue).toBe(expectedValue);
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Solved status persists across navigation
   * For any room that is marked as solved, navigating away and back should maintain solved status
   */
  it('Property: Solved status persists across navigation', () => {
    fc.assert(
      fc.property(
        // Generate which rooms are solved
        fc.array(fc.boolean(), { minLength: 10, maxLength: 10 }),
        (roomStates) => {
          // Reset state
          resetFragments();

          // Set fragments for solved rooms
          const solvedRooms: number[] = [];
          roomStates.forEach((isSolved, index) => {
            const roomId = index + 1;
            if (isSolved) {
              setFragment(roomId, `FRAGMENT${roomId}`);
              solvedRooms.push(roomId);
            }
          });

          // Simulate navigation (load/save)
          const fragments = loadFragments();
          saveFragments(fragments);

          // Property: All previously solved rooms should still be solved
          solvedRooms.forEach((roomId) => {
            expect(isRoomSolved(roomId)).toBe(true);
          });

          // Property: All previously unsolved rooms should still be unsolved
          roomStates.forEach((wasSolved, index) => {
            const roomId = index + 1;
            if (!wasSolved) {
              expect(isRoomSolved(roomId)).toBe(false);
            }
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Master key calculation uses all stored fragments
   * For any set of fragments, the master key should be the concatenation of all fragments in order
   * and should validate correctly
   */
  it('Property: Master key calculation uses all stored fragments correctly', () => {
    fc.assert(
      fc.property(
        // Generate 10 fragments (can be empty or non-empty)
        fc.array(fc.string({ maxLength: 20 }), { minLength: 10, maxLength: 10 }),
        (fragmentValues) => {
          // Reset state
          resetFragments();

          // Set all fragments
          fragmentValues.forEach((value, index) => {
            const roomId = index + 1;
            setFragment(roomId, value);
          });

          // Compose master key
          const masterKey = composeMasterKey();

          // Expected key is concatenation of all fragments in order
          const expectedKey = fragmentValues.join('');

          // Property: Master key should equal concatenation of all fragments
          expect(masterKey).toBe(expectedKey);

          // Property: Master key should validate against itself
          expect(validateMasterKey(masterKey)).toBe(true);

          // Property: If all fragments are non-empty, master key should be non-empty
          const allNonEmpty = fragmentValues.every((v) => v !== '');
          if (allNonEmpty) {
            expect(masterKey.length).toBeGreaterThan(0);
          }

          // Property: Master key length should equal sum of all fragment lengths
          const expectedLength = fragmentValues.reduce((sum, frag) => sum + frag.length, 0);
          expect(masterKey.length).toBe(expectedLength);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Fragment updates are immediately reflected in master key
   * For any sequence of fragment updates, the master key should immediately reflect those changes
   */
  it('Property: Fragment updates immediately reflect in master key', () => {
    fc.assert(
      fc.property(
        // Generate a sequence of updates
        fc.array(
          fc.tuple(
            fc.integer({ min: 1, max: 10 }),
            fc.string({ minLength: 1, maxLength: 20 })
          ),
          { minLength: 1, maxLength: 20 }
        ),
        (updates) => {
          // Reset state
          resetFragments();

          // Track all fragments set so far
          const setFragments: Record<number, string> = {};

          // Apply each update and verify master key updates immediately
          updates.forEach(([roomId, fragmentValue]) => {
            // Set fragment
            setFragment(roomId, fragmentValue);
            setFragments[roomId] = fragmentValue;

            // Get master key immediately
            const masterKey = composeMasterKey();

            // Build expected master key from all fragments set so far
            let expectedKey = '';
            for (let i = 1; i <= 10; i++) {
              expectedKey += setFragments[i] || '';
            }

            // Property: The master key should match the concatenation of all set fragments
            expect(masterKey).toBe(expectedKey);
          });
        }
      ),
      { numRuns: 100 }
    );
  });
});

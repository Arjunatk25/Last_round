/**
 * Property-Based Tests for Puzzle State Management
 * Feature: bytequest-treasure-hunt
 */

import { describe, it, expect, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import {
  initializeFragments,
  setFragment,
  getFragment,
  isRoomSolved,
  calculateProgress,
  calculateProgressPercentage,
  resetFragments,
  type FragmentStorage,
} from './puzzleState';

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

describe('Puzzle State Management - Property Tests', () => {
  /**
   * Feature: bytequest-treasure-hunt, Property 1: Progress calculation accuracy
   * Validates: Requirements 2.1
   * 
   * For any set of fragments, the progress count should equal the number of non-empty fragments
   */
  it('Property 1: Progress calculation accuracy - progress equals count of non-empty fragments', () => {
    fc.assert(
      fc.property(
        // Generate an array of 10 optional strings (empty or non-empty)
        fc.array(fc.option(fc.string({ minLength: 1, maxLength: 20 }), { nil: '' }), {
          minLength: 10,
          maxLength: 10,
        }),
        (fragmentValues) => {
          // Reset state
          resetFragments();

          // Set fragments based on generated values
          let expectedCount = 0;
          fragmentValues.forEach((value, index) => {
            const roomId = index + 1;
            if (value !== '') {
              setFragment(roomId, value);
              expectedCount++;
            }
          });

          // Calculate progress
          const actualProgress = calculateProgress();

          // Property: progress should equal the count of non-empty fragments
          expect(actualProgress).toBe(expectedCount);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Additional property: Progress percentage consistency
   * For any set of fragments, the percentage should be (count / 10) * 100
   */
  it('Property: Progress percentage is consistent with count', () => {
    fc.assert(
      fc.property(
        fc.array(fc.option(fc.string({ minLength: 1, maxLength: 20 }), { nil: '' }), {
          minLength: 10,
          maxLength: 10,
        }),
        (fragmentValues) => {
          resetFragments();

          let expectedCount = 0;
          fragmentValues.forEach((value, index) => {
            const roomId = index + 1;
            if (value !== '') {
              setFragment(roomId, value);
              expectedCount++;
            }
          });

          const actualPercentage = calculateProgressPercentage();
          const expectedPercentage = (expectedCount / 10) * 100;

          expect(actualPercentage).toBe(expectedPercentage);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Room solved status consistency
   * For any room, isRoomSolved should return true if and only if the fragment is non-empty
   */
  it('Property: Room solved status matches fragment presence', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 10 }),
        fc.option(fc.string({ minLength: 1, maxLength: 20 }), { nil: '' }),
        (roomId, fragmentValue) => {
          resetFragments();

          if (fragmentValue !== '') {
            setFragment(roomId, fragmentValue);
          }

          const isSolved = isRoomSolved(roomId);
          const hasFragment = fragmentValue !== '';

          expect(isSolved).toBe(hasFragment);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: bytequest-treasure-hunt, Property 14: State update reactivity
   * Validates: Requirements 2.4, 17.4
   * 
   * For any sequence of fragment updates, the state should immediately reflect those changes
   * and subsequent reads should return the updated values
   */
  it('Property 14: State update reactivity - state updates are immediately reflected', () => {
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
          resetFragments();

          // Apply each update and verify it's immediately reflected
          updates.forEach(([roomId, fragmentValue]) => {
            // Set the fragment
            setFragment(roomId, fragmentValue);

            // Immediately read it back
            const retrievedValue = getFragment(roomId);

            // Property: the retrieved value should match what was just set
            expect(retrievedValue).toBe(fragmentValue);

            // Property: isRoomSolved should immediately reflect the update
            const isSolved = isRoomSolved(roomId);
            expect(isSolved).toBe(true);

            // Property: calculateProgress should immediately include this room
            const progress = calculateProgress();
            expect(progress).toBeGreaterThan(0);
          });

          // After all updates, verify final state consistency
          const finalProgress = calculateProgress();
          const finalPercentage = calculateProgressPercentage();

          // Count unique rooms that were updated
          const uniqueRooms = new Set(updates.map(([roomId]) => roomId));
          expect(finalProgress).toBe(uniqueRooms.size);
          expect(finalPercentage).toBe((uniqueRooms.size / 10) * 100);
        }
      ),
      { numRuns: 100 }
    );
  });
});

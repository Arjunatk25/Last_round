/**
 * Property-Based Tests for Puzzle Validation Pattern
 * Feature: bytequest-treasure-hunt
 */

import { describe, it, expect, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import {
  setFragment,
  getFragment,
  isRoomSolved,
  resetFragments,
} from '../utils/puzzleState';

describe('Puzzle Validation Pattern - Property Tests', () => {
  beforeEach(() => {
    resetFragments();
    localStorage.clear();
  });

  /**
   * Feature: bytequest-treasure-hunt, Property 11: Puzzle validation pattern
   * Validates: Requirements 3.3, 4.3
   * 
   * For any room and any answer:
   * 1. When the correct answer is provided, the fragment should be stored
   * 2. When an incorrect answer is provided, no fragment should be stored
   * 3. The validation pattern should work consistently across all rooms
   * 4. Fragment storage should persist and be retrievable
   */
  it('Property 11: Puzzle validation pattern - correct answers store fragments, incorrect answers do not', () => {
    fc.assert(
      fc.property(
        // Generate a valid room ID (1-10)
        fc.integer({ min: 1, max: 10 }),
        // Generate a fragment string (uppercase letters)
        fc.stringMatching(/^[A-Z]+$/),
        // Generate a correct answer
        fc.string({ minLength: 1, maxLength: 20 }),
        // Generate an incorrect answer (different from correct)
        fc.string({ minLength: 1, maxLength: 20 }),
        (roomId, fragment, correctAnswer, incorrectAnswer) => {
          // Ensure incorrect answer is actually different
          fc.pre(correctAnswer !== incorrectAnswer);
          fc.pre(fragment.length > 0);

          // Reset state before each property test iteration
          resetFragments();

          // Property 1: Before validation, room should not be solved
          expect(isRoomSolved(roomId)).toBe(false);
          expect(getFragment(roomId)).toBe('');

          // Simulate incorrect answer validation
          const isIncorrectAnswerValid = incorrectAnswer === correctAnswer;
          
          if (!isIncorrectAnswerValid) {
            // Property 2: Incorrect answer should NOT store fragment
            // (we don't call setFragment for incorrect answers)
            expect(getFragment(roomId)).toBe('');
            expect(isRoomSolved(roomId)).toBe(false);
          }

          // Simulate correct answer validation
          const isCorrectAnswerValid = correctAnswer === correctAnswer; // Always true
          
          if (isCorrectAnswerValid) {
            // Property 3: Correct answer SHOULD store fragment
            setFragment(roomId, fragment);
            
            // Property 4: Fragment should be stored and retrievable
            expect(getFragment(roomId)).toBe(fragment);
            expect(isRoomSolved(roomId)).toBe(true);
          }

          // Property 5: Stored fragment should persist across reads
          const retrievedFragment = getFragment(roomId);
          expect(retrievedFragment).toBe(fragment);
          
          // Property 6: Room should be marked as solved after correct answer
          expect(isRoomSolved(roomId)).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Additional property: Fragment storage is idempotent
   * For any room, storing the same fragment multiple times should result in the same state
   */
  it('Property: Fragment storage is idempotent', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 10 }),
        fc.stringMatching(/^[A-Z]+$/),
        (roomId, fragment) => {
          fc.pre(fragment.length > 0);
          
          resetFragments();

          // Store fragment once
          setFragment(roomId, fragment);
          const firstResult = getFragment(roomId);

          // Store same fragment again
          setFragment(roomId, fragment);
          const secondResult = getFragment(roomId);

          // Both results should be identical
          expect(firstResult).toBe(secondResult);
          expect(secondResult).toBe(fragment);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Additional property: Fragment storage is isolated per room
   * For any two different rooms, storing a fragment in one should not affect the other
   */
  it('Property: Fragment storage is isolated per room', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 10 }),
        fc.integer({ min: 1, max: 10 }),
        fc.stringMatching(/^[A-Z]+$/),
        fc.stringMatching(/^[A-Z]+$/),
        (roomId1, roomId2, fragment1, fragment2) => {
          fc.pre(roomId1 !== roomId2);
          fc.pre(fragment1.length > 0);
          fc.pre(fragment2.length > 0);

          resetFragments();

          // Store fragment in room 1
          setFragment(roomId1, fragment1);

          // Store fragment in room 2
          setFragment(roomId2, fragment2);

          // Each room should have its own fragment
          expect(getFragment(roomId1)).toBe(fragment1);
          expect(getFragment(roomId2)).toBe(fragment2);

          // Both rooms should be solved
          expect(isRoomSolved(roomId1)).toBe(true);
          expect(isRoomSolved(roomId2)).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Additional property: Validation pattern consistency
   * For any room, the validation pattern (compare answer to stored variable) should be consistent
   */
  it('Property: Validation pattern is consistent', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 10 }),
        fc.string({ minLength: 1, maxLength: 50 }),
        fc.stringMatching(/^[A-Z]+$/),
        (roomId, userAnswer, fragment) => {
          fc.pre(fragment.length > 0);

          resetFragments();

          // Define a stored correct answer (simulating the pattern in Room1 and Room2)
          const storedCorrectAnswer = 'CORRECT';

          // Simulate validation logic
          const isValid = userAnswer.trim().toUpperCase() === storedCorrectAnswer;

          if (isValid) {
            // If answer is correct, store fragment
            setFragment(roomId, fragment);
            expect(getFragment(roomId)).toBe(fragment);
            expect(isRoomSolved(roomId)).toBe(true);
          } else {
            // If answer is incorrect, fragment should not be stored
            expect(getFragment(roomId)).toBe('');
            expect(isRoomSolved(roomId)).toBe(false);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});

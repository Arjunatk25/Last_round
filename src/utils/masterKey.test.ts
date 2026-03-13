/**
 * Property-Based Tests for Master Key Composition
 * Feature: bytequest-treasure-hunt
 */

import { describe, it, expect, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import {
  composeMasterKey,
  validateMasterKey,
  isMasterKeyComplete,
} from './masterKey';
import { resetFragments, setFragment } from './puzzleState';

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

describe('Master Key Composition - Property Tests', () => {
  /**
   * Feature: bytequest-treasure-hunt, Property 4: Master key composition correctness
   * Validates: Requirements 17.3
   * 
   * For any set of 10 fragments, the composed master key should be the concatenation
   * of all fragments in room order (r1 + r2 + r3 + ... + r10)
   */
  it('Property 4: Master key composition correctness - key is concatenation of fragments in order', () => {
    fc.assert(
      fc.property(
        // Generate 10 strings (can be empty or non-empty)
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
          const composedKey = composeMasterKey();

          // Expected key is concatenation in order
          const expectedKey = fragmentValues.join('');

          // Property: composed key should equal concatenation of fragments
          expect(composedKey).toBe(expectedKey);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Master key validation consistency
   * For any set of fragments, validateMasterKey should return true if and only if
   * the input matches the composed key
   */
  it('Property: Master key validation is consistent with composition', () => {
    fc.assert(
      fc.property(
        fc.array(fc.string({ maxLength: 20 }), { minLength: 10, maxLength: 10 }),
        fc.string({ maxLength: 100 }),
        (fragmentValues, testKey) => {
          resetFragments();

          fragmentValues.forEach((value, index) => {
            const roomId = index + 1;
            setFragment(roomId, value);
          });

          const composedKey = composeMasterKey();
          const isValid = validateMasterKey(testKey);
          const shouldBeValid = testKey === composedKey;

          expect(isValid).toBe(shouldBeValid);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Master key completeness check
   * For any set of fragments, isMasterKeyComplete should return true if and only if
   * all 10 fragments are non-empty
   */
  it('Property: Master key completeness matches all fragments being non-empty', () => {
    fc.assert(
      fc.property(
        fc.array(fc.option(fc.string({ minLength: 1, maxLength: 20 }), { nil: '' }), {
          minLength: 10,
          maxLength: 10,
        }),
        (fragmentValues) => {
          resetFragments();

          fragmentValues.forEach((value, index) => {
            const roomId = index + 1;
            if (value !== '') {
              setFragment(roomId, value);
            }
          });

          const isComplete = isMasterKeyComplete();
          const allNonEmpty = fragmentValues.every((v) => v !== '');

          expect(isComplete).toBe(allNonEmpty);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Correct key always validates
   * For any set of fragments, the composed key should always validate as correct
   */
  it('Property: Composed master key always validates as correct', () => {
    fc.assert(
      fc.property(
        fc.array(fc.string({ maxLength: 20 }), { minLength: 10, maxLength: 10 }),
        (fragmentValues) => {
          resetFragments();

          fragmentValues.forEach((value, index) => {
            const roomId = index + 1;
            setFragment(roomId, value);
          });

          const composedKey = composeMasterKey();
          const isValid = validateMasterKey(composedKey);

          // Property: the composed key should always be valid
          expect(isValid).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: bytequest-treasure-hunt, Property 13: Master key validation
   * Validates: Requirements 13.3, 13.4
   * 
   * For any set of fragments and any input string, the validation should correctly
   * distinguish between correct and incorrect keys. Correct keys (matching the composed
   * master key) should validate successfully, while incorrect keys should fail validation.
   */
  it('Property 13: Master key validation - correct keys pass, incorrect keys fail', () => {
    fc.assert(
      fc.property(
        fc.array(fc.string({ minLength: 1, maxLength: 15 }), { minLength: 10, maxLength: 10 }),
        fc.string({ minLength: 1, maxLength: 100 }),
        (fragmentValues, incorrectKey) => {
          resetFragments();

          // Set all fragments
          fragmentValues.forEach((value, index) => {
            const roomId = index + 1;
            setFragment(roomId, value);
          });

          const correctKey = composeMasterKey();

          // Property: correct key should validate
          expect(validateMasterKey(correctKey)).toBe(true);

          // Property: incorrect key should fail validation (unless it happens to match by chance)
          if (incorrectKey !== correctKey) {
            expect(validateMasterKey(incorrectKey)).toBe(false);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});

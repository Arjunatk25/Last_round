/**
 * Property-Based Tests for RoomCard Component
 * Feature: bytequest-treasure-hunt
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import * as fc from 'fast-check';
import { RoomCard } from './RoomCard';
import { resetFragments, setFragment } from '../utils/puzzleState';

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

afterEach(() => {
  cleanup();
});

describe('RoomCard Component - Property Tests', () => {
  /**
   * Feature: bytequest-treasure-hunt, Property 9: Room card solved indicator
   * Validates: Requirements 1.3
   * 
   * For any room, the solved indicator (checkmark) should be visible if and only if
   * that room has a non-empty fragment stored
   */
  it('Property 9: Room card solved indicator - checkmark appears iff room is solved', () => {
    fc.assert(
      fc.property(
        // Generate a room number (1-10)
        fc.integer({ min: 1, max: 10 }),
        // Generate an optional fragment value (empty or non-empty)
        fc.option(fc.string({ minLength: 1, maxLength: 20 }), { nil: '' }),
        // Generate a room title
        fc.string({ minLength: 1, maxLength: 50 }),
        (roomNumber, fragmentValue, title) => {
          // Clean up before each property test iteration
          cleanup();
          
          // Reset state
          resetFragments();

          // Set fragment if non-empty
          if (fragmentValue !== '') {
            setFragment(roomNumber, fragmentValue);
          }

          // Render component wrapped in Router
          const { container } = render(
            <BrowserRouter>
              <RoomCard roomNumber={roomNumber} title={title} />
            </BrowserRouter>
          );

          // Check if solved indicator is present
          const solvedIndicator = container.querySelector('.solved-indicator');
          const hasSolvedIndicator = solvedIndicator !== null;

          // Property: solved indicator should be present if and only if fragment is non-empty
          const shouldHaveIndicator = fragmentValue !== '';
          expect(hasSolvedIndicator).toBe(shouldHaveIndicator);

          // If indicator is present, verify it contains the checkmark
          if (hasSolvedIndicator) {
            expect(solvedIndicator?.textContent).toBe('✓');
            expect(solvedIndicator?.getAttribute('aria-label')).toBe('Solved');
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Property-Based Tests for ProgressBar Component
 * Feature: bytequest-treasure-hunt
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import * as fc from 'fast-check';
import { ProgressBar } from './ProgressBar';
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

describe('ProgressBar Component - Property Tests', () => {
  /**
   * Feature: bytequest-treasure-hunt, Property 2: Progress bar percentage consistency
   * Validates: Requirements 2.3
   * 
   * For any set of solved rooms, the displayed percentage should equal (solvedCount / 10) * 100
   */
  it('Property 2: Progress bar percentage consistency - percentage matches calculation', () => {
    fc.assert(
      fc.property(
        // Generate an array of 10 booleans representing which rooms are solved
        fc.array(fc.boolean(), { minLength: 10, maxLength: 10 }),
        (roomStates) => {
          // Clean up before each property test iteration
          cleanup();
          
          // Reset state
          resetFragments();

          // Set fragments based on room states
          let expectedSolvedCount = 0;
          roomStates.forEach((isSolved, index) => {
            const roomId = index + 1;
            if (isSolved) {
              setFragment(roomId, `FRAGMENT${roomId}`);
              expectedSolvedCount++;
            }
          });

          // Render component
          const { container } = render(<ProgressBar />);

          // Calculate expected percentage
          const expectedPercentage = (expectedSolvedCount / 10) * 100;

          // Check displayed count
          const progressText = screen.getByText(new RegExp(`${expectedSolvedCount} / 10 ROOMS SOLVED`, 'i'));
          expect(progressText).toBeTruthy();

          // Check progress bar width
          const progressFill = container.querySelector('.progress-bar-fill') as HTMLElement;
          expect(progressFill).toBeTruthy();
          expect(progressFill.style.width).toBe(`${expectedPercentage}%`);

          // If percentage > 0, check displayed percentage text
          if (expectedPercentage > 0) {
            const percentageText = container.querySelector('.progress-percentage');
            expect(percentageText).toBeTruthy();
            expect(percentageText?.textContent).toBe(`${Math.round(expectedPercentage)}%`);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: bytequest-treasure-hunt, Property 8: Progress tracker visibility
   * Validates: Requirements 2.5
   * 
   * For any puzzle state, the progress tracker should always be visible and display current progress
   */
  it('Property 8: Progress tracker visibility - tracker is always visible', () => {
    fc.assert(
      fc.property(
        // Generate an array of 10 booleans representing which rooms are solved
        fc.array(fc.boolean(), { minLength: 10, maxLength: 10 }),
        (roomStates) => {
          // Clean up before each property test iteration
          cleanup();
          
          // Reset state
          resetFragments();

          // Set fragments based on room states
          roomStates.forEach((isSolved, index) => {
            const roomId = index + 1;
            if (isSolved) {
              setFragment(roomId, `FRAGMENT${roomId}`);
            }
          });

          // Render component
          const { container } = render(<ProgressBar />);

          // Property: Progress tracker container should always be visible
          const progressContainer = container.querySelector('.progress-bar-container');
          expect(progressContainer).toBeTruthy();
          expect(progressContainer).toBeVisible();

          // Property: Progress info should always be visible
          const progressInfo = container.querySelector('.progress-info');
          expect(progressInfo).toBeTruthy();
          expect(progressInfo).toBeVisible();

          // Property: Progress label should always be visible
          const progressLabel = container.querySelector('.progress-label');
          expect(progressLabel).toBeTruthy();
          expect(progressLabel).toBeVisible();
          expect(progressLabel?.textContent).toBe('PROGRESS');

          // Property: Progress count should always be visible
          const progressCount = container.querySelector('.progress-count');
          expect(progressCount).toBeTruthy();
          expect(progressCount).toBeVisible();
          expect(progressCount?.textContent).toMatch(/\d+ \/ 10 ROOMS SOLVED/);

          // Property: Progress bar track should always be visible
          const progressTrack = container.querySelector('.progress-bar-track');
          expect(progressTrack).toBeTruthy();
          expect(progressTrack).toBeVisible();

          // Property: Progress bar fill should always be present (even if width is 0%)
          const progressFill = container.querySelector('.progress-bar-fill');
          expect(progressFill).toBeTruthy();
        }
      ),
      { numRuns: 100 }
    );
  });
});


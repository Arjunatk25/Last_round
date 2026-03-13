/**
 * Property-Based Tests for Error Message Display
 * Feature: bytequest-treasure-hunt, Property 12: Error message display
 * Validates: Requirements 3.2, 13.3
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import * as fc from 'fast-check';
import { Room1 } from './Room1';
import { Room2 } from './Room2';
import { resetFragments } from '../utils/puzzleState';

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
  // Mock console.log to prevent test output pollution
  vi.spyOn(console, 'log').mockImplementation(() => {});
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('Error Message Display - Property Tests', () => {
  /**
   * Feature: bytequest-treasure-hunt, Property 12: Error message display
   * Validates: Requirements 3.2, 13.3
   * 
   * For any puzzle room and any incorrect input:
   * 1. An error message should be displayed when validation fails
   * 2. The error message should be non-empty and visible
   * 3. The error message should be cleared when correct input is provided
   * 4. Error messages should follow a consistent pattern across rooms
   */
  it('Property 12: Error message display - incorrect inputs show error messages', () => {
    fc.assert(
      fc.property(
        // Generate incorrect command inputs (anything except 'ls')
        // Exclude empty strings and whitespace-only strings to ensure meaningful input
        fc.string({ minLength: 1, maxLength: 20 }).filter(s => {
          const trimmed = s.trim();
          return trimmed.length > 0 && trimmed.toLowerCase() !== 'ls';
        }),
        (incorrectInput) => {
          // Clean up before each property test iteration
          cleanup();
          resetFragments();

          // Render Room1 with router context
          const { container } = render(
            <BrowserRouter>
              <Room1 />
            </BrowserRouter>
          );

          // Find the input field
          const input = container.querySelector('.terminal-input') as HTMLInputElement;
          expect(input).toBeTruthy();

          // Enter incorrect input
          fireEvent.change(input, { target: { value: incorrectInput } });

          // Submit the form
          const form = container.querySelector('.terminal-input-form') as HTMLFormElement;
          expect(form).toBeTruthy();
          fireEvent.submit(form);

          // Property 1: Error message should be displayed (synchronously after submit)
          const errorMessage = container.querySelector('.error-message');
          expect(errorMessage).toBeTruthy();
          
          // Property 2: Error message should be non-empty and visible
          expect(errorMessage?.textContent).toBeTruthy();
          expect(errorMessage?.textContent?.length).toBeGreaterThan(0);
          
          // Property 3: Error message should match expected pattern for Room 1
          expect(errorMessage?.textContent).toBe('ACCESS DENIED');

          // Property 4: Input should be cleared after error
          expect(input.value).toBe('');
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Property: Error message display for Room 2 (Programming Puzzle)
   * For any incorrect answer selection, an error message should be displayed
   */
  it('Property 12: Error message display - Room 2 shows error for incorrect selections', () => {
    fc.assert(
      fc.property(
        // Generate incorrect answer selections (anything except '42')
        fc.constantFrom('36', '8', '64'),
        (incorrectAnswer) => {
          // Clean up before each property test iteration
          cleanup();
          resetFragments();

          // Render Room2 with router context
          const { container } = render(
            <BrowserRouter>
              <Room2 />
            </BrowserRouter>
          );

          // Find and select an incorrect option
          const radioInput = container.querySelector(
            `input[type="radio"][value="${incorrectAnswer}"]`
          ) as HTMLInputElement;
          expect(radioInput).toBeTruthy();
          fireEvent.click(radioInput);

          // Submit the form
          const submitButton = screen.getByText('SUBMIT ANSWER');
          expect(submitButton).toBeTruthy();
          fireEvent.click(submitButton);

          // Property 1: Error message should be displayed (synchronously after submit)
          const errorMessage = container.querySelector('.error-message');
          expect(errorMessage).toBeTruthy();
          
          // Property 2: Error message should be non-empty and visible
          expect(errorMessage?.textContent).toBeTruthy();
          expect(errorMessage?.textContent?.length).toBeGreaterThan(0);
          
          // Property 3: Error message should match expected pattern for Room 2
          expect(errorMessage?.textContent).toBe('INCORRECT OUTPUT');
        }
      ),
      { numRuns: 10 }
    );
  });

  /**
   * Property: Error messages are consistent across puzzle rooms
   * All error messages should be non-empty, visible, and displayed in the same CSS class
   */
  it('Property 12: Error message consistency - all rooms use consistent error display pattern', async () => {
    // Test Room 1
    {
      cleanup();
      resetFragments();

      const { container } = render(
        <BrowserRouter>
          <Room1 />
        </BrowserRouter>
      );

      const input = container.querySelector('.terminal-input') as HTMLInputElement;
      fireEvent.change(input, { target: { value: 'wrong' } });
      
      const form = container.querySelector('.terminal-input-form') as HTMLFormElement;
      fireEvent.submit(form);

      await waitFor(() => {
        const errorMessage = container.querySelector('.error-message');
        expect(errorMessage).toBeTruthy();
        expect(errorMessage?.textContent).toBeTruthy();
        expect(errorMessage?.className).toContain('error-message');
      });
    }

    // Test Room 2
    {
      cleanup();
      resetFragments();

      const { container } = render(
        <BrowserRouter>
          <Room2 />
        </BrowserRouter>
      );

      const radioInput = container.querySelector(
        'input[type="radio"][value="36"]'
      ) as HTMLInputElement;
      fireEvent.click(radioInput);

      const submitButton = screen.getByText('SUBMIT ANSWER');
      fireEvent.click(submitButton);

      await waitFor(() => {
        const errorMessage = container.querySelector('.error-message');
        expect(errorMessage).toBeTruthy();
        expect(errorMessage?.textContent).toBeTruthy();
        expect(errorMessage?.className).toContain('error-message');
      });
    }
  });

  /**
   * Property: Error message is cleared on correct input
   * When a correct answer is provided after an error, the error should be cleared
   */
  it('Property 12: Error message clearing - error is removed on correct input', async () => {
    cleanup();
    resetFragments();

    const { container } = render(
      <BrowserRouter>
        <Room1 />
      </BrowserRouter>
    );

    const input = container.querySelector('.terminal-input') as HTMLInputElement;
    const form = container.querySelector('.terminal-input-form') as HTMLFormElement;

    // First, submit incorrect input to trigger error
    fireEvent.change(input, { target: { value: 'wrong' } });
    fireEvent.submit(form);

    // Wait for error to appear
    await waitFor(() => {
      const errorMessage = container.querySelector('.error-message');
      expect(errorMessage).toBeTruthy();
      expect(errorMessage?.textContent).toBe('ACCESS DENIED');
    });

    // Now submit correct input
    fireEvent.change(input, { target: { value: 'ls' } });
    fireEvent.submit(form);

    // Wait for success state (error should be cleared)
    await waitFor(() => {
      const successMessage = screen.queryByText('ACCESS GRANTED');
      expect(successMessage).toBeTruthy();
      
      // Error message should no longer be present
      const errorMessage = container.querySelector('.error-message');
      expect(errorMessage).toBeFalsy();
    });
  });
});

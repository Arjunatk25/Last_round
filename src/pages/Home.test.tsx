/**
 * Property-Based Tests for Home Page Component
 * Feature: bytequest-treasure-hunt
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, cleanup, fireEvent } from '@testing-library/react';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import * as fc from 'fast-check';
import { Home } from './Home';
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

// Track navigation calls
let navigationHistory: string[] = [];

// Mock useNavigate
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => (path: string) => {
      navigationHistory.push(path);
    },
  };
});

beforeEach(() => {
  localStorageMock.clear();
  resetFragments();
  navigationHistory = [];
});

afterEach(() => {
  cleanup();
});

describe('Home Page - Property Tests', () => {
  /**
   * Feature: bytequest-treasure-hunt, Property 10: Room card navigation
   * Validates: Requirements 1.2
   * 
   * For any room card clicked on the home page, the application should navigate
   * to the correct room URL (/room/:id) where :id matches the room number
   */
  it('Property 10: Room card navigation - clicking any room card navigates to correct URL', () => {
    fc.assert(
      fc.property(
        // Generate a room number (1-10)
        fc.integer({ min: 1, max: 10 }),
        (roomNumber) => {
          // Clean up before each property test iteration
          cleanup();
          navigationHistory = [];

          // Reset state
          resetFragments();

          // Render Home page wrapped in Router
          const { container } = render(
            <BrowserRouter>
              <Home />
            </BrowserRouter>
          );

          // Find all room cards
          const roomCards = container.querySelectorAll('.room-card');
          
          // Verify we have 10 room cards
          expect(roomCards.length).toBe(10);

          // Get the specific room card for this room number (0-indexed)
          const targetCard = roomCards[roomNumber - 1];
          expect(targetCard).toBeDefined();

          // Click the room card
          fireEvent.click(targetCard);

          // Property: navigation should be called with the correct room URL
          const expectedPath = `/room/${roomNumber}`;
          expect(navigationHistory).toContain(expectedPath);
          
          // Verify the last navigation was to the expected path
          expect(navigationHistory[navigationHistory.length - 1]).toBe(expectedPath);
        }
      ),
      { numRuns: 100 }
    );
  });
});

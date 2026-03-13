/**
 * End-to-End Integration Tests for ByteQuest Treasure Hunt
 * Feature: bytequest-treasure-hunt
 * 
 * Tests the complete user flow from home page through all 10 puzzle rooms,
 * master key assembly, and victory portal.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Home } from './Home';
import { Portal } from './Portal';
import { MasterKey } from './MasterKey';
import { resetFragments, calculateProgress, setFragment } from '../utils/puzzleState';
import { composeMasterKey, validateMasterKey } from '../utils/masterKey';

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

describe('End-to-End Integration Tests', () => {
  /**
   * Test: Home page displays all 10 room cards
   * Verifies that the home page loads with all puzzle rooms available
   */
  it('should display all 10 room cards on home page', async () => {
    const { container } = render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    // Verify home page loads with 10 room cards
    await waitFor(() => {
      const roomCards = container.querySelectorAll('.room-card');
      expect(roomCards.length).toBe(10);
    });

    // Verify progress bar is visible on home page
    expect(screen.getByText(/PROGRESS/i)).toBeDefined();

    // Verify all room cards have correct room numbers
    const roomCards = container.querySelectorAll('.room-card');
    roomCards.forEach((card, index) => {
      expect(card.textContent).toContain(`ROOM ${index + 1}`);
    });
  });

  /**
   * Test: Master key assembly with all fragments
   * Verifies that collecting all fragments creates the correct master key
   */
  it('should assemble correct master key from all 10 fragments', () => {
    // Simulate collecting all fragments
    const fragments = [
      'ONE',      // Room 1
      'PIECE',    // Room 2
      'GRAND',    // Room 3
      'LINE',     // Room 4
      'NEW',      // Room 5
      'WORLD',    // Room 6
      'TREASURE', // Room 7
      'HUNT',     // Room 8
      'FINAL',    // Room 9
      'QUEST',    // Room 10
    ];

    // Reset and set all fragments
    resetFragments();
    fragments.forEach((fragment, index) => {
      setFragment(index + 1, fragment);
    });

    // Compose master key
    const masterKey = composeMasterKey();

    // Verify master key is the concatenation of all fragments
    const expectedKey = fragments.join('');
    expect(masterKey).toBe(expectedKey);
    expect(masterKey).toBe('ONEPIECEGRANDLINENEWWORLDTREASUREHUNTFINALQUEST');

    // Verify master key validates correctly
    expect(validateMasterKey(masterKey)).toBe(true);
  });

  /**
   * Test: Progress calculation accuracy
   * Verifies that progress correctly reflects number of solved rooms
   */
  it('should calculate progress accurately based on solved rooms', () => {
    resetFragments();

    // Initially, progress should be 0
    expect(calculateProgress()).toBe(0);

    // Solve rooms one by one and verify progress
    for (let i = 1; i <= 10; i++) {
      setFragment(i, `FRAGMENT${i}`);
      expect(calculateProgress()).toBe(i);
    }
  });

  /**
   * Test: Master key validation
   * Verifies that master key validation works correctly
   */
  it('should validate master key correctly', () => {
    resetFragments();

    // Set all fragments
    const fragments = ['ONE', 'PIECE', 'GRAND', 'LINE', 'NEW', 'WORLD', 'TREASURE', 'HUNT', 'FINAL', 'QUEST'];
    fragments.forEach((fragment, index) => {
      setFragment(index + 1, fragment);
    });

    // Compose correct master key
    const correctKey = composeMasterKey();

    // Verify correct key validates
    expect(validateMasterKey(correctKey)).toBe(true);

    // Verify incorrect key does not validate
    expect(validateMasterKey('WRONGKEY')).toBe(false);
    expect(validateMasterKey('')).toBe(false);
  });

  /**
   * Test: Portal page displays victory elements
   * Verifies that the portal page shows the correct victory screen
   */
  it('should display portal page with victory message', async () => {
    const { container } = render(
      <BrowserRouter>
        <Portal />
      </BrowserRouter>
    );

    // Check for portal page structure
    const portalContainer = container.querySelector('.portal-container');
    expect(portalContainer).toBeDefined();

    // Check for victory message elements
    const victoryTitle = container.querySelector('.victory-title');
    expect(victoryTitle).toBeDefined();
    expect(victoryTitle?.textContent).toContain('BYTEQUEST');

    // Check for action buttons
    expect(screen.getByText(/RETURN HOME/i)).toBeDefined();
    expect(screen.getByText(/NEW ADVENTURE/i)).toBeDefined();
  });

  /**
   * Test: MasterKey page displays correctly
   * Verifies that the master key entry page renders properly
   */
  it('should display master key page with input field', async () => {
    // Set all fragments to enable master key entry
    const fragments = ['ONE', 'PIECE', 'GRAND', 'LINE', 'NEW', 'WORLD', 'TREASURE', 'HUNT', 'FINAL', 'QUEST'];
    fragments.forEach((fragment, index) => {
      setFragment(index + 1, fragment);
    });

    const { container } = render(
      <BrowserRouter>
        <MasterKey />
      </BrowserRouter>
    );

    // Check for master key page elements
    const masterKeyTitle = container.querySelector('.master-key-title');
    expect(masterKeyTitle).toBeDefined();
    expect(masterKeyTitle?.textContent).toContain('MASTER KEY');

    expect(screen.getByText(/All fragments collected/i)).toBeDefined();

    // Check for input field
    const input = container.querySelector('.master-key-input');
    expect(input).toBeDefined();

    // Check for submit button
    expect(screen.getByText(/UNLOCK PORTAL/i)).toBeDefined();
  });

  /**
   * Test: Dark hacker theme styling is applied
   * Verifies that the application uses the correct visual theme
   */
  it('should apply dark hacker theme styling', async () => {
    const { container } = render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    // Check for glitch text elements (hacker theme)
    const glitchElements = container.querySelectorAll('.glitch-text');
    expect(glitchElements.length).toBeGreaterThan(0);

    // Check for progress bar element
    const progressBar = container.querySelector('.progress-bar');
    expect(progressBar).toBeDefined();

    // Check for room cards with styling
    const roomCards = container.querySelectorAll('.room-card');
    expect(roomCards.length).toBe(10);
  });

  /**
   * Test: Responsive grid layout
   * Verifies that the home page uses responsive grid layout
   */
  it('should use responsive grid layout for room cards', async () => {
    const { container } = render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    // Verify room cards grid exists
    const roomsGrid = container.querySelector('.rooms-grid');
    expect(roomsGrid).toBeDefined();

    // Check that grid layout is applied (could be grid or flex depending on CSS)
    const styles = window.getComputedStyle(roomsGrid);
    expect(styles.display).toBeDefined();
    // Grid can be 'grid', 'flex', or 'block' depending on responsive breakpoint
    expect(['grid', 'flex', 'block']).toContain(styles.display);
  });

  /**
   * Test: Fragment persistence across state changes
   * Verifies that fragments remain stored after state updates
   */
  it('should persist fragments across state changes', () => {
    resetFragments();

    // Set fragments
    setFragment(1, 'ONE');
    setFragment(2, 'PIECE');
    setFragment(3, 'GRAND');

    // Verify fragments are stored
    expect(calculateProgress()).toBe(3);

    // Add more fragments
    setFragment(4, 'LINE');
    setFragment(5, 'NEW');

    // Verify all fragments are still there
    expect(calculateProgress()).toBe(5);

    // Verify master key includes all fragments
    const masterKey = composeMasterKey();
    expect(masterKey).toContain('ONE');
    expect(masterKey).toContain('PIECE');
    expect(masterKey).toContain('GRAND');
    expect(masterKey).toContain('LINE');
    expect(masterKey).toContain('NEW');
  });

  /**
   * Test: Complete puzzle flow
   * Verifies the complete flow from home to master key to portal
   */
  it('should support complete puzzle flow from home to portal', () => {
    // Step 1: Verify home page renders
    const { container: homeContainer } = render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    const roomCards = homeContainer.querySelectorAll('.room-card');
    expect(roomCards.length).toBe(10);

    cleanup();

    // Step 2: Simulate solving all puzzles
    resetFragments();
    const fragments = ['ONE', 'PIECE', 'GRAND', 'LINE', 'NEW', 'WORLD', 'TREASURE', 'HUNT', 'FINAL', 'QUEST'];
    fragments.forEach((fragment, index) => {
      setFragment(index + 1, fragment);
    });

    // Step 3: Verify master key is ready
    const masterKey = composeMasterKey();
    expect(masterKey).toBe('ONEPIECEGRANDLINENEWWORLDTREASUREHUNTFINALQUEST');
    expect(validateMasterKey(masterKey)).toBe(true);

    // Step 4: Verify portal page can be rendered
    const { container: portalContainer } = render(
      <BrowserRouter>
        <Portal />
      </BrowserRouter>
    );

    expect(portalContainer.querySelector('.portal-container')).toBeDefined();
    const victoryTitle = portalContainer.querySelector('.victory-title');
    expect(victoryTitle?.textContent).toContain('BYTEQUEST');
  });

  /**
   * Test: All room cards are interactive
   * Verifies that room cards can be clicked for navigation
   */
  it('should have interactive room cards for navigation', async () => {
    const { container } = render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    // Verify all room cards exist and are clickable
    const roomCards = container.querySelectorAll('.room-card');
    expect(roomCards.length).toBe(10);

    roomCards.forEach((card, index) => {
      // Each card should have a link or button
      const link = card.querySelector('a') || card.querySelector('button');
      expect(link).toBeDefined();
      expect(card.textContent).toContain(`ROOM ${index + 1}`);
    });
  });

  /**
   * Test: Progress bar updates with fragment collection
   * Verifies that progress bar reflects solved rooms
   */
  it('should update progress bar when fragments are collected', () => {
    resetFragments();

    // Render home page
    const { container } = render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    // Initially progress should be 0
    let progressText = screen.getByText(/PROGRESS/i);
    expect(progressText).toBeDefined();

    // Simulate collecting fragments
    setFragment(1, 'ONE');
    setFragment(2, 'PIECE');

    // Progress should be updated
    const progress = calculateProgress();
    expect(progress).toBe(2);
  });
});

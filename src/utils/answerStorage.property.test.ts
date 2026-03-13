import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  setFragment,
  getFragment,
  isRoomSolved,
  calculateProgress,
  loadFragments,
  saveFragments,
  resetFragments,
  initializeFragments,
  type FragmentStorage
} from './puzzleState';

/**
 * Property-Based Tests for Answer Storage Pattern
 * **Feature: bytequest-treasure-hunt, Property 15: Answer storage pattern**
 * **Validates: Requirements 15.3**
 */
describe('Answer Storage Pattern', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    resetFragments();
  });

  afterEach(() => {
    // Clean up after each test
    localStorage.clear();
    resetFragments();
  });

  /**
   * Property 15: Answer storage round trip
   * For any room ID (1-10) and any fragment string, storing the fragment and then 
   * retrieving it should return the same fragment value
   */
  it('should store and retrieve fragments correctly', () => {
    const testCases = [
      { roomId: 1, fragment: 'ONE' },
      { roomId: 2, fragment: 'PIECE' },
      { roomId: 3, fragment: 'GRAND' },
      { roomId: 4, fragment: 'LINE' },
      { roomId: 5, fragment: 'NEW' },
      { roomId: 6, fragment: 'WORLD' },
      { roomId: 7, fragment: 'TREASURE' },
      { roomId: 8, fragment: 'HUNT' },
      { roomId: 9, fragment: 'FINAL' },
      { roomId: 10, fragment: 'QUEST' }
    ];

    testCases.forEach(({ roomId, fragment }) => {
      // Store the fragment
      setFragment(roomId, fragment);
      
      // Retrieve and verify
      const retrieved = getFragment(roomId);
      expect(retrieved).toBe(fragment);
    });
  });

  /**
   * Property 15 (continued): Fragment persistence
   * For any stored fragment, it should persist in localStorage and be retrievable 
   * after reloading the state
   */
  it('should persist fragments in localStorage', () => {
    // Store multiple fragments
    setFragment(1, 'ONE');
    setFragment(3, 'GRAND');
    setFragment(7, 'TREASURE');

    // Manually reload from localStorage to simulate page refresh
    const reloadedFragments = loadFragments();

    expect(reloadedFragments.r1).toBe('ONE');
    expect(reloadedFragments.r3).toBe('GRAND');
    expect(reloadedFragments.r7).toBe('TREASURE');
  });

  /**
   * Property 15 (continued): Room solved detection
   * For any room with a stored fragment, isRoomSolved should return true
   * For any room without a fragment, isRoomSolved should return false
   */
  it('should correctly detect solved rooms', () => {
    // Initially, no rooms should be solved
    for (let roomId = 1; roomId <= 10; roomId++) {
      expect(isRoomSolved(roomId)).toBe(false);
    }

    // After storing fragments, rooms should be marked as solved
    setFragment(1, 'ONE');
    expect(isRoomSolved(1)).toBe(true);

    setFragment(5, 'NEW');
    expect(isRoomSolved(5)).toBe(true);

    // Other rooms should still be unsolved
    expect(isRoomSolved(2)).toBe(false);
    expect(isRoomSolved(10)).toBe(false);
  });

  /**
   * Property 15 (continued): Progress calculation accuracy
   * For any number of solved rooms, calculateProgress should return the correct count
   */
  it('should calculate progress correctly', () => {
    // Initially, progress should be 0
    expect(calculateProgress()).toBe(0);

    // After solving one room
    setFragment(1, 'ONE');
    expect(calculateProgress()).toBe(1);

    // After solving multiple rooms
    setFragment(2, 'PIECE');
    setFragment(3, 'GRAND');
    expect(calculateProgress()).toBe(3);

    // After solving all rooms
    for (let roomId = 4; roomId <= 10; roomId++) {
      setFragment(roomId, `FRAGMENT_${roomId}`);
    }
    expect(calculateProgress()).toBe(10);
  });

  /**
   * Property 15 (continued): Empty fragment initialization
   * For any newly initialized fragment storage, all rooms should have empty fragments
   */
  it('should initialize fragments as empty strings', () => {
    const initialized = initializeFragments();

    for (let roomId = 1; roomId <= 10; roomId++) {
      const key = `r${roomId}` as keyof FragmentStorage;
      expect(initialized[key]).toBe('');
    }
  });

  /**
   * Property 15 (continued): Fragment overwrite
   * For any room with an existing fragment, storing a new fragment should replace the old one
   */
  it('should overwrite existing fragments', () => {
    // Store initial fragment
    setFragment(1, 'ONE');
    expect(getFragment(1)).toBe('ONE');

    // Overwrite with new fragment
    setFragment(1, 'UPDATED');
    expect(getFragment(1)).toBe('UPDATED');

    // Verify other rooms are unaffected
    setFragment(2, 'PIECE');
    expect(getFragment(1)).toBe('UPDATED');
    expect(getFragment(2)).toBe('PIECE');
  });

  /**
   * Property 15 (continued): Fragment reset
   * After calling resetFragments, all rooms should have empty fragments
   */
  it('should reset all fragments to empty', () => {
    // Store fragments in all rooms
    for (let roomId = 1; roomId <= 10; roomId++) {
      setFragment(roomId, `FRAGMENT_${roomId}`);
    }

    // Verify all are stored
    for (let roomId = 1; roomId <= 10; roomId++) {
      expect(isRoomSolved(roomId)).toBe(true);
    }

    // Reset
    resetFragments();

    // Verify all are cleared
    for (let roomId = 1; roomId <= 10; roomId++) {
      expect(isRoomSolved(roomId)).toBe(false);
      expect(getFragment(roomId)).toBe('');
    }
  });

  /**
   * Property 15 (continued): Fragment storage structure
   * For any loaded fragment storage, it should have exactly 10 room entries (r1-r10)
   */
  it('should maintain correct fragment storage structure', () => {
    const fragments = loadFragments();

    // Verify all 10 rooms are present
    expect(fragments).toHaveProperty('r1');
    expect(fragments).toHaveProperty('r2');
    expect(fragments).toHaveProperty('r3');
    expect(fragments).toHaveProperty('r4');
    expect(fragments).toHaveProperty('r5');
    expect(fragments).toHaveProperty('r6');
    expect(fragments).toHaveProperty('r7');
    expect(fragments).toHaveProperty('r8');
    expect(fragments).toHaveProperty('r9');
    expect(fragments).toHaveProperty('r10');

    // Verify no extra properties
    const keys = Object.keys(fragments);
    expect(keys.length).toBe(10);
  });

  /**
   * Property 15 (continued): Fragment value types
   * For any fragment, the stored value should be a string
   */
  it('should store fragments as strings', () => {
    setFragment(1, 'ONE');
    setFragment(2, 'PIECE');

    const fragment1 = getFragment(1);
    const fragment2 = getFragment(2);

    expect(typeof fragment1).toBe('string');
    expect(typeof fragment2).toBe('string');
  });

  /**
   * Property 15 (continued): Multiple room independence
   * For any two different rooms, storing a fragment in one should not affect the other
   */
  it('should maintain independence between rooms', () => {
    setFragment(1, 'ONE');
    setFragment(2, 'PIECE');
    setFragment(3, 'GRAND');

    // Verify each room has its own fragment
    expect(getFragment(1)).toBe('ONE');
    expect(getFragment(2)).toBe('PIECE');
    expect(getFragment(3)).toBe('GRAND');

    // Modify one room
    setFragment(2, 'MODIFIED');

    // Verify others are unchanged
    expect(getFragment(1)).toBe('ONE');
    expect(getFragment(2)).toBe('MODIFIED');
    expect(getFragment(3)).toBe('GRAND');
  });
});

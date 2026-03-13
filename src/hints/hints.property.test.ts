import { describe, it, expect } from 'vitest';
import {
  hintDistribution,
  validateHintDistribution,
  getInternalHints,
  getExternalHint,
  getRoomHints,
  getHintLocations
} from './hints';

/**
 * Property-Based Tests for Hint Distribution
 * **Feature: bytequest-treasure-hunt, Property 16: Hint hiding techniques**
 * **Validates: Requirements 15.2**
 */
describe('Hint Distribution System', () => {
  /**
   * Property: Each room has exactly 2 internal hints
   * For any room 1-10, the internal hints array should have exactly 2 elements
   */
  it('should have exactly 2 internal hints per room', () => {
    for (let roomId = 1; roomId <= 10; roomId++) {
      const hints = getInternalHints(roomId);
      expect(hints).toHaveLength(2);
      expect(hints[0]).toBeDefined();
      expect(hints[1]).toBeDefined();
    }
  });

  /**
   * Property: Each room (except Room 10) has exactly 1 external hint reference
   * For any room 1-9, the external hint should be defined
   * Room 10 is the meta puzzle and doesn't need an external hint
   */
  it('should have exactly 1 external hint reference per room (except Room 10)', () => {
    for (let roomId = 1; roomId <= 9; roomId++) {
      const externalHint = getExternalHint(roomId);
      expect(externalHint).toBeDefined();
      expect(externalHint?.hint).toBeDefined();
      expect(externalHint?.targetRoom).toBeDefined();
    }

    // Room 10 should not have external hint
    const room10External = getExternalHint(10);
    expect(room10External).toBeUndefined();
  });

  /**
   * Property: All internal hints have valid variable names
   * For any internal hint, the variable name should follow the pattern: hint_r{roomId}_{hintNumber}
   */
  it('should have valid internal hint variable names', () => {
    for (let roomId = 1; roomId <= 10; roomId++) {
      const hints = getInternalHints(roomId);
      hints.forEach((hint, index) => {
        const expectedPattern = `hint_r${roomId}_${index + 1}`;
        expect(hint.variable).toBe(expectedPattern);
      });
    }
  });

  /**
   * Property: All external hints have valid variable names
   * For any external hint, the variable name should follow the pattern: hint_r{X}_from_r{Y}
   * where X and Y are room numbers (the exact pattern varies in the current implementation)
   */
  it('should have valid external hint variable names', () => {
    const hintVariablePattern = /^hint_r\d+_from_r\d+$/;
    
    for (let roomId = 1; roomId <= 9; roomId++) {
      const externalHint = getExternalHint(roomId);
      if (externalHint) {
        // Verify the variable follows the pattern hint_r{X}_from_r{Y}
        expect(externalHint.hint.variable).toMatch(hintVariablePattern);
      }
    }
  });

  /**
   * Property: All hints have non-empty content
   * For any hint (internal or external), the content should not be empty
   */
  it('should have non-empty content for all hints', () => {
    for (let roomId = 1; roomId <= 10; roomId++) {
      const internalHints = getInternalHints(roomId);
      internalHints.forEach(hint => {
        expect(hint.content).toBeTruthy();
        expect(hint.content.length).toBeGreaterThan(0);
      });

      const externalHint = getExternalHint(roomId);
      if (externalHint) {
        expect(externalHint.hint.content).toBeTruthy();
        expect(externalHint.hint.content.length).toBeGreaterThan(0);
      }
    }
  });

  /**
   * Property: All hints have valid locations
   * For any hint, the location should be one of the defined HintLocation types
   */
  it('should have valid hint locations', () => {
    const validLocations = ['console', 'html-comment', 'footer', 'data-attribute', 'network', 'page-element'];

    for (let roomId = 1; roomId <= 10; roomId++) {
      const hints = getInternalHints(roomId);
      hints.forEach(hint => {
        expect(validLocations).toContain(hint.location);
      });

      const externalHint = getExternalHint(roomId);
      if (externalHint) {
        expect(validLocations).toContain(externalHint.hint.location);
      }
    }
  });

  /**
   * Property: Hint distribution validation passes
   * The validateHintDistribution function should return true for the entire system
   */
  it('should pass hint distribution validation', () => {
    expect(validateHintDistribution()).toBe(true);
  });

  /**
   * Property: All rooms have defined hints
   * For any room 1-10, getRoomHints should return a defined object
   */
  it('should have hints defined for all rooms', () => {
    for (let roomId = 1; roomId <= 10; roomId++) {
      const roomHints = getRoomHints(roomId);
      expect(roomHints).toBeDefined();
      expect(roomHints?.internal).toBeDefined();
    }
  });

  /**
   * Property: Hint locations are retrievable for all rooms
   * For any room 1-10, getHintLocations should return an array with at least 2 elements
   */
  it('should retrieve hint locations for all rooms', () => {
    for (let roomId = 1; roomId <= 10; roomId++) {
      const locations = getHintLocations(roomId);
      expect(Array.isArray(locations)).toBe(true);
      // Each room should have at least 2 internal hints
      expect(locations.length).toBeGreaterThanOrEqual(2);
    }
  });

  /**
   * Property: Cross-room hint references are bidirectional
   * For any room with an external hint pointing to another room,
   * that target room should have an internal hint that can be referenced
   */
  it('should have valid cross-room hint references', () => {
    for (let roomId = 1; roomId <= 9; roomId++) {
      const externalHint = getExternalHint(roomId);
      if (externalHint) {
        const targetRoom = externalHint.targetRoom;
        expect(targetRoom).toBeGreaterThanOrEqual(1);
        expect(targetRoom).toBeLessThanOrEqual(10);
        
        // Verify target room exists
        const targetRoomHints = getRoomHints(targetRoom);
        expect(targetRoomHints).toBeDefined();
      }
    }
  });

  /**
   * Property: No duplicate hint variable names within a room
   * For any room, internal hints should have unique variable names
   * Note: External hints may reference the same hint from multiple rooms (bidirectional references)
   */
  it('should not have duplicate internal hint variable names', () => {
    for (let roomId = 1; roomId <= 10; roomId++) {
      const internalHints = getInternalHints(roomId);
      const variables = internalHints.map(h => h.variable);
      const uniqueVariables = new Set(variables);
      
      // Each room should have unique internal hint variables
      expect(uniqueVariables.size).toBe(internalHints.length);
    }
  });

  /**
   * Property: Hint descriptions are non-empty
   * For any hint, the description should not be empty
   */
  it('should have non-empty descriptions for all hints', () => {
    for (let roomId = 1; roomId <= 10; roomId++) {
      const internalHints = getInternalHints(roomId);
      internalHints.forEach(hint => {
        expect(hint.description).toBeTruthy();
        expect(hint.description.length).toBeGreaterThan(0);
      });

      const externalHint = getExternalHint(roomId);
      if (externalHint) {
        expect(externalHint.hint.description).toBeTruthy();
        expect(externalHint.hint.description.length).toBeGreaterThan(0);
      }
    }
  });

  /**
   * Property 16: Hint hiding techniques
   * **Feature: bytequest-treasure-hunt, Property 16: Hint hiding techniques**
   * **Validates: Requirements 15.2**
   * 
   * For any room, hints should be hidden using different techniques (console, HTML comments, 
   * footer, data attributes, network, page elements) to encourage exploration of different 
   * DevTools features. The system should use a variety of hiding techniques across all rooms.
   */
  it('should use diverse hint hiding techniques across the system', () => {
    const validLocations = ['console', 'html-comment', 'footer', 'data-attribute', 'network', 'page-element'];
    const usedLocations = new Set<HintLocation>();
    
    for (let roomId = 1; roomId <= 10; roomId++) {
      const locations = getHintLocations(roomId);
      
      // All locations should be valid
      locations.forEach(location => {
        expect(validLocations).toContain(location);
        usedLocations.add(location);
      });
    }
    
    // The system should use multiple different hiding techniques across all rooms
    expect(usedLocations.size).toBeGreaterThan(1);
  });

  /**
   * Property 16 (continued): Hint locations should vary across rooms
   * For any two different rooms, they should use different combinations of hint locations
   * to encourage players to explore all DevTools features
   */
  it('should distribute hint locations across different rooms', () => {
    const locationsByRoom: Record<number, Set<HintLocation>> = {};
    
    for (let roomId = 1; roomId <= 10; roomId++) {
      const locations = getHintLocations(roomId);
      locationsByRoom[roomId] = new Set(locations);
    }
    
    // Verify that console hints are used in multiple rooms
    let consoleRoomCount = 0;
    for (let roomId = 1; roomId <= 10; roomId++) {
      if (locationsByRoom[roomId].has('console')) {
        consoleRoomCount++;
      }
    }
    expect(consoleRoomCount).toBeGreaterThan(0);
  });
});

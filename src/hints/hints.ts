/**
 * Hints Utility System
 * Manages hint distribution and cross-room hint references
 * 
 * Hint Variable Naming Convention:
 * - Internal hints: hint_r{roomNumber}_{hintNumber} (e.g., hint_r1_1, hint_r1_2)
 * - External hints: hint_r{targetRoom}_from_r{sourceRoom} (e.g., hint_r1_from_r5)
 * 
 * Each room has:
 * - 2 internal hints (for solving that room)
 * - 1 external hint reference (pointing to another room's hint)
 */

export type HintLocation = 'console' | 'html-comment' | 'footer' | 'data-attribute' | 'network' | 'page-element';

export interface HintDefinition {
  variable: string;
  location: HintLocation;
  content: string;
  description: string;
}

export interface RoomHints {
  internal: HintDefinition[];
  external?: {
    targetRoom: number;
    hint: HintDefinition;
  };
}

/**
 * Hint Distribution Map
 * Maps each room to its internal hints and external hint references
 */
export const hintDistribution: Record<number, RoomHints> = {
  1: {
    internal: [
      {
        variable: 'hint_r1_1',
        location: 'console',
        content: 'Try common system commands',
        description: 'First internal hint for Room 1'
      },
      {
        variable: 'hint_r1_2',
        location: 'console',
        content: 'Think about listing directory contents',
        description: 'Second internal hint for Room 1'
      }
    ],
    external: {
      targetRoom: 5,
      hint: {
        variable: 'hint_r1_from_r5',
        location: 'console',
        content: 'The command you need is in Room 5 console',
        description: 'External hint from Room 5 for Room 1'
      }
    }
  },
  2: {
    internal: [
      {
        variable: 'hint_r2_1',
        location: 'console',
        content: 'Read the code carefully',
        description: 'First internal hint for Room 2'
      },
      {
        variable: 'hint_r2_2',
        location: 'console',
        content: 'What does the function return?',
        description: 'Second internal hint for Room 2'
      }
    ],
    external: {
      targetRoom: 7,
      hint: {
        variable: 'hint_r2_from_r7',
        location: 'html-comment',
        content: 'Check Room 7 HTML comments for programming hint',
        description: 'External hint from Room 7 for Room 2'
      }
    }
  },
  3: {
    internal: [
      {
        variable: 'hint_r3_1',
        location: 'console',
        content: 'The first half of the PIN is displayed',
        description: 'First internal hint for Room 3'
      },
      {
        variable: 'hint_r3_2',
        location: 'console',
        content: 'Look for the second half elsewhere',
        description: 'Second internal hint for Room 3'
      }
    ],
    external: {
      targetRoom: 9,
      hint: {
        variable: 'hint_r9_from_r3',
        location: 'html-comment',
        content: 'Room 3 HTML comment has network hint',
        description: 'External hint from Room 3 for Room 9'
      }
    }
  },
  4: {
    internal: [
      {
        variable: 'hint_r4_1',
        location: 'console',
        content: 'You need a cipher key',
        description: 'First internal hint for Room 4'
      },
      {
        variable: 'hint_r4_2',
        location: 'console',
        content: 'Check Room 2 footer for the key',
        description: 'Second internal hint for Room 4'
      }
    ],
    external: {
      targetRoom: 8,
      hint: {
        variable: 'hint_r8_from_r4',
        location: 'footer',
        content: 'Room 4 footer has binary conversion hint',
        description: 'External hint from Room 4 for Room 8'
      }
    }
  },
  5: {
    internal: [
      {
        variable: 'hint_r5_1',
        location: 'console',
        content: 'Not everything is as it seems',
        description: 'First internal hint for Room 5'
      },
      {
        variable: 'hint_r5_2',
        location: 'console',
        content: 'Try clicking around the page',
        description: 'Second internal hint for Room 5'
      }
    ],
    external: {
      targetRoom: 9,
      hint: {
        variable: 'hint_r5_from_r9',
        location: 'network',
        content: 'Check Room 9 network tab for offline hint',
        description: 'External hint from Room 9 for Room 5'
      }
    }
  },
  6: {
    internal: [
      {
        variable: 'hint_r6_1',
        location: 'console',
        content: 'Open the developer console',
        description: 'First internal hint for Room 6'
      },
      {
        variable: 'hint_r6_2',
        location: 'console',
        content: 'Solve the math puzzle in the console',
        description: 'Second internal hint for Room 6'
      }
    ],
    external: {
      targetRoom: 10,
      hint: {
        variable: 'hint_r6_from_r10',
        location: 'page-element',
        content: 'Room 10 page element has console puzzle hint',
        description: 'External hint from Room 10 for Room 6'
      }
    }
  },
  7: {
    internal: [
      {
        variable: 'hint_r7_1',
        location: 'data-attribute',
        content: 'Inspect the image element',
        description: 'First internal hint for Room 7'
      },
      {
        variable: 'hint_r7_2',
        location: 'data-attribute',
        content: 'Check alt text and data attributes',
        description: 'Second internal hint for Room 7'
      }
    ],
    external: {
      targetRoom: 10,
      hint: {
        variable: 'hint_r7_from_r10',
        location: 'console',
        content: 'Room 10 console has image puzzle hint',
        description: 'External hint from Room 10 for Room 7'
      }
    }
  },
  8: {
    internal: [
      {
        variable: 'hint_r8_1',
        location: 'console',
        content: 'Binary to ASCII conversion',
        description: 'First internal hint for Room 8'
      },
      {
        variable: 'hint_r8_2',
        location: 'console',
        content: 'Each 8 bits represents one character',
        description: 'Second internal hint for Room 8'
      }
    ],
    external: {
      targetRoom: 3,
      hint: {
        variable: 'hint_r3_from_r8',
        location: 'html-comment',
        content: 'Room 8 HTML comment has PIN part 2',
        description: 'External hint from Room 8 for Room 3 (PIN part 2)'
      }
    }
  },
  9: {
    internal: [
      {
        variable: 'hint_r9_1',
        location: 'console',
        content: 'Check the Network tab in DevTools',
        description: 'First internal hint for Room 9'
      },
      {
        variable: 'hint_r9_2',
        location: 'console',
        content: 'Look for hidden API requests',
        description: 'Second internal hint for Room 9'
      }
    ],
    external: {
      targetRoom: 5,
      hint: {
        variable: 'hint_r5_from_r9',
        location: 'network',
        content: 'Check Room 9 network tab for offline hint',
        description: 'External hint from Room 9 for Room 5'
      }
    }
  },
  10: {
    internal: [
      {
        variable: 'hint_r10_1',
        location: 'console',
        content: 'Think about patterns from previous rooms',
        description: 'First internal hint for Room 10'
      },
      {
        variable: 'hint_r10_2',
        location: 'console',
        content: 'The answer connects multiple puzzles',
        description: 'Second internal hint for Room 10'
      }
    ]
    // Room 10 has no external hint reference (meta puzzle)
  }
};

/**
 * Get all hints for a specific room
 */
export const getRoomHints = (roomId: number): RoomHints | undefined => {
  return hintDistribution[roomId];
};

/**
 * Get internal hints for a specific room
 */
export const getInternalHints = (roomId: number): HintDefinition[] => {
  const roomHints = hintDistribution[roomId];
  return roomHints?.internal || [];
};

/**
 * Get external hint reference for a specific room
 */
export const getExternalHint = (roomId: number): { targetRoom: number; hint: HintDefinition } | undefined => {
  const roomHints = hintDistribution[roomId];
  return roomHints?.external;
};

/**
 * Log hints to console with proper variable naming
 * This function should be called in room components to expose hints
 */
export const logHintsToConsole = (roomId: number): void => {
  const hints = getInternalHints(roomId);
  
  hints.forEach(hint => {
    // Create a global variable with the hint content
    (window as any)[hint.variable] = hint.content;
    console.log(`${hint.variable} is available`);
  });
};

/**
 * Get hint by variable name (for cross-room references)
 */
export const getHintByVariable = (variableName: string): HintDefinition | undefined => {
  for (const roomId in hintDistribution) {
    const room = hintDistribution[Number(roomId)];
    
    // Check internal hints
    const internalHint = room.internal.find(h => h.variable === variableName);
    if (internalHint) return internalHint;
    
    // Check external hint
    if (room.external?.hint.variable === variableName) {
      return room.external.hint;
    }
  }
  
  return undefined;
};

/**
 * Validate hint distribution (each room should have 2 internal + 1 external except Room 10)
 */
export const validateHintDistribution = (): boolean => {
  for (let roomId = 1; roomId <= 10; roomId++) {
    const hints = hintDistribution[roomId];
    
    if (!hints) return false;
    
    // Check internal hints count
    if (hints.internal.length !== 2) return false;
    
    // Room 10 is meta puzzle and doesn't need external hint
    if (roomId !== 10 && !hints.external) return false;
  }
  
  return true;
};

/**
 * Get all hint locations used in a room
 */
export const getHintLocations = (roomId: number): HintLocation[] => {
  const hints = getRoomHints(roomId);
  if (!hints) return [];
  
  const locations: HintLocation[] = hints.internal.map(h => h.location);
  
  if (hints.external) {
    locations.push(hints.external.hint.location);
  }
  
  return locations;
};


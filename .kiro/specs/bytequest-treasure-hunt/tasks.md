# Implementation Plan

- [x] 1. Initialize project structure and dependencies
  - Create Vite + React project with TypeScript support
  - Install React Router v6
  - Set up project directory structure (pages, components, utils, hints)
  - Configure base styling and CSS variables for dark hacker theme
  - _Requirements: 18.1, 18.3, 18.5_

- [x] 2. Implement core state management and utilities
  - Create puzzle state management utility (puzzleState.ts)
  - Implement fragment storage object structure (r1-r10)
  - Create master key composition utility (masterKey.ts)
  - Set up state persistence logic
  - _Requirements: 17.1, 17.2, 17.3_

- [x] 2.1 Write property test for progress calculation
  - **Property 1: Progress calculation accuracy**
  - **Validates: Requirements 2.1**

- [x] 2.2 Write property test for master key composition
  - **Property 4: Master key composition correctness**
  - **Validates: Requirements 17.3**

- [x] 3. Create ProgressBar component
  - Implement ProgressBar component with solved count display
  - Add visual progress bar with percentage fill
  - Style with dark hacker theme (terminal fonts, cyberpunk colors)
  - Implement reactive updates on state changes
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 3.1 Write property test for progress bar percentage













  - **Property 2: Progress bar percentage consistency**
  - **Validates: Requirements 2.3**

- [x] 3.2 Write property test for progress tracker visibility
  - **Property 8: Progress tracker visibility**
  - **Validates: Requirements 2.5**

- [x] 4. Create RoomCard component
  - Implement RoomCard with room number and title display
  - Add solved indicator (checkmark) conditional rendering
  - Implement click handler for navigation

  - Style with hover effects and animations
  - _Requirements: 1.2, 1.3_



- [x] 4.1 Write property test for room card solved indicator
  - **Property 9: Room card solved indicator**
  - **Validates: Requirements 1.3**

- [x] 5. Implement Home page
  - Create Home page component with 10 RoomCard grid layout
  - Integrate ProgressBar at top
  - Implement responsive grid (mobile: 1 col, tablet: 2 col, desktop: 3 col)
  - Add dark hacker theme styling with glitch effects
  - _Requirements: 1.1, 1.4, 16.1, 16.2, 16.3_

- [x] 5.1 Write property test for room card navigation
  - **Property 10: Room card navigation**
  - **Validates: Requirements 1.2**

- [x] 6. Set up routing infrastructure













  - Configure React Router with routes for all pages
  - Create route definitions (/, /room/:id, /master-key, /portal)
  - Implement App.tsx with Router setup
  - _Requirements: 18.3_



- [x] 7. Create hints utility system








  - Create hints.ts with hint distribution map
  - Define cross-room hint references
  - Implement hint variable naming convention
  - Document hint locations for each room
  - _Requirements: 15.2, 15.4_

- [x] 8. Implement Room 1 - Terminal Command Puzzle





  - Create Room1.tsx page component
  - Create terminal interface UI with command input
  - Implement command validation against stored variable
  - Add "ACCESS DENIED" error message display
  - Log hint variables to console using variable references
  - Store fragment "ONE" on correct answer
  - Add 2 internal hints and reference to external hint in Room 5
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 8.1 Write property test for terminal validation pattern





  - **Property 7: Validation against stored variables**
  - **Validates: Requirements 15.3**

- [x] 8.2 Write property test for hint variable logging






  - **Property 5: Hint variable logging format**
  - **Validates: Requirements 15.1**

- [x] 9. Implement Room 2 - Programming Puzzle





  - Create Room2.tsx page component
  - Create code snippet display with multiple choice options
  - Implement selection validation against stored variable
  - Log hint variables to console using variable references
  - Store fragment "PIECE" on correct answer
  - Add cipher key hint in footer for Room 4
  - Add 2 internal hints and reference to external hint in Room 7
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [x] 9.1 Write property test for puzzle validation and fragment storage






  - **Property 11: Puzzle validation pattern**
  - **Validates: Requirements 3.3, 4.3**

- [x] 10. Implement Room 3 - Vault Puzzle





  - Create Room3.tsx page component
  - Create vault keypad UI (0-9 buttons)
  - Display first half of PIN through program output
  - Implement PIN validation (two-part combination)
  - Store fragment "GRAND" on correct PIN
  - Add HTML comment with hint for Room 9
  - Add 2 internal hints and reference to external hint in Room 8 (PIN part 2)
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_


- [x] 11. Implement Room 4 - Cipher Puzzle




  - Create Room4.tsx page component
  - Display encrypted text to player
  - Implement decryption input and validation
  - Store fragment "LINE" on correct decryption
  - Add console hints using variable references
  - Add footer hint for Room 8
  - Reference cipher key location in Room 2 footer
  - _Requirements: 6.1, 6.2, 6.3, 6.4_


- [x] 12. Implement Room 5 - Fake Offline Puzzle




  - Create Room5.tsx page component
  - Create "No Internet Connection" styled page
  - Implement hidden clickable area with invisible div
  - Add secret gate reveal animation
  - Store fragment "NEW" when gate unlocked
  - Add console hint for Room 1 command
  - Add 2 internal hints and reference to external hint in Room 9
  - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [x] 12.1 Write property test for error message display





  - **Property 12: Error message display**
  - **Validates: Requirements 3.2, 13.3**

- [x] 13. Implement Room 6 - Console Puzzle











  - Create Room6.tsx page component
  - Create minimal/empty visual page
  - Log math puzzle hint variables to console
  - Implement answer input and validation
  - Store fragment "WORLD" on correct answer
  - Add HTML comment hint for Room 1
  - Add page element hint for Room 10
  - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [x] 14. Implement Room 7 - Image Puzzle



  - Create Room7.tsx page component
  - Display image with hidden clues in alt text
  - Add data attributes with additional hints
  - Implement answer input and validation
  - Store fragment "TREASURE" on correct answer
  - Add HTML comment hint for Room 2
  - Add 2 internal hints and reference to external hint in Room 10
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [x] 15. Implement Room 8 - Binary Puzzle




  - Create Room8.tsx page component
  - Display binary string to player
  - Implement ASCII conversion validation
  - Store fragment "HUNT" on correct decoding
  - Add console hints using variable references
  - Add HTML comment with PIN part 2 for Room 3
  - Add footer hint for Room 4
  - Add 2 internal hints and reference to external hint in Room 4
  - _Requirements: 10.1, 10.2, 10.3, 10.4_

- [x] 16. Implement Room 9 - Network Puzzle




  - Create Room9.tsx page component
  - Implement hidden fetch request on component mount
  - Create mock API endpoint or use data URL for response
  - Display clue discoverable in network tab
  - Implement answer input and validation
  - Store fragment "FINAL" on correct answer
  - Add network response hint for Room 5
  - Add 2 internal hints and reference to external hint in Room 3
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

- [x] 16.1 Write property test for hint distribution





  - **Property 6: Puzzle room hint distribution**
  - **Validates: Requirements 15.4**

- [x] 17. Implement Room 10 - Meta Puzzle




  - Create Room10.tsx page component
  - Create riddle referencing patterns from other rooms
  - Log hint variables to console using variable references
  - Implement answer input and validation
  - Store fragment "QUEST" on correct answer
  - Add console hint for Room 7
  - Reference hint from Room 6 page element
  - Add 2 internal hints
  - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_

- [x] 17.1 Write property test for state update reactivity





  - **Property 14: State update reactivity**
  - **Validates: Requirements 2.4, 17.4**

- [x] 18. Wire up room routes in App.tsx




  - Import all room components (Room1-Room10)
  - Update /room/:id route to render appropriate room component
  - Implement route parameter handling
  - _Requirements: 18.3_

- [x] 19. Implement MasterKey page





  - Create MasterKey.tsx page component
  - Create master key input field
  - Implement validation against concatenated fragments
  - Display error message for incorrect keys
  - Navigate to Portal on correct key
  - Integrate ProgressBar at top
  - Style with dark hacker theme
  - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5_

- [x] 19.1 Write property test for master key validation





  - **Property 13: Master key validation**
  - **Validates: Requirements 13.3, 13.4**

- [x] 20. Implement Portal page




  - Create Portal.tsx page component
  - Create victory screen with "BYTEQUEST COMPLETED" message
  - Implement glowing portal animation using CSS keyframes
  - Add One Piece themed victory elements
  - Style with dark atmospheric effects and transitions
  - _Requirements: 14.1, 14.2, 14.3_

- [x] 21. Review and enhance global styling




  - Review CSS variables for color palette consistency
  - Verify terminal font stack is applied correctly
  - Ensure glitch effect animations work smoothly
  - Verify progress bar fill transitions
  - Check card hover effects with glow
  - Test terminal cursor blinking animation
  - _Requirements: 16.1, 16.2, 16.3_

- [x] 21.1 Write property test for terminal font usage





  - **Property 17: Terminal font usage**
  - **Validates: Requirements 16.2**

- [x] 22. Verify cross-room hint distribution









  - Test that Room 1 hint appears in Room 5 console
  - Test that Room 2 cipher key appears in Room 2 footer
  - Test that Room 3 PIN part 2 appears in Room 8 HTML comment
  - Test that all cross-room references are correctly implemented
  - Verify each room has exactly 2 internal + 1 external hint
  - _Requirements: 15.4_

- [x] 22.1 Write property test for hint hiding techniques


  - **Property 16: Hint hiding techniques**
  - **Validates: Requirements 15.2**

- [x] 22.2 Write property test for answer storage pattern


  - **Property 15: Answer storage pattern**
  - **Validates: Requirements 15.3**

- [x] 23. Implement fragment persistence tests





  - Test navigation between rooms maintains solved state
  - Verify progress tracker updates persist across navigation
  - Test that solved room cards maintain checkmark indicator
  - Ensure master key calculation uses all stored fragments
  - _Requirements: 17.2, 17.3_

- [x] 23.1 Write property test for fragment persistence


  - **Property 3: Fragment persistence during navigation**
  - **Validates: Requirements 17.2**

- [x] 23.2 Write property test for functional component pattern


  - **Property 18: Functional component pattern**
  - **Validates: Requirements 18.2**

- [x] 24. Final integration testing


  - Test complete user flow from home to portal
  - Verify all 10 puzzles can be solved in sequence
  - Test master key assembly with all fragments
  - Ensure all animations and transitions work smoothly
  - Verify responsive design on mobile, tablet, and desktop
  - Test DevTools hint discovery (console, inspector, network)
  - _Requirements: All_

- [x] 25. Checkpoint - Ensure all tests pass


  - Ensure all tests pass, ask the user if questions arise.

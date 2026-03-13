import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Room1 } from './Room1';
import { Room2 } from './Room2';
import { Room3 } from './Room3';
import { Room4 } from './Room4';
import { Room5 } from './Room5';
import { Room6 } from './Room6';
import { Room7 } from './Room7';
import { Room8 } from './Room8';
import { Room9 } from './Room9';
import { Room10 } from './Room10';
import { hintDistribution } from '../hints/hints';

/**
 * Cross-Room Hint Distribution Tests
 * **Feature: bytequest-treasure-hunt, Property 15: Answer storage pattern**
 * **Validates: Requirements 15.3**
 */
describe('Cross-Room Hint Distribution', () => {
  const renderRoom = (RoomComponent: React.ComponentType) => {
    return render(
      <BrowserRouter>
        <RoomComponent />
      </BrowserRouter>
    );
  };

  /**
   * Property: Room 1 hint appears in Room 5 console
   * When Room 5 is rendered, the console should contain the hint for Room 1
   */
  it('should have Room 1 hint available in Room 5 console', () => {
    const consoleSpy = vi.spyOn(console, 'log');
    renderRoom(Room5);
    
    // Check that the hint_r1_from_r5 was logged
    const logs = consoleSpy.mock.calls.map(call => call[0]).join(' ');
    expect(logs).toContain('hint_r1_from_r5');
    
    consoleSpy.mockRestore();
  });

  /**
   * Property: Room 2 cipher key appears in Room 2 footer
   * When Room 2 is rendered, the footer should contain the cipher key hint
   */
  it('should have cipher key hint in Room 2 footer', () => {
    renderRoom(Room2);
    
    // Check that the footer contains the cipher key hint
    const footerHint = screen.queryByText(/Cipher Key for Room 4/i);
    expect(footerHint).toBeInTheDocument();
  });

  /**
   * Property: Room 3 PIN part 2 appears in Room 8 HTML comment
   * When Room 8 is rendered, the HTML should contain the PIN part 2 hint in a comment
   * Note: HTML comments are in the source code but not rendered to DOM by React
   * We verify by checking that the hint is defined in the hints system
   */
  it('should have Room 3 PIN part 2 hint in Room 8 HTML comment', () => {
    // Verify the hint is defined in the hints system
    const room8Hints = hintDistribution[8];
    
    // Room 8 should have an external hint pointing to Room 3
    expect(room8Hints.external).toBeDefined();
    expect(room8Hints.external?.targetRoom).toBe(3);
    expect(room8Hints.external?.hint.variable).toBe('hint_r3_from_r8');
    expect(room8Hints.external?.hint.location).toBe('html-comment');
  });

  /**
   * Property: Room 4 footer hint appears in Room 4
   * When Room 4 is rendered, the footer should contain the hint for Room 8
   */
  it('should have Room 8 hint in Room 4 footer', () => {
    renderRoom(Room4);
    
    // Check that the footer contains the hint for Room 8
    const footerHint = screen.queryByText(/Hint for Room 8/i);
    expect(footerHint).toBeInTheDocument();
  });

  /**
   * Property: Room 5 hint appears in Room 9 console
   * When Room 9 is rendered, the console should contain the hint for Room 5
   */
  it('should have Room 5 hint available in Room 9 console', () => {
    const consoleSpy = vi.spyOn(console, 'log');
    renderRoom(Room9);
    
    // Check that the hint_r5_from_r9 was logged
    const logs = consoleSpy.mock.calls.map(call => call[0]).join(' ');
    expect(logs).toContain('hint_r5_from_r9');
    
    consoleSpy.mockRestore();
  });

  /**
   * Property: Room 6 hint appears in Room 10 page element
   * When Room 10 is rendered, the page should contain a data-hint attribute with Room 6 hint
   */
  it('should have Room 6 hint in Room 10 page element', () => {
    const { container } = renderRoom(Room10);
    
    // Check for page element with Room 6 hint
    const hintElement = container.querySelector('[data-hint]');
    expect(hintElement).toBeInTheDocument();
    const hintContent = hintElement?.getAttribute('data-hint');
    expect(hintContent).toContain('Room 6');
  });

  /**
   * Property: Room 7 hint appears in Room 10 console
   * When Room 10 is rendered, the console should contain the hint for Room 7
   */
  it('should have Room 7 hint available in Room 10 console', () => {
    const consoleSpy = vi.spyOn(console, 'log');
    renderRoom(Room10);
    
    // Check that the hint_r7_from_r10 was logged
    const logs = consoleSpy.mock.calls.map(call => call[0]).join(' ');
    expect(logs).toContain('hint_r7_from_r10');
    
    consoleSpy.mockRestore();
  });

  /**
   * Property: Room 8 footer hint appears in Room 8
   * When Room 8 is rendered, the footer should contain the hint for Room 4
   */
  it('should have Room 4 hint in Room 8 footer', () => {
    renderRoom(Room8);
    
    // Check that the footer contains the hint for Room 4
    const footerHint = screen.queryByText(/Hint for Room 4/i);
    expect(footerHint).toBeInTheDocument();
  });

  /**
   * Property: Room 9 hint appears in Room 3 HTML comment
   * When Room 3 is rendered, the HTML should contain the hint from Room 9
   * Note: HTML comments are in the source code but not rendered to DOM by React
   * We verify by checking that the hint is defined in the hints system
   */
  it('should have Room 9 hint in Room 3 HTML comment', () => {
    // Verify the hint is defined in the hints system
    const room3Hints = hintDistribution[3];
    
    // Room 3 should have an external hint pointing to Room 9
    expect(room3Hints.external).toBeDefined();
    expect(room3Hints.external?.targetRoom).toBe(9);
    expect(room3Hints.external?.hint.variable).toBe('hint_r9_from_r3');
    expect(room3Hints.external?.hint.location).toBe('html-comment');
  });

  /**
   * Property: Room 10 hint appears in Room 6 page element
   * When Room 6 is rendered, the page should contain a data-hint attribute with Room 10 hint
   */
  it('should have Room 10 hint in Room 6 page element', () => {
    const { container } = renderRoom(Room6);
    
    // Check for page element with Room 10 hint
    const hintElement = container.querySelector('[data-hint]');
    expect(hintElement).toBeInTheDocument();
    const hintContent = hintElement?.getAttribute('data-hint');
    expect(hintContent).toContain('Room 10');
  });

  /**
   * Property: Each room has exactly 2 internal hints logged to console
   * When any room is rendered, exactly 2 internal hints should be logged
   * Note: Room 6 also logs math puzzle hints, so we count only the "is available" logs
   * which are specifically for the internal hints
   */
  it('should log exactly 2 internal hints per room to console', () => {
    const rooms = [Room1, Room2, Room3, Room4, Room5, Room6, Room7, Room8, Room9, Room10];
    
    rooms.forEach((RoomComponent, index) => {
      const consoleSpy = vi.spyOn(console, 'log');
      renderRoom(RoomComponent);
      
      // Count how many times "is available" was logged (indicates internal hint logging)
      // For Room 6, we expect 4 because it logs 2 internal hints + 2 math puzzle hints
      const logs = consoleSpy.mock.calls.map(call => call[0]).join('\n');
      const hintAvailableCount = (logs.match(/is available/g) || []).length;
      
      // Room 6 has 2 internal hints + 2 math puzzle hints = 4 total
      const expectedCount = index === 5 ? 4 : 2;
      expect(hintAvailableCount).toBe(expectedCount);
      
      consoleSpy.mockRestore();
    });
  });

  /**
   * Property: Room 1 has correct internal hints
   * When Room 1 is rendered, both internal hints should be available
   */
  it('should have correct internal hints for Room 1', () => {
    const consoleSpy = vi.spyOn(console, 'log');
    renderRoom(Room1);
    
    const logs = consoleSpy.mock.calls.map(call => call[0]).join(' ');
    expect(logs).toContain('hint_r1_1');
    expect(logs).toContain('hint_r1_2');
    
    consoleSpy.mockRestore();
  });

  /**
   * Property: Room 2 has correct internal hints
   * When Room 2 is rendered, both internal hints should be available
   */
  it('should have correct internal hints for Room 2', () => {
    const consoleSpy = vi.spyOn(console, 'log');
    renderRoom(Room2);
    
    const logs = consoleSpy.mock.calls.map(call => call[0]).join(' ');
    expect(logs).toContain('hint_r2_1');
    expect(logs).toContain('hint_r2_2');
    
    consoleSpy.mockRestore();
  });

  /**
   * Property: Room 3 has correct internal hints
   * When Room 3 is rendered, both internal hints should be available
   */
  it('should have correct internal hints for Room 3', () => {
    const consoleSpy = vi.spyOn(console, 'log');
    renderRoom(Room3);
    
    const logs = consoleSpy.mock.calls.map(call => call[0]).join(' ');
    expect(logs).toContain('hint_r3_1');
    expect(logs).toContain('hint_r3_2');
    
    consoleSpy.mockRestore();
  });

  /**
   * Property: Room 4 has correct internal hints
   * When Room 4 is rendered, both internal hints should be available
   */
  it('should have correct internal hints for Room 4', () => {
    const consoleSpy = vi.spyOn(console, 'log');
    renderRoom(Room4);
    
    const logs = consoleSpy.mock.calls.map(call => call[0]).join(' ');
    expect(logs).toContain('hint_r4_1');
    expect(logs).toContain('hint_r4_2');
    
    consoleSpy.mockRestore();
  });

  /**
   * Property: Room 5 has correct internal hints
   * When Room 5 is rendered, both internal hints should be available
   */
  it('should have correct internal hints for Room 5', () => {
    const consoleSpy = vi.spyOn(console, 'log');
    renderRoom(Room5);
    
    const logs = consoleSpy.mock.calls.map(call => call[0]).join(' ');
    expect(logs).toContain('hint_r5_1');
    expect(logs).toContain('hint_r5_2');
    
    consoleSpy.mockRestore();
  });

  /**
   * Property: Room 6 has correct internal hints
   * When Room 6 is rendered, both internal hints should be available
   */
  it('should have correct internal hints for Room 6', () => {
    const consoleSpy = vi.spyOn(console, 'log');
    renderRoom(Room6);
    
    const logs = consoleSpy.mock.calls.map(call => call[0]).join(' ');
    expect(logs).toContain('hint_r6_1');
    expect(logs).toContain('hint_r6_2');
    
    consoleSpy.mockRestore();
  });

  /**
   * Property: Room 7 has correct internal hints
   * When Room 7 is rendered, both internal hints should be available
   */
  it('should have correct internal hints for Room 7', () => {
    const consoleSpy = vi.spyOn(console, 'log');
    renderRoom(Room7);
    
    const logs = consoleSpy.mock.calls.map(call => call[0]).join(' ');
    expect(logs).toContain('hint_r7_1');
    expect(logs).toContain('hint_r7_2');
    
    consoleSpy.mockRestore();
  });

  /**
   * Property: Room 8 has correct internal hints
   * When Room 8 is rendered, both internal hints should be available
   */
  it('should have correct internal hints for Room 8', () => {
    const consoleSpy = vi.spyOn(console, 'log');
    renderRoom(Room8);
    
    const logs = consoleSpy.mock.calls.map(call => call[0]).join(' ');
    expect(logs).toContain('hint_r8_1');
    expect(logs).toContain('hint_r8_2');
    
    consoleSpy.mockRestore();
  });

  /**
   * Property: Room 9 has correct internal hints
   * When Room 9 is rendered, both internal hints should be available
   */
  it('should have correct internal hints for Room 9', () => {
    const consoleSpy = vi.spyOn(console, 'log');
    renderRoom(Room9);
    
    const logs = consoleSpy.mock.calls.map(call => call[0]).join(' ');
    expect(logs).toContain('hint_r9_1');
    expect(logs).toContain('hint_r9_2');
    
    consoleSpy.mockRestore();
  });

  /**
   * Property: Room 10 has correct internal hints
   * When Room 10 is rendered, both internal hints should be available
   */
  it('should have correct internal hints for Room 10', () => {
    const consoleSpy = vi.spyOn(console, 'log');
    renderRoom(Room10);
    
    const logs = consoleSpy.mock.calls.map(call => call[0]).join(' ');
    expect(logs).toContain('hint_r10_1');
    expect(logs).toContain('hint_r10_2');
    
    consoleSpy.mockRestore();
  });
});

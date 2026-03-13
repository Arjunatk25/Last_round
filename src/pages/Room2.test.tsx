/**
 * Room 2 - Programming Puzzle Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Room2 } from './Room2';
import { resetFragments } from '../utils/puzzleState';

describe('Room2 - Programming Puzzle', () => {
  beforeEach(() => {
    resetFragments();
    localStorage.clear();
  });

  it('renders the programming puzzle with code snippet and options', () => {
    render(
      <BrowserRouter>
        <Room2 />
      </BrowserRouter>
    );

    // Check for room title
    expect(screen.getByText(/ROOM 2 - CODE ANALYSIS/i)).toBeDefined();

    // Check for code snippet
    expect(screen.getByText(/function mystery/i)).toBeDefined();

    // Check for options
    expect(screen.getByText(/A\) 36/i)).toBeDefined();
    expect(screen.getByText(/B\) 42/i)).toBeDefined();
    expect(screen.getByText(/C\) 8/i)).toBeDefined();
    expect(screen.getByText(/D\) 64/i)).toBeDefined();

    // Check for cipher key hint in footer
    expect(screen.getByText(/Cipher Key for Room 4: SHIFT3/i)).toBeDefined();
  });

  it('validates correct answer and stores fragment', () => {
    render(
      <BrowserRouter>
        <Room2 />
      </BrowserRouter>
    );

    // Select the correct answer (42)
    const correctOption = screen.getByLabelText(/B\) 42/i);
    fireEvent.click(correctOption);

    // Submit the form
    const submitButton = screen.getByText(/SUBMIT ANSWER/i);
    fireEvent.click(submitButton);

    // Check for success message
    expect(screen.getByText(/ANALYSIS COMPLETE/i)).toBeDefined();
    expect(screen.getByText(/Fragment acquired: PIECE/i)).toBeDefined();
  });

  it('shows error message for incorrect answer', () => {
    render(
      <BrowserRouter>
        <Room2 />
      </BrowserRouter>
    );

    // Select an incorrect answer
    const incorrectOption = screen.getByLabelText(/A\) 36/i);
    fireEvent.click(incorrectOption);

    // Submit the form
    const submitButton = screen.getByText(/SUBMIT ANSWER/i);
    fireEvent.click(submitButton);

    // Check for error message
    expect(screen.getByText(/INCORRECT OUTPUT/i)).toBeDefined();
  });
});

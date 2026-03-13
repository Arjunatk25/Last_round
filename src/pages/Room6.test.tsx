import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Room6 } from './Room6';
import { resetFragments, setFragment } from '../utils/puzzleState';

describe('Room 6 - Console Puzzle', () => {
  beforeEach(() => {
    resetFragments();
    vi.clearAllMocks();
  });

  it('renders the console puzzle page', () => {
    render(
      <BrowserRouter>
        <Room6 />
      </BrowserRouter>
    );

    expect(screen.getByText('ROOM 6 - CONSOLE PUZZLE')).toBeInTheDocument();
    expect(screen.getByText('Open the developer console to find the puzzle hints')).toBeInTheDocument();
  });

  it('logs console hints on mount', () => {
    const consoleSpy = vi.spyOn(console, 'log');

    render(
      <BrowserRouter>
        <Room6 />
      </BrowserRouter>
    );

    expect(consoleSpy).toHaveBeenCalledWith('hint_r6_1 is available');
    expect(consoleSpy).toHaveBeenCalledWith('hint_r6_2 is available');
    expect(consoleSpy).toHaveBeenCalledWith('mathPuzzle_hint1 is available');
    expect(consoleSpy).toHaveBeenCalledWith('mathPuzzle_hint2 is available');

    consoleSpy.mockRestore();
  });

  it('validates correct answer and stores fragment', async () => {
    render(
      <BrowserRouter>
        <Room6 />
      </BrowserRouter>
    );

    const input = screen.getByPlaceholderText('Type your answer...');
    const submitButton = screen.getByText('SUBMIT ANSWER');

    fireEvent.change(input, { target: { value: '1024' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('PUZZLE SOLVED')).toBeInTheDocument();
      expect(screen.getByText('Fragment acquired: WORLD')).toBeInTheDocument();
    });
  });

  it('shows error message for incorrect answer', async () => {
    render(
      <BrowserRouter>
        <Room6 />
      </BrowserRouter>
    );

    const input = screen.getByPlaceholderText('Type your answer...');
    const submitButton = screen.getByText('SUBMIT ANSWER');

    fireEvent.change(input, { target: { value: 'wrong' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('INCORRECT ANSWER')).toBeInTheDocument();
    });
  });

  it('shows solved state if room is already solved', () => {
    setFragment(6, 'WORLD');

    render(
      <BrowserRouter>
        <Room6 />
      </BrowserRouter>
    );

    expect(screen.getByText('PUZZLE SOLVED')).toBeInTheDocument();
    expect(screen.getByText('Fragment acquired: WORLD')).toBeInTheDocument();
  });
});

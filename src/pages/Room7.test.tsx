/**
 * Room 7 - Image Puzzle Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Room7 } from './Room7';
import { resetFragments, getFragment } from '../utils/puzzleState';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Room 7 - Image Puzzle', () => {
  beforeEach(() => {
    resetFragments();
    mockNavigate.mockClear();
    localStorage.clear();
  });

  it('renders the image puzzle page', () => {
    render(
      <BrowserRouter>
        <Room7 />
      </BrowserRouter>
    );

    expect(screen.getByText('ROOM 7 - IMAGE ANALYSIS')).toBeInTheDocument();
    expect(screen.getByText('Analyze the image and find the hidden answer:')).toBeInTheDocument();
  });

  it('displays the puzzle image with alt text', () => {
    render(
      <BrowserRouter>
        <Room7 />
      </BrowserRouter>
    );

    const image = screen.getByAltText(/Geometric shapes with hidden clue/);
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('data-hint-1', 'Circle represents Earth');
    expect(image).toHaveAttribute('data-hint-2', 'Rectangle represents boundaries');
    expect(image).toHaveAttribute('data-hint-3', 'Triangle points to direction');
    expect(image).toHaveAttribute('data-clue', 'All shapes help you find your way');
  });

  it('validates correct answer and stores fragment', async () => {
    render(
      <BrowserRouter>
        <Room7 />
      </BrowserRouter>
    );

    const input = screen.getByPlaceholderText('Enter your answer...');
    const submitButton = screen.getByText('SUBMIT ANSWER');

    fireEvent.change(input, { target: { value: 'map' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(getFragment(7)).toBe('TREASURE');
    });
  });

  it('shows error message for incorrect answer', async () => {
    render(
      <BrowserRouter>
        <Room7 />
      </BrowserRouter>
    );

    const input = screen.getByPlaceholderText('Enter your answer...');
    const submitButton = screen.getByText('SUBMIT ANSWER');

    fireEvent.change(input, { target: { value: 'wrong' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('INCORRECT ANALYSIS')).toBeInTheDocument();
    });
  });

  it('shows solved state if room is already solved', () => {
    // Pre-solve the room
    localStorage.setItem('bytequest_fragments', JSON.stringify({
      r1: '', r2: '', r3: '', r4: '', r5: '', r6: '', r7: 'TREASURE', r8: '', r9: '', r10: ''
    }));

    render(
      <BrowserRouter>
        <Room7 />
      </BrowserRouter>
    );

    expect(screen.getByText('ANALYSIS COMPLETE')).toBeInTheDocument();
    expect(screen.getByText('Fragment acquired: TREASURE')).toBeInTheDocument();
  });

  it('logs console hints on mount', () => {
    const consoleSpy = vi.spyOn(console, 'log');

    render(
      <BrowserRouter>
        <Room7 />
      </BrowserRouter>
    );

    expect(consoleSpy).toHaveBeenCalledWith('hint_r7_1 is available');
    expect(consoleSpy).toHaveBeenCalledWith('hint_r7_2 is available');

    consoleSpy.mockRestore();
  });

  it('displays back button and navigates on click', () => {
    render(
      <BrowserRouter>
        <Room7 />
      </BrowserRouter>
    );

    const backButton = screen.getByText('← BACK');
    fireEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('clears input after incorrect answer', async () => {
    render(
      <BrowserRouter>
        <Room7 />
      </BrowserRouter>
    );

    const input = screen.getByPlaceholderText('Enter your answer...') as HTMLInputElement;
    const submitButton = screen.getByText('SUBMIT ANSWER');

    fireEvent.change(input, { target: { value: 'wrong' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(input.value).toBe('');
    });
  });

  it('disables submit button when input is empty', () => {
    render(
      <BrowserRouter>
        <Room7 />
      </BrowserRouter>
    );

    const submitButton = screen.getByText('SUBMIT ANSWER') as HTMLButtonElement;
    expect(submitButton).toBeDisabled();
  });

  it('enables submit button when input has text', () => {
    render(
      <BrowserRouter>
        <Room7 />
      </BrowserRouter>
    );

    const input = screen.getByPlaceholderText('Enter your answer...');
    const submitButton = screen.getByText('SUBMIT ANSWER') as HTMLButtonElement;

    fireEvent.change(input, { target: { value: 'map' } });
    expect(submitButton).not.toBeDisabled();
  });
});

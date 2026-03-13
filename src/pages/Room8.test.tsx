/**
 * Room 8 - Binary Puzzle Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Room8 } from './Room8';
import { resetFragments } from '../utils/puzzleState';

describe('Room8 - Binary Puzzle', () => {
  beforeEach(() => {
    resetFragments();
  });

  it('renders the binary puzzle with binary string', () => {
    render(
      <BrowserRouter>
        <Room8 />
      </BrowserRouter>
    );

    expect(screen.getByText(/ROOM 8 - BINARY CONVERSION/i)).toBeInTheDocument();
    expect(screen.getByText(/Convert the binary string to ASCII text/i)).toBeInTheDocument();
    expect(screen.getByText(/01001000 01100101 01101100 01101100 01101111/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter ASCII text/i)).toBeInTheDocument();
  });

  it('validates correct answer and stores fragment', async () => {
    render(
      <BrowserRouter>
        <Room8 />
      </BrowserRouter>
    );

    const input = screen.getByPlaceholderText(/Enter ASCII text/i);
    const submitButton = screen.getByRole('button', { name: /CONVERT/i });

    fireEvent.change(input, { target: { value: 'HELLO' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/CONVERSION SUCCESSFUL/i)).toBeInTheDocument();
      expect(screen.getByText(/Fragment acquired: HUNT/i)).toBeInTheDocument();
    });
  });

  it('shows error message for incorrect answer', async () => {
    render(
      <BrowserRouter>
        <Room8 />
      </BrowserRouter>
    );

    const input = screen.getByPlaceholderText(/Enter ASCII text/i);
    const submitButton = screen.getByRole('button', { name: /CONVERT/i });

    fireEvent.change(input, { target: { value: 'WRONG' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/CONVERSION FAILED/i)).toBeInTheDocument();
    });
  });

  it('displays footer hint for Room 4', () => {
    render(
      <BrowserRouter>
        <Room8 />
      </BrowserRouter>
    );

    expect(screen.getByText(/Hint for Room 4: Each binary octet converts to one ASCII character/i)).toBeInTheDocument();
  });

  it('logs console hints on mount', () => {
    const consoleSpy = vi.spyOn(console, 'log');
    
    render(
      <BrowserRouter>
        <Room8 />
      </BrowserRouter>
    );

    expect(consoleSpy).toHaveBeenCalledWith('hint_r8_1 is available');
    expect(consoleSpy).toHaveBeenCalledWith('hint_r8_2 is available');
    
    consoleSpy.mockRestore();
  });
});

/**
 * Room 4 - Cipher Puzzle Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Room4 } from './Room4';
import { resetFragments } from '../utils/puzzleState';

describe('Room4 - Cipher Puzzle', () => {
  beforeEach(() => {
    resetFragments();
  });

  it('renders the cipher puzzle with encrypted text', () => {
    render(
      <BrowserRouter>
        <Room4 />
      </BrowserRouter>
    );

    expect(screen.getByText(/ROOM 4 - CIPHER DECRYPTION/i)).toBeInTheDocument();
    expect(screen.getByText(/Decrypt the following encrypted message/i)).toBeInTheDocument();
    expect(screen.getByText(/WUHDVXUH/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter decrypted text/i)).toBeInTheDocument();
  });

  it('validates correct answer and stores fragment', async () => {
    render(
      <BrowserRouter>
        <Room4 />
      </BrowserRouter>
    );

    const input = screen.getByPlaceholderText(/Enter decrypted text/i);
    const submitButton = screen.getByRole('button', { name: /DECRYPT/i });

    fireEvent.change(input, { target: { value: 'TREASURE' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/DECRYPTION SUCCESSFUL/i)).toBeInTheDocument();
      expect(screen.getByText(/Fragment acquired: LINE/i)).toBeInTheDocument();
    });
  });

  it('shows error message for incorrect answer', async () => {
    render(
      <BrowserRouter>
        <Room4 />
      </BrowserRouter>
    );

    const input = screen.getByPlaceholderText(/Enter decrypted text/i);
    const submitButton = screen.getByRole('button', { name: /DECRYPT/i });

    fireEvent.change(input, { target: { value: 'WRONG' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/DECRYPTION FAILED/i)).toBeInTheDocument();
    });
  });

  it('displays footer hint for Room 8', () => {
    render(
      <BrowserRouter>
        <Room4 />
      </BrowserRouter>
    );

    expect(screen.getByText(/Hint for Room 8: Binary strings can be converted to ASCII/i)).toBeInTheDocument();
  });

  it('logs console hints on mount', () => {
    const consoleSpy = vi.spyOn(console, 'log');
    
    render(
      <BrowserRouter>
        <Room4 />
      </BrowserRouter>
    );

    expect(consoleSpy).toHaveBeenCalledWith('hint_r4_1 is available');
    expect(consoleSpy).toHaveBeenCalledWith('hint_r4_2 is available');
    
    consoleSpy.mockRestore();
  });
});

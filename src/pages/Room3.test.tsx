/**
 * Room 3 - Vault Puzzle Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Room3 } from './Room3';
import { resetFragments } from '../utils/puzzleState';

describe('Room3 - Vault Puzzle', () => {
  beforeEach(() => {
    resetFragments();
    // Clear console.log calls
    vi.clearAllMocks();
  });

  it('renders the vault puzzle with keypad and PIN display', () => {
    render(
      <BrowserRouter>
        <Room3 />
      </BrowserRouter>
    );

    expect(screen.getByText(/ROOM 3 - VAULT ACCESS/i)).toBeInTheDocument();
    expect(screen.getByText(/Enter the 8-digit PIN to unlock the vault/i)).toBeInTheDocument();
    expect(screen.getByText(/First 4 digits = 1337/i)).toBeInTheDocument();
    
    // Check keypad buttons exist
    for (let i = 0; i <= 9; i++) {
      expect(screen.getByRole('button', { name: i.toString() })).toBeInTheDocument();
    }
    
    expect(screen.getByRole('button', { name: /CLEAR/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /UNLOCK/i })).toBeInTheDocument();
  });

  it('validates correct PIN and stores fragment', async () => {
    render(
      <BrowserRouter>
        <Room3 />
      </BrowserRouter>
    );

    // Enter the correct PIN: 13374242
    const digits = ['1', '3', '3', '7', '4', '2', '4', '2'];
    digits.forEach(digit => {
      fireEvent.click(screen.getByRole('button', { name: digit }));
    });

    // Submit the PIN
    const unlockButton = screen.getByRole('button', { name: /UNLOCK/i });
    fireEvent.click(unlockButton);

    // Check for success message
    expect(await screen.findByText(/VAULT UNLOCKED/i)).toBeInTheDocument();
    expect(screen.getByText(/Fragment acquired: GRAND/i)).toBeInTheDocument();
  });

  it('shows error message for incorrect PIN', () => {
    render(
      <BrowserRouter>
        <Room3 />
      </BrowserRouter>
    );

    // Enter an incorrect PIN
    const digits = ['1', '2', '3', '4', '5', '6', '7', '8'];
    digits.forEach(digit => {
      fireEvent.click(screen.getByRole('button', { name: digit }));
    });

    // Submit the PIN
    const unlockButton = screen.getByRole('button', { name: /UNLOCK/i });
    fireEvent.click(unlockButton);

    // Check for error message
    expect(screen.getByText(/INVALID PIN/i)).toBeInTheDocument();
  });

  it('clears PIN when clear button is clicked', () => {
    render(
      <BrowserRouter>
        <Room3 />
      </BrowserRouter>
    );

    // Enter some digits
    fireEvent.click(screen.getByRole('button', { name: '1' }));
    fireEvent.click(screen.getByRole('button', { name: '2' }));
    fireEvent.click(screen.getByRole('button', { name: '3' }));

    // Click clear
    const clearButton = screen.getByRole('button', { name: /CLEAR/i });
    fireEvent.click(clearButton);

    // Unlock button should be disabled (no PIN entered)
    const unlockButton = screen.getByRole('button', { name: /UNLOCK/i });
    expect(unlockButton).toBeDisabled();
  });
});

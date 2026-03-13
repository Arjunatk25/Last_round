/**
 * Room 5 - Fake Offline Puzzle Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Room5 } from './Room5';
import * as puzzleState from '../utils/puzzleState';

// Mock the navigation
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Room5 - Fake Offline Puzzle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renders the fake offline page', () => {
    render(
      <BrowserRouter>
        <Room5 />
      </BrowserRouter>
    );

    expect(screen.getByText('No Internet Connection')).toBeInTheDocument();
    expect(screen.getByText(/Unable to connect to the network/)).toBeInTheDocument();
    expect(screen.getByText(/Error Code: ERR_INTERNET_DISCONNECTED/)).toBeInTheDocument();
  });

  it('reveals gate and stores fragment when hidden area is clicked', async () => {
    const setFragmentSpy = vi.spyOn(puzzleState, 'setFragment');
    
    render(
      <BrowserRouter>
        <Room5 />
      </BrowserRouter>
    );

    // Find and click the hidden area
    const hiddenArea = screen.getByLabelText('Hidden secret area');
    fireEvent.click(hiddenArea);

    // Check that fragment was stored
    expect(setFragmentSpy).toHaveBeenCalledWith(5, 'NEW');

    // Check that success message appears
    await waitFor(() => {
      expect(screen.getByText('SECRET GATE UNLOCKED')).toBeInTheDocument();
      expect(screen.getByText('Fragment acquired: NEW')).toBeInTheDocument();
    });

    // Check that navigation happens after delay
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    }, { timeout: 3000 });
  });

  it('logs console hints on mount', () => {
    const consoleSpy = vi.spyOn(console, 'log');
    
    render(
      <BrowserRouter>
        <Room5 />
      </BrowserRouter>
    );

    // Check that hints are logged
    expect(consoleSpy).toHaveBeenCalledWith('hint_r5_1 is available');
    expect(consoleSpy).toHaveBeenCalledWith('hint_r5_2 is available');
    expect(consoleSpy).toHaveBeenCalledWith('hint_r1_from_r5: ls');
  });

  it('shows solved state if room is already solved', () => {
    vi.spyOn(puzzleState, 'isRoomSolved').mockReturnValue(true);
    
    render(
      <BrowserRouter>
        <Room5 />
      </BrowserRouter>
    );

    // Should show success message immediately
    expect(screen.getByText('SECRET GATE UNLOCKED')).toBeInTheDocument();
    expect(screen.getByText('Fragment acquired: NEW')).toBeInTheDocument();
  });
});

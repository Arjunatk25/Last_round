/**
 * Room 5 - Fake Offline Puzzle
 * Player must discover and click the hidden area to reveal the secret gate
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setFragment, isRoomSolved } from '../utils/puzzleState';
import { logHintsToConsole, getExternalHint } from '../hints/hints';
import './Room5.css';

export const Room5 = () => {
  const navigate = useNavigate();
  const [gateRevealed, setGateRevealed] = useState(false);
  const [solved, setSolved] = useState(false);

  // Console hint for Room 1 command
  const hint_r1_from_r5 = 'ls';

  useEffect(() => {
    // Check if already solved
    setSolved(isRoomSolved(5));

    // Log internal hints to console
    logHintsToConsole(5);

    // Log external hint reference (from Room 9)
    const externalHint = getExternalHint(5);
    if (externalHint) {
      console.log(`Hint: ${externalHint.hint.content}`);
    }

    // Log the Room 1 command hint to console
    console.log(`hint_r1_from_r5: ${hint_r1_from_r5}`);
  }, []);

  const handleHiddenClick = () => {
    if (!solved) {
      // Reveal the secret gate
      setGateRevealed(true);
      
      // Store fragment "NEW"
      setFragment(5, 'NEW');
      setSolved(true);
      
      // Navigate back to home after a delay
      setTimeout(() => {
        navigate('/');
      }, 2500);
    }
  };

  if (solved && gateRevealed) {
    return (
      <div className="room5-page">
        <div className="offline-container gate-revealed">
          <div className="gate-animation">
            <div className="gate-glow"></div>
            <div className="gate-content">
              <p className="success-message">SECRET GATE UNLOCKED</p>
              <p className="fragment-message">Fragment acquired: NEW</p>
              <p className="return-message">Returning to main hub...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (solved && !gateRevealed) {
    // Already solved, show success immediately
    setGateRevealed(true);
  }

  return (
    <div className="room5-page">
      <div className="offline-container">
        <div className="offline-icon">
          <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <line x1="1" y1="1" x2="23" y2="23" strokeWidth="2" strokeLinecap="round"/>
            <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" strokeWidth="2" strokeLinecap="round"/>
            <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" strokeWidth="2" strokeLinecap="round"/>
            <path d="M10.71 5.05A16 16 0 0 1 22.58 9" strokeWidth="2" strokeLinecap="round"/>
            <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" strokeWidth="2" strokeLinecap="round"/>
            <path d="M8.53 16.11a6 6 0 0 1 6.95 0" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="12" cy="20" r="1" fill="currentColor"/>
          </svg>
        </div>
        <h1 className="offline-title">No Internet Connection</h1>
        <p className="offline-message">
          Unable to connect to the network. Please check your connection and try again.
        </p>
        <p className="offline-code">Error Code: ERR_INTERNET_DISCONNECTED</p>
        
        {/* Hidden clickable area - invisible div */}
        <div 
          className="hidden-clickable-area"
          onClick={handleHiddenClick}
          aria-label="Hidden secret area"
        ></div>
        
        <button className="back-button-offline" onClick={() => navigate('/')}>
          ← BACK TO HOME
        </button>
      </div>
    </div>
  );
};

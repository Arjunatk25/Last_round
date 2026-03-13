/**
 * Room 3 - Vault Puzzle
 * Player must enter the correct PIN to unlock the vault
 * PIN is split into two parts: first half displayed, second half hidden in Room 8
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setFragment, isRoomSolved } from '../utils/puzzleState';
import { logHintsToConsole, getExternalHint } from '../hints/hints';
import './Room3.css';

export const Room3 = () => {
  const navigate = useNavigate();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [solved, setSolved] = useState(false);

  // The correct PIN stored as a variable (two-part combination)
  const pinPart1 = '1337'; // Displayed to player
  const pinPart2 = '4242'; // Hidden in Room 8 HTML comment
  const correctPin = pinPart1 + pinPart2; // Full PIN: 13374242

  useEffect(() => {
    // Check if already solved
    setSolved(isRoomSolved(3));

    // Log internal hints to console
    logHintsToConsole(3);

    // Log external hint reference (from Room 8)
    const externalHint = getExternalHint(3);
    if (externalHint) {
      console.log(`Hint: ${externalHint.hint.content}`);
    }
  }, []);

  const handleNumberClick = (num: string) => {
    if (pin.length < 8) {
      setPin(pin + num);
      setError('');
    }
  };

  const handleClear = () => {
    setPin('');
    setError('');
  };

  const handleSubmit = () => {
    // Validate PIN against stored variable
    if (pin === correctPin) {
      // Store fragment "GRAND"
      setFragment(3, 'GRAND');
      setSolved(true);
      setError('');
      
      // Navigate back to home after a short delay
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } else {
      // Display error message
      setError('INVALID PIN');
      setPin('');
    }
  };

  if (solved) {
    return (
      <div className="room3-page">
        <div className="vault-container">
          <div className="vault-header">
            <span className="vault-title">ROOM 3 - VAULT ACCESS</span>
          </div>
          <div className="vault-body">
            <div className="vault-output">
              <p className="success-message">VAULT UNLOCKED</p>
              <p className="fragment-message">Fragment acquired: GRAND</p>
              <p className="return-message">Returning to main hub...</p>
            </div>
          </div>
        </div>
        {/* HTML comment with hint for Room 9 */}
        {/* hint_r9_from_r3: The network request contains the answer you seek */}
      </div>
    );
  }

  return (
    <div className="room3-page">
      <div className="vault-container">
        <div className="vault-header">
          <span className="vault-title">ROOM 3 - VAULT ACCESS</span>
          <button className="back-button" onClick={() => navigate('/')}>
            ← BACK
          </button>
        </div>
        <div className="vault-body">
          <div className="vault-output">
            <p className="vault-instruction">Enter the 8-digit PIN to unlock the vault</p>
            <div className="pin-display-section">
              <p className="pin-hint">System Output: First 4 digits = {pinPart1}</p>
              <p className="pin-hint-sub">Find the remaining 4 digits...</p>
            </div>
            <div className="pin-display">
              {pin.split('').map((digit, index) => (
                <span key={index} className="pin-digit">{digit}</span>
              ))}
              {Array(8 - pin.length).fill(0).map((_, index) => (
                <span key={`empty-${index}`} className="pin-digit empty">_</span>
              ))}
            </div>
            {error && (
              <p className="error-message">{error}</p>
            )}
          </div>
          <div className="keypad">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
              <button
                key={num}
                className="keypad-button"
                onClick={() => handleNumberClick(num.toString())}
              >
                {num}
              </button>
            ))}
          </div>
          <div className="keypad-controls">
            <button className="control-button clear-button" onClick={handleClear}>
              CLEAR
            </button>
            <button 
              className="control-button submit-button" 
              onClick={handleSubmit}
              disabled={pin.length !== 8}
            >
              UNLOCK
            </button>
          </div>
        </div>
      </div>
      {/* HTML comment with hint for Room 9 */}
      {/* hint_r9_from_r3: The network request contains the answer you seek */}
    </div>
  );
};

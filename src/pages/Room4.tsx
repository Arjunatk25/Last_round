/**
 * Room 4 - Cipher Puzzle
 * Player must decrypt the encrypted text using the cipher key from Room 2
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setFragment, isRoomSolved } from '../utils/puzzleState';
import { logHintsToConsole, getExternalHint } from '../hints/hints';
import './Room4.css';
import { ScrollReveal } from '../components';

export const Room4 = () => {
  const navigate = useNavigate();
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const [solved, setSolved] = useState(false);

  // The correct decrypted answer stored as a variable
  const correctAnswer = 'TREASURE';

  // Encrypted text (Caesar cipher with shift of 3)
  // TREASURE -> WUHDVXUH
  const encryptedText = 'WUHDVXUH';

  useEffect(() => {
    // Check if already solved
    setSolved(isRoomSolved(4));

    // Log internal hints to console
    logHintsToConsole(4);

    // Log external hint reference (from Room 8)
    const externalHint = getExternalHint(4);
    if (externalHint) {
      console.log(`Hint: ${externalHint.hint.content}`);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate answer against stored variable
    if (answer.trim().toUpperCase() === correctAnswer) {
      // Store fragment "LINE"
      setFragment(4, 'LINE');
      setSolved(true);
      setError('');
      
      // Navigate back to home after a short delay
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } else {
      // Display error message
      setError('DECRYPTION FAILED');
      setAnswer('');
    }
  };

  if (solved) {
    return (
      <div className="room4-page">
        <div className="cipher-container">
          <div className="cipher-header">
            <span className="cipher-title">ROOM 4 - CIPHER DECRYPTION</span>
          </div>
          <div className="cipher-body">
            <div className="cipher-output">
              <p className="success-message">DECRYPTION SUCCESSFUL</p>
              <p className="fragment-message">Fragment acquired: LINE</p>
              <p className="return-message">Returning to main hub...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="room4-page">
      <div className="cipher-container">
        <div className="cipher-header">
          <span className="cipher-title">ROOM 4 - CIPHER DECRYPTION</span>
          <button className="back-button" onClick={() => navigate('/')}>
            ← BACK
          </button>
        </div>
        <div className="cipher-body">
          <div className="cipher-output">
            <p className="cipher-instruction">Decrypt the following encrypted message:</p>
            <div className="encrypted-display">
              <span className="encrypted-label">ENCRYPTED:</span>
              <span className="encrypted-text">{encryptedText}</span>
            </div>
            <p className="cipher-hint">Find the cipher key to decrypt this message...</p>
            {error && (
              <p className="error-message">{error}</p>
            )}
          </div>
          <form onSubmit={handleSubmit} className="answer-form">
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="cipher-input"
              placeholder="Enter decrypted text..."
              autoFocus
              autoComplete="off"
            />
            <button 
              type="submit" 
              className="submit-button"
              disabled={!answer.trim()}
            >
              DECRYPT
            </button>
          </form>
        </div>
        <ScrollReveal
  baseOpacity={0.1}
  enableBlur
  baseRotation={3}
  blurStrength={4}
>
        <div className="room-footer">
          <p className="footer-hint">Hint for Room 8: Binary strings can be converted to ASCII</p>
        </div>
        </ScrollReveal>
      </div>
    </div>
  );
};

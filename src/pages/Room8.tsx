/**
 * Room 8 - Binary Puzzle
 * Player must convert binary string to ASCII text to unlock the fragment
 * Contains PIN part 2 for Room 3 in HTML comment
 * Contains hint for Room 4 in footer
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setFragment, isRoomSolved } from '../utils/puzzleState';
import { logHintsToConsole, getExternalHint } from '../hints/hints';
import './Room8.css';

export const Room8 = () => {
  const navigate = useNavigate();
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const [solved, setSolved] = useState(false);

  // The correct answer stored as a variable
  // Binary: 01001000 01100101 01101100 01101100 01101111
  // ASCII: H e l l o
  const correctAnswer = 'HELLO';

  // Binary string to display to player
  const binaryString = '01001000 01100101 01101100 01101100 01101111';

  useEffect(() => {
    // Check if already solved
    setSolved(isRoomSolved(8));

    // Log internal hints to console
    logHintsToConsole(8);

    // Log external hint reference (from Room 4)
    const externalHint = getExternalHint(8);
    if (externalHint) {
      console.log(`Hint: ${externalHint.hint.content}`);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate answer against stored variable
    if (answer.trim().toUpperCase() === correctAnswer) {
      // Store fragment "HUNT"
      setFragment(8, 'HUNT');
      setSolved(true);
      setError('');
      
      // Navigate back to home after a short delay
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } else {
      // Display error message
      setError('CONVERSION FAILED');
      setAnswer('');
    }
  };

  if (solved) {
    return (
      <div className="room8-page">
        <div className="binary-container">
          <div className="binary-header">
            <span className="binary-title">ROOM 8 - BINARY CONVERSION</span>
          </div>
          <div className="binary-body">
            <div className="binary-output">
              <p className="success-message">CONVERSION SUCCESSFUL</p>
              <p className="fragment-message">Fragment acquired: HUNT</p>
              <p className="return-message">Returning to main hub...</p>
            </div>
          </div>
        </div>
        {/* HTML comment with PIN part 2 for Room 3 */}
        {/* hint_r3_from_r8: PIN part 2 is 4242 */}
      </div>
    );
  }

  return (
    <div className="room8-page">
      <div className="binary-container">
        <div className="binary-header">
          <span className="binary-title">ROOM 8 - BINARY CONVERSION</span>
          <button className="back-button" onClick={() => navigate('/')}>
            ← BACK
          </button>
        </div>
        <div className="binary-body">
          <div className="binary-output">
            <p className="binary-instruction">Convert the binary string to ASCII text:</p>
            <div className="binary-display">
              <span className="binary-label">BINARY:</span>
              <span className="binary-text">{binaryString}</span>
            </div>
            <p className="binary-hint">Each 8-bit sequence represents one character</p>
            {error && (
              <p className="error-message">{error}</p>
            )}
          </div>
          <form onSubmit={handleSubmit} className="answer-form">
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="binary-input"
              placeholder="Enter ASCII text..."
              autoFocus
              autoComplete="off"
            />
            <button 
              type="submit" 
              className="submit-button"
              disabled={!answer.trim()}
            >
              CONVERT
            </button>
          </form>
        </div>
        <div className="room-footer">
          <p className="footer-hint">Hint for Room 4: Each binary octet converts to one ASCII character</p>
        </div>
      </div>
      {/* HTML comment with PIN part 2 for Room 3 */}
      {/* hint_r3_from_r8: PIN part 2 is 4242 */}
    </div>
  );
};

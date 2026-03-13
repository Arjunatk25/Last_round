/**
 * Room 6 - Console Puzzle
 * Player must solve a math puzzle by examining console hints
 * The page appears minimal/empty, but hints are logged to console
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setFragment, isRoomSolved } from '../utils/puzzleState';
import { logHintsToConsole, getExternalHint } from '../hints/hints';
import './Room6.css';

export const Room6 = () => {
  const navigate = useNavigate();
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const [solved, setSolved] = useState(false);

  // The correct answer stored as a variable
  // Math puzzle: 2^10 = 1024
  const correctAnswer = '1024';

  useEffect(() => {
    // Check if already solved
    setSolved(isRoomSolved(6));

    // Log internal hints to console
    logHintsToConsole(6);

    // Log math puzzle hint variables to console
    const mathHint1 = 'What is 2 to the power of 10?';
    const mathHint2 = 'Binary: 10000000000';
    (window as any).mathPuzzle_hint1 = mathHint1;
    (window as any).mathPuzzle_hint2 = mathHint2;
    console.log('mathPuzzle_hint1 is available');
    console.log('mathPuzzle_hint2 is available');

    // Log external hint reference (from Room 10)
    const externalHint = getExternalHint(6);
    if (externalHint) {
      console.log(`Hint: ${externalHint.hint.content}`);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate answer against stored variable
    if (answer.trim() === correctAnswer) {
      // Store fragment "WORLD"
      setFragment(6, 'WORLD');
      setSolved(true);
      setError('');
      
      // Navigate back to home after a short delay
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } else {
      // Display error message
      setError('INCORRECT ANSWER');
      setAnswer('');
    }
  };

  if (solved) {
    return (
      <div className="room6-page">
        <div className="console-container">
          <div className="console-header">
            <span className="console-title">ROOM 6 - CONSOLE PUZZLE</span>
          </div>
          <div className="console-body">
            <div className="console-output">
              <p className="success-message">PUZZLE SOLVED</p>
              <p className="fragment-message">Fragment acquired: WORLD</p>
              <p className="return-message">Returning to main hub...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="room6-page">
      <div className="console-container">
        <div className="console-header">
          <span className="console-title">ROOM 6 - CONSOLE PUZZLE</span>
          <button className="back-button" onClick={() => navigate('/')}>
            ← BACK
          </button>
        </div>
        <div className="console-body">
          <div className="console-output">
            <p className="console-instruction">Open the developer console to find the puzzle hints</p>
            <p className="console-hint-text">Check the console for: hint_r6_1, hint_r6_2, mathPuzzle_hint1, mathPuzzle_hint2</p>
            {error && (
              <p className="error-message">{error}</p>
            )}
          </div>
          <form onSubmit={handleSubmit} className="answer-form">
            <div className="input-group">
              <label htmlFor="answer" className="answer-label">Enter your answer:</label>
              <input
                id="answer"
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="answer-input"
                placeholder="Type your answer..."
                autoFocus
                autoComplete="off"
              />
            </div>
            <button 
              type="submit" 
              className="submit-button"
              disabled={!answer.trim()}
            >
              SUBMIT ANSWER
            </button>
          </form>
        </div>
      </div>
      {/* HTML comment hint for Room 1 */}
      {/* hint_r1_from_r6: The command you need starts with 'l' */}
      {/* Page element hint for Room 10 */}
      <div className="hint-element" data-hint="Room 10: Think about patterns and connections">
        Hidden hint for Room 10
      </div>
    </div>
  );
};

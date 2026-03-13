/**
 * Room 7 - Image Puzzle
 * Player must analyze an image with hidden clues to find the answer
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setFragment, isRoomSolved } from '../utils/puzzleState';
import { logHintsToConsole, getExternalHint } from '../hints/hints';
import './Room7.css';

export const Room7 = () => {
  const navigate = useNavigate();
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const [solved, setSolved] = useState(false);

  // The correct answer stored as a variable
  const correctAnswer = 'map';

  useEffect(() => {
    // Check if already solved
    setSolved(isRoomSolved(7));

    // Log internal hints to console
    logHintsToConsole(7);

    // Log external hint reference (from Room 10)
    const externalHint = getExternalHint(7);
    if (externalHint) {
      console.log(`Hint: ${externalHint.hint.content}`);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate answer against stored variable
    if (answer.trim().toLowerCase() === correctAnswer) {
      // Store fragment "TREASURE"
      setFragment(7, 'TREASURE');
      setSolved(true);
      setError('');
      
      // Navigate back to home after a short delay
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } else {
      // Display error message
      setError('INCORRECT ANALYSIS');
      setAnswer('');
    }
  };

  if (solved) {
    return (
      <div className="room7-page">
        <div className="image-container">
          <div className="image-header">
            <span className="image-title">ROOM 7 - IMAGE ANALYSIS</span>
          </div>
          <div className="image-body">
            <div className="image-output">
              <p className="success-message">ANALYSIS COMPLETE</p>
              <p className="fragment-message">Fragment acquired: TREASURE</p>
              <p className="return-message">Returning to main hub...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="room7-page">
      {/* HTML comment hint for Room 2 */}
      {/* Room 2 Hint: The code snippet calculates the sum of numbers from 1 to 8 */}
      
      <div className="image-container">
        <div className="image-header">
          <span className="image-title">ROOM 7 - IMAGE ANALYSIS</span>
          <button className="back-button" onClick={() => navigate('/')}>
            ← BACK
          </button>
        </div>
        <div className="image-body">
          <div className="image-output">
            <p className="image-instruction">Analyze the image and find the hidden answer:</p>
            
            <div className="image-display">
              <img
                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%23001a00' width='400' height='300'/%3E%3Ctext x='200' y='80' font-size='48' fill='%2300ff41' text-anchor='middle' font-family='monospace' font-weight='bold'%3EWORLD%3C/text%3E%3Ccircle cx='100' cy='150' r='40' fill='none' stroke='%2300d4ff' stroke-width='2'/%3E%3Crect x='200' y='120' width='80' height='60' fill='none' stroke='%23ff0040' stroke-width='2'/%3E%3Cpolygon points='300,200 340,250 260,250' fill='none' stroke='%23ffff00' stroke-width='2'/%3E%3Ctext x='200' y='280' font-size='16' fill='%2300d4ff' text-anchor='middle' font-family='monospace'%3EFind the common element%3C/text%3E%3C/svg%3E"
                alt="Geometric shapes with hidden clue: The answer is what you use to navigate"
                className="puzzle-image"
                data-hint-1="Circle represents Earth"
                data-hint-2="Rectangle represents boundaries"
                data-hint-3="Triangle points to direction"
                data-clue="All shapes help you find your way"
              />
            </div>

            {error && (
              <p className="error-message">{error}</p>
            )}
          </div>
          <form onSubmit={handleSubmit} className="answer-form">
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="answer-input"
              placeholder="Enter your answer..."
              autoFocus
              autoComplete="off"
            />
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
    </div>
  );
};

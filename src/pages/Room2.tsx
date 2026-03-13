/**
 * Room 2 - Programming Puzzle
 * Player must analyze a code snippet and select the correct output
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setFragment, isRoomSolved } from '../utils/puzzleState';
import { logHintsToConsole, getExternalHint } from '../hints/hints';
import './Room2.css';

export const Room2 = () => {
  const navigate = useNavigate();
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [error, setError] = useState('');
  const [solved, setSolved] = useState(false);

  // The correct answer stored as a variable
  const correctAnswer = '42';

  // Code snippet to display
  const codeSnippet = `function mystery(x) {
  if (x <= 1) return 1;
  return x + mystery(x - 1);
}

console.log(mystery(8));`;

  // Multiple choice options
  const options = [
    { id: 'a', value: '36', label: 'A) 36' },
    { id: 'b', value: '42', label: 'B) 42' },
    { id: 'c', value: '8', label: 'C) 8' },
    { id: 'd', value: '64', label: 'D) 64' }
  ];

  useEffect(() => {
    // Check if already solved
    setSolved(isRoomSolved(2));

    // Log internal hints to console
    logHintsToConsole(2);

    // Log external hint reference (from Room 7)
    const externalHint = getExternalHint(2);
    if (externalHint) {
      console.log(`Hint: ${externalHint.hint.content}`);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate selection against stored variable
    if (selectedAnswer === correctAnswer) {
      // Store fragment "PIECE"
      setFragment(2, 'PIECE');
      setSolved(true);
      setError('');
      
      // Navigate back to home after a short delay
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } else {
      // Display error message
      setError('INCORRECT OUTPUT');
      setSelectedAnswer('');
    }
  };

  if (solved) {
    return (
      <div className="room2-page">
        <div className="code-container">
          <div className="code-header">
            <span className="code-title">ROOM 2 - CODE ANALYSIS</span>
          </div>
          <div className="code-body">
            <div className="code-output">
              <p className="success-message">ANALYSIS COMPLETE</p>
              <p className="fragment-message">Fragment acquired: PIECE</p>
              <p className="return-message">Returning to main hub...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="room2-page">
      <div className="code-container">
        <div className="code-header">
          <span className="code-title">ROOM 2 - CODE ANALYSIS</span>
          <button className="back-button" onClick={() => navigate('/')}>
            ← BACK
          </button>
        </div>
        <div className="code-body">
          <div className="code-output">
            <p className="code-instruction">Analyze the following code and determine its output:</p>
            <pre className="code-snippet">{codeSnippet}</pre>
            {error && (
              <p className="error-message">{error}</p>
            )}
          </div>
          <form onSubmit={handleSubmit} className="answer-form">
            <div className="options-container">
              {options.map(option => (
                <label key={option.id} className="option-label">
                  <input
                    type="radio"
                    name="answer"
                    value={option.value}
                    checked={selectedAnswer === option.value}
                    onChange={(e) => setSelectedAnswer(e.target.value)}
                    className="option-input"
                  />
                  <span className="option-text">{option.label}</span>
                </label>
              ))}
            </div>
            <button 
              type="submit" 
              className="submit-button"
              disabled={!selectedAnswer}
            >
              SUBMIT ANSWER
            </button>
          </form>
        </div>
        <div className="room-footer">
          <p className="footer-hint">Cipher Key for Room 4: SHIFT3</p>
        </div>
      </div>
    </div>
  );
};

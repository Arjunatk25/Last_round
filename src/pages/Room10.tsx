/**
 * Room 10 - Meta Puzzle
 * The final puzzle that references patterns from all previous rooms
 * Player must solve a riddle that connects multiple puzzle elements
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setFragment, isRoomSolved } from '../utils/puzzleState';
import { logHintsToConsole, getExternalHint } from '../hints/hints';
import './Room10.css';

export const Room10 = () => {
  const navigate = useNavigate();
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const [solved, setSolved] = useState(false);

  // The correct answer stored as a variable
  // The answer is "BYTEQUEST" - the name of the entire game/quest
  const correctAnswer = 'BYTEQUEST';

  // Console hint for Room 7
  const hint_r7_from_r10 = 'The image puzzle answer is what you use to find your way around';

  useEffect(() => {
    // Check if already solved
    setSolved(isRoomSolved(10));

    // Log internal hints to console
    logHintsToConsole(10);

    // Log the Room 7 console hint
    console.log(`hint_r7_from_r10: ${hint_r7_from_r10}`);

    // Log external hint reference (from Room 6)
    const externalHint = getExternalHint(10);
    if (externalHint) {
      console.log(`Hint: ${externalHint.hint.content}`);
    }

    // Make the Room 6 page element hint available
    const room6HintElement = document.querySelector('[data-hint]');
    if (room6HintElement) {
      const hintContent = room6HintElement.getAttribute('data-hint');
      console.log(`Room 6 page element hint: ${hintContent}`);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate answer against stored variable
    if (answer.trim().toUpperCase() === correctAnswer) {
      // Store fragment "QUEST"
      setFragment(10, 'QUEST');
      setSolved(true);
      setError('');
      
      // Navigate back to home after a short delay
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } else {
      // Display error message
      setError('INCORRECT ANSWER - The quest continues...');
      setAnswer('');
    }
  };

  if (solved) {
    return (
      <div className="room10-page">
        <div className="meta-container">
          <div className="meta-header">
            <span className="meta-title">ROOM 10 - META PUZZLE</span>
          </div>
          <div className="meta-body">
            <div className="meta-output">
              <p className="success-message">PUZZLE SOLVED</p>
              <p className="fragment-message">Fragment acquired: QUEST</p>
              <p className="return-message">All fragments collected. Return to assemble the master key...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="room10-page">
      <div className="meta-container">
        <div className="meta-header">
          <span className="meta-title">ROOM 10 - META PUZZLE</span>
          <button className="back-button" onClick={() => navigate('/')}>
            ← BACK
          </button>
        </div>
        <div className="meta-body">
          <div className="meta-output">
            <p className="meta-instruction">
              You have journeyed through 9 rooms, each revealing a fragment of truth.
            </p>
            <div className="riddle-container">
              <p className="riddle-title">The Final Riddle:</p>
              <p className="riddle-text">
                I am the quest you have undertaken,<br/>
                Through terminals and code, my path is taken.<br/>
                In vaults and ciphers, networks and more,<br/>
                I am the name of what you explore.<br/>
                <br/>
                From Room 1's command to Room 9's network call,<br/>
                I am the thread that connects them all.<br/>
                What am I?
              </p>
              <p className="riddle-hint">
                Hint: Think about the name of this entire experience. Check the console for additional clues.
              </p>
            </div>
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
                placeholder="What is the quest?"
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
      {/* HTML comment hint for Room 7 */}
      {/* hint_r7_from_r10: The answer to the image puzzle is a navigation tool */}
      {/* Page element hint for Room 6 */}
      <div className="hint-element" data-hint="Room 6: The console puzzle answer is 2 to the power of 10">
        Hidden hint for Room 6
      </div>
    </div>
  );
};

/**
 * Room 1 - Terminal Command Puzzle
 * Player must enter the correct terminal command to unlock the fragment
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setFragment, isRoomSolved } from '../utils/puzzleState';
import { logHintsToConsole, getExternalHint } from '../hints/hints';
import ScrollReveal from '../components/ScrollReveal';
import './Room1.css';

export const Room1 = () => {
  const navigate = useNavigate();
  const [command, setCommand] = useState('');
  const [error, setError] = useState('');
  const [solved, setSolved] = useState(false);

  // The correct command stored as a variable
  const correctCommand = 'ls';

  useEffect(() => {
    // Check if already solved
    setSolved(isRoomSolved(1));

    // Log internal hints to console
    logHintsToConsole(1);

    // Log external hint reference (from Room 5)
    const externalHint = getExternalHint(1);
    if (externalHint) {
      console.log(`Hint: ${externalHint.hint.content}`);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate command against stored variable
    if (command.trim().toLowerCase() === correctCommand) {
      // Store fragment "ONE"
      setFragment(1, 'ONE');
      setSolved(true);
      setError('');
      
      // Navigate back to home after a short delay
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } else {
      // Display error message
      setError('ACCESS DENIED');
      setCommand('');
    }
  };

  if (solved) {
    return (
      <div className="room1-page">
        <div className="terminal-container">
          <div className="terminal-header">
            <span className="terminal-title">ROOM 1 - TERMINAL ACCESS</span>
          </div>
          <div className="terminal-body">
            <div className="terminal-output">
              <p className="success-message">ACCESS GRANTED</p>
              <p className="fragment-message">Fragment acquired: ONE</p>
              <p className="return-message">Returning to main hub...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="room1-page">
      <div className="terminal-container">
        <div className="terminal-header">
          <span className="terminal-title">ROOM 1 - TERMINAL ACCESS</span>
          <button className="back-button" onClick={() => navigate('/')}>
            ← BACK
          </button>
        </div>
        <div className="terminal-body">
          <div className="terminal-output">
            <p className="terminal-line">System initialized...</p>
            <p className="terminal-line">Awaiting command input...</p>
            <p className="terminal-line terminal-prompt">
              Enter the correct command to access the system:
            </p>
            {error && (
              <p className="error-message">{error}</p>
            )}
          </div>
          <form onSubmit={handleSubmit} className="terminal-input-form">
            <span className="prompt-symbol">$</span>
            <input
              type="text"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              className="terminal-input"
              placeholder="Enter command..."
              autoFocus
              autoComplete="off"
            />
          </form>
        </div>
      </div>
      
      {/* Scroll-reveal hints section */}
      <div className="hints-section">
        <ScrollReveal 
          containerClassName="hint-reveal"
          textClassName="hint-text"
          baseOpacity={0.05}
          blurStrength={6}
        >
          Hint: Try common system commands
        </ScrollReveal>
        <ScrollReveal 
          containerClassName="hint-reveal"
          textClassName="hint-text"
          baseOpacity={0.05}
          blurStrength={6}
        >
          Hint: Think about listing directory contents
        </ScrollReveal>
      </div>
    </div>
  );
};

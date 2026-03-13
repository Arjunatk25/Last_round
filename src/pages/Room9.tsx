/**
 * Room 9 - Network Puzzle
 * Player must discover a hidden fetch request in the network tab to find the answer
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setFragment, isRoomSolved } from '../utils/puzzleState';
import { logHintsToConsole, getExternalHint } from '../hints/hints';
import './Room9.css';

export const Room9 = () => {
  const navigate = useNavigate();
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const [solved, setSolved] = useState(false);

  // The correct answer stored as a variable
  const correctAnswer = 'OFFLINE';

  // Network response hint for Room 5
  const hint_r5_from_r9 = 'Check the network response for offline clue';

  useEffect(() => {
    // Check if already solved
    setSolved(isRoomSolved(9));

    // Log internal hints to console
    logHintsToConsole(9);

    // Log external hint reference (from Room 3)
    const externalHint = getExternalHint(9);
    if (externalHint) {
      console.log(`Hint: ${externalHint.hint.content}`);
    }

    // Log the Room 5 network hint to console
    console.log(`hint_r5_from_r9: ${hint_r5_from_r9}`);

    // Make hidden fetch request on component mount
    // This request will be visible in the Network tab of DevTools
    const fetchClue = async () => {
      try {
        // Create a data URL with the clue that will appear in network tab
        const clueData = {
          puzzle: 'network_puzzle',
          clue: 'The answer is what Room 5 pretended to be',
          hint: 'Think about the error message in Room 5'
        };

        // Fetch from a data URL to simulate a network request
        const response = await fetch(
          'data:application/json;base64,' + 
          btoa(JSON.stringify(clueData))
        );

        // Also try a real fetch to a non-existent endpoint
        // This will show in network tab even though it fails
        fetch('/api/puzzle/room9/clue', {
          method: 'GET',
          headers: {
            'X-Puzzle-Room': '9',
            'X-Clue': 'OFFLINE'
          }
        }).catch(() => {
          // Expected to fail, but the request will be visible in network tab
        });

        const data = await response.json();
        console.log('Network puzzle data:', data);
      } catch (error) {
        // Silently fail - the fetch attempt is what matters for the network tab
        console.log('Network request completed');
      }
    };

    fetchClue();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate answer against stored variable
    if (answer.trim().toUpperCase() === correctAnswer) {
      // Store fragment "FINAL"
      setFragment(9, 'FINAL');
      setSolved(true);
      setError('');
      
      // Navigate back to home after a short delay
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } else {
      // Display error message
      setError('NETWORK ERROR: Invalid response');
      setAnswer('');
    }
  };

  if (solved) {
    return (
      <div className="room9-page">
        <div className="network-container">
          <div className="network-header">
            <span className="network-title">ROOM 9 - NETWORK ANALYSIS</span>
          </div>
          <div className="network-body">
            <div className="network-output">
              <p className="success-message">CONNECTION ESTABLISHED</p>
              <p className="fragment-message">Fragment acquired: FINAL</p>
              <p className="return-message">Returning to main hub...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="room9-page">
      <div className="network-container">
        <div className="network-header">
          <span className="network-title">ROOM 9 - NETWORK ANALYSIS</span>
          <button className="back-button" onClick={() => navigate('/')}>
            ← BACK
          </button>
        </div>
        <div className="network-body">
          <div className="network-output">
            <p className="network-instruction">
              A hidden network request has been made. Check the Network tab in DevTools to find the clue.
            </p>
            <div className="network-info">
              <p className="info-line">Status: Analyzing network traffic...</p>
              <p className="info-line">Requests: 1 pending</p>
              <p className="info-line">Hint: Look for headers and response data</p>
            </div>
            {error && (
              <p className="error-message">{error}</p>
            )}
          </div>
          <form onSubmit={handleSubmit} className="network-input-form">
            <label htmlFor="answer-input" className="input-label">
              Enter the answer discovered in the network tab:
            </label>
            <input
              id="answer-input"
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="network-input"
              placeholder="Enter answer..."
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

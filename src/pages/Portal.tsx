/**
 * Portal Page Component
 * Victory screen displayed after solving all puzzles and entering the master key
 * Features glowing portal animation and One Piece themed victory elements
 */

import { useNavigate } from 'react-router-dom';
import './Portal.css';

export const Portal = () => {
  const navigate = useNavigate();

  return (
    <div className="portal-page">
      {/* Animated background grid */}
      <div className="portal-grid-background"></div>

      {/* Main portal container */}
      <div className="portal-container">
        {/* Glowing portal circle */}
        <div className="portal-glow-outer">
          <div className="portal-glow-middle">
            <div className="portal-glow-inner">
              {/* Portal core with rotating elements */}
              <div className="portal-core">
                <div className="portal-ring portal-ring-1"></div>
                <div className="portal-ring portal-ring-2"></div>
                <div className="portal-ring portal-ring-3"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Victory message */}
        <div className="victory-message">
          <h1 className="victory-title">
            <span className="glitch-text" data-text="BYTEQUEST">BYTEQUEST</span>
          </h1>
          <h2 className="victory-subtitle">COMPLETED</h2>
        </div>

        {/* One Piece themed elements */}
        <div className="treasure-elements">
          <div className="treasure-icon">🏴‍☠️</div>
          <p className="treasure-text">THE TREASURE IS YOURS</p>
          <div className="treasure-icon">💎</div>
        </div>

        {/* Atmospheric effects */}
        <div className="portal-particles">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                '--delay': `${i * 0.1}s`,
              } as React.CSSProperties}
            ></div>
          ))}
        </div>

        {/* Action buttons */}
        <div className="portal-actions">
          <button
            className="portal-button home-button"
            onClick={() => navigate('/')}
          >
            ← RETURN HOME
          </button>
          <button
            className="portal-button reset-button"
            onClick={() => {
              localStorage.clear();
              navigate('/');
            }}
          >
            ↻ NEW ADVENTURE
          </button>
        </div>

        {/* Footer message */}
        <div className="portal-footer">
          <p className="portal-message">
            &gt; You have unlocked the secrets of ByteQuest...
          </p>
          <p className="portal-message">
            &gt; The adventure awaits those brave enough to return.
          </p>
        </div>
      </div>

      {/* Atmospheric glow effect */}
      <div className="atmosphere-glow"></div>
    </div>
  );
};

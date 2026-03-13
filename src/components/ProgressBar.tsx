/**
 * ProgressBar Component
 * Displays the player's progress through the 10 puzzle rooms
 * Shows solved count and visual progress bar with percentage fill
 */

import { useState, useEffect } from 'react';
import { calculateProgress, calculateProgressPercentage } from '../utils/puzzleState';
import './ProgressBar.css';

export const ProgressBar = () => {
  const [solvedCount, setSolvedCount] = useState(0);
  const [percentage, setPercentage] = useState(0);

  // Update progress on mount and when storage changes
  const updateProgress = () => {
    const count = calculateProgress();
    const percent = calculateProgressPercentage();
    setSolvedCount(count);
    setPercentage(percent);
  };

  useEffect(() => {
    // Initial load
    updateProgress();

    // Listen for storage changes (when fragments are updated)
    const handleStorageChange = () => {
      updateProgress();
    };

    window.addEventListener('storage', handleStorageChange);

    // Custom event for same-window updates
    const handleFragmentUpdate = () => {
      updateProgress();
    };

    window.addEventListener('fragmentUpdate', handleFragmentUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('fragmentUpdate', handleFragmentUpdate);
    };
  }, []);

  return (
    <div className="progress-bar-container">
      <div className="progress-info">
        <span className="progress-label">PROGRESS</span>
        <span className="progress-count">{solvedCount} / 10 ROOMS SOLVED</span>
      </div>
      <div className="progress-bar-track">
        <div 
          className="progress-bar-fill" 
          style={{ width: `${percentage}%` }}
        >
          {percentage > 0 && (
            <span className="progress-percentage">{Math.round(percentage)}%</span>
          )}
        </div>
      </div>
    </div>
  );
};


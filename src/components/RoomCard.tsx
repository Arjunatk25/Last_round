/**
 * RoomCard Component
 * Displays a clickable card for each puzzle room
 * Shows room number, title, and solved indicator
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isRoomSolved } from '../utils/puzzleState';
import './RoomCard.css';

interface RoomCardProps {
  roomNumber: number;
  title: string;
}

export const RoomCard = ({ roomNumber, title }: RoomCardProps) => {
  const navigate = useNavigate();
  const [solved, setSolved] = useState(false);

  // Update solved status on mount and when storage changes
  const updateSolvedStatus = () => {
    setSolved(isRoomSolved(roomNumber));
  };

  useEffect(() => {
    // Initial load
    updateSolvedStatus();

    // Listen for storage changes (when fragments are updated)
    const handleStorageChange = () => {
      updateSolvedStatus();
    };

    window.addEventListener('storage', handleStorageChange);

    // Custom event for same-window updates
    const handleFragmentUpdate = () => {
      updateSolvedStatus();
    };

    window.addEventListener('fragmentUpdate', handleFragmentUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('fragmentUpdate', handleFragmentUpdate);
    };
  }, [roomNumber]);

  const handleClick = () => {
    navigate(`/room/${roomNumber}`);
  };

  return (
    <div className="room-card" onClick={handleClick}>
      <div className="room-card-header">
        <span className="room-number">ROOM {roomNumber}</span>
        {solved && (
          <span className="solved-indicator" aria-label="Solved">
            ✓
          </span>
        )}
      </div>
      <h3 className="room-title">{title}</h3>
      <div className="room-card-footer">
        <span className="enter-text">ENTER &gt;</span>
      </div>
    </div>
  );
};

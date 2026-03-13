/**
 * Home Page Component
 * Main landing page displaying all 10 puzzle rooms in a grid layout
 * Includes progress tracker at the top
 */

import { useNavigate } from 'react-router-dom';
import { ProgressBar } from '../components/ProgressBar';
import { RoomCard } from '../components/RoomCard';
import './Home.css';

// Room data with titles
const rooms = [
  { number: 1, title: 'Terminal Command' },
  { number: 2, title: 'Programming Logic' },
  { number: 3, title: 'Vault Keypad' },
  { number: 4, title: 'Cipher Decryption' },
  { number: 5, title: 'Offline Mystery' },
  { number: 6, title: 'Console Puzzle' },
  { number: 7, title: 'Image Secrets' },
  { number: 8, title: 'Binary Decoder' },
  { number: 9, title: 'Network Inspector' },
  { number: 10, title: 'Meta Riddle' },
];

export const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <div className="home-header">
        <h1 className="home-title">
          <span className="glitch-text" data-text="BYTEQUEST">BYTEQUEST</span>
        </h1>
        <p className="home-subtitle">DECODE THE FRAGMENTS. UNLOCK THE PORTAL.</p>
      </div>

      <ProgressBar />

      <div className="rooms-grid">
        {rooms.map((room) => (
          <RoomCard
            key={room.number}
            roomNumber={room.number}
            title={room.title}
          />
        ))}
      </div>

      <div className="home-footer">
        <button 
          className="master-key-link"
          onClick={() => navigate('/master-key')}
        >
          → MASTER KEY
        </button>
        <p className="hint-text">
          &gt; Use your developer tools to uncover hidden clues...
        </p>
      </div>
    </div>
  );
};

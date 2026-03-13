/**
 * Master Key Page Component
 * Player enters the master key composed from all 10 fragments
 * On correct entry, navigates to the Portal victory page
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { validateMasterKey, isMasterKeyComplete } from '../utils/masterKey';
import { ProgressBar } from '../components/ProgressBar';
import './MasterKey.css';

export const MasterKey = () => {
  const navigate = useNavigate();
  const [masterKey, setMasterKey] = useState('');
  const [error, setError] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [solved, setSolved] = useState(false);

  useEffect(() => {
    // Check if all fragments are collected
    const complete = isMasterKeyComplete();
    setIsComplete(complete);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate master key against concatenated fragments
    if (validateMasterKey(masterKey.trim())) {
      // Navigate to Portal on correct key
      setSolved(true);
      setError('');
      
      // Navigate to portal after a short delay
      setTimeout(() => {
        navigate('/portal');
      }, 1500);
    } else {
      // Display error message for incorrect keys
      setError('INVALID KEY - ACCESS DENIED');
      setMasterKey('');
    }
  };

  if (solved) {
    return (
      <div className="master-key-page">
        <ProgressBar />
        <div className="master-key-container">
          <div className="master-key-header">
            <h1 className="master-key-title">
              <span className="glitch-text" data-text="MASTER KEY">MASTER KEY</span>
            </h1>
          </div>
          <div className="master-key-body">
            <div className="success-message">
              <p className="success-text">KEY ACCEPTED</p>
              <p className="portal-message">Opening portal...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="master-key-page">
      <ProgressBar />
      <div className="master-key-container">
        <div className="master-key-header">
          <h1 className="master-key-title">
            <span className="glitch-text" data-text="MASTER KEY">MASTER KEY</span>
          </h1>
          <button className="back-button" onClick={() => navigate('/')}>
            ← BACK
          </button>
        </div>
        <div className="master-key-body">
          <div className="master-key-info">
            {!isComplete ? (
              <p className="incomplete-message">
                Collect all fragments from the 10 puzzle rooms to unlock the master key.
              </p>
            ) : (
              <p className="ready-message">
                All fragments collected. Enter the master key to unlock the portal.
              </p>
            )}
          </div>
          
          {isComplete && (
            <form onSubmit={handleSubmit} className="master-key-form">
              <div className="input-group">
                <label htmlFor="master-key-input" className="input-label">
                  ENTER MASTER KEY:
                </label>
                <input
                  id="master-key-input"
                  type="text"
                  value={masterKey}
                  onChange={(e) => setMasterKey(e.target.value)}
                  className="master-key-input"
                  placeholder="Enter the master key..."
                  autoFocus
                  autoComplete="off"
                  disabled={!isComplete}
                />
              </div>
              
              {error && (
                <p className="error-message">{error}</p>
              )}
              
              <button 
                type="submit" 
                className="submit-button"
                disabled={!isComplete}
              >
                UNLOCK PORTAL
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

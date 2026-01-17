import { useState } from 'react';

interface GameLobbyProps {
  onCreateGame: () => void;
  onJoinGame: (id: string) => void;
}

export function GameLobby({ onCreateGame, onJoinGame }: GameLobbyProps) {
  const [joinId, setJoinId] = useState('');

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (joinId.trim()) {
      onJoinGame(joinId.trim().toUpperCase());
    }
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <button onClick={onCreateGame}>Create New Game</button>
      </div>

      <div style={{ position: 'relative', textAlign: 'center', margin: '20px 0' }}>
        <hr style={{ border: 'none', borderTop: '2px solid #ddd', margin: '0' }} />
        <span style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'var(--bg-card)', // Match card background
          padding: '0 10px',
          color: '#888',
          fontWeight: 'bold',
          fontSize: '0.9rem'
        }}>
          OR
        </span>
      </div>
      <form onSubmit={handleJoinSubmit} style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
        <input
          type="text"
          value={joinId}
          onChange={(e) => setJoinId(e.target.value)}
          placeholder="Enter Game ID"
          style={{ width: '120px' }}
        />
        <button type="submit">Join Game</button>
      </form>
    </div>
  );
}
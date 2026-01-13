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
      <button onClick={onCreateGame} style={{ marginBottom: '20px' }}>Create New Game</button>
      <hr />
      <form onSubmit={handleJoinSubmit} style={{ marginTop: '20px' }}>
        <input
          type="text"
          value={joinId}
          onChange={(e) => setJoinId(e.target.value)}
          placeholder="Enter Game ID"
        />
        <button type="submit">Join Game</button>
      </form>
    </div>
  );
}
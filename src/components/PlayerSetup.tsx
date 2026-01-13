import { useState } from 'react';

interface PlayerSetupProps {
  onPlayerAdd: (name: string) => void;
}

export function PlayerSetup({ onPlayerAdd }: PlayerSetupProps) {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      console.log('[PlayerSetup] Form submitted. Calling onPlayerAdd with name:', name.trim());
      onPlayerAdd(name.trim());
    }
  };

  return (
    <div className="card">
      <h2>Welcome to Flip 7 Scoring Tool</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name (Max 7)"
          maxLength={7}
          required
          style={{ marginRight: '10px', padding: '8px' }}
        />
        <button type="submit">Start Scoring</button>
      </form>
    </div>
  );
}
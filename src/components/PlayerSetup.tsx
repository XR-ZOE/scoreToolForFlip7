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
      <form onSubmit={handleSubmit} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name (Max 7)"
          maxLength={7}
          required
          style={{ width: '140px' }}
        />
        <button type="submit">Start Scoring</button>
      </form>
    </div>
  );
}
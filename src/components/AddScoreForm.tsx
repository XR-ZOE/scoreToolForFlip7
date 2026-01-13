import { useState } from 'react';

interface AddScoreFormProps {
  round: number;
  playerName: string;
  onScoreAdd: (score: number) => void;
}

export function AddScoreForm({ round, playerName, onScoreAdd }: AddScoreFormProps) {
  const [score, setScore] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const scoreValue = parseInt(score, 10);
    if (!isNaN(scoreValue)) {
      onScoreAdd(scoreValue);
      setScore(''); // Reset after submission
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card">
      <h3>{playerName}, Enter Score for Round {round}</h3>
      <input
        type="number"
        value={score}
        onChange={(e) => setScore(e.target.value)}
        placeholder="Enter Score"
        required
        style={{ marginRight: '10px', padding: '8px' }}
      />
      <button type="submit">Add Score</button>
    </form>
  );
}
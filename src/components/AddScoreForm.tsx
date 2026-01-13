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
      <h3>{playerName}, 請輸入 Round {round} 的分數</h3>
      <input
        type="number"
        value={score}
        onChange={(e) => setScore(e.target.value)}
        placeholder="輸入分數"
        required
        style={{ marginRight: '10px', padding: '8px' }}
      />
      <button type="submit">新增分數</button>
    </form>
  );
}
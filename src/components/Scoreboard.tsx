import type { Player } from "../types";


interface ScoreboardProps {
  players: Player[];
  currentPlayerName: string | null;
}

export function Scoreboard({ players, currentPlayerName }: ScoreboardProps) {
  if (players.length === 0) {
    return <p>目前沒有玩家</p>;
  }

  const maxRounds = Math.max(0, ...players.map(p => p.scores.length));
  const roundHeaders = Array.from({ length: maxRounds }, (_, i) => i + 1);

  return (
    <div>
      <h2>計分板</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>玩家</th>
            {roundHeaders.map(round => (
              <th key={round} style={{ border: '1px solid #ddd', padding: '8px' }}>R{round}</th>
            ))}
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>總分</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player) => {
            const isCurrentPlayer = player.name === currentPlayerName;
            const rowStyle = isCurrentPlayer ? { backgroundColor: 'palegreen' } : {};

            return (
            <tr key={player.name} style={rowStyle}>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{player.name}</td>
              {roundHeaders.map(roundIndex => (
                <td key={roundIndex} style={{ border: '1px solid #ddd', padding: '8px' }}>
                  {player.scores[roundIndex - 1] ?? ''}
                </td>
              ))}
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{player.totalScore}</td>
            </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
import { useState } from 'react';

import type { Player } from "../types";
import { ScoreChart } from "./ScoreChart";

interface ScoreboardProps {
  players: Player[];
  currentPlayerName: string | null;
  onScoreEdit?: (round: number, newScore: number) => void;
}

export function Scoreboard({ players, currentPlayerName, onScoreEdit }: ScoreboardProps) {
  const [editingCell, setEditingCell] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  if (players.length === 0) {
    return <p>No players yet</p>;
  }

  const maxRounds = Math.max(0, ...players.map(p => p.scores.length));
  const roundHeaders = Array.from({ length: maxRounds }, (_, i) => i + 1);

  // Sort players by total score to determine rank
  const sortedPlayers = [...players].sort((a, b) => b.totalScore - a.totalScore);

  const getRankIcon = (index: number) => {
    const size = 28;
    const baseStyle = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: size,
      height: size,
      borderRadius: '50%',
      marginRight: 8,
      fontWeight: 'bold',
      color: '#000',
      fontSize: '0.9em'
    };

    switch (index) {
      case 0: return <div style={{ ...baseStyle, background: 'linear-gradient(135deg, #FFD700 0%, #FDB931 100%)', boxShadow: '0 0 5px #FFD700' }}>1</div>;
      case 1: return <div style={{ ...baseStyle, background: 'linear-gradient(135deg, #E0E0E0 0%, #C0C0C0 100%)', boxShadow: '0 0 5px #C0C0C0' }}>2</div>;
      case 2: return <div style={{ ...baseStyle, background: 'linear-gradient(135deg, #CD7F32 0%, #B87333 100%)', boxShadow: '0 0 5px #CD7F32' }}>3</div>;
      default: return <div style={{ ...baseStyle, background: 'transparent', color: '#666', border: '1px solid #444' }}>{index + 1}</div>;
    }
  };

  return (
    <div>
      <h2>Scoreboard</h2>
      <div className="card" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '300px' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '12px' }}>Rank / Player</th>
              {roundHeaders.map(round => (
                <th key={round} style={{ padding: '8px', color: '#888' }}>R{round}</th>
              ))}
              <th style={{ padding: '12px', color: '#4caf50' }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {sortedPlayers.map((player, index) => {
              const isCurrentPlayer = player.name === currentPlayerName;
              const rowStyle = isCurrentPlayer ? { backgroundColor: 'rgba(76, 175, 80, 0.1)' } : {};

              return (
                <tr key={player.name} style={{ ...rowStyle, borderBottom: '1px solid #333' }}>
                  <td style={{ padding: '12px', display: 'flex', alignItems: 'center' }}>
                    {getRankIcon(index)}
                    <span style={{ fontWeight: isCurrentPlayer ? 'bold' : 'normal', color: isCurrentPlayer ? '#4caf50' : 'inherit' }}>
                      {player.name}
                    </span>
                  </td>
                  {roundHeaders.map(roundIndex => {
                    // Logic to find if this specific cell is being edited
                    const cellKey = `${player.name}-${roundIndex}`;
                    const isEditing = editingCell === cellKey;
                    const score = player.scores[roundIndex - 1];

                    return (
                      <td
                        key={roundIndex}
                        style={{ padding: '8px', textAlign: 'center', color: '#aaa', cursor: isCurrentPlayer ? 'pointer' : 'default' }}
                        onClick={() => {
                          if (isCurrentPlayer && !isEditing) {
                            setEditingCell(cellKey);
                            setEditValue(score?.toString() ?? '');
                          }
                        }}
                      >
                        {isEditing ? (
                          <input
                            autoFocus
                            type="number"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onBlur={() => {
                              // Save on blur
                              if (editValue !== '' && !isNaN(Number(editValue))) {
                                onScoreEdit?.(roundIndex, Number(editValue));
                              }
                              setEditingCell(null);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.currentTarget.blur();
                              }
                            }}
                            style={{ width: '50px', padding: '4px', textAlign: 'center', background: '#fff', color: '#000' }}
                          />
                        ) : (
                          score ?? '-'
                        )}
                      </td>
                    );
                  })}
                  <td style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold', fontSize: '1.2em' }}>
                    {player.totalScore}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <ScoreChart players={players} currentPlayerName={currentPlayerName} />
    </div>
  );
}

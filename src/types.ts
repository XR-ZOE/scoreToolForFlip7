export interface Player {
  name: string;
  scores: number[];
  totalScore: number;
}

export interface Game {
  id: string; // The backend uses gameId as map key, but client might want to know it. Actually server sends {players: [], status...}. We might need to handle ID separately or mix it in.
  players: Player[];
  status: 'lobby' | 'playing' | 'finished';
  createdAt: number;
}
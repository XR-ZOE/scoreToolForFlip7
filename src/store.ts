import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GameState {
  gameId: string | null;
  playerName: string | null;
  setGameId: (gameId: string) => void;
  setPlayerName: (name: string) => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      gameId: null,
      playerName: null,
      setGameId: (gameId) => set({ gameId }),
      setPlayerName: (name) => set({ playerName: name }),
    }),
    {
      name: 'flip7-game-storage', // 在 localStorage 中的 key
    }
  )
);
import { useState, useEffect, useCallback } from 'react';
import './App.css';
import { useGameStore } from './store';
import type { Game } from './types';
import { PlayerSetup } from './components/PlayerSetup';
import { Scoreboard } from './components/Scoreboard';
import { AddScoreForm } from './components/AddScoreForm';
import { GameLobby } from './components/GameLobby';
import { socket } from './socket';

function App() {
  const { gameId, playerName, setGameId, setPlayerName } = useGameStore();
  const [game, setGame] = useState<Game | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onGameUpdate(updatedGame: Game) {
      console.log("Game update received:", updatedGame);
      setGame(updatedGame);
      setError(null);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('game_update', onGameUpdate);
    socket.connect(); // Ensure we connect

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('game_update', onGameUpdate);
      socket.disconnect();
    };
  }, []);

  // Re-join logic on refresh/reconnect
  useEffect(() => {
    if (isConnected && gameId && playerName) {
      console.log("Attempting to rejoin...", gameId, playerName);
      socket.emit('join_game', { gameId, playerName }, (response: { success: boolean, error?: string }) => {
        if (!response.success && response.error) {
          console.error("Rejoin failed:", response.error);
          // Optional: Clear store if game not found?
          // setError(response.error);
        }
      });
    }
  }, [isConnected, gameId, playerName]);


  const handleCreateGame = useCallback(() => {
    socket.emit('create_game', (response: { success: boolean, gameId: string }) => {
      if (response.success) {
        setGameId(response.gameId);
        // Creator is automatically joined to room by server, so they will receive updates if they stay connected.
        // But checking `game` might still be null until first update arrives? 
        // Server emits update immediately inside create_game? No, create_game just joins.
        // We might want server to emit update or just set local empty state.
        // Let's rely on server sending update or we can just wait.
        // Actually my server code for create_game: calls callback, logic joins socket. 
        // It DOES NOT emit game_update.
        // Fix: I should trust the ID. The first game_update will come when a player joins?
        // Wait, if I am creator, I want to see the empty scoreboard.
        // I should probably ask server to send me the game object.
        // OR: create_game returns gameId. I can just render locally.
        // BUT server `games` Map has the object.
        // Let's update server or handle it here?
        // Easier: Creator enters name -> joins game -> gets update.
        // So Creator flow: Create -> ID set -> Player Setup -> Join -> Update.
        // This works fine.
      }
    });
  }, [setGameId]);

  const handleJoinGame = useCallback((id: string) => {
    // Just set local ID to trigger PlayerSetup view
    setGameId(id);
    setError(null);
  }, [setGameId]);

  const handlePlayerAdd = useCallback((name: string) => {
    if (!gameId) return;

    socket.emit('join_game', { gameId, playerName: name }, (response: { success: boolean, error?: string }) => {
      if (response.success) {
        setPlayerName(name);
        setError(null);
      } else {
        setError(response.error || "加入遊戲失敗");
        // If game not found, maybe reset gameId?
        if (response.error === 'Game not found') {
          setGameId(''); // Go back to lobby
        }
      }
    });
  }, [gameId, setPlayerName, setGameId]);

  const handleScoreAdd = useCallback((score: number) => {
    if (!gameId || !playerName || !game) return;

    const currentPlayer = game.players.find(p => p.name === playerName);
    const round = (currentPlayer?.scores.length ?? 0) + 1;

    socket.emit('update_score', { gameId, playerName, score, round });
  }, [gameId, playerName, game]);

  const currentPlayer = game?.players.find(p => p.name === playerName);
  const currentRound = (currentPlayer?.scores.length ?? 0) + 1;

  // Show PlayerSetup if:
  // 1. We have a gameId (so not in Lobby)
  // 2. We don't have a playerName set LOCALLY OR We are not in the game players list (remote source of truth)
  // But strictly, if we have local playerName but not in game list (e.g. game restarted), we should probably re-join?
  // Using simple logic: if !playerName, show setup. 
  // If playerName is set, but not in game... wait for join_game effect to work?
  // Let's sticking to: !playerName ? Setup : Scoreboard.
  const showPlayerSetup = !playerName;

  return (
    <>
      <h1>Flip 7 計分小工具</h1>
      <div style={{ fontSize: '0.8rem', opacity: 0.7, marginBottom: '1rem' }}>
        Status: {isConnected ? <span style={{ color: 'lightgreen' }}>Connected</span> : <span style={{ color: 'red' }}>Disconnected</span>}
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!gameId ? (
        <GameLobby onCreateGame={handleCreateGame} onJoinGame={handleJoinGame} />
      ) : showPlayerSetup ? (
        <PlayerSetup onPlayerAdd={handlePlayerAdd} />
      ) : game ? (
        <>
          <p>遊戲ID: <strong>{gameId}</strong> (分享給朋友加入)</p>
          <Scoreboard players={game.players} currentPlayerName={playerName} />
          {/* Only show add score form if "game is playing" (in future) or just always for now */}
          <AddScoreForm round={currentRound} playerName={playerName} onScoreAdd={handleScoreAdd} />
        </>
      ) : (
        <p>載入遊戲資料中... (ID: {gameId})</p>
      )}
    </>
  );
}

export default App;

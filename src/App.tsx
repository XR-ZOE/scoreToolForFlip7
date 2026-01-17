import { useState, useEffect, useCallback } from 'react';
import './App.css';
import { useGameStore } from './store';
import type { Game } from './types';
import { PlayerSetup } from './components/PlayerSetup';
import { Scoreboard } from './components/Scoreboard';
import { AddScoreForm } from './components/AddScoreForm';
import { GameLobby } from './components/GameLobby';
import { AlertModal } from './components/AlertModal';
import { ConfirmModal } from './components/ConfirmModal';
import { socket } from './socket';
import { logEvent } from './utils/analytics';

function App() {
  const { gameId, playerName, setGameId, setPlayerName } = useGameStore();
  const [game, setGame] = useState<Game | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showNotFoundAlert, setShowNotFoundAlert] = useState(false);

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

          if (response.error === 'Game not found') {
            // Server restart or game deleted
            // alert('找不到此遊戲 (可能伺服器已重啟)，將回到大廳。');
            setGameId('');
            setPlayerName('');
            setShowNotFoundAlert(true);
          }
        }
      });
    }
  }, [isConnected, gameId, playerName]);


  const handleCreateGame = useCallback(() => {
    socket.emit('create_game', (response: { success: boolean, gameId: string }) => {
      if (response.success) {
        setGameId(response.gameId);
        logEvent('create_game', { gameId: response.gameId });
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
        logEvent('join_game', { gameId, playerName: name });
      } else {
        setError(response.error || "Failed to join game");
        // If game not found, maybe reset gameId?
        if (response.error === 'Game not found') {
          setGameId(''); // Go back to lobby
          setShowNotFoundAlert(true);
        }
      }
    });
  }, [gameId, setPlayerName, setGameId]);

  const handleScoreAdd = useCallback((score: number) => {
    if (!gameId || !playerName || !game) return;

    const currentPlayer = game.players.find(p => p.name === playerName);
    const round = (currentPlayer?.scores.length ?? 0) + 1;

    socket.emit('update_score', { gameId, playerName, score, round });
    logEvent('update_score', { gameId, score, round });
  }, [gameId, playerName, game]);

  const currentPlayer = game?.players.find(p => p.name === playerName);
  const currentRound = (currentPlayer?.scores.length ?? 0) + 1;

  // Show PlayerSetup if:
  // 1. We have a gameId (so not in Lobby)
  // 2. We don't have a playerName set LOCALLY OR We are not in the game players list (remote source of truth)
  // But strictly, if we have local playerName but not in game (e.g. game restarted), we should probably re-join?
  // Using simple logic: if !playerName, show setup. 
  // If playerName is set, but not in game... wait for join_game effect to work?
  // Let's sticking to: !playerName ? Setup : Scoreboard.
  const showPlayerSetup = !playerName;

  const handleScoreEdit = useCallback((round: number, newScore: number) => {
    if (!gameId || !playerName) return;
    socket.emit('update_score', { gameId, playerName, score: newScore, round });
  }, [gameId, playerName]);


  return (
    <>
      <h1>Flip 7 Scoring Tool</h1>
      <div style={{ fontSize: '0.8rem', opacity: 0.7, marginBottom: '1rem' }}>
        Status: {isConnected ? <span style={{ color: 'lightgreen' }}>Connected</span> : <span style={{ color: 'red' }}>Disconnected</span>}
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ConfirmModal
        isOpen={showExitConfirm}
        title="Leave Room?"
        message="Leaving will clear your local session. The game continues on the server. Are you sure?"
        onConfirm={() => {
          setGameId('');
          setPlayerName('');
          setShowExitConfirm(false);
        }}
        onCancel={() => setShowExitConfirm(false)}
      />

      <AlertModal
        isOpen={showNotFoundAlert}
        title="Game Not Found"
        message="The game may have ended or the server restarted. Returning to lobby."
        onConfirm={() => setShowNotFoundAlert(false)}
      />

      {!gameId ? (
        <GameLobby onCreateGame={handleCreateGame} onJoinGame={handleJoinGame} />
      ) : showPlayerSetup ? (
        <PlayerSetup onPlayerAdd={handlePlayerAdd} />
      ) : game ? (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <p style={{ margin: 0 }}>Game ID: <strong>{gameId}</strong></p>
            <button
              onClick={() => setShowExitConfirm(true)}
              style={{
                fontSize: '0.8em',
                padding: '4px 8px',
                background: '#333',
                border: '1px solid #555',
                color: '#aaa'
              }}
            >
              Leave Room
            </button>
          </div>
          {/* Only show add score form if "game is playing" (in future) or just always for now */}
          <AddScoreForm round={currentRound} playerName={playerName} onScoreAdd={handleScoreAdd} />
          <Scoreboard players={game.players} currentPlayerName={playerName} onScoreEdit={handleScoreEdit} />
        </>
      ) : (
        <p>Loading game data... (ID: {gameId})</p>
      )}
    </>
  );
}

export default App;

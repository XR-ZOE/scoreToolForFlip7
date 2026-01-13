import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173", // Vite default port
    methods: ["GET", "POST"]
  }
});

// In-memory game state
// Map<gameId, { players: Player[], status: 'lobby'|'playing' }>
const games = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('create_game', (callback) => {
    const gameId = Math.random().toString(36).substring(2, 8).toUpperCase();

    games.set(gameId, {
      players: [],
      status: 'lobby',
      createdAt: Date.now()
    });
    socket.join(gameId);
    callback({ success: true, gameId });
    console.log(`Game created with dummy data: ${gameId}`);
  });

  socket.on('join_game', ({ gameId, playerName }, callback) => {
    // Normalize ID
    const room = gameId?.toUpperCase();

    if (!games.has(room)) {
      callback({ success: false, error: 'Game not found' });
      return;
    }

    const game = games.get(room);
    const existingPlayer = game.players.find(p => p.name === playerName);

    if (!existingPlayer) {
      game.players.push({
        name: playerName,
        scores: [],
        totalScore: 0,
        socketId: socket.id
      });
    } else {
      // Reconnect logic: update socket ID
      existingPlayer.socketId = socket.id;
    }

    socket.join(room);

    // Broadcast updated game state to everyone in the room
    io.to(room).emit('game_update', game);

    callback({ success: true });
    console.log(`Player ${playerName} joined ${room}`);
  });

  socket.on('update_score', ({ gameId, playerName, score, round }) => {
    const room = gameId?.toUpperCase();
    if (!games.has(room)) return;

    const game = games.get(room);
    const player = game.players.find(p => p.name === playerName);

    if (player) {
      // Ensure scores array is large enough
      // Note: round is 1-indexed usually, but let's assume strict array pushing for now
      // or using index. Let's use direct index assignment for robustness if rounds trigger out of order (unlikely but safe)
      // Actually, let's just push for now or replace if specifically looking for round editing.
      // Simple logic: Add score.

      // If the player is modifying a specific round, we might need more logic. 
      // For now, let's assume appending a new round score.
      if (score !== undefined) {
        player.scores[round - 1] = score;
        player.totalScore = player.scores.reduce((a, b) => a + b, 0);
      }

      // Sort players by total score (descending)
      game.players.sort((a, b) => b.totalScore - a.totalScore);

      io.to(room).emit('game_update', game);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = 3001;
httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

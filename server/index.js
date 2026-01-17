import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP for now to avoid breaking inline scripts/styles if any
}));

// Rate Limiting (Prevent DDoS)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

app.use(cors()); // TODO: Restrict origin in production

// Serve static files from the build directory properly
app.use(express.static(path.join(__dirname, '../dist')));

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Allow all origins for simplicity in prod mix, or strict match
    methods: ["GET", "POST"]
  }
});

// Structured Logging Helper
const logEvent = (type, data) => {
  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    event: type,
    ...data
  }));
};

// In-memory game state
// Map<gameId, { players: Player[], status: 'lobby'|'playing', lastActive: number }>
const games = new Map();

// Lazy Cleanup: Runs only when a new game is created
const cleanOldGames = () => {
  const now = Date.now();
  const SIX_HOURS_MS = 6 * 60 * 60 * 1000;

  let deletedCount = 0;
  for (const [id, game] of games.entries()) {
    if (now - game.lastActive > SIX_HOURS_MS) {
      games.delete(id);
      deletedCount++;
    }
  }
  if (deletedCount > 0) {
    logEvent('CLEANUP', { count: deletedCount, message: 'Inactive games removed' });
  }
};

io.on('connection', (socket) => {
  // Try to get IP address (works for proxy setups too if config is right, otherwise falls back)
  const clientIp = socket.handshake.headers['x-forwarded-for'] || socket.handshake.address;
  logEvent('CONNECTION', { socketId: socket.id, ip: clientIp });

  socket.on('create_game', (callback) => {
    // 1. Perform Cleanup (Lazy)
    cleanOldGames();

    // 2. Generate Unique 3-Digit ID
    let gameId;
    let attempts = 0;
    do {
      gameId = Math.floor(Math.random() * 900 + 100).toString(); // 100-999
      attempts++;
    } while (games.has(gameId) && attempts < 100);

    if (games.has(gameId)) {
      callback({ success: false, error: 'Server busy, please try again.' });
      return;
    }

    games.set(gameId, {
      players: [],
      status: 'lobby',
      createdAt: Date.now(),
      lastActive: Date.now()
    });

    socket.join(gameId);
    callback({ success: true, gameId });
    logEvent('GAME_CREATED', { gameId, socketId: socket.id });
  });

  socket.on('join_game', ({ gameId, playerName }, callback) => {
    // Normalize ID
    const room = gameId?.toString(); // Ensure string

    if (!games.has(room)) {
      callback({ success: false, error: 'Game not found' });
      return;
    }

    const game = games.get(room);
    game.lastActive = Date.now(); // Update activity

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
    logEvent('PLAYER_JOIN', { gameId: room, playerName, socketId: socket.id });
  });

  socket.on('update_score', ({ gameId, playerName, score, round }) => {
    const room = gameId?.toString();
    if (!games.has(room)) return;

    const game = games.get(room);
    game.lastActive = Date.now(); // Update activity

    const player = game.players.find(p => p.name === playerName);

    if (player) {
      if (typeof score === 'number') { // Basic validation
        player.scores[round - 1] = score;
        player.totalScore = player.scores.reduce((a, b) => a + b, 0);
      }

      // Sort players by total score (descending)
      game.players.sort((a, b) => b.totalScore - a.totalScore);

      io.to(room).emit('game_update', game);

      logEvent('SCORE_UPDATE', {
        gameId: room,
        playerName,
        round,
        score,
        totalScore: player.totalScore
      });
    }
  });

  socket.on('disconnect', () => {
    logEvent('DISCONNECT', { socketId: socket.id });
  });
});

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  logEvent('SYSTEM', { message: 'Server started', port: PORT });
});

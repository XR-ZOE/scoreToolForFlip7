# Flip 7 Scoring Tool

Here to start a new game: https://scoretoolforflip7.onrender.com

A real-time, digital scoring companion for the **Flip 7** card game. This web application replaces traditional paper scoring, allowing players to join a shared game room, input scores round-by-round, and track the winner with beautiful, automated visualizations.

![Flip 7 Theme](https://via.placeholder.com/800x400?text=Flip+7+Scoring+Tool)

## 🎯 Purpose
The main goal of this project is to enhance the board game experience by providing a seamless, style-matched tool for:
- **Calculating Scores**: Automatically sums up scores across multiple rounds.
- **Ranking Players**: Instantly sorts players by total score with rank icons (Gold/Silver/Bronze).
- **Visualizing Trends**: Displays a dynamic bar chart comparing total scores in real-time.
- **Remote / Shared View**: Using WebSocket technology, everyone's phone or tablet shows the same live scoreboard.

## ✨ Key Features

### 🎮 Real-Time Multiplayer
- **Lobby System**: Create a unique Game ID or join an existing room.
- **Live Updates**: Scores entered by one player update instantly on everyone's screen.
- **Cross-Device**: Works on mobile, tablet, and desktop.

### 📊 Interactive Scoreboard
- **Automated Ranking**: Players are automatically re-ordered based on their total score.
- **Visual Badges**: Top 3 players receive special ranking badges (1st Gold, 2nd Silver, 3rd Bronze).
- **Click-to-Edit**: Made a mistake? Simply click on your score cell to correct it instantly.

### 📈 Smart Visualization
- **Total Score Chart**: A horizontal bar chart visualizes the gap between players.
- **Highlighting**: Your own score bar is highlighted in **Gold**, while others are in **Grey**, making it easy to spot your standing.

### 🎨 Authentic "Flip 7" Aesthetic
- Designed with the official **Retro Pop / Art Deco** style.
- **Color Palette**: Teal background, Cream cards, and vibrant Gold/Red accents.
- **Typography**: Bold, clean fonts matching the game's box art.

## 🛠️ Technology Stack
- **Frontend**: React, TypeScript, Vite
- **Styling**: Vanilla CSS (Custom Theming), Recharts (Visualization), Lucide React (Icons)
- **Backend**: Node.js, Express, Socket.io
- **State Management**: Zustand (Client), In-Memory Map (Server)

## 🚀 How to Run

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```

### Starting the Development Server
This command will start both the **Backend API** (port 3001) and the **Frontend Client** (port 5173).

```bash
npm run dev:all
```

Open your browser and navigate to `http://localhost:5173`.

## 📖 How to Use
1. **Host**: Click **"Create New Game"** to generate a Game ID.
2. **Players**: Enter the **Game ID** and your **Player Name**.
3. **Playing**: After each round of Flip 7, enter your score in the top form.
4. **Winning**: Watch the chart update live! The player with the highest score at the end wins.

---
*Disclaimer: This is a fan-made tool and is not affiliated with the official Flip 7 game publishers.*

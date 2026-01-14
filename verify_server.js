
import { io } from "socket.io-client";

const socket = io("http://localhost:3001");

socket.on("connect", () => {
    console.log("Connected to server");

    socket.emit("create_game", (response) => {
        if (response.success) {
            console.log("Game Created Successfully!");
            console.log("Game ID:", response.gameId);

            // Verification Logic
            const isThreeDigits = /^\d{3}$/.test(response.gameId);
            if (isThreeDigits) {
                console.log("PASS: Game ID is 3 digits.");
            } else {
                console.error("FAIL: Game ID is NOT 3 digits:", response.gameId);
                process.exit(1);
            }

            process.exit(0);
        } else {
            console.error("Failed to create game:", response.error);
            process.exit(1);
        }
    });
});

socket.on("connect_error", (err) => {
    console.log("Connection Error. Ensure server is running via 'npm run server'.");
    // Don't fail immediately, maybe server isn't up yet, but for this managed run we assume we might need to start it.
    // Actually, I cannot easily start the server in background and run this in this environment reliably without using concurrently or multiple commands.
    // I will just rely on the user having the server running or I will try to start it briefly.
    process.exit(1);
});

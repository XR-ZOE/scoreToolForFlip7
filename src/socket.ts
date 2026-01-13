import { io } from "socket.io-client";

// "undefined" means the URL will be computed from the `window.location` object
// In development, we want to point to port 3000 if we are on 5173
// But if we run "dev:all", we are local.
const URL = import.meta.env.PROD ? undefined : 'http://localhost:3001';

export const socket = io(URL, {
    autoConnect: false
});

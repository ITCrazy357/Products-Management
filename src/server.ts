import http from "http";
import { Server as SocketIOServer } from "socket.io";

import dotenv from "dotenv";
import buildApp from "./app.js";

dotenv.config();

const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = buildApp();

const server = http.createServer(app);
const io = new SocketIOServer(server);

// Temporary compatibility with existing socket modules
// (global usage will be removed in later refactor)
(globalThis as unknown as { _io?: SocketIOServer })._io = io;

server.listen(port, () => {
  console.log(`🚀🚀🚀 Server đang chạy tại cổng ${port}`);
});


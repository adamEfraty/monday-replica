import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";

import { loggerService } from "./services/logger.service.js";
import http from "http";
import { boardRoutes } from "./api/board/board.routs.js";
import { userRoutes } from "./api/user/user.routs.js";
import { authRoutes } from "./api/auth/auth.routs.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://127.0.0.1:5173", "http://localhost:5173"],
    credentials: true,
  },
});

//* Socket.IO Events
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

//* App Configuration
app.use(cors({ origin: true, credentials: true })); // TODO: change origin to client url
app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));

// Middleware to emit an event after API response
app.use((req, res, next) => {
  const originalSend = res.send;
  res.send = function (body) {
    // Define specific routes and methods
    const allowedRoutes = [
      { route: "/api/board", methods: ["POST", "PUT", "DELETE"]},
      { route: "/api/user", methods: ["POST", "PUT", "DELETE"] },
      { route: "/api/auth", methods: ["POST", "PUT", "DELETE"] },
    ];

    const isAllowedRoute = allowedRoutes.some(
      ({ route, methods }) =>
        req.originalUrl.startsWith(route) && methods.includes(req.method)
    );

    if (isAllowedRoute) {
      console.log("Emitting API response event for:", req.originalUrl);
      io.emit("api response", {
        method: req.method,
        url: req.originalUrl,
        statusCode: res.statusCode,
        response: body,
      });
    }

    return originalSend.call(this, body);
  };
  next();
});

//* Routes
app.use("/api/board", boardRoutes);
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);

// Open Server
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  loggerService.info("Up and listening to port " + `http://localhost:${PORT}`);
});

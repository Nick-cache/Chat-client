import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "http";

import { lmManager } from "./llmodels/service.js";
import { router as llmodels_router } from "./llmodels/router.js";

const port = 3000;

const httpServer = createServer();
const app = express(httpServer);
const io = new Server(httpServer);

app.use(cors({ origin: ["http://localhost:5173"] }));
app.use(express.json());
app.use(llmodels_router);
app.once("started", async () => {
  await lmManager.init();
});
app.listen(port, () => {
  console.log(`http://localhost:${port}/docs`);
  app.emit("started");
});

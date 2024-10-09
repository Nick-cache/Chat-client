import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import swaggerUi from "swagger-ui-express";

import { lmManager } from "./services.js";
import { chatInputSocketEvents } from "./chats/socket.js";
import { router as chats_router } from "./chats/router.js";
import { router as llmodels_router } from "./llmodels/router.js";
import swaggerFile from "./swagger-output.json" assert { type: "json" };

const port = 3000;

const httpServer = createServer();
const app = express(httpServer);
const io = new Server(httpServer);

app.use(express.json());
app.use(chats_router);
app.use(llmodels_router);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.once("started", async () => {
  await lmManager.init();
});
app.listen(port, () => {
  console.log(`http://localhost:${port}/docs`);
  app.emit("started");
});

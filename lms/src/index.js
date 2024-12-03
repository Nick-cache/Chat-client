import express from "express";
import cors from "cors";
import { createServer } from "http";
import { lmManager } from "./service.js";
import { router as llmodels_router } from "./router.js";
import { appCorsConfig } from "./config.js";
import { socketEventsController } from "./socket.js";
import { ioConfig } from "./config.js";
import { Server } from "socket.io";

const app = express();

const httpServer = createServer(app);
export const io = new Server(httpServer, ioConfig);

httpServer.setMaxListeners(0);
app.setMaxListeners(0);
io.setMaxListeners(0);

io.on("connection", async (socket) => {
  socketEventsController.addAllEvents(socket);
});

app.use(cors(appCorsConfig));
app.use(express.json());
app.use(llmodels_router);
app.once("started", async () => {
  await lmManager.init();
});

httpServer.listen(3000, () => {
  console.log("Started");
  app.emit("started");
});

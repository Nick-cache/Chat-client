import express from "express";
import { router as chats_router } from "./chats/router.js";
import { lmManager } from "./services.js";
import { router as llmodels_router } from "./llmodels/router.js";

const app = express();
const port = 3000;

app.use(express.json());
app.use(chats_router);
app.use(llmodels_router);
app.once("started", async () => {
  await lmManager.init();
});
app.listen(port, () => {
  console.log(`http://localhost:${port}`);
  app.emit("started");
});

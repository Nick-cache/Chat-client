import express from "express";
import router from "./router.js";
import { lmManager } from "./services.js";

const app = express();
const port = 3000;

app.use(express.json());
app.use(router);
app.once("started", async () => {
  await lmManager.init();
});
app.listen(port, () => {
  console.log(`http://localhost:${port}`);
  app.emit("started");
});

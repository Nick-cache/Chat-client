import express from "express";
import router from "./router.js";
import { lmManager } from "./services.js";
import { router as llmodel_router } from "./llmodels/router.js";
const app = express();
const port = 3000;

app.use(express.json());
app.use(router);
app.use(llmodel_router);
app.once("started", async () => {
  await lmManager.init();
});
app.listen(port, () => {
  console.log(`http://localhost:${port}`);
  app.emit("started");
});

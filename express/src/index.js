import express from "express";
import { router as chats_router } from "./chats/router.js";
import { lmManager } from "./services.js";
import { router as llmodels_router } from "./llmodels/router.js";
import swaggerUi from "swagger-ui-express";
import swaggerFile from "./swagger-output.json" assert { type: "json" };

const app = express();
const port = 3000;

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

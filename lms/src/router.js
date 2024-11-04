import express from "express";
import { lmManager } from "./service.js";
import { modelsInputSocketEvents, modelsOutputSocketEvents } from "./events.js";

export const router = express.Router();

router.get("/list_models", async (req, res) => {
  return res.json(lmManager.models);
});

router.get("/list_loaded_models", async (req, res) => {
  return res.json(lmManager.loaded_models);
});

// request body: { path: str, ident: str, contentLength: num }
router.post("/load_model", async (req, res) => {
  const path = req.body.path;
  if (lmManager.models[path] === undefined)
    return res.status(404).json("Wrong path");

  const contentLength = Number(req.body.contentLength);
  let ident = req.body.ident;

  const controller = new AbortController();

  const onProgress = (progress) => {
    req.socket.emit(modelsOutputSocketEvents.loadStream, progress);
  };

  req.socket.addListener(modelsInputSocketEvents.loadStop, () => {
    controller.abort();
    req.socket.emit("close");
  });

  ident = await lmManager.load(
    path,
    ident,
    contentLength,
    controller,
    onProgress
  );
  return res.json(`Loaded with identifier: ${ident}`);
});

// request body: { ident: str }
router.post("/unload_model", async (req, res) => {
  const ident = req.body.ident;
  if (lmManager.loaded_models[ident] === undefiend)
    return res.status(404).json("Wrong identifier");

  await lmManager.unload(ident);
  return res.json(`Unloaded ${ident}`);
});

// request body: {history: [messages], promt: message}
router.post("/:ident/stream", async (req, res) => {
  const ident = req.params.ident;
  const model = lmManager.loaded_models[ident];
  if (model === undefined) return res.status(404).json("Wrong identifier");

  const date = new Date().toJSON().slice(0, -1);
  const history = req.body.history;
  const promt = req.body.promt;

  const stream = model.respond([...history, promt]);

  let stopped = false;
  req.socket.addListener(modelsInputSocketEvents.messageStop, async () => {
    await stream.cancel();
    stopped = true;
    req.socket.emit("close");
  });

  for await (const data of stream) {
    req.socket.emit(modelsOutputSocketEvents.messageStream, data);
  }

  const response = {
    role: "assistant",
    content: stream.content.slice(9),
    date: date,
    stopped: stopped,
  };

  return res.json(response);
});

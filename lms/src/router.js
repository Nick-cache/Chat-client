import express from "express";
import { lmManager } from "./service.js";
import { modelsInputSocketEvents, modelsOutputSocketEvents } from "./events.js";

export const router = express.Router();

router.get("/list_models", async (req, res) => {
  return res.json(lmManager.models);
});

router.get("/list_loaded_models", async (req, res) => {
  const data = Object.values(lmManager.loaded_models).map((model) => {
    return {
      path: model.path,
      ident: model.identifier,
    };
  });
  return res.json(data);
});

// request body: { path: str, ident: str }
router.post("/load_model", async (req, res) => {
  const path = req.body.path;
  if (lmManager.models[path] === undefined)
    return res.status(422).json("Wrong path");

  let ident = req.body.ident;
  let contextLength = Number(req.body.contextLength);

  const controller = new AbortController();

  const onProgress = (progress) => {
    req.socket.emit(modelsOutputSocketEvents.loadStream, progress);
  };

  req.socket.addListener(modelsInputSocketEvents.loadStop, () => {
    controller.abort();
    req.socket.emit("close");
  });

  try {
    ident = await lmManager.load(
      path,
      ident,
      contextLength,
      controller,
      onProgress
    );
    return res.json(`Loaded with identifier: ${ident}`);
  } catch (error) {
    return res.status(400).json(`An error occurred ${error}`);
  }
});

// request body: { ident: str }
router.post("/unload_model", async (req, res) => {
  const ident = req.body.ident;

  if (lmManager.loaded_models[ident] === undefined)
    return res.status(422).json("Wrong identifier");

  try {
    await lmManager.unload(ident);
  } catch (error) {
    return res.status(400).json(`An error occurred ${error}`);
  }
  return res.json(`Unloaded ${ident}`);
});

// request body: {history: [messages], promt: message}
router.post("/:ident/stream", async (req, res) => {
  const ident = req.params.ident;
  const model = lmManager.loaded_models[ident];
  if (model === undefined) return res.status(422).json("Wrong identifier");

  const date = new Date().toJSON().slice(0, -1);
  const history = req.body.history;
  const promt = req.body.promt;

  try {
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
  } catch (error) {
    return res.status(400).json(`An error occurred ${error}`);
  }
});

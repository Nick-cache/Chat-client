import express from "express";
import { lmManager, chatApi } from "./service.js";
import { modelSocketEvents, messageSocketEvents } from "./events.js";
import { emitSocketEvent, socketEventsController } from "./socket.js";

export const router = express.Router();

router.get("/list_models", async (req, res) => {
  return res.json(lmManager.models);
});

router.get("/list_loaded_models", async (req, res) => {
  const data = Object.values(lmManager.loaded_models).map((model) => {
    return {
      path: model.api.path,
      formatedPath: model.formatedPath,
      ident: model.api.identifier,
      contextLength: model.contextLength,
    };
  });
  return res.json(data);
});

router.post("/load_model", async (req, res) => {
  const path = req.body.path;
  const modelInfo = lmManager.models[path];
  if (modelInfo === undefined) return res.status(422).json("Wrong path");

  const requestedIdent = req.body.ident;
  const contextLength = Number(req.body.contextLength);
  const GPULayers = Number(req.body.GPULayers);

  const controller = new AbortController();
  const controllerHandler = () => {
    controller.abort();
  };

  await socketEventsController.addEventToAll(
    modelSocketEvents.loadStop(requestedIdent || modelInfo.formatedPath),
    controllerHandler
  );

  const onProgress = (progress) => {
    if (!controller.signal.aborted) {
      const formated = (progress * 100).toFixed(1);
      emitSocketEvent(modelSocketEvents.loadStream, {
        ident: requestedIdent || modelInfo.formatedPath,
        state: formated,
      });
    }
  };

  try {
    const ident = await lmManager.load(
      modelInfo.path,
      requestedIdent,
      contextLength,
      GPULayers,
      controller,
      onProgress
    );
    emitSocketEvent(
      modelSocketEvents.loadEnd,
      requestedIdent || modelInfo.formatedPath
    );
    await socketEventsController.removeEventFromAll(
      modelSocketEvents.loadStop(requestedIdent || modelInfo.formatedPath),
      controllerHandler
    );
    return res.json(`Loaded with identifier: ${ident}`);
  } catch (error) {
    if (error.name === "AbortError") {
      emitSocketEvent(
        modelSocketEvents.loadEnd,
        requestedIdent || modelInfo.formatedPath
      );
      return res.status(200).json("Stopped");
    }
    return res.status(400).json(`An error occurred ${error}`);
  }
});

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

router.post("/:ident/stream", async (req, res) => {
  const ident = req.params.ident;
  const model = lmManager.loaded_models[ident];
  if (model === undefined) return res.status(422).json("Wrong identifier");

  const chat_uuid = req.body.chat_uuid;
  const history = req.body.history;
  const promt = req.body.promt;

  if (!(chat_uuid && history && promt))
    return res.status(422).json("Unavailable entity");

  const date = new Date().toJSON().slice(0, -1);

  try {
    const stream = model.api.respond([...history, promt]);

    let stopped = false;
    const messageStreamStopHandler = () => {
      stream.cancel();
      stopped = true;
      emitSocketEvent("close");
    };

    await socketEventsController.addEventToAll(
      messageSocketEvents.messageStop(chat_uuid),
      messageStreamStopHandler
    );

    emitSocketEvent(messageSocketEvents.messageStreamStart(chat_uuid));
    let content = "";
    for await (const data of stream) {
      content = content + data;
      emitSocketEvent(messageSocketEvents.messageStream(chat_uuid), content);
    }

    emitSocketEvent(messageSocketEvents.messageStop(chat_uuid));
    await chatApi.addMessage(
      "assistant",
      content,
      date,
      chat_uuid,
      stopped,
      stream.stats.predictedTokensCount
    );
    await socketEventsController.removeEventFromAll(
      messageSocketEvents.messageStop(chat_uuid),
      messageStreamStopHandler
    );
  } catch (error) {
    console.log(error);

    return res.status(400).json(`An error occurred ${error}`);
  }
  return res.status(200).json("Resolved");
});

router.post("/:ident/resume", async (req, res) => {
  const ident = req.params.ident;
  const model = lmManager.loaded_models[ident];
  if (model === undefined) return res.status(422).json("Wrong identifier");

  const history = req.body.history;
  const chat_uuid = req.body.chat_uuid;

  if (!(history && chat_uuid))
    return res.status(422).json("Unavailable entity");

  const uuid = history[history.length - 1].uuid;
  const startContent = history[history.length - 1].content;
  try {
    const stream = model.api.respond(history);

    let stopped = false;
    const messageResumeStopHandler = () => {
      stream.cancel();
      stopped = true;
      emitSocketEvent("close");
    };

    await socketEventsController.addEventToAll(
      messageSocketEvents.messageResumeStop(chat_uuid, uuid),
      messageResumeStopHandler
    );

    let content = startContent;
    for await (const data of stream) {
      content = content + data;
      emitSocketEvent(
        messageSocketEvents.messageResumeStream(chat_uuid, uuid),
        content
      );
    }

    emitSocketEvent(messageSocketEvents.messageResumeStop(chat_uuid, uuid));
    await chatApi.updateMessage(
      uuid,
      content,
      stopped,
      stream.stats.predictedTokensCount
    );
    await socketEventsController.removeEventFromAll(
      messageSocketEvents.messageResumeStop(chat_uuid, uuid),
      messageResumeStopHandler
    );
  } catch (error) {
    console.log(error);

    return res.status(400).json(`An error occurred ${error}`);
  }
  return res.status(200).json("Resolved");
});

router.post("/:ident/tokenize", async (req, res) => {
  const ident = req.params.ident;
  const model = lmManager.loaded_models[ident];
  if (model === undefined) return res.status(422).json("Wrong identifier");

  try {
    const content = req.body.content;
    const tokens = await model.api.unstable_countTokens(content);

    return res.status(200).json({ tokens: tokens });
  } catch (error) {
    return res.status(400).json(`An error occurred ${error}`);
  }
});

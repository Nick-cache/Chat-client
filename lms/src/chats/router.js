import express from "express";
import { lmManager } from "../llmodels/services.js";
import { chatWebApi } from "./services.js";
import { Chat } from "./models.js";
import { v4 as uuidv4 } from "uuid";
import { chatInputSocketEvents, chatOutputSocketEvents } from "./events.js";

export const router = express.Router();

// request body: { name: str, ident: str }
router.post("/create_chat", async (req, res) => {
  const name = req.body.name;
  const ident = req.body.ident;

  const model = await lmManager.loaded_models[ident];
  if (model === undefined)
    return res.status(404).json("No model loaded with this identifier");

  const uuid = uuidv4();
  const chat = new Chat(uuid, name, model, ident);
  await chatWebApi.save_chat(chat.requestBody); // ! ?
  lmManager.chats[uuid] = chat;
  return res.json(chat);
});

// request body: name: str
router.put("/chat/:uuid/change_name", async (req, res) => {
  const uuid = req.params.uuid;
  const chat = lmManager.chats[uuid];
  if (chat === undefined) return res.status(404).json("Wrong uuid");

  const name = req.body.name;
  chat.changeName(name);
  await chatWebApi.update_chat_name(uuid, name); // ! ?
  return res.status(200).json("OK");
});

// request body: ident: str
router.put("/chat/:uuid/change_model", async (req, res) => {
  const uuid = req.params.uuid;
  const chat = lmManager.chats[uuid];
  if (chat === undefined) return res.status(404).json("Wrong uuid");

  const ident = req.body.ident;
  const model = lmManager.loaded_models[ident];
  if (model === undefined) return res.status(404).json("Wrong identificator");

  chat.changeModel(model, ident);
  return res.status(200).json("OK");
});

// request body: messages: [{ role: str, content: str }]
router.post("/chat/:uuid/respond", async (req, res) => {
  const uuid = req.params.uuid;
  const chat = lmManager.chats[uuid];
  if (chat === undefined) return res.status(404).json("Wrong uuid");

  const messages = req.body.messages; // [{message}]

  let stream = chat.stream(messages);
  let isStopped = false;
  req.socket.addListener(chatInputSocketEvents.messageStop, async () => {
    await stream.cancel();
    isStopped = true;
    req.socket.emit("close");
  });

  let content;
  for await (const data of stream) {
    req.socket.emit(chatOutputSocketEvents.chatStream, data);
    content = content + data;
  }

  const responseBody = chat.toMessageSchema(
    "assistant",
    content.slice(9),
    isStopped
  );

  return res.status(200).json(responseBody);
});

// request body:  messages: [{ role: str, content: str }]
//                resume: { role: "assistant", content: str }
router.put("/chat/:uuid/resume", async (req, res) => {
  const uuid = req.params.uuid;
  const chat = lmManager.chats[uuid];
  if (chat === undefined) return res.status(404).json("Wrong uuid");

  const messages = req.body.messages; // [{message}]
  const resume = req.body.resume; // {message}

  let stream = chat.stream([...messages, resume]);
  let isStopped = false;
  req.socket.addListener(chatInputSocketEvents.messageStop, async () => {
    await stream.cancel();
    isStopped = true;
    req.socket.emit("close");
  });

  let content;
  for await (const data of stream) {
    req.socket.emit(chatOutputSocketEvents.chatStream, data);
    content = content + data;
  }

  const responseBody = {
    ...resume,
    content: resume.content + content.slice(9),
    stopped: isStopped,
  };

  await chatWebApi.update_mesages([responseBody]); // ! ?
  return res.status(200).json("OK");
});

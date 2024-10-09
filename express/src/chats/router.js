import express from "express";
import { lmManager } from "../services.js";
import { chatWebApi } from "./services.js";
import { Chat } from "./models.js";
import { v4 as uuidv4 } from "uuid";
import { chatInputSocketEvents, chatOutputSocketEvents } from "./socket.js";

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
  await chatWebApi.save_chat(chat.requestBody);
  lmManager.chats[uuid] = chat;
  return res.json(chat);
});

// message: { role: str, content: str }
// ! Need to add Redis call
router.post("/chat/:uuid/respond", async (req, res) => {
  const uuid = req.params.uuid;
  const chat = lmManager.chats[uuid];
  if (chat === undefined) return res.status(404).json("Wrong uuid");
  const history = await chatWebApi.get_messages(uuid);

  const promt = req.body.promt;
  const promt_date = new Date().toJSON().slice(0, -1);

  let isStopped = false;
  req.socket.addListener(chatInputSocketEvents.messageStop, () => {
    chat.model.stop();
    isStopped = true;
    req.socket.emit("close");
  });

  let content;
  let stream = chat.stream([promt, ...history.data]);
  for await (const data of stream) {
    req.socket.emit(chatOutputSocketEvents.chatStream, data);
    content = content + data;
  }

  const promtBody = chat.toMessageSchema(
    promt.role,
    promt.content,
    false,
    promt_date
  );
  const responseBody = chat.toMessageSchema(
    "assistant",
    content.slice(9),
    isStopped
  );

  await chatWebApi.add_messages([promtBody, responseBody]);
  return res.status(200).json("OK");
});

router.post("/chat/:uuid/resume", async (req, res) => {
  const uuid = req.params.uuid;
  const chat = lmManager.chats[uuid];
  if (chat === undefined) return res.status(404).json("Wrong uuid");
  const history = await chatWebApi.get_messages(uuid);

  let isStopped = false;
  req.socket.addListener(chatInputSocketEvents.messageStop, () => {
    chat.model.stop();
    isStopped = true;
    req.socket.emit("close");
  });

  let content;
  let stream = chat.stream(history.data);
  for await (const data of stream) {
    req.socket.emit(chatOutputSocketEvents.chatStream, data);
    content = content + data;
  }

  const responseBody = chat.toMessageSchema(
    "assistant",
    content.slice(9),
    isStopped
  );

  await chatWebApi.add_messages([promtBody, responseBody]);
  return res.status(200).json("OK");
});

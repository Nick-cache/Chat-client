import express from "express";
import { lmManager } from "../services.js";

export const router = express.Router();

// request body: { name: str, ident: str }
router.post("/create_chat", async (req, res) => {
  const name = req.body.name;
  const ident = req.body.ident;
  let model = await lmManager.loaded_models[ident];
  if (model === undefined)
    return res.status(404).json("No model loaded with this identifier");
  const chat = lmManager.createChat(name, model, ident);
  return res.json(chat);
});

// request body: {messages: [message,message,...]}
// message: { role: str, content: str }
router.post("/chat/:uuid", async (req, res) => {
  const chat_uuid = req.params.uuid;
  const messages = req.body.messages;
  const chat = lmManager.chats[chat_uuid];
  let stream = chat.stream(messages);
  for await (const data of stream) {
    console.log(data);
  }
  return res.json(stream);
});

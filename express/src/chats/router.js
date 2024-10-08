import express from "express";
import { lmManager } from "../services.js";
import { chatWebApi } from "./services.js";
import { Chat } from "./models.js";
import { v4 as uuidv4 } from "uuid";

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
router.post("/chat/:uuid", async (req, res) => {
  const uuid = req.params.uuid;
  const promt = req.body.promt;
  const chat = lmManager.chats[uuid];
  const promt_date = new Date().toJSON().slice(0, -5);

  if (chat === undefined) return res.status(404).json("Wrong uuid");
  const history = await chatWebApi.get_messages(uuid);
  let content;
  let stream = chat.stream([promt, ...history.data]);
  for await (const data of stream) {
    // There should be another ws stream which throws data to front - end
    content = content + data;
  }
  const promtBody = chat.toMessageSchema(promt.role, promt.content, promt_date);
  const predictionBody = chat.toMessageSchema("assistant", content.slice(9));
  await chatWebApi.add_messages([promtBody, predictionBody]);
  return res.json({ content: content, stream: stream });
});

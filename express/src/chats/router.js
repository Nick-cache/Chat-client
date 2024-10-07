import express from "express";
import { v4 as uuidv4 } from "uuid";
import { lmManager } from "../services.js";
import { chatWebApi } from "./services.js";
import { Chat } from "./models.js";


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
  await chatWebApi.save_chat(chat.requestBody)
  lmManager.chats[uuid] = chat;
  return res.json(chat);
});

// message: { role: str, content: str }
router.post("/chat/:uuid", async (req, res) => {
  const uuid = req.params.uuid;
  const message = req.body.message;
  const chat = lmManager.chats[uuid];
  if (chat === undefined) return res.status(404).json("Wrong uuid")
    // ! Need to add Redis call
  const request_date = new Date().toJSON().slice(0, -5);
  const response = await chatWebApi.get_messages(uuid)
  let stream = chat.stream([message, ...response.data]);
  let content
  for await (const data of stream) {
    // There should be another ws stream which throws data to front - end
    if (data !== "undefined") content = content + data
  }
  // After success stream, should throw [message] to backend
  // ! Need to add Redis call
  await chatWebApi.add_messages(
    [
      {
        uuid: uuidv4(),
        role: message.role,
        content: message.content,
        tokens: stream.stats.promptTokensCount,
        date: request_date,
        chat_uuid: uuid,
      },
      {
        uuid: uuidv4(),
        role: "assistant",
        content: content,
        tokens: stream.stats.predictedTokensCount,
        date: new Date().toJSON().slice(0, -5),
        chat_uuid: uuid,
      }
    ]
  )
  return res.json({content: content, stream: stream});
});

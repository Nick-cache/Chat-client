import express from "express";
import { lmManager } from "../services.js";

export const router = express.Router();

// request body: { name: str, ident: str }
router.post("/create_chat", async (req, res) => {
  const name = req.body.name;
  const ident = req.body.ident;
  const model = lmManager.loaded_models[ident];
  lmManager.createChat(name, model, ident);
});

import express from "express";
import { lmManager } from "../services.js";

export const router = express.Router();

router.get("/list_models", async (req, res) => {
  return res.json(lmManager.models);
});

router.get("/list_loaded_models", async (req, res) => {
  const models = {
    Llms: lmManager.loaded_llms,
    Embeddings: lmManager.loaded_embeddings,
  };
  return res.json(models);
});

// request body: { path: str, type: str, ident: str }
router.post("/load_model", async (req, res) => {
  const path = req.body.path;
  const type = req.body.type;
  const ident = req.body.ident;
  await lmManager.load(path, type, ident);
  return res.json(`Loaded with identifier: ${ident}`);
});

// request body: { type: str, ident: str }
router.post("/unload_model", async (req, res) => {
  const type = req.body.type;
  const ident = req.body.ident;
  await lmManager.unload(type, ident);
  return res.json(`Unloaded ${ident}`);
});

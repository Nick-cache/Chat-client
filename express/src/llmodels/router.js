import express from "express";
import { lmManager } from "../services.js";

export const router = express.Router();

router.get("/list_models", async (req, res) => {
  return res.json(lmManager.models);
});

router.get("/list_loaded_models", async (req, res) => {
  return res.json(lmManager.loaded_models);
});

// request body: { path: str, ident: str }
router.post("/load_model", async (req, res) => {
  const path = req.body.path;
  const ident = req.body.ident;
  if (lmManager.loaded_models[ident] !== undefined) {
    return res.json(`Already loaded with ident: ${ident}`);
  }
  await lmManager.load(path, ident);
  return res.json(`Loaded with ident: ${ident}`);
});

// request body: { ident: str }
router.post("/unload_model", async (req, res) => {
  const ident = req.body.ident;
  if (lmManager.loaded_models[ident] === undefined)
    return res.json(`Unloaded ${ident}`);
  await lmManager.unload(ident);
  return res.json(`Unloaded ${ident}`);
});

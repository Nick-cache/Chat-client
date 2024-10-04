import express from "express";
import { lmManager } from "./services.js";
const router = express.Router();

router.get("/list_models", async (req, res) => {
  const models = await lmManager.getListModels();
  return res.status(200).json(models);
});

// request body: { path: str, ident: str }
router.post("/load_model", async (req, res) => {
  const path = req.body.path;
  let ident = req.body.ident;
  if (lmManager.loaded_models[ident] !== undefined) {
    return res.json(`Loaded with ident: ${ident}`);
  }
  await lmManager.load(path, ident);
  return res.json(`Loaded with ident: ${ident}`);
});

// request body: { name: str, ident: str }
router.post("/create_chat", async (req, res) => {
  const name = req.body.name;
  const ident = req.body.ident;

  lmManager.createChat();
});

export default router;

// kurvabober!@123sdawdacdsvaw
// huianusprivet123
// jioduz@heduu.com

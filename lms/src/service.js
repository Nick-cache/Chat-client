import SDK from "@lmstudio/sdk";
import axios from "axios";
import { BACKEND_SERVICE, LMS_HOST, LMS_PORT } from "./config.js";

const { LMStudioClient } = SDK;

class HuggingFace {
  constructor() {
    this.client = axios.create({
      baseURL: "https://huggingface.co",
    });
  }

  getBaseModelPath = async (path) => {
    const res = await this.client.get(`/api/models/${path}`);
    return res.data.cardData.base_model;
  };

  getModelConfig = async (path) => {
    const res = await this.client.get(`/${path}/raw/main/config.json`);
    const data = {
      contextLength: res.data.max_position_embeddings,
      GPULayers: res.data.num_hidden_layers,
    };
    return data;
  };

  getModelInfo = async (path) => {
    const baseModelPath = await this.getBaseModelPath(path);
    return await this.getModelConfig(baseModelPath);
  };
}

class LmManager {
  constructor() {
    this.client = new LMStudioClient({
      baseUrl: `ws://${LMS_HOST}:${LMS_PORT}`,
    });
    this.huggingFace = new HuggingFace();
    this.models = {}; // { path: Model }
    this.loaded_models = {}; // ident : model
  }

  _fillLoadedModels = async () => {
    const models = await this.client.llm.listLoaded();
    for await (const model of models) {
      const formatedPath = /\b.*\//g.exec(model.path)[0].slice(0, -1);
      const res = await this.client.llm.get({
        identifier: model.identifier,
      });
      const contextLength = await res.unstable_getContextLength();
      const data = {
        api: res,
        formatedPath: formatedPath,
        contextLength: contextLength,
      };
      this.loaded_models[model.identifier] = data;
    }
  };

  _fillDownloadedModels = async () => {
    const models = await this.client.system.listDownloadedModels();

    const added = models.map(async (model) => {
      if (model.type !== "llm") return null;
      const formatedPath = /\b.*\//g.exec(model.path)[0].slice(0, -1);

      let data = { ...model, formatedPath: formatedPath };
      try {
        data = {
          ...data,
          ...(await this.huggingFace.getModelInfo(formatedPath)),
        };
      } catch (error) {
        if (error.response.status === 401) {
          return null;
        }
      }
      return data;
    });

    for await (const model of added) {
      if (model !== null) this.models[model.formatedPath] = model;
    }
  };

  init = async () => {
    await this._fillDownloadedModels();
    await this._fillLoadedModels();
  };

  load = async (
    path,
    ident,
    contextLength,
    GPULayers,
    controller,
    onProgress
  ) => {
    const model = await this.client.llm.load(path, {
      identifier: ident,
      config: {
        contextLength: contextLength,
        tryMmap: true,
        gpuOffload: {
          ratio: GPULayers,
          mainGpu: 1,
          tensorSplit: [1, 0],
        },
      },
      signal: controller.signal,
      verbose: true,
      onProgress: onProgress,
    });
    const formatedPath = /\b.*\//g.exec(model.path)[0].slice(0, -1);
    const data = {
      api: model,
      formatedPath: formatedPath,
      contextLength: contextLength,
    };
    this.loaded_models[model.identifier] = data;
    return model.identifier;
  };

  unload = async (ident) => {
    await this.client.llm.unload(ident);
    delete this.loaded_models[ident];
  };
}

export const lmManager = new LmManager();

class ChatApi {
  constructor() {
    this.client = axios.create({
      baseURL: `${BACKEND_SERVICE}/chats`,
    });
  }

  addMessage = async (role, content, date, chat_uuid, stopped, tokens) => {
    const message = {
      role: role,
      content: content,
      date: date,
      chat_uuid: chat_uuid,
      stopped: stopped,
      tokens: tokens,
    };
    const res = await this.client.put("/add_message", message);
  };

  updateMessage = async (uuid, content, stopped, tokens) => {
    const message = {
      uuid: uuid,
      content: content,
      stopped: stopped,
      tokens: tokens,
    };
    await this.client.put("/update_message", message);
  };
}

export const chatApi = new ChatApi();

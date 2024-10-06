import SDK from "@lmstudio/sdk";
const { LMStudioClient } = SDK;
import { v4 as uuidv4 } from "uuid";
import { Chat } from "./chats/models.js";

class LmManager {
  client = new LMStudioClient();
  constructor() {
    this.models = {}; // { path: Model }
    this.llm = {}; // ident : model
    this.embedding = {}; // ident : model
    this.chats = {}; // c_uuid : chat
    // this.projects = {}; // p_uuid : project
  }

  get loaded_models() {
    return {
      ...this.llm,
      ...this.embedding,
    };
  }

  _fillLoadedLlms = async () => {
    const models = await this.client.llm.listLoaded();
    for await (const model of models) {
      this.llm[model.identifier] = await this.client.llm.get({
        identifier: model.identifier,
      });
    }
  };

  _fillLoadedEmbeddings = async () => {
    const models = await this.client.embedding.listLoaded();
    for await (const model of models) {
      this.embedding[model.identifier] = await this.client.embedding.get({
        identifier: model.identifier,
      });
    }
  };

  _fillDownloadedModels = async () => {
    const models = await this.client.system.listDownloadedModels();
    for await (const model of models) {
      this.models[model.path] = model;
    }
  };

  init = async () => {
    await this._fillDownloadedModels();
    await this._fillLoadedLlms();
    await this._fillLoadedEmbeddings();
  };

  load = async (path, type, ident, contextLength) => {
    const model = await this.client[type].load(path, {
      identifier: ident,
      config: {
        contextLength: contextLength,
        gpuOffload: {
          ratio: 1,
          mainGpu: 1,
          tensorSplit: [1, 0],
        },
      },
    });
    this[type][model.identifier] = model;
    return model.identifier;
  };

  unload = async (type, ident) => {
    if (this[type][ident] !== undefined) {
      await this.client[type].unload(ident);
      delete this[type][ident];
    }
  };

  createChat = (name, model, model_ident, project_uuid = null) => {
    const uuid = uuidv4();
    const chat = new Chat(uuid, name, model, model_ident, project_uuid);

    this.chats[uuid] = chat;
    return chat;
  };
}

export const lmManager = new LmManager();

// This class should describe default socket interface
// Will be emmited in Chat namespace
// class SocketInteraction {}

// Helper function which creates namespace and init SocketInteraction
// function create_namespace() {}
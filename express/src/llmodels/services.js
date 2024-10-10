import { modelsInputSocketEvents, modelsOutputSocketEvents } from "./events.js";
import SDK from "@lmstudio/sdk";
const { LMStudioClient } = SDK;

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
      const res = await this.client.llm.get({
        identifier: model.identifier,
      });
      this.llm[model.identifier] = res;
    }
  };

  _fillLoadedEmbeddings = async () => {
    const models = await this.client.embedding.listLoaded();
    for await (const model of models) {
      const res = await this.client.embedding.get({
        identifier: model.identifier,
      });
      this.embedding[model.identifier] = res;
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

  load = async (path, type, ident, contextLength, socket) => {
    const ac = new AbortController();
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
      signal: ac.signal,
      verbose: false,
      onProgress: (progress) => {
        socket.emit(modelsOutputSocketEvents.loadStream, progress);
      },
    });
    socket.addListener(modelsInputSocketEvents.loadStop, () => {
      ac.abort();
      socket.emit("close");
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
}

export const lmManager = new LmManager();

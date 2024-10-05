import SDK from "@lmstudio/sdk";
const { LMStudioClient } = SDK;
import { v4 as uuidv4 } from "uuid";
import { Chat } from "./models.js";

class LmManager {
  client = new LMStudioClient();

  constructor() {
    this.models = {}; // { path: Model }
    this.loaded_models = {}; // ident : [model, info]
    // this.projects = {}; // p_uuid : project
    this.chats = {}; // c_uuid : chat
  }

  _fillLoadedModels = async () => {
    const models = await this.client.embedding.listLoaded();

    for await (const model of models) {
      this.loaded_models[model.identifier] = await this.client.embedding.get({
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
    await this._fillLoadedModels();
  };

  load = async (path, ident) => {
    const model = await this.client.llm.load(path, {
      identifier: ident,
      config: {
        gpuOffload: {
          ratio: 1,
          mainGpu: 1,
          tensorSplit: [1, 0],
        },
      },
    });
    this.loaded_models[ident] = model;

    return model;
  };

  unload = async (ident) => {
    await this.client.llm.unload(ident);
    delete this.loaded_models[ident];
  };

  createChat = (name, model, model_ident, model_info, project_uuid = null) => {
    const uuid = uuidv4();
    const chat = new Chat(
      uuid,
      name,
      model,
      model_ident,
      model_info,
      project_uuid
    );
    this.chats[uuid] = chat;
    return chat;
  };
}

export const lmManager = new LmManager();

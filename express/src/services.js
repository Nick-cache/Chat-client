import { LMStudioClient } from "@lmstudio/sdk";
import { v4 as uuidv4 } from "uuid";
import { Chat } from "./models";

class LmManager {
  client = new LMStudioClient();

  constructor() {
    this.models = []; // list[str]
    this.loaded_models = {}; // ident : [model, info]
    this.projects = {}; // p_uuid : project
    this.chats = {}; // c_uuid : chat
  }

  getListModels = async () => {
    if (this.models.length !== 0) return this.models;
    const models = await this.client.system.listDownloadedModels();
    this.models = models;
    return models;
  };

  load = async (path, ident) => {
    const model = await this.client.llm.load(path, {
      config: {
        gpuOffload: {
          ratio: 1,
          // mainGpu: 1,
          // tensorSplit: [1, 0],
        },
        identifier: ident,
      },
    });
    const info = await model.getModelInfo();
    model.this.loaded_models[ident] = [model, info];
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

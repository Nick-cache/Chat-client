import SDK from "@lmstudio/sdk";
const { LMStudioClient } = SDK;

const lmsHost = process.env.LMS_LOCAL_HOST;
const lmsPort = process.env.LMS_LOCAL_PORT;

class LmManager {
  client = new LMStudioClient({
    baseUrl: `ws://${lmsHost}:${lmsPort}`,
  });
  constructor() {
    this.models = {}; // { path: Model }
    this.loaded_models = {}; // ident : model
  }

  _fillLoadedModels = async () => {
    const models = await this.client.llm.listLoaded();
    for await (const model of models) {
      const res = await this.client.llm.get({
        identifier: model.identifier,
      });
      this.loaded_models[model.identifier] = res;
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

  load = async (path, ident, contextLength, controller, onProgress) => {
    const model = await this.client.llm.load(path, {
      identifier: ident,
      config: {
        contextLength: contextLength,
        gpuOffload: {
          ratio: 1,
          mainGpu: 1,
          tensorSplit: [1, 0],
        },
      },
      signal: controller.signal,
      verbose: false,
      onProgress: onProgress,
    });

    this.loaded_models[model.identifier] = model;
    return model.identifier;
  };

  unload = async (ident) => {
    if (this.loaded_models[ident] !== undefined) {
      await this.client.llm.unload(ident);
      delete this.loaded_models[ident];
    }
  };
}

export const lmManager = new LmManager();

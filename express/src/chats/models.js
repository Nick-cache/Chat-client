import { v4 as uuidv4 } from "uuid";

export class Chat {
  constructor(uuid, name, model, model_ident, project_uuid = null) {
    this.uuid = uuid; // str
    this.name = name; // str
    this.model = model; // model
    this.model_ident = model_ident; // str
    this.project_uuid = project_uuid; // str
    this.tokens = 0;
  }

  get requestBody() {
    return {
      uuid: this.uuid,
      name: this.name,
      tokens: this.tokens,
      project_uuid: this.project_uuid,
    };
  }

  toMessageSchema = (
    role,
    content,
    stopped,
    date = new Date().toJSON().slice(0, -1)
  ) => {
    return {
      uuid: uuidv4(),
      role: role,
      content: content,
      date: date,
      chat_uuid: this.uuid,
      stopped: stopped,
    };
  };

  changeName = (name) => {
    this.name = name;
  };

  changeModel = (model, model_ident) => {
    this.model = model;
    this.model_ident = model_ident;
  };

  stream = (messages, opts = null) => {
    return this.model.respond(messages, opts);
  };

  // addMessage = async () => {
  //   OrmAdd
  //   RedisAdd
  // }

  // getHistory = async () => {
  //   RedisGet or OrmGet
  // }
}

import {ChatApi} from "./services.js"

export class Message {
  constructor(uuid, content, chat_uuid, date, tokens, role) {
    this.aborted = false;
    this.uuid = uuid;
    this.role = role;
    this.content = content;
    this.chat_uuid = chat_uuid;
    this.date = date;
    this.tokens = tokens;
    this.requestBody = {
      uuid: this.uuid,
      role: this.role,
      content: this.content,
      tokens: this.tokens,
      date: this.date,
      chat_uuid: this.chat_uuid,
    };
  }
}

export class Chat {
  constructor(
    uuid,
    name,
    model,
    model_ident,
    project_uuid,
    api_uri,
    headers,
  ) {
    this.uuid = uuid; // str
    this.name = name; // str
    this.model = model; // model
    this.model_ident = model_ident; // str
    this.project_uuid = project_uuid; // str
    this.messages = {}; // {uuid: Message}
    this.tokens = 0;
    this.api = new ChatApi(uuid, api_uri, headers)
  }

  requestBody = () => {
    return {
      uuid: this.uuid,
      name: this.name,
      tokens: this.tokens,
      messages: this.messages.values().map((message) => message.requestBody),
      project_uuid: this.project_uuid,
    };
  };

  changeName = (name) => {
    this.name = name;
  };

  changeModel = (model, model_ident) => {
    this.model = model;
    this.model_ident = model_ident;
  };

  // returns Promise<ws>
  stream = (messages) => {
    return this.model.respond(messages);
  };

  // addMessage = async () => {
  //   OrmAdd
  //   RedisAdd
  // }

  // getHistory = async () => {
  //   RedisGet or OrmGet
  // }
}

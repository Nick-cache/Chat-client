export class Message {
  constructor(uuid, role, content, chat_uuid) {
    this.uuid = uuid;
    this.role = role;
    this.content = content;
    this.chat_uuid = chat_uuid;
  }
}

export class LoadedModel {
  constructor(model, ident) {
    this.model = model;
    this.ident = ident;
  }
}

export class Model {
  constructor(path, info) {
    this.path = path;
    this.info = info;
  }
}

export class Chat {
  constructor(uuid, name, model, model_ident, model_info, project_uuid) {
    this.uuid = uuid; // str
    this.name = name; // str
    this.model = model; // model
    this.model_ident = model_ident; // str
    this.model_info = model_info; // str
    this.project_uuid = project_uuid; // str
    this.history = {}; // {uuid: Message}
  }

  changeModel = (model, model_ident, model_info) => {
    this.model = model;
    this.model_ident = model_ident;
    this.model_info = model_info;
  };

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

class Project {
  constructor(uuid, name, chat) {
    this.uuid = uuid; // str (uuid)
    this.name = name; // str
    this.chat = chat; // chat
    this.structure = []; // [File]
  }
}

class File {
  constructor(name, content, path, project_uuid) {
    this.name = name;
    this.content = content;
    this.path = path;
    this.project_uuid = project_uuid;
  }
}

// createProject = (name, model, model_ident, model_info) => {
//   const project_uuid = uuidv4();
//   const chat = this.createChat(
//     `${name} Chat`,
//     model,
//     model_ident,
//     model_info,
//     project_uuid
//   );
//   const project = new ProjectManager(project_uuid, name, chat);
//   this.projects[uuid] = project;
//   return project;
// };

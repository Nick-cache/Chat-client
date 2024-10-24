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

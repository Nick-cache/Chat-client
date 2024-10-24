import axios from "axios";

class ChatWebApi {
  constructor(uri, headers = null) {
    this.instance = axios.create({
      baseURL: uri,
      headers: headers,
    });
  }

  save_chat = async (chat) => {
    return await this.instance.post("/create_chat", chat);
  };

  update_chat_name = async (uuid, name) => {
    await this.instance.put(`/${uuid}`, { name: name });
  };

  get_messages = async (uuid) => {
    return await this.instance.get(`/${uuid}/messages`);
  };

  add_messages = async (messages) => {
    await this.instance.put("/add_messages", messages);
  };

  update_mesages = async (messages) => {
    return await this.instance.put("/update_messages", messages);
  };
}

export const chatWebApi = new ChatWebApi("http://localhost:8000/chats");

import axios from "axios";

class ChatWebApi {
  constructor(uri, headers = null) {
    this.instance = axios.create({
      baseURL: uri,
      headers: headers,
    });
  }

  save_chat = async (data) => {
    return await this.instance.post("/create_chat", data);
  };

  add_messages = async (messages) => {
    await this.instance.put("/add_messages", messages);
  };

  get_messages = async (uuid) => {
    return await this.instance.get(`/${uuid}/messages`);
  };
}

export const chatWebApi = new ChatWebApi("http://localhost:8000/chats");

import axios from "axios";

export class ChatApi {
    constructor(uuid, uri, headers=null) {
        this.instance = axios.create({
            baseURL: uri,
            headers: headers,
          })
        this.uuid = uuid
    }

    save_chat = async (data) => {
        return await this.instance.post("/save_chat", data)
    }

    add_messages = async (messages) => {
        await this.instance.put("/add_messages", messages) 
    }

    get_messages = async () => {
        return await this.instance.get(`/${this.uuid}/messages`)
    }
}

import { io } from "./index.js";

export const emitSocketEvent = (event, data) => {
  io.emit(event, data);
};

class SocketEventsController {
  constructor() {
    this.events = {};
  }

  async getSockets() {
    return await io.fetchSockets();
  }

  getAll() {
    return Object.entries(this.events);
  }

  get(event) {
    return this.events[event];
  }

  add(event, callback) {
    this.events[event] = callback;
  }

  remove(event) {
    const callback = this.get(event);
    if (callback !== undefined) {
      delete this.events[event];
    }
  }

  addEvent(socket, event, callback) {
    this.add(event, callback);
    socket.on(event, callback);
  }

  addAllEvents(socket) {
    for (const [event, callback] of this.getAll()) {
      socket.on(event, callback);
    }
  }

  async addEventToAll(event, callback) {
    this.add(event, callback);
    const sockets = await this.getSockets();
    for (const socket of sockets) {
      socket.on(event, callback);
    }
  }

  async addEventsToAll() {
    const sockets = await this.getSockets();
    for (const socket of sockets) {
      for (const [event, callback] of this.getAll()) {
        socket.on(event, callback);
      }
    }
  }

  removeEvent(socket, event) {
    const callback = this.get(event);
    if (callback !== undefined) {
      socket.off(event, callback);
    }
  }

  removeAllEvents(socket) {
    for (const [event, callback] of this.getAll()) {
      socket.off(event, callback);
    }
  }

  async removeEventFromAll(event) {
    const callback = this.get(event);
    if (callback !== undefined) {
      const sockets = await this.getSockets();
      for (const socket of sockets) {
        socket.off(event, callback);
      }
      this.remove(event);
    }
  }

  async removeEventsFromAll() {
    const sockets = await this.getSockets();
    for (const socket of sockets) {
      for (const [event, callback] of this.getAll()) {
        socket.off(event, callback);
        this.remove(event);
      }
    }
  }
}

export const socketEventsController = new SocketEventsController();

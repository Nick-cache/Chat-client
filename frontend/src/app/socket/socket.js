import { io } from "socket.io-client";
import { LMS_SOCKET } from "../config";

export const socket = io(LMS_SOCKET);

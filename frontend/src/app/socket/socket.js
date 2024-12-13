import { io } from "socket.io-client";
import { lms_socket } from "../config";

export const socket = io(lms_socket);

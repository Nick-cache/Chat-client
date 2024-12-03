export const modelSocketEvents = {
  loadStream: "loadStream",
  loadStop: (ident) => `loadStop:${ident}`,
  loadEnd: "loadEnd",
};

export const messageSocketEvents = {
  messageStreamStart: (chat_uuid) => `messageStreamStart:${chat_uuid}`,
  messageStream: (chat_uuid) => `messageStream:${chat_uuid}`,
  messageStop: (chat_uuid) => `messageStop:${chat_uuid}`,
  messageResumeStream: (chat_uuid, message_uuid) =>
    `messageResumeStream:${chat_uuid}:${message_uuid}`,
  messageResumeStop: (chat_uuid, message_uuid) =>
    `messageResumeStop:${chat_uuid}:${message_uuid}`,
};

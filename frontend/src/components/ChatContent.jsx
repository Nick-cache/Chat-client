import Message from "./Message";
import { useParams } from "react-router-dom";
import { useGetMessagesQuery } from "../app/features/chats/chatsSlice";
import { useState, useEffect } from "react";
import { socket } from "../app/socket/socket";
import { messageSocketEvents } from "../app/socket/events";
import CodeSnippet from "./CodeSnippet.jsx";

const ChatContent = ({setCurrentContext}) => {
  const {uuid} = useParams()

  const renderer = {
    code: CodeSnippet
  };

  const {
    data,
    isSuccess,
  } = useGetMessagesQuery(uuid)

  const [messages, setMessages] = useState([])
  
  useEffect(() => {
    if (isSuccess) {
      const entities = Object.values(data?.entities)
      setMessages(entities)
      setCurrentContext(entities.reduce((acc, message) => message.tokens + acc, 0))
    }
  }, [data])
  
  const [streamMessage, setStreamMessage] = useState(undefined)
  
  const [updatedMessages, setUpdatedMessages] = useState(messages)

  const messageStreamStartHandler = () => {
    setUpdatedMessages([...messages, streamMessage])
  }

  const messageStreamHandler = (data) => {
    setStreamMessage({
      role: "assistant",
      content: data
    })
  }

  const messageStopHandler = () => {
    setStreamMessage(undefined)
  }
  
  useEffect(() => {
    setUpdatedMessages([...messages, streamMessage])
  }, [streamMessage, messages])

  useEffect(() => {
    socket.on(messageSocketEvents.messageStreamStart(uuid), messageStreamStartHandler)
    
    socket.on(messageSocketEvents.messageStream(uuid), messageStreamHandler)

    socket.on(messageSocketEvents.messageStop(uuid), messageStopHandler)

    return () => {
      socket.off(messageSocketEvents.messageStreamStart(uuid), messageStreamStartHandler)
      socket.off(messageSocketEvents.messageStream(uuid), messageStreamHandler)
      socket.off(messageSocketEvents.messageStop(uuid), messageStopHandler)
    }
  })
  
  return (
    <>
      <ul className="w-[100%] px-4 pt-4 bg-gradient-to-r from-black/60 h-[100%] bg-transparent text-pretty text-lg tracking-tight scrollbar-invise">
        {isSuccess && updatedMessages.map((message, index) => (
          <Message key={message?.uuid || "streaming"} message={message} renderer={renderer} index={index} />
        ))}
      </ul>
    </>
  );
};

export default ChatContent;

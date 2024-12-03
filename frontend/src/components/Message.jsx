import { useState, useEffect, useRef } from "react";
import { useDeleteMessageMutation, useUpdateMessageMutation, useGetMessages } from "../app/features/chats/chatsSlice";
import { useTokenizeMutation, useResumeMutation } from "../app/features/lms/lmsSlice";
import { getChosenModelSelector } from "../app/features/lms/lmsSlice";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { messageSocketEvents } from "../app/socket/events";
import {socket} from "../app/socket/socket"

import Markdown from "marked-react"

const Message = ({ message, renderer, index }) => {
  const {uuid} = useParams()
  const chosenModel = useSelector(getChosenModelSelector)
  const [deleteMessage] = useDeleteMessageMutation()
  const [content, setContent] = useState("")
  
  const [deletion, setDeletion] = useState(false)
  const [edit, setEdit] = useState(false)
  const [resumed, setResumed] = useState(false)

  const [tokenize] = useTokenizeMutation()
  const [updateMessage] = useUpdateMessageMutation()
  const [updatedContent, setUpdatedContent] = useState("")
  const textareaRef = useRef(null)

  const isEditMessageHandler = () => {
    setEdit(!edit)
    if (!edit) {
      return setUpdatedContent(content)
    }
    setUpdatedContent(updatedContent + " ")
  }

  const submitEditionHandler = (uuid, stopped, content) => {
    const inner = async () => {
      setEdit(!edit)
      const res = await tokenize({ident: chosenModel?.ident, content})
      await updateMessage({uuid, content, stopped, tokens: res.data.tokens})
    }
    return inner
  }
 
  const deleteMessageHandler = (uuid) => {
    const inner = async () => {
      setDeletion(!deletion)
      await deleteMessage([uuid])
    }
    return inner
  }

  const copyMessageHandler = (content) => {
    const inner = () => {
      navigator.clipboard.writeText(content)
    }
    return inner
  }

  const messages = useGetMessages(uuid)
  
  let history
  const [resume] = useResumeMutation()
  if (messages?.data?.entities) history = Object.values(messages?.data?.entities)
  const resumeMessageHandler = () => {
    const inner = async () => {
      try {
        let historySlice
        if (index === 0) historySlice = history[0]
        if (index === history.length) historySlice = history
        historySlice = history.slice(0, index + 1)
        setResumed(true)
        await resume({ident: chosenModel?.ident, history: historySlice, chat_uuid: uuid})
      } catch (error) {
        console.log(error);
      }
      setResumed(false)
    }
    return inner
  }

  const resumeStreamHandler = (data) => {
    setContent(data)
  }
  
  useEffect(() => {
    socket.on(messageSocketEvents.messageResumeStream(uuid, message?.uuid), resumeStreamHandler)

    return () => {
      socket.off(messageSocketEvents.messageResumeStream(uuid, message?.uuid), resumeStreamHandler)
    }
  })

  useEffect(() => {
    setContent(message?.content)
    setUpdatedContent(message?.content + " ")
  }, [message])

  useEffect(() => {
    if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }
    }, [updatedContent]);
  
  return (
    <>
      {message && <li className={`${message?.role === "user" ? "border-emerald-200" : "border-blue-200"} ${deletion ? "hidden" : ""} container border-l-2 my-10 w-[70%] mx-auto`}>
        <div className={`flex flex-row justify-between border-b-2 ${message?.role === "user" ? "border-emerald-200" : "border-blue-200"}`}>
          <h1 className={`text-xl basis-9/12 pl-2 ${message?.role === "user" ? "text-emerald-200" : "text-blue-200"}`}>{message?.role}</h1>
          <div className="basis-3/12 justify-end flex container p-0 static basis-auto">
            {message?.stopped && <span disabled={resumed || !chosenModel ? true : false} className="p-0 mr-4 cursor-pointer" onClick={resumed || !chosenModel ? undefined : resumeMessageHandler()}><svg className="h-7 w-7 text-emerald-500/30 hover:text-emerald-500/90" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/> <path d="M18 15l-6-6l-6 6h12" transform="rotate(90 12 12)" /></svg></span>}
            <span className="p-0 mr-4 cursor-pointer" onClick={copyMessageHandler(content)}><svg className="h-6 w-6 text-orange-500/30 hover:text-orange-500/90" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/></svg></span>
            <span disabled={resumed || !chosenModel ? true : false} className="p-0 mr-4 cursor-pointer" onClick={resumed || !chosenModel ? undefined : isEditMessageHandler }><svg className="h-6 w-6 text-blue-500/30 hover:text-blue-500/90" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z"/><path d="M9 7 h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3" /><path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3" /><line x1="16" y1="5" x2="19" y2="8" /></svg></span>
            <span className="p-0 ml-12 cursor-pointer" onClick={deleteMessageHandler(message?.uuid)}><svg className="h-6 w-6 text-red-500/30 hover:text-red-500/90" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z"/><line x1="4" y1="7" x2="20" y2="7" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg></span>
          </div>
        </div>
        <div key={message?.uuid || "streaming"} className={`p-4 items-center text-xs text-start text-gray-400 bg-gradient-to-t ${message?.role === "user" ? "from-green-700/10" : "from-blue-700/10"}`}>
          {!edit && <Markdown value={content} renderer={renderer} />}
          <span className={`${!edit ? "hidden" : ""}`}>
            <div className="flex justify-end">
              <span onClick={submitEditionHandler(message?.uuid, message?.stopped, updatedContent)}><svg className="h-4 w-4 text-green-500/30 hover:text-green-500/90 cursor-pointer" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span>
              <span className="ml-4" onClick={isEditMessageHandler}><svg className="h-4 w-4 text-red-500/30 hover:text-red-500/90 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg></span>
            </div>
            <textarea ref={textareaRef} className="bg-transparent w-[100%] text-start text-gray-100 caret-pink-500 outline-none text-xs scrollbar-invise m-0 p-2"
            onChange={(event) => setUpdatedContent(event.target.value)}
            value={updatedContent} />
          </span>
        </div>
      </li>}
    </>
  );
};

export default Message;

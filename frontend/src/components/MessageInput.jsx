import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetMessages, useAddMessageMutation, useCreateChatMutation } from "../app/features/chats/chatsSlice";
import { getChosenModelSelector } from "../app/features/lms/lmsSlice";
import { useSelector } from "react-redux";
import { useStreamMutation, useTokenizeMutation } from "../app/features/lms/lmsSlice";
import { socket } from "../app/socket/socket";
import { messageSocketEvents } from "../app/socket/events";
import { selectChatById } from "../app/features/chats/chatsSlice";

const MessageInput = () => {
  const {uuid} = useParams()
  const [promt, setPromt] = useState("")
  const [pending, setPending] = useState(false)
  const navigate = useNavigate()
  const chat = useSelector(state => selectChatById(state, uuid))
  const [createChat] = useCreateChatMutation()
  const [tokenize] = useTokenizeMutation()
  const [stream] = useStreamMutation()
  const [addMessage] = useAddMessageMutation()
  const messages = useGetMessages(uuid)

  const chosenModel = useSelector(getChosenModelSelector)

  const promtChangeHandler = (value) => {
    setPromt(value)
  }

  const promtSendHandler = async () => {
    let chat_uuid
    if (promt === "" || /^\s+$/g.exec(promt) !== null) return
    if (uuid === undefined || chat === undefined) {
      const res = await createChat({name: "new chat"})
      chat_uuid = res.data.uuid
    } else {
      chat_uuid = uuid
    }
    navigate(`/${chat_uuid}`)
    const parsed = {
      role: "user",
      content: promt,
      date: new Date().toJSON().slice(0, -1),
      chat_uuid: chat_uuid,
      stopped: false
    };
    try {
      const res = await tokenize({ident: chosenModel.ident, content: promt})
      parsed.tokens = res.data.tokens
    } catch (error) {
      return error
    }
    let history
    if (messages?.data?.entities)
    history = Object.values(messages.data.entities)
    else history = []
    setPromt("")
    try {
      setPending(true)
      await addMessage(parsed)
      await stream({
        ident: chosenModel.ident,
        history: history,
        promt: parsed,
        chat_uuid: chat_uuid
      })
    } catch (error) {
      console.log(error);
    }
    setPending(false)
  }

  const streamStopHandler = () => {
    socket.emit(messageSocketEvents.messageStop(uuid))
    setPending(false)
  }

  return (<>
    <textarea
      disabled={(chosenModel && !pending) ? false : true}
      value={promt}
      onChange={(event) => promtChangeHandler(event.target.value)}
      placeholder={chosenModel ? "Enter promt here..." : "Please select model"}
      className="ml-8 border-teal-600 border-x-2 bg-transparent h-[45px] w-[50%] text-center text-emerald-100 caret-pink-500 outline-none font-bold text-md scrollbar-invise m-0 p-2 resize-none"
    />
    <button type="button" className="ml-4 mb-20 font-bold text-5xl border-teal-600/90 cursor-pointer" onClick={pending ? streamStopHandler : promtSendHandler}>{!pending && <svg className="h-10 w-10 text-emerald-500/30 hover:text-emerald-500/90"  width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <path d="M18 15l-6-6l-6 6h12" transform="rotate(90 12 12)" /></svg>}
    {pending && <svg className="h-7 w-7 text-red-500/30 hover:text-red-500/90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"> <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /></svg>}</button>
  </>);
};

export default MessageInput;

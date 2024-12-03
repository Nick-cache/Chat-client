import ChatContent from "./ChatContent";
import MessageInput from "./MessageInput";
import ModelsSelector from "./ModelsSelector";
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectChatById, selectAllChats, useGetAllChatsQuery, useChangeChatNameMutation, useCreateChatMutation, useDeleteChatMutation } from "../app/features/chats/chatsSlice";
import { getChosenModelSelector, useListModelsQuery, useListLoadedModelsQuery, selectAllLoadedModels } from "../app/features/lms/lmsSlice";
import { removeChosenModel } from "../app/features/lms/lmsSlice";

const MainArea = () => {
  useListModelsQuery()
  const {isSuccess: isLoadedModels} = useListLoadedModelsQuery()
  const dispatch = useDispatch()
  const navigate = useNavigate()

	const models = useSelector(selectAllLoadedModels)
  const chosenModel = useSelector(getChosenModelSelector)
  if (isLoadedModels) {
    const isModel = models.find(model => model?.ident === chosenModel?.ident)
    if (!isModel ) dispatch(removeChosenModel())
  }

  const chats = useSelector(selectAllChats)

  const {
    isSuccess,
    isError,
    error,
  } = useGetAllChatsQuery()
  const {uuid} = useParams()
  
  const chat = useSelector((state) => selectChatById(state, uuid))
  const [changeChatName] = useChangeChatNameMutation()
  const [chatName, setChatName] = useState(chat?.name)
  const [currentContext, setCurrentContext] = useState(0)
  const [editName, setEditName] = useState(false)
  const [updatedName, setUpdatedName] = useState("")
  
  const isEditNameHandler = () => {
    setEditName(!editName)
  }
  
  const [hideTab, setHideTab] = useState(true)
  
  const [createChat] = useCreateChatMutation()
  const createChatHandler = () => {
    const inner = async () => {
      try {
        const res = await createChat({name: "new chat"})
        if (chats.length === 0) {
          navigate(`/${res.data.uuid}`)
          setHideTab(true)
        }
      } catch (error) {
        console.log(error);
      }
    }
    return inner
  }

  const hideTabHandler = () => {
    setHideTab(!hideTab)
  }

  const changeChatNameHandler = async () => {
    setChatName(updatedName)
    setEditName(!editName)
    await changeChatName({uuid, name: updatedName})
  }

  const declineChatNameHandler = () => {
    setUpdatedName(chatName)
    setEditName(!editName)
  }

  useEffect(() => {
    setChatName(chat?.name)
    setUpdatedName(chat?.name)
  }, [chat])

  const [deleteChat] = useDeleteChatMutation()

  const deleteChatHandler = (deletetion_uuid) => {
    const inner = async () => {
      await deleteChat(deletetion_uuid)
      if (uuid === deletetion_uuid) {
        navigate("/")
      }
    }
    return inner
  }

  return (<>
  <div className="w-[100%] h-[100%]">
  <div className={`fixed inset-0 h-[100%] flex justify-start bg-black/80 z-10 ${hideTab && "hidden"}`} onClick={hideTabHandler}>
    <div className="w-[70%] flex ">
      <div className="pt-4 h-[95%] w-[40%] text-emerald-200 scrollbar-invise">
        {isSuccess && <ul 
        onClick={(e) => e.stopPropagation()}>
          {chats.map((chat) => (
          <span key={chat.uuid} className="flex justify-between w-[60%]" >
            <Link to={`/${chat.uuid}`} >
              <li className="text-start ml-2 border-teal-600/90 border-l-2 pl-2 mb-2 truncate ... hover:border-amber-300 cursor-pointer" onClick={hideTabHandler}>
                {chat.name}
              </li>
            </Link>
            <span className="cursor-pointer" onClick={deleteChatHandler(chat.uuid)}><svg className="h-4 w-4 text-red-500/30 hover:text-red-500/90" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z"/><line x1="4" y1="7" x2="20" y2="7" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg></span>
          </span>))}
        </ul>}
          {isError && <p className="text-red-200">{error.status}</p>}
      </div>
      <p className="pr-2 text-left text-emerald-300/80 cursor-pointer hover:text-amber-300 text-4xl" onClick={createChatHandler()}>{"+"}</p>
    </div>
  </div>
    <span className="p-2 fixed text-emerald-200 h-[15%] w-[15%]">
      {chat && <>
        <div className="flex justify-between">
          <span className="flex truncate ... text-emerald-100 text-md">
            <>
              {editName && <>
                <input className="bg-transparent w-[80%] text-center text-emerald-100 caret-pink-500 text-xs outline-none" type="text" placeholder={chatName} value={updatedName} onChange={(event) => setUpdatedName(event.target.value)} />
                  <span onClick={changeChatNameHandler}>
                    <svg className="h-3 w-3 text-green-500/30 hover:text-green-500/90 cursor-pointer" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  </span>
                  <span className="ml-2" onClick={declineChatNameHandler}>
                    <svg className="h-3 w-3 text-red-500/30 hover:text-red-500/90 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                  </span>
              </>}
              {!editName && <>
                {chatName}
                <span onClick={isEditNameHandler}>
                  <svg className="h-3 w-3 text-blue-500/30 hover:text-blue-500/90 cursor-pointer" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z"/><path d="M9 7 h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3" /><path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3" /><line x1="16" y1="5" x2="19" y2="8" /></svg>
                </span>
              </>}
            </>
          </span>
          <p className={`text-left text-emerald-300/80 cursor-pointer hover:text-amber-300 text-xl ${!hideTab && "text-transparent"}`}
          onClick={hideTabHandler}
          >{">"}</p>
        </div>
          <span className="text-blue-300 text-xs">mT: {chosenModel ? chosenModel.contextLength : "no model selected"}</span>
          <div className="flex text-start truncate ...">
            <span className="text-xs text-blue-200">cT: {currentContext}</span>
          </div>
          <div className="text-xs text-start truncate ...">{chat.uuid}</div>
          <span className="cursor-pointer" onClick={deleteChatHandler(chat.uuid)}><svg className="h-4 w-4 text-red-500/30 hover:text-red-500/90" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z"/><line x1="4" y1="7" x2="20" y2="7" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg></span>
      </>}
      {!chat && <span className="text-emerald-200/80 font-bold text-lg hover:text-amber-400 cursor-pointer" onClick={hideTabHandler}>
        Chats
      </span>}
    </span>
    <div className="flex h-[85%]">
      <ChatContent setCurrentContext={setCurrentContext} chat={chat}/>
    </div>
    <div className="flex mb-20 bg-gradient-to-r pt-4 from-black/60">
      <ModelsSelector />
      <MessageInput />
    </div>
  </div>
  </>
  );
};

export default MainArea;

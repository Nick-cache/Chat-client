import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import {  getChosenModelSelector } from "../app/features/lms/lmsSlice";
import ModelListsPopup from "./ModelsListPopup";

const ModelsSelector = () => {
  const model = useSelector(getChosenModelSelector)
  
  const [modelContent, setModelContent] = useState(model)
  const [showPopup, setShowPopup] = useState(false);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };
  
  useEffect(() => {
    setModelContent(model === null ? false : model)
  }, [model])


  return (<>
    {showPopup && <ModelListsPopup togglePopup={togglePopup} />}
    <div className="p-2 pl-4 cursor-pointer w-[20%] text-emerald-200/80 hover:text-amber-400 flex justify-items-start text-left ... text-md mb-8" onClick={togglePopup}>
      {modelContent && <p className="font-bold truncate ...">{modelContent.ident}</p>}
      {!modelContent && <p className="font-bold truncate ...">Select Model</p>}
    </div>
   </>)
}

export default ModelsSelector

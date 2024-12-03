import DownloadedModelsList from "./DownloadedModelsList";
import LoadedModelsList from "./LoadedModelsList";
import ModelLoadPopup from "./ModelLoadPopup"
import { useEffect, useState } from "react";
import { modelSocketEvents } from "../app/socket/events";
import { socket } from "../app/socket/socket";

const ModelListsPopup = ({ togglePopup }) => {
	const [showPopup, setShowPopup] = useState(false)
  const [model, setModel] = useState(null)

  const toggleLoadPopup = () => {
    setShowPopup(!showPopup)
  }

  const [currentlyLoading, setCurrentlyLoading] = useState({})

  const LoadingModelsHandler = (data) => {
    const {ident, state} = data
    const updated = {...currentlyLoading, [ident]: state}
    setCurrentlyLoading(updated)
  }

  const LoadingEndedHandler = (ident) => {
    const {[ident]: _, ...rest} = currentlyLoading
    setCurrentlyLoading(rest)
  }

  const LoadingStopHandler = (ident) => {
    socket.emit(modelSocketEvents.loadStop(ident))
  }

  useEffect(() => {
      socket.on(modelSocketEvents.loadStream, LoadingModelsHandler)
      socket.on(modelSocketEvents.loadEnd, LoadingEndedHandler)

      return () => {
        socket.off(modelSocketEvents.loadStream, LoadingModelsHandler)
        socket.off(modelSocketEvents.loadEnd, LoadingEndedHandler)
      }
  })

  return (
    <div
      className="fixed inset-0 h-[100%] flex items-center justify-center bg-black/90 z-10"
      onClick={togglePopup}
    >
      <div
        className="p-8 w-[70%] h-[90%] mx-auto border-t-2 border-teal-600/20"
        onClick={(e) => e.stopPropagation()}
      >
        {!showPopup && <>
          <div className="h-[40%]">
            <LoadedModelsList togglePopup={togglePopup} currentlyLoading={currentlyLoading} LoadingStopHandler={LoadingStopHandler}/>
          </div>
          <div className="h-[40%]">
            <DownloadedModelsList toggleLoadPopup={toggleLoadPopup} setModel={setModel}/>
          </div>
        </>}
        {showPopup && <ModelLoadPopup togglePopup={toggleLoadPopup} model={model} />}
      </div>
    </div>
  );
};

export default ModelListsPopup;

import { useListLoadedModelsQuery, useListModelsQuery} from "../app/features/lms/lmsSlice";
import { selectAllLoadedModels, selectAllModels } from "../app/features/lms/lmsSlice";
import ModelsList from "./ModelsList";
import ModelLoadPopup from "./ModelLoadPopup"
import { useState } from "react";

const ModelListsPopup = ({ togglePopup }) => {
	const [showPopup, setShowPopup] = useState(false)
  const [model, setModel] = useState(null)

  const toggleLoadPopup = () => {
    setShowPopup(!showPopup)
  }

  return (
    <div
      className="fixed inset-0 h-[100%] flex items-center justify-center bg-black/80 z-10"
      onClick={togglePopup}
    >
      <div
        className="p-8 w-[70%] h-[90%] mx-auto border-t-2 border-teal-600/20"
        onClick={(e) => e.stopPropagation()}
      >
        {!showPopup && <>
          <div className="h-[40%]">
            <ModelsList tag={"Currently Loadded"} selector={selectAllLoadedModels} query={useListLoadedModelsQuery} togglePopup={togglePopup} toggleLoadPopup={undefined} setModelPath={undefined} />
          </div>
          <div className="h-[40%]">
            <ModelsList tag={"Availible Models"} selector={selectAllModels} query={useListModelsQuery} togglePopup={togglePopup} toggleLoadPopup={toggleLoadPopup} setModel={setModel}/>
          </div>
        </>}
        {showPopup && <ModelLoadPopup togglePopup={toggleLoadPopup} model={model} />}
      </div>
    </div>
  );
};

export default ModelListsPopup;

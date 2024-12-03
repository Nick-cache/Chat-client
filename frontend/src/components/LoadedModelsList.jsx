import { useUnloadModelMutation, chooseModel, removeChosenModel, getChosenModelSelector } from "../app/features/lms/lmsSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectAllLoadedModels } from "../app/features/lms/lmsSlice";


const LoadedModelsList = ({togglePopup, currentlyLoading, LoadingStopHandler}) => {
	const dispatch = useDispatch()
  	const chosenModel = useSelector(getChosenModelSelector)
	  
	const models = useSelector(selectAllLoadedModels)
	
	const [unloadModel] = useUnloadModelMutation()

	const chooseModelhandler = (ident, path, contextLength) => {
		const inner = () => {
			dispatch(chooseModel({ident: ident, path: path, contextLength: contextLength}))
			togglePopup()
		}
		return inner
	}

	const unLoadModeHandler = async (event, ident) => {
		event.stopPropagation()
		if (chosenModel !== null && chosenModel.ident === ident) {
			dispatch(removeChosenModel())
		}
		try {
			await unloadModel(ident)
		} catch (error) {
			console.log(error);
		}
	}

	return (
	<div className="mx-auto h-[65%] w-[85%] mt-2">
		<h2 className="text-yellow-200 text-left ...">Loaded Models ({models.length})</h2>
		<div className="scrollbar-invise h-[100%]">
			<ul className="">
            {Object.entries(currentlyLoading).map((model) => (
                <li key={model[0]} >
                    <span className="flex justify-beetwen text-beetwen">
                        <span className="text-gray-300/80 font-bold pl-2 mb-4 border-l-4 rounded border-gray-600/60 text-sm w-[95%] truncate ... text-start ">{model[0]}
                            <span className="ml-2 mb-4 text-blue-200 text-xs">{model[1]} %</span>
                        </span>
                    <span className="mx-auto font-bold text-md z-20 text-gray-300/80 rounded px-2 cursor-pointer hover:text-rose-400/80" onClick={() => LoadingStopHandler(model[0])}>Stop</span>
                    </span>
                </li>
            ))}
            {models.map((model) => (
                <li
                key={model.ident}
                onClick={chooseModelhandler(model.ident, model.path, model.contextLength)}
                className={`text-emerald-300/80 cursor-pointer border-l-4 rounded border-teal-600/90 pl-2 mb-4 ${((chosenModel === null || chosenModel.ident !== model.ident) || chosenModel.path !== model.path) && "hover:border-amber-300"}`}
                >
                    <span className="flex justify-beetwen text-beetwen">
                        <span className={`font-bold text-lg mx-auto w-[95%] truncate ... text-start ${((chosenModel !== null && chosenModel.ident === model.ident) && chosenModel.path === model.path) ? "text-blue-600" : "text-emerald-100"}`}>{model.ident}
						<span className="ml-2 text-xs text-emerald-300">Context: {model.contextLength}</span>
                        </span>
                        <span className="mx-auto font-bold text-xl z-20 hover:text-blue-500 text-emerald-300/80 rounded px-2" onClick={(event) => unLoadModeHandler(event, model.ident)}>Eject</span>
                    </span>
                    {(model.ident !== model.path) && <span className="text-xs text-emerald-300/80 truncate ...">{model.formatedPath}</span>}
                </li>
            ))}
			</ul>
		</div>
	</div>)
}

export default LoadedModelsList

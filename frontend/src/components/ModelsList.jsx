import { useUnloadModelMutation, chooseModel, removeChosenModel, getChosenModelSelector } from "../app/features/lms/lmsSlice";
import { useDispatch, useSelector } from "react-redux";

const ModelsList = ({tag, selector, query, togglePopup, toggleLoadPopup, setModel}) => {
	const dispatch = useDispatch()

  const chosenModel = useSelector(getChosenModelSelector)
	const models = useSelector(selector)
	
	const {
	isSuccess,
    isError,
    error,
  } = query()

	const [unloadModel] = useUnloadModelMutation()

	const chooseModelhandler = (ident, path) => {
			const inner = () => {
					dispatch(chooseModel({ident: ident, path: path}))
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

	const loadModelhandler = (model) => {
		const inner = () => {
			setModel(model)
			toggleLoadPopup()
		}
		return inner
	} 

	return (
	<div className="mx-auto h-[65%] w-[85%] mt-2">
		<h2 className="text-yellow-200 text-left ...">{tag} ({models.length})</h2>
		<div className="scrollbar-invise h-[100%]">
			{isSuccess && <ul className="">
				{models.map((model) => (
						<li
						key={model.ident || model.path}
						onClick={!model.ident ? loadModelhandler(model) : chooseModelhandler(model.ident, model.formatedPath)}
						className="border-teal-600/90 border-l-4 pl-2 rounded mb-4 text-emerald-300/80 cursor-pointer hover:border-amber-300"
						>
							{model.ident && <>
							<span className="flex justify-beetwen text-beetwen">
								<span className="font-bold text-lg mx-auto text-emerald-100 w-[95%] truncate ... text-start">{model.ident}
								</span>
								<span className="mx-auto font-bold text-xl z-20 hover:text-blue-500 text-emerald-300/80 rounded px-2" onClick={(event) => unLoadModeHandler(event, model.ident)}>Eject</span>
							</span></>}
							<div className="font-bold flex-col w-[95%] text-start truncate ...">
								<span>{model.formatedPath}</span>
							</div>
						</li>
				))}
			</ul>}
			{isError && <p>{error}</p>}
		</div>
	</div>)
}

export default ModelsList

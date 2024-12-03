import { useSelector } from "react-redux";
import { selectAllModels, useListModelsQuery } from "../app/features/lms/lmsSlice";

const DownloadedModelsList = ({toggleLoadPopup, setModel}) => {
	const models = useSelector(selectAllModels)

	const {
		isSuccess,
		isError,
		error,
  	} = useListModelsQuery()

	const loadModelhandler = (model) => {
		const inner = () => {
			setModel(model)
			toggleLoadPopup()
		}
		return inner
	}

	return (
	<div className="mx-auto h-[65%] w-[85%] mt-2">
		<h2 className="text-yellow-200 text-left ...">Downloaded Models ({models.length})</h2>
		<div className="scrollbar-invise h-[100%]">
			{isError && <p className="text-red-400">{error.status}</p>}
			{isSuccess && <ul className="">
			{models.map((model) => (
				<li
				key={model.path}
				onClick={loadModelhandler(model)}
				className=" text-emerald-300/80 cursor-pointer "
				>
					<div className="pl-2 mb-4 border-l-4 rounded border-teal-600/90 font-bold flex-col w-[95%] hover:border-amber-300 text-start truncate ...">
						<span>{model.formatedPath}</span>
					</div>
				</li>
			))}
			</ul>}
		</div>
	</div>)
}

export default DownloadedModelsList

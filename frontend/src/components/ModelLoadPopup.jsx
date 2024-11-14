import { useState } from "react"
import { useLoadModelMutation } from "../app/features/lms/lmsSlice"

const ModelLoadPopup = ({togglePopup, model}) => {
	const [loadModel] = useLoadModelMutation()
  const [contextLength, setContentLength] = useState(1)
  const [GPULayers, setGPULayers] = useState(0)
  const [identifier, setIdentifier] = useState("")

  const contentLengthHandler = (value) => {
    setContentLength(value)
  }

  const GPULayersHandler = (value) => {
    setGPULayers(value)
  }

  const identifierHandler = (value) => {
    setIdentifier(value)
  }

  const loadModelHandler = (path, ident, contextLength, GPULayers) => {
    const inner = async () => {
      if (ident === "") ident = undefined
      GPULayers = Number(GPULayers)
      GPULayers = GPULayers === model.GPULayers ? 1 : GPULayers/model.GPULayers
      togglePopup()
      try {
        await loadModel({path, ident, contextLength, GPULayers})
      } catch (error) {
        console.log(error);
      }
    }
    return inner
  }

  return (<div className="mx-auto w-[90%] h-[90%] text-emerald-300/80">
    <div className="justify-items-start font-bold text-4xl cursor-pointer hover:text-amber-300 truncate ... border-b-2 border-teal-600/90" onClick={togglePopup}>{"< "}<span className="text-2xl text-emerald-300/80">{model.formatedPath}</span>
    </div>
    <div className="space-y-4 p-2 mt-2 justify-items-start text-emerald-200/80 scrollbar-invise h-[90%]">

      <div className="w-[100%] border-teal-600/50 border-l-4 rounded pl-2">
      <div className="flex justify-between">
        <div className="font-bold ">Identifier</div>
        <button className="hover:text-amber-600 cursor-pointer font-bold text-xl" onClick={loadModelHandler(model.path, identifier, contextLength, GPULayers)} type="button">Load</button>
      </div>
        <span className="px-2">Provide an identifier for this model. Leave blank to use the default identifier.</span>
        <input className="border-teal-600 mt-2 border-l-2 px-2 bg-transparent bg-gradient-to-t from-teal-200/10 w-[100%] text-center text-emerald-100 caret-pink-500 outline-none" type="text" placeholder={model.formatedPath} onChange={(event) => identifierHandler(event.target.value)} value={identifier}/>
      </div>

      <div className="w-[100%] border-teal-600/50 border-l-4 rounded pl-2 drop-shadow">
      <div className="flex justify-between">
        <div className="font-bold">Context Length</div>
        <input className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border-teal-600 border-x-2 bg-transparent text-center text-emerald-100 caret-pink-500 w-[20%] text-sm outline-none" type="number" value={contextLength} min={1} max={model.contextLength} onChange={(event) => contentLengthHandler(event.target.value)}/>
      </div>
        <span className="px-2">
          Model supports up to <span className="font-bold hover:text-emerald-100 cursor-pointer" onClick={() => contentLengthHandler(model.contextLength)}>{model.contextLength}</span> tokens.
        </span>
        <input className="rounded bg-transparent w-[100%] appearance-none outline-none cursor-pointer [&::-webkit-slider-runnable-track]:rounded [&::-webkit-slider-runnable-track]:h-[5px] [&::-webkit-slider-runnable-track]:bg-teal-200/10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-[5px] [&::-webkit-slider-thumb]:w-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-teal-600 " type="range" min={1} max={model.contextLength} step={1} value={contextLength} onChange={(event) => contentLengthHandler(event.target.value)}/>
      </div>

      <div className="w-[100%] border-teal-600/50 border-l-4 rounded pl-2 drop-shadow">
        <div className="flex justify-between">
          <div className="font-bold ">GPU Offload</div>
          <input className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border-teal-600 border-x-2 bg-transparent text-center text-emerald-100 caret-pink-500 w-[20%] text-sm outline-none" type="number" value={GPULayers} min={0} max={model.GPULayers} onChange={event => GPULayersHandler(event.target.value)}/>
        </div>
          <span className="px-2">
            Model supports up to <span className="font-bold hover:text-emerald-100 cursor-pointer" onClick={() => GPULayersHandler(model.GPULayers)}>{model.GPULayers}</span> discrete model layers.
          </span>
          <input className="rounded bg-transparent w-[100%] appearance-none outline-none cursor-pointer [&::-webkit-slider-runnable-track]:rounded [&::-webkit-slider-runnable-track]:h-[5px] [&::-webkit-slider-runnable-track]:bg-teal-200/10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-[5px] [&::-webkit-slider-thumb]:w-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-teal-600" type="range" min={0} max={model.GPULayers} step={1} value={GPULayers} onChange={event => GPULayersHandler(event.target.value)}/>
      </div>

    </div>
  </div>)
}

export default ModelLoadPopup

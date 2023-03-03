import { createResource, createSignal, For } from "solid-js";
import { request } from "../services/services";
import { setSelectedModel } from "../signaux";

const models_req = async () => (await request('api/model/all', 'GET', null)).json()

export default function SelectModel(props: any){
    const [models, setModels] = createSignal()
    const [_models] = createResource(models_req)


    // const [_models] = request('api/model/all', 'GET', null)

    if (_models() !== undefined && _models() !== null) setModels(_models())
    

    const handleChange = (e: any) => {
      setSelectedModel(_models().filter((md:any) => md.id == e.target.value)[0])
      if(typeof(props._onchange) == 'function') props._onchange(e)
    }

    return <select onChange={handleChange} id="models" class="mx-auto w-64 bg-indigo-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 mx-auto p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <option selected>Aucun model sélectionner</option>
            <For each={_models()}>{(model, i) =>
                <option value={model.id}>{model.name}</option>
            }</For>
        </select>
}
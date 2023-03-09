// Importations SolidJS
import { createResource, createSignal, For, onMount, Show } from "solid-js";

// Importations fonctions customs
import { selectClasse } from "../signaux";
import { Formater,request } from "../services/services";
import { pushNotif, trainClassesSelect } from "../signaux";

// Requête permettant de récup les classes existantes
const fetchClasses  = async () => (await request('api/classe/all', 'GET', null)).json()

// Requête permettant d'enregistrer un modèle dans le backend
const fetchAddModel = async (formdata: any) => (await request('api/model/create', 'POST', formdata))

export default function AddModel(){

    const [classes] = createResource(fetchClasses)
    
    const [modelData, setModelData] = createSignal()
    const [model] = createResource(modelData, fetchAddModel)


    const [isTrainedModel, setIsTrainedModel] = createSignal(false) 
    const [modelName,      setModelName]      = createSignal('');

    let file:  File;
    var modal: Object;

    // Récupère l'élément modal au montage du composant
    onMount(() =>  modal = new te.Modal(document.getElementById('add_model')) )
    
    // Récupère le fichier sélectionner et le stock dans la variable file
    const handleFile = (e: any) => file = e.target.files[0]

    const addModel = async (e: any) => {
        if(checkForm() != ''){
            pushNotif({ message: checkForm() })
            return false
        }   
        
        let classes: Array<number> = []
        trainClassesSelect.forEach((element: any) => classes.push(element.id) );

        const formdata = Formater({name: modelName(), file: file, classes: [...classes]})
        setModelData(formdata)
        console.log(model())
        
        modal.hide()
    }

    /**
     * Cette fonction vas érifier si les champs requis son compléter 
     * @returns {string} errors
     */
    const checkForm = () => {
        let errors = ''
        
        if(!file || file === undefined || file === null) errors += 'Veuillez sélectionner un fichier'
        if(modelName().length == 0)                      errors += 'Veuillez entrer un nom pour le modèle.'

        return errors
    }


    return <>
        <button type="button"  data-te-toggle="modal" data-te-target="#add_model"  >
            <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24">
                <path fill="#32a64b" d="M18 12.998h-5v5a1 1 0 0 1-2 0v-5H6a1 1 0 0 1 0-2h5v-5a1 1 0 0 1 2 0v5h5a1 1 0 0 1 0 2z"/>
            </svg>
        </button>

        <div  data-te-modal-init class="fixed top-0 left-0 z-[1055] hidden h-full w-full overflow-y-auto overflow-x-hidden outline-none" id="add_model" tabindex="-1" aria-labelledby="exampleModalCenterTitle" aria-modal="true" role="dialog">
            <div data-te-modal-dialog-ref class=" relative flex min-h-[calc(100%-1rem)]  translate-y-[-50px] items-center opacity-0 transition-all duration-100 min-[576px]:mx-auto min-[576px]:mt-7 min-[576px]:min-h-[calc(100%-3.5rem)] min-[576px]:max-w-[500px]">
                <div class="pointer-events-auto  flex w-full flex-col rounded-md border-none bg-[#4544AB] ">
                    <div class="flex items-center justirelativefy-center rounded-t-md border-b border-neutral-100 border-opacity-100 p-4 dark:border-opacity-50">
                        <h5 class="text-xl font-medium leading-normal text-neutral-800 dark:text-neutral-200">
                            Ajouter un modèle 
                        </h5>
                    </div>
                    <div class="relative p-4 pt-5 pb-3">
                        <div class="mb-3 w-full">
                            <label for="formFileSm" class="mb-2 inline-block text-neutral-700 dark:text-neutral-200" >Sélectionner un fichier .h5</label>
                            <input onChange={handleFile} class="relative m-0  w-full  flex-auto cursor-pointer rounded border border-solid border-neutral-300 bg-white bg-clip-padding px-3 py-1 text-sm font-normal text-neutral-700 outline-none transition duration-300 ease-in-out file:-mx-3 file:-my-1.5 file:cursor-pointer file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-1.5 file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[margin-inline-end:0.75rem] file:[border-inline-end-width:1px] hover:file:bg-neutral-200 focus:border-primary focus:bg-white focus:text-neutral-700 focus:shadow-[0_0_0_1px] focus:shadow-primary focus:outline-none dark:bg-transparent dark:text-neutral-200 dark:focus:bg-transparent" id="formFileSm" type="file" />
                        </div>

                        <div class="relative ">
                            <input type="text" class="rounded text-black min-h-[auto] w-full border border-solid border-neutral-300 bg-white bg-clip-padding px-3 py-1 text-sm font-normal  outline-none transition duration-300 ease-in-out file:-mx-3 hover:file:bg-neutral-200 focus:border-primary focus:bg-white" placeholder="Nom du modèle" 
                            onKeyPress={(e) => setModelName(e.currentTarget.value)} value={modelName()}  />
                        </div>

                        <div class="flex items-center my-2">
                            <label for="trained_model?" class="mr-4">Modèle entrainer</label>
                            <input id="trained_model?" type="checkbox" onclick={(e) => setIsTrainedModel(e.currentTarget.checked) }   class="mt-[0.15rem] mr-[6px]  h-[1.125rem] w-[1.155rem] appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-[rgba(0,0,0,0.25)] bg-white outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:ml-[0.25rem] checked:after:-mt-px checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-t-0 checked:after:border-l-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:bg-white focus:after:content-[''] checked:focus:border-primary checked:focus:bg-primary checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:ml-[0.25rem] checked:focus:after:-mt-px checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-t-0 checked:focus:after:border-l-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent" />
                        </div>
                        
                        <Show when={isTrainedModel()}>
                            <For each={classes()}>{(classe, i) => 
                                <div class="flex justify-around border-b py-2 ">
                                    <p style="width: 150px">{classe.name}</p>
                                    <input type="checkbox" onClick={selectClasse} value={JSON.stringify(classe)}   class="mt-[0.15rem] mr-[6px]  h-[1.125rem] w-[1.155rem] appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-[rgba(0,0,0,0.25)] bg-white outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:ml-[0.25rem] checked:after:-mt-px checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-t-0 checked:after:border-l-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:bg-white focus:after:content-[''] checked:focus:border-primary checked:focus:bg-primary checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:ml-[0.25rem] checked:focus:after:-mt-px checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-t-0 checked:focus:after:border-l-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent" />
                                </div>
                            }</For>
                        </Show>
                    </div>
                    <div class="flex flex-shrink-0 flex-wrap items-center justify-end rounded-b-md  p-4 dark:border-opacity-50">
                        <button onClick={addModel} type="button" class="w-full rounded bg-primary-100 px-6 pt-2.5 pb-2 text-xs font-medium uppercase leading-normal text-primary-700 transition duration-150 ease-in-out hover:bg-primary-accent-100 "  data-te-ripple-init data-te-ripple-color="light">
                            Ajouter
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </>
}
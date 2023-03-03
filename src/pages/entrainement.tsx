import { createResource, For, onMount } from "solid-js"

import { trainClassesSelect } from "../signaux";
import ChooseClasses from "../components/ChooseClasses";
import SelectModel from "../components/SelectModel";
import AddModel from "../components/AddModel";

export default function entrainement(){
    const train = () => {}

    return <>
    <section class="pt-[5rem] container md:w-3/5 lg:w-2/5 text-white mx-auto">

        <div class="md:py-10 sm:py-5 py-2">
            <div class="flex items-center">
                <h3 class="text-lg md:text-2xl">Sélectionner sur quel classe entrainer </h3>
                <ChooseClasses />
            </div>

            <div class="flex felx-wrap">
                <For each={trainClassesSelect}>{(classe, i) =>
                    <button type="button" class="mx-3 justify-center text-white  bg-[#7D6ADE] font-medium rounded-lg text-sm  px-5 py-2.5 mt-4">{classe.name}</button>
                }</For>
            </div>
        </div>    

        <div class="md:py-10 sm:py-5 py-2">
            <div class="flex items-center">
                <h3 class="text-lg md:text-2xl">Sélectionner un modèle / ajouter</h3>
                <AddModel />
            </div>   
            <div class="w-full flex justify-start">
                <SelectModel />
            </div>             
           
        </div> 

        <div class="md:py-10 sm:py-5 py-2">
            <div class="flex justify-start">
                <h3 class="text-lg md:text-2xl">Paramètre d'entrainement</h3>
            </div>
            

            <div id="model-settings">
                <div class="w-full flex my-2">
                    <p class="mx-3" style="width: 120px">Learning-rate</p>
                    <input type="number" class="p-1 text-zinc-900" />
                </div>
                <div class="w-full flex my-2">
                    <p class="mx-3" style="width: 120px">Dropout</p>
                    <input type="number" class="p-1 text-zinc-900" />
                </div>
                <div class="w-full flex my-2">
                    <p class="mx-3" style="width: 120px">Epoques</p>
                    <input type="number" class="p-1 text-zinc-900"  name="epoques"/>
                </div>

                <div class="w-full flex my-2">
                    <p class="mx-3" style="width: 120px">Data Aug</p>
                    <input type="checkbox" class="mt-[0.15rem] mr-[6px]  h-[1.125rem] w-[1.155rem] appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-[rgba(0,0,0,0.25)] bg-white outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:ml-[0.25rem] checked:after:-mt-px checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-t-0 checked:after:border-l-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:bg-white focus:after:content-[''] checked:focus:border-primary checked:focus:bg-primary checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:ml-[0.25rem] checked:focus:after:-mt-px checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-t-0 checked:focus:after:border-l-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent" />
                </div>
            </div>              
        </div>    

        <div class="md:py-10 sm:py-5 py-2">
            <div className="flex justify-start">
                <h3 class="text-lg md:text-2xl">Paramètre d'entrainement</h3>                
            </div>
            <div id="model-settings" class="ml-3 bg-slate-800 p-5 rounded">
                <p>Feedback de l'entrainement</p>
            </div>              
        </div>    
        <div class="flex juitify-center w-full">
            <button type="button" onClick={train} class="w-64   bg-[#7D6ADE] rounded-lg text-sm px-5 py-2.5 mt-4 mx-auto">Entrainer</button>
        </div>
    </section></>
}
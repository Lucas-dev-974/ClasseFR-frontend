import { createEffect, createResource, createSignal, For, Show } from "solid-js"
import { Formater, request } from "../services/services"
import { pushNotif, selectedModel } from "../signaux"
import SelectModel from "../components/SelectModel"

const fetchPrediction = async (data:any) => (await request('api/model/predict', 'POST', data)).json()
const fGetClasses     = async () => (await request('api/classe/all', 'GET', null)).json()
const fBadPrediction  = async (data:any) => (await request('api/model/feedback    ', 'POST', data)).json()

export default function Prediction(){
    const [predictionData, setPrediction] = createSignal()
    const [preds] = createResource(predictionData, fetchPrediction)

    const [classes] = createResource(fGetClasses)

    const [badPredict, setBadPredict] = createSignal()
    const [badPredResource] = createResource(badPredict, fBadPrediction)

    var file:       any;
    var image_area: HTMLElement;
    var img_before: string;
    var [predictionTxt, setPredictionTxt] = createSignal('');

    const [on, setOn] = createSignal('predict')

    const predict = async () =>{
        console.log(selectedModel.id)
        if(selectedModel.id == undefined){
          pushNotif({message: 'Veuillez sélectionner un modèle avant de lancer la prédiction !'})
          return false
        }
        if(file === null || !file){
          pushNotif({message: 'Désoler veuillez sélectionner une image avant de faire une prédiction !'});
          return false;
        }
        
        setPrediction(Formater({model_id: selectedModel.id, img: file, filename: file.name}))
        
        createEffect(() => {
          setPredictionTxt(preds()  != undefined ? preds().prediction : '...')
        })
  
        setOn('predicted')
      }
  
      const badPrediction = () => setOn('badpredicted')
          
      const handleImage = (e: object) => {
        const reader = new FileReader()
        image_area = document.getElementById('selected_img') ?? document.createElement('div')
  
        reader.onload = (e) => {
          img_before = image_area.outerHTML
          image_area!.innerHTML = ''
          const image = new Image()
  
          image.src = reader.result?.toString()
          image_area.style.width = "100%"
          image_area.style.height = '100%'
          image_area.style.background = 'url(' + image.src + ')'
          image_area.style.backgroundPosition = 'center'
          image_area.style.backgroundSize = 'cover'
        }
  
        try{
          file = e.target.files[0]
          reader.readAsDataURL(file)
  
        }catch(error){
          console.error(error)
        }
      }
  
      const nextPrediction = () => {
        file = null
        image_area.style.backgroundImage = ''
        image_area.innerHTML = img_before 
        setOn('predict')
        setPredictionTxt('')
      }
  
      const handleCategorie = (e:any) => {
        console.log(e.target.value, preds().pred_id)
        setBadPredict(Formater({pred_id: preds().pred_id, categorie_id: e.target.value}))
        console.log(badPredResource())
      }
    return(
        <main class="lg:container relative mx-auto">
        <section class="w-full"> {/** Selection modèle */}
          <div class="mt-10">
            <p class="text-center text-white text-xl">Sélectionner un modèle</p>
            <div class="flex justify-center mx-auto mt-3" style="max-width: 450px">
              <SelectModel />
            </div>
          </div>
            

            <div id="televersement_image" class="w-full  relative mt-10">
              <h3 class="w-full text-xl	text-center text-white">Téléverser une image</h3>
              <p class="w-full text-center text-white text-sm">Clicker sur l’icone image pour en choisir une</p>
            </div>

            <div class="flex justify-center mt-2">
                <label style="width: 250px; height: 250px" class="flex justify-center transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
                    <div class="flex items-center space-x-2 mx-auto" id="selected_img">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#929292" d="M7 17h10q.3 0 .45-.275t-.05-.525l-2.75-3.675q-.15-.2-.4-.2t-.4.2L11.25 16L9.4 13.525q-.15-.2-.4-.2t-.4.2l-2 2.675q-.2.25-.05.525T7 17Zm-2 4q-.825 0-1.413-.588T3 19V5q0-.825.588-1.413T5 3h14q.825 0 1.413.588T21 5v14q0 .825-.588 1.413T19 21H5Z"/></svg>
                    </div>
                    <input type="file" name="file_upload"  class="hidden" accept="image/png, image/jpg, image/jpeg " onChange={handleImage}/>
                </label>
            </div>

            
            <div id="prediction_label" class="text-center m-5 text-white">
              {predictionTxt()}
            </div>


            <div class="w-full flex justify-center flex-wrap">
              <Show when={on() == 'predict'}>
                
                  <button type="button" onClick={predict} class="w-64 justify-center text-white  bg-[#7D6ADE] font-medium rounded-lg text-sm px-5 py-2.5 mt-4">Prédire</button>
                
              </Show>

              <Show when={on() == 'predicted'}>
                <div class="w-full flex justify-center">
                  <button type="button" onClick={nextPrediction} class="w-64 justify-center text-white  bg-[#7D6ADE] font-medium rounded-lg text-sm px-5 py-2.5 mt-4">Bonne</button>
                </div>  
                <div class="w-full flex justify-center">
                  <button type="button" onClick={badPrediction} class="w-64 justify-center text-white  bg-[#AE4141] font-medium rounded-lg text-sm px-5 py-2.5 mt-4">Mauvaise</button>
                </div>  
              </Show>

              <Show when={on() == 'badpredicted'}>
                <div class="w-full text-center text-white">
                  Si mauvaise prédiction veuillez sélectionner la catégorie qui aurais du être prédite
                </div>

                <div class="bg-[#7D6ADE] rounded-lg relative  flex flex-wrap justify-around" style='height: 134px; max-width: 600px; min-width: 250px'>
                  <For each={classes()}>{(classe, i) => 
                    <button type="button" onclick={handleCategorie} value={classe.id} class="w-40 h-10 justify-center text-white  bg-[#3A2798] font-medium rounded-lg text-sm  p-1 my-2 mx-3">{classe.name}</button>
                  }</For>
                </div>
              </Show>

            </div>

            <div class="w-full flex justify-center mt-20" style='bottom: 0'>
              <button type="button" onClick={nextPrediction} class="w-60 justify-center text-white  bg-[#7D6ADE] font-medium rounded-lg text-sm  px-5 py-2.5 mt-4">Prédiction suivante</button>
            </div>
        </section>
      </main>
    )
}
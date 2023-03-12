// Page "Statistiques par modèle"
// TO-DO => Responsive à améliorer => qd mobile un seul graph combiné ;  Affichage mauvaises prédiction => seulement 2 images quand mobile
//           Affichage des paramètres, classes prédites, bouton entrainement
// Faire un flex nowrap pour les images prédictions

// Importations SolidJS & Chart.JS
import { Chart } from "chart.js";
import { createEffect, createResource, createSignal, For, onMount, Show } from "solid-js";
import SelectModel from "../components/SelectModel";

import { selectedModel } from "../signaux";

// correction bug pas compris : https://github.com/sgratzl/chartjs-chart-wordcloud/issues/4
import { registerables } from 'chart.js';
import { request } from "../services/services";
Chart.register(...registerables);

// Permet de faire fonctionner les charts; À revoir !
declare const window: any;

const fetchTrainedOnClasses = async (model_id: number) => (await request('api/model/trained_on_classes/' + model_id, 'GET', null)).json()
const fetchBadPredictions   = async (model_id: number) => (await request('api/model/bad_predictions/'    + model_id, 'GET', null)).json()


export default function Stats_modele() {
    // Signals
    const [onShowGraph,setShowGraph]              = createSignal('line')
    const [badPredictions, setBadPrediction]      = createSignal([])
    const [selectedModelID, setSelectedModelID]   = createSignal(null)
    const [trainedOnClasses, setTrainedOnClasses] = createSignal([])

    // Resources
    const [trainedOnFettched]     = createResource(selectedModelID, fetchTrainedOnClasses)
    const [badPredictionsfetched] = createResource(selectedModelID, fetchBadPredictions)

    // Fonction permettant la 1ere étape de l'update chart => la suppression
    function removeData(chart:any) {

        // Récup le nombre de valeur en abscisse (époques)
        let dataLength:number = chart.data.datasets[0].data.length

        // Effectue les suppression
        for(let i=0 ; i < dataLength; i++){
            // Supprime les valeurs y (loss ou accuracy)
            chart.data.datasets.forEach((dataset:any) => {
                dataset.data.pop();
            });

            // Supprime les valeurs
            chart.data.labels.pop();
        }
        chart.update();
    }

    // Fonction permettant la 2e étape de l'update chart => chargement des nouvelles datas
    function addData(chart:any, label:any, dataTest:any, dataVal:any) {
        
        // Push des valeurs y (époques)
        chart.data.labels.push(...label);

        // Push des valeurs x (test & accuracy)
        chart.data.datasets[0].data.push(...dataTest);
        chart.data.datasets[1].data.push(...dataVal);
        chart.update();
    }

    // Fonction action selon modèle sélectionné
    function dynamicGraph(numModel:string){
        
        // Suppression des données précedantes
        removeData(window.myChartA);
        removeData(window.myChartL);

        //ici faut une fonction qui récup les data (époques, val&test accuracy et loss) selon le "numModel"
        //puis add data avec ces données

        //temporaire
        if(Number(numModel) == 1){
            addData(window.myChartA, [1,2,3,4,5,6,7], [40, 59, 80, 81, 90, 92, 89], [39, 50, 81, 75, 80, 79, 60]);
            addData(window.myChartL, [1,2,3,4,5,6,7], [90, 60, 55, 40, 10, 6, 7], [95, 60, 40, 30, 10, 9, 10]);
        }
        else if(Number(numModel) == 2){

            addData(window.myChartA, [1,2,3,4,5,6,7], [25,52,85,95,36,25,48], [20,20,20,30,50,60,50]);
            addData(window.myChartL, [1,2,3,4,5,6,7], [25,52,85,95,36,25,48], [20,20,20,20,20,20,40]);
        }
        else if(Number(numModel) == 3){
            addData(window.myChartA, [1,2,3,4,5,6,7], [25,26,29,89,46,48,15], [20,20,20,30,50,60,100]);
            addData(window.myChartL, [1,2,3,4,5,6,7], [20,20,20,30,50,60,50], [25,26,29,89,46,48,15]);
        }
    }

    // Affiche les graphs metrics (Accuracy & Loss)
    function handleGraph(chartId:string, type:string, dataTest:Array<number>, dataVal:Array<number>){
        const ctx = document.getElementById(chartId) as HTMLCanvasElement;

        const labels = [1,2,3,4,5,6,7];
        const data = {
        labels: labels,
        datasets: [{
            label: 'Test ' + type,
            data: dataTest,
            fill: false,
            borderColor: 'rgb(46, 128, 185)',
            tension: 0.1
        },{
            label: 'Validation ' + type,
            data: dataVal,
            fill: false,
            borderColor: 'rgb(255, 128, 17)',
            tension: 0.1
        }]
        };

        if(type == "Accuracy"){
            window.myChartA = new Chart(ctx, {
                type:"line",
                data: data,
                options: {
                    responsive: true,
                    scales: {
                        y: { title: { display:true,  text: type } },
                        x: { title: { display: true, text: "Époques" } }
                    },
                }
            });
        }
        else if(type == "Loss"){
            window.myChartL = new Chart(ctx, {
                type:"line",
                data: data,
                options: {
                    responsive: true,
                    scales: {
                        y: { title: { display:true,  text: type } },
                        x: { title: { display: true, text: "Époques" } }
                    }
                }
            });
        }
    } 

    // Affiche le camemebert
    function handlePieGraph(data:Array<number>){
        const ctx = document.getElementById('pieChart') as HTMLCanvasElement;

        // Création du graph
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Bonnes prédictions', 'Mauvaises prédictions'],
                datasets: [{
                    label: 'Prédictions',
                    data: data,
                    backgroundColor: [
                        'rgb(54, 162, 235)',
                        'rgb(213,0,5)'],
                    borderWidth: 0
                }]
            },
            options: {
                plugins: {
                    legend: {
                        labels: {
                            color: "white"
                        }
                    }
                }
            }});
    }

    // Valeur par default => à améliorer : depend modèle par default défini par signal en global
    var defaultChartValueAT = [40, 59, 80, 81, 90, 92, 89];
    var defaultChartValueAV = [39, 50, 81, 75, 80, 79, 60];
    var defaultChartValueLT = [90, 60, 55, 40, 10, 6, 7];
    var defaultChartValueLV = [95, 60, 40, 30, 10, 9, 10];
    
    // S'éxecute après le return, permet ici de charger les graphs dans les canvas
    onMount(()=> {
        handleGraph("accuracyChart", "Accuracy", defaultChartValueAT , defaultChartValueAV); // Graph accuracy
        handleGraph("lossChart",     "Loss",     defaultChartValueLT, defaultChartValueLV); // Graph loss
        // handlePieGraph([90,10]);
    })

    // Permet d'afficher une card "Mauvaise prédiction"
    function BadPredictionCard(props:any){
        return (
            <div class="flex flex-col  rounded  w-64 md:w-48 lg:w-48  bg-[#7D6ADE] mx-2">
                <div class="flex w-full items-center m-auto  sm:m-auto">
                    <img class="rounded" src={props.url} alt={props.reelleClasse}/>
                </div>
                <div class="p-2 text-white">
                    <p>Prédiction: {props.prediction}</p>
                    <p>Vrai: {props.reelleClasse}</p>
                </div>
            </div>
        )
    }

    

    const showGraph = (e: any) => {
        setShowGraph(e.target.value)
        if(onShowGraph() == 'pie') handlePieGraph([90,10]);
        if(onShowGraph() == 'line'){
            handleGraph("accuracyChart", "Accuracy", defaultChartValueAT , defaultChartValueAV); // Graph accuracy
            handleGraph("lossChart",     "Loss",     defaultChartValueLT,  defaultChartValueLV); // Graph loss
        }
    }
        

    const handleModelSelection = (e: any) => {
        console.log(trainedOnFettched())
        console.log('handle model selection')
        dynamicGraph(e.target.value)
        setSelectedModelID(e.target.value)

        createEffect(() => {
            setTrainedOnClasses(trainedOnFettched())
            setBadPrediction(badPredictionsfetched())
        })

        
    }

        // Return de la page finale à charger
    return <>
    <main class="pt-[1rem] container lg:w-full md:w-[80%] text-white mx-auto">
        
        <div class="flex flex-wrap">
            <div class="w-full md:w-1/2">
                {/* Select model */}
                <section class="text-left py-3">
                    <p class="text-2xl py-2"> Sélectionner un modèle </p>
                    <SelectModel _onchange={handleModelSelection} />
                </section>
                    
                    
                {/* Affichage des metrics */}
                <section class="mx-auto py-3">
                    <header class="text-white flex items-center">
                        <p class="text-2xl mr-3">Metrics</p>
                        <Show when={onShowGraph() == 'pie'}>
                            <button  value="line" class="rounded bg-[#7D6ADE] px-3 py-1 text-sm" onclick={showGraph}>Line</button>
                        </Show>

                        <Show when={onShowGraph() == 'line'}>
                            <button value="pie"  class="rounded bg-[#7D6ADE] px-3 py-1 text-sm" onclick={showGraph}>Pie</button>
                        </Show>
                    </header>

                    <main class="py-3">
                        <Show when={onShowGraph() == 'pie'}>
                            <canvas class="m-2" id="pieChart"></canvas> 
                        </Show>

                        <Show  when={onShowGraph() ==  'line'}>
                            <div class="flex flex-wrap justify-start items-center px-5">
                                <canvas class="bg-white mx-1 my-2" id="accuracyChart"></canvas> 
                                <canvas class="bg-white mx-1 my-2" id="lossChart"></canvas>       
                            </div>
                        </Show>
                    </main>
                </section>
            </div>

            <div class="w-full md:w-1/2">
                {/* Affichage classes prédites */}
                <section>
                    <p class="text-left text-white text-2xl my-2 py-2">Classes d'entrainement</p>  

                    <div class="flex flex ">
                        <For each={trainedOnClasses()}>{(classe, i) =>
                            <div class="bg-[#7D6ADE] rounded text-center w-[150px] mx-2 py-1 text-[0.9em]">
                                <p> {classe} </p>
                            </div>
                        }</For>
                    </div>
                </section>
                
                {/* Affichage des mauvaise prrédictions  */}
                <section class="mx-auto py-3">
                    <p class="text-left text-white text-2xl pb-4">Mauvaises prédictions</p>

                    <div class="flex felx-wrap  mx-auto">
                        <For each={badPredictions()}>{(bad, i) => 
                            <BadPredictionCard url={"http://localhost:8000/api/media/" + bad.image_id} reelleClasse={bad.user_feedback} prediction={bad.classe}/>
                        }</For>                        
                    </div>
                </section>


                {/* Affichage des paramètres */}
                <section class="w-full my-full md:mt-28">
                    <p class="text-left text-white text-2xl">Paramètres</p>
                    <div class="flex justify-start flex-wrap ">
                        <div class="relative w-full h-6 border-b-2 border-[#818181] my-3">
                            <div class="absolute left-0 text-white">Learning-rate</div>
                            <div class="absolute right-0 text-white">0.001</div>
                        </div>
                        <div class="relative  w-full h-6 border-b-2 border-[#818181] my-3">
                            <div class="absolute left-0 text-white">Dropout</div>
                            <div class="absolute right-0 text-white">0.4</div>
                        </div>
                        <div class="relative  w-full h-6 border-b-2 border-[#818181] my-3">
                            <div class="absolute left-0 text-white">Époques</div>
                            <div class="absolute right-0 text-white">18</div>
                        </div>
                    </div>                    
                </section>
                

                {/* Affichage boutton entrainement */}
                <section>
                    <div class="flex justify-center mt-10">
                        <a type="button" class="flex w-auto px-3 h-10 rounded bg-[#7D6ADE]" href="/entrainement">
                            <div class="text-white m-auto">
                                Aller à l'entrainement
                            </div>
                        </a>
                    </div>                    
                </section>
        
            </div>
        </div>
    </main></>
}
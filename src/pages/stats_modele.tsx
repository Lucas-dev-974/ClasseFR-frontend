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

// Metrics Data
const [labels, setLabels] = createSignal();
const [testAccuracy, setTestAccuracy] = createSignal();
const [testLoss, setTestLoss] = createSignal();
const [valAccuracy, setValAccuracy] = createSignal();
const [valLoss, setValLoss] = createSignal();

// Pie chart data
const [pieBonnePred, setPieBonnePred] = createSignal();
const [pieMauvaisePred, setPieMauvaisePred] = createSignal();

// Permet de récup les classes entrainé selon le model
const fetchTrainedOnClasses = async (model_id: number) => (await request('api/model/trained_on_classes/' + model_id, 'GET', null)).json()

// Permet de recup les metrics
const fetchMetrics = async (model_id:number) => (await request('api/model/metrics/' + model_id, 'GET', null)).json().then(response=>thenAddData(response))

// Permet de recup data pour le chart pie
const fetchPieData = async (model_id:number) => (await request('api/model/pieData/' + model_id, 'GET', null)).json().then(response=> thenAddDataPie(response))

// Exécuté après reception des data pie
function thenAddDataPie(response:any){
    setPieBonnePred(response['nbBonnesPred']);
    setPieMauvaisePred(response['nbMauvaisesPred']);

    // 2e phase du chart update pie
    pieAddData(window.pieChart, ['Bonnes prédictions', 'Mauvaises prédictions'], [pieBonnePred(), pieMauvaisePred()]);
}

// Créer le graph pie
function handlePieGraph(data:Array<number>){
    const ctx = document.getElementById('pieChart') as HTMLCanvasElement;
    
    // Création du graph
    window.pieChart = new Chart(ctx, {
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

// Executé après reception des data metrics
function thenAddData(response:any){

    // Enregistrement des metrics
    for (var elt of ['test_loss', 'test_accuracy', 'val_accuracy', 'val_loss']){
        let subData:Array<number> = []
        for (var i of response[elt]){
            subData.push(Number(i))
        }
        if (elt == 'test_loss') { setTestLoss(subData) } else if (elt == 'test_accuracy') { setTestAccuracy(subData) } else if (elt == 'val_accuracy') { setValAccuracy(subData) } else if (elt == 'val_loss') { setValLoss(subData) }
    }
    
    // Création du labels pour chartJS
    var label:Array<number> = [];
    for(let i = 1; i< response['test_loss'].length +1 ; i++ ){
        label.push(i);
    }
    setLabels(label);

    addData(window.myChartA, labels(), testAccuracy(), valAccuracy())
    addData(window.myChartL, labels(), testLoss(), valLoss())
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

// 2e phase du chart update pie
function pieAddData(chart:any, label:any, data:any){

    chart.data.labels.push(...label);
    chart.data.datasets[0].data.push(...data)
    chart.update();
}



// Main function
export default function Stats_modele() {

    // Valeur du bouton "Pie/Line"
    const [onShowGraph,setShowGraph] = createSignal('pie')

    // Modèle sélectionné
    const [selectedModelID, setSelectedModelID] = createSignal(0)

    // Classes trained on
    const [trainedOnClasses, setTrainedOnClasses] = createSignal([])
    const [trainedOn] = createResource(selectedModelID, fetchTrainedOnClasses)

    // Fonction permettant la 1ere étape de l'update chart => la suppression
    function removeData(chart:any) {

        // Récup le nombre de valeur en abscisse (époques)
        let dataLength:number = chart.data.datasets[0].data.length
        if (dataLength == 0){ dataLength = 1 }

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

    // Fonction action selon modèle sélectionné
    function dynamicGraph(numModel:string){
        
        if (onShowGraph() == 'pie') {
            // Suppression des données précedantes (hitos)
            removeData(window.myChartA);
            removeData(window.myChartL);
        }
        else if (onShowGraph() == 'line') {
            // Suppression des données prededantes (pie)
            removeData(window.pieChart);
        }


        //ici faut une fonction qui récup les data (époques, val&test accuracy et loss) selon le "numModel"
        const [metricsRecup] = createResource(Number(numModel), fetchMetrics);


        const [pieDataRecup] = createResource(Number(numModel), fetchPieData);
    }

    // Affiche les graphs metrics (Accuracy & Loss)
    function handleGraph(chartId:string, type:string, dataTest:Array<number>, dataVal:Array<number>, label:Array<number>){
        const ctx = document.getElementById(chartId) as HTMLCanvasElement;

        const labels = label;
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
    
    // S'éxecute après le return, permet ici de charger les graphs dans les canvas
    onMount(()=> {
        handleGraph("accuracyChart", "Accuracy", [] , [], [0]); // Graph accuracy
        handleGraph("lossChart",     "Loss",     [], [], [0]); // Graph loss
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

    // Action du bouton pie/line
    const showGraph = (e: any) => {

        // Fait afficher l'autre bouton
        setShowGraph(e.target.value)

        // Afficher le pie
        if (e.target.value == 'line'){
            handlePieGraph([pieBonnePred(), pieMauvaisePred()]);
        }

        // Afficher les histos
        else if (e.target.value == 'pie'){

            // Afficher graph avec valeurs déjà recup
            handleGraph('accuracyChart', "Accuracy", testAccuracy(), valAccuracy(), labels())
            handleGraph('lossChart', 'Loss', testLoss(), valLoss(), labels())
        }
    }
        
    // Action lors de selection du modèle
    const handleModelSelection = (e:any) => {
        dynamicGraph(e.target.value)
        setSelectedModelID(e.target.value)
        
        createEffect(() => {
            // Recup/Affichage ? des classes trained on 
            setTrainedOnClasses(trainedOn())
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
                        <Show when={onShowGraph() == 'line'}>
                            <button  value='pie' class="rounded bg-[#7D6ADE] px-3 py-1 text-sm" onclick={showGraph}>Line</button>
                        </Show>

                        <Show when={onShowGraph() == 'pie'}>
                            <button value='line'  class="rounded bg-[#7D6ADE] px-3 py-1 text-sm" onclick={showGraph}>Pie</button>
                        </Show>
                    </header>

                    <main class="py-3">
                        {/* Graph Pie */}
                        <Show when={onShowGraph() == 'line'}>
                            <canvas class="m-2" id="pieChart"></canvas>
                            <div>OUais</div>
                        </Show>

                        <Show  when={onShowGraph() ==  'pie'}>
                            {/* Graph histos */}
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
                        <For each={trainedOnClasses()}>{(classe:any, i) =>
                            <div class="bg-[#7D6ADE] rounded text-center w-[150px] mx-2 py-1 text-[0.9em]">
                                <p> {classe.name}   </p>
                            </div>
                        }</For>
                    </div>
                </section>
                
                {/* Affichage des mauvaise prrédictions  */}
                <section class="mx-auto py-3">
                    <p class="text-left text-white text-2xl pb-4">Mauvaises prédictions</p>
                    <div class="flex felx-wrap  mx-auto">
                        <BadPredictionCard url="https://assets.afcdn.com/recipe/20210514/120317_w1024h1024c1cx1060cy707.jpg" reelleClasse="Pizza" prediction="Tacos"/>
                        <BadPredictionCard url="https://assets.afcdn.com/recipe/20130627/42230_w1024h1024c1cx1250cy1875.jpg" reelleClasse="Hamburger" prediction="Pizza"/>
                        <BadPredictionCard url="https://img.cuisineaz.com/660x660/2019/04/17/i146583-tacos-poulet-curry.jpeg" reelleClasse="Tacos" prediction="Hamburger"/>
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
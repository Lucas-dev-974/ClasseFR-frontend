// Page "Statistiques par modèle"
// TO-DO => Responsive à améliorer => qd mobile un seul graph combiné ;  Affichage mauvaises prédiction => seulement 2 images quand mobile
//           Affichage des paramètres, classes prédites, bouton entrainement
// Faire un flex nowrap pour les images prédictions

// Importations SolidJS & Chart.JS
import { Chart } from "chart.js";
import { createEffect, createSignal, on, onMount } from "solid-js";
import { render } from "solid-js/web";

// Importations elts customs
import SelectModel from "../components/SelectModel";
import authenticationCheck from "../utils";

// correction bug pas compris : https://github.com/sgratzl/chartjs-chart-wordcloud/issues/4
import { registerables } from 'chart.js';
Chart.register(...registerables);
//---------------------------------------

// Permet de faire fonctionner les charts; À revoir !
declare const window: any;

export default function Stats_modele() {

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

        // Récupère le modèle selectionné et lance dynamicGraph ; À fusionner avec dynamicGraph ?
        const handleModelSelection = (e: any) => {
            console.log(e)
            dynamicGraph(e.target.value);
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
                        scales: {
                            y: {
                                title: {
                                    display:true,
                                    text: type
                                }
                            },
                            x: {
                                title: {
                                    display: true,
                                    text: "Époques"
                                }
                            }
                        }
                    }
                });
            }
            else if(type == "Loss"){
                window.myChartL = new Chart(ctx, {
                    type:"line",
                    data: data,
                    options: {
                        scales: {
                            y: {
                                title: {
                                    display:true,
                                    text: type
                                }
                            },
                            x: {
                                title: {
                                    display: true,
                                    text: "Époques"
                                }
                            }
                        }
                    }
                });
            }
            console.log(window.myChartA);
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
            handleGraph("lossChart", "Loss", defaultChartValueLT, defaultChartValueLV); // Graph loss
            handlePieGraph([90,10]);
        })

        // Permet d'afficher une card "Mauvaise prédiction"
        function BadPredictionCard(props:any){
            return (
                <div class="flex flex-col  rounded  w-64 md:w-48 lg:w-48  mx-auto my-1 bg-[#7D6ADE] mx-2">
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

        function ClassCard(props:any){
            return (
                <div class="bg-[#7D6ADE] rounded mx-auto">
                    <div class="flex flex-col px-2">
                        <div class="text-white mx-auto">{props.class}</div>
                        <div class="text-white mx-auto">{props.number} images</div>
                    </div>
                </div>
            )
        }

    return (
        <main class="sm:container mx-auto">
            <div class="flex flex-col justify-center mx-auto">
                
                <SelectModel _onchange={handleModelSelection} />

                {/* Affichage des metrics */}
                <section style='width: 80%' class="mx-auto">
                    <p class="text-center text-white text-2xl">Metrics</p>
                    <div class="flex flex-wrap">
                        <div class="m-auto" style="width:250px; height:250px">
                            <canvas class="m-2" id="pieChart"></canvas>
                        </div>
                        <div class="m-auto" style="width:400px; height:200px">
                            <canvas class="bg-white m-2" id="accuracyChart"></canvas>
                        </div>
                        <div class="m-auto" style="width:400px; height:200px">
                            <canvas class="bg-white m-2" id="lossChart"></canvas>
                        </div>
                    </div>
                </section>


                {/* Affichage des mauvaise prrédictions  */}
                <section class="w-2/4 mx-auto my-3">
                    <p class="text-center text-white text-2xl">Mauvaises prédictions</p>
                    <div class="flex felx-wrap justify-center mx-auto">
                        <BadPredictionCard url="https://assets.afcdn.com/recipe/20210514/120317_w1024h1024c1cx1060cy707.jpg" reelleClasse="Pizza" prediction="Tacos"/>
                        <BadPredictionCard url="https://assets.afcdn.com/recipe/20130627/42230_w1024h1024c1cx1250cy1875.jpg" reelleClasse="Hamburger" prediction="Pizza"/>
                        <BadPredictionCard url="https://img.cuisineaz.com/660x660/2019/04/17/i146583-tacos-poulet-curry.jpeg" reelleClasse="Tacos" prediction="Hamburger"/>
                    </div>
                </section>


                {/* Affichage des paramètres */}
                <section class="w-full my-full">
                    <p class="text-center text-white text-2xl">Paramètres</p>
                    <div class="flex justify-center flex-wrap w-96 m-auto">
                        <div class="relative w-full h-6 border-b-2 border-white">
                            <div class="absolute left-0 text-white">Learning-rate</div>
                            <div class="absolute right-0 text-white">0.001</div>
                        </div>
                        <div class="relative  w-full h-6 border-b-2 border-white">
                            <div class="absolute left-0 text-white">Dropout</div>
                            <div class="absolute right-0 text-white">0.4</div>
                        </div>
                        <div class="relative  w-full h-6 border-b-2 border-white">
                            <div class="absolute left-0 text-white">Époques</div>
                            <div class="absolute right-0 text-white">18</div>
                        </div>
                    </div>                    
                </section>
                
                {/* Affichage classes prédites */}
                <section>
                    <p class="text-center text-white text-2xl my-3">Classes prédites</p>  
                    <div class="flex flex-wrap w-96 mx-auto">
                        <ClassCard class="Tacos" number="1000"/>
                        <ClassCard class="Hamburger" number="1000"/>
                        <ClassCard class="Pizza" number="1000"/>
                    </div>
                </section>
                
                {/* Affichage boutton entrainement */}
                <section>
                    <div class="flex justify-center mt-10">
                        <a type="button" class="flex w-28 h-10 rounded bg-[#7D6ADE]" href="/entrainement">
                            <div class="text-white m-auto">
                                Entrainement
                            </div>
                        </a>
                    </div>                    
                </section>
                
            </div>
        </main>
    )
}
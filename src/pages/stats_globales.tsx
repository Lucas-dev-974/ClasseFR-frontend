//Page "Statistiques globales"

import {Chart} from "chart.js";
import { onMount, createResource, createSignal } from "solid-js";

import { request } from "../services/services";

// correction bug pas compris : https://github.com/sgratzl/chartjs-chart-wordcloud/issues/4
import { registerables } from 'chart.js';
Chart.register(...registerables);
//---------------------------------------
const [totalPredctions, setTotalPredictions] = createSignal()
const stats_globales_request = async () => (await request('api/stats_globales/total_pred', 'GET', null)).json().then(response => {
    setTotalPredictions(response.total_predictions);
    console.log(response.total_predictions)
})
// Afficher la page que quand requete effectué ! avec then ? onSetup ?

export default function Stats_globales() {
    
    const [dataGlobale] = createResource(stats_globales_request)
    const handleGraph = () => {
        const ctx = document.getElementById('myChart') as HTMLCanvasElement;

        // Création du graph
        new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Bonnes prédictions', 'Mauvaises prédictions'],
            datasets: [{
                label: 'Prédictions',
                data: [90,10],
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

    //Execute la fonction après return
    onMount(()=> {
        handleGraph();
    })
    
    return (
        <main class="p-4">
            <p class="text-center text-white">
                Statistiques globales
            </p>

            <p class="m-10 text-center text-2xl text-white">
                Nombre total de prédictions : {totalPredctions()}
            </p>
            <div class="flex justify-center pb-10">
                <div style="width:400px; height:400px">
                    <canvas id="myChart"></canvas>
                </div>
            </div>
            <div class="flex justify-center">
                <a class="p-3 text-white bg-[#7D6ADE] rounded" type="button" href="/stats_modele">Statistiques par modèles</a>
            </div>
        </main>
    )
}

function recupDataGraph () {
    
}
// Page "Home"

// Import SolidJS
import { onMount, createSignal, Show, createResource} from "solid-js"; // OnSe ?!


// Import fonction custom
import authenticationCheck from "../utils";
import { request } from "../services/services";
// TailWindCSS classes
const buttonClass = "rounded-2xl p-2 md:p-8 m-3 bg-[#7D6ADE] w-[120px] h-[110px] md:w-[200px] md:h-[200px] ";
const buttonStyle = "height: 200px";
const buttonTextClass = "text-center font-medium text-white text-sm md:text-xl ";
const buttonSVGWidth  = "100";
const buttonSVGHeight = "100";

//TEST
// const fetchTest = async ()=> (await request('api/model/test', 'POST', {"test":"test"})).json().then(response => console.log(response));

export default function Index(){
    //TEST
    // const [test] = createResource(fetchTest);

    // Vérif si utilisateur connecté
    const connexion = authenticationCheck();
    return (
        
        <section class="flex justify-center items-center h-[calc(100vh_-_90px)] mx-auto" id="redirectionButtons">
            <div class="flex flex-wrap items-center mx-auto justify-center">
                
                {/* Bouton prédiction */}
                <a type="button" class={buttonClass} href="/prediction">
                    <svg class="mx-auto w-[50px] md:w-[100px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="white" d="M5 21q-.825 0-1.413-.588T3 19V5q0-.825.588-1.413T5 3h14q.825 0 1.413.588T21 5v14q0 .825-.588 1.413T19 21H5Zm0-2h14V5H5v14Zm1-2h12l-3.75-5l-3 4L9 13l-3 4Zm-1 2V5v14Z"/></svg>
                    <p class={buttonTextClass}>Prédiction</p>
                </a>

                {/* Bouton statistiques globales */}
                <a type="button" class={buttonClass} href="/stats_globales">
                    <svg class="mx-auto w-[50px] md:w-[100px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="white" d="M104 496H72a24 24 0 0 1-24-24V328a24 24 0 0 1 24-24h32a24 24 0 0 1 24 24v144a24 24 0 0 1-24 24Zm224 0h-32a24 24 0 0 1-24-24V232a24 24 0 0 1 24-24h32a24 24 0 0 1 24 24v240a24 24 0 0 1-24 24Zm112 0h-32a24 24 0 0 1-24-24V120a24 24 0 0 1 24-24h32a24 24 0 0 1 24 24v352a24 24 0 0 1-24 24Zm-224 0h-32a24 24 0 0 1-24-24V40a24 24 0 0 1 24-24h32a24 24 0 0 1 24 24v432a24 24 0 0 1-24 24Z"/></svg>
                    <p class={buttonTextClass}>Statistiques globales</p>
                </a>

                {/* Boutons affichés si utilisateur connecté */}
                <Show when={connexion==true}>
                    {/* Bouton statistiques par modèle */}
                    <a type="button" class={buttonClass} href="/stats_modele">
                        <svg class="mx-auto w-[50px] md:w-[100px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="white" d="M19.88 18.47c.44-.7.7-1.51.7-2.39c0-2.49-2.01-4.5-4.5-4.5s-4.5 2.01-4.5 4.5s2.01 4.5 4.49 4.5c.88 0 1.7-.26 2.39-.7L21.58 23L23 21.58l-3.12-3.11zm-3.8.11a2.5 2.5 0 0 1 0-5a2.5 2.5 0 0 1 0 5zm-.36-8.5c-.74.02-1.45.18-2.1.45l-.55-.83l-3.8 6.18l-3.01-3.52l-3.63 5.81L1 17l5-8l3 3.5L13 6l2.72 4.08zm2.59.5c-.64-.28-1.33-.45-2.05-.49L21.38 2L23 3.18l-4.69 7.4z"/></svg>
                        <p class={buttonTextClass}>Statistiques des modèles</p>
                    </a>
                    
                    {/* Bouton entrainement */}
                    <a type="button" class={buttonClass} href="/entrainement">
        
                        <svg class="mx-auto w-[50px] md:w-[100px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path fill="white" d="M6.13 2.793A3.91 3.91 0 0 1 8.5 2c.24 0 .431.125.542.211c.124.098.24.223.344.348a.5.5 0 0 1 .114.318V6.5H8.415a1.5 1.5 0 1 0 0 1H9.5v9.415a.5.5 0 0 1-.183.387C8.855 17.68 8.237 18 7.5 18c-1.186 0-2.069-.598-2.64-1.313a4.057 4.057 0 0 1-.819-1.752a2.68 2.68 0 0 1-1.054-.555C2.435 13.907 2 13.14 2 12c0-.557.037-1.06.12-1.5h3.13c.636 0 1.16.475 1.24 1.089a1.5 1.5 0 1 0 1.004-.006A2.25 2.25 0 0 0 5.25 9.5H2.441c.153-.298.358-.55.625-.729a1.58 1.58 0 0 1 .212-.118c-.284-.832-.21-1.806.064-2.571c.175-.492.453-.957.835-1.267c.252-.205.552-.34.88-.366c.144-.683.549-1.248 1.074-1.656ZM10.5 14.5h.75a2.25 2.25 0 0 0 2.25-2.25v-1.835a1.5 1.5 0 1 0-1 0v1.835c0 .69-.56 1.25-1.25 1.25h-.75V2.877a.5.5 0 0 1 .114-.318c.103-.125.22-.25.344-.348c.11-.086.301-.211.542-.211a3.91 3.91 0 0 1 2.37.793c.525.408.93.973 1.073 1.656c.328.025.628.161.88.366c.382.31.66.775.835 1.267c.274.765.348 1.74.064 2.57c.072.034.143.074.212.12c.275.183.484.445.638.754c.303.605.428 1.449.428 2.474c0 1.141-.435 1.907-.987 2.38a2.68 2.68 0 0 1-1.054.555c-.1.558-.38 1.204-.819 1.752c-.57.715-1.454 1.313-2.64 1.313c-.736 0-1.355-.32-1.816-.698a.5.5 0 0 1-.184-.387V14.5ZM7 6.5a.5.5 0 1 0 0 1a.5.5 0 0 0 0-1Zm0 6a.5.5 0 1 0 0 1a.5.5 0 0 0 0-1Zm6-3a.5.5 0 1 0 0-1a.5.5 0 0 0 0 1Z"/></svg>
                        <p class={buttonTextClass}>Entrainement</p>
                    </a>
        
                    {/* Bouton dataset */}
                    <a type="button" class={buttonClass} href="/dataset">
        
                        <svg class="mx-auto w-[50px] md:w-[100px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="white" d="m7 15l4.5-6l3.5 4.5l2.5-3L21 15m1-11h-8l-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2M2 6H0v14a2 2 0 0 0 2 2h18v-2H2V6Z"/></svg>
                        <p class={buttonTextClass}>Datasets</p>
                    </a>
                </Show>

            </div>
        </section>
    )
}
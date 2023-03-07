// Importations SolidJS
import {createSignal, createResource} from "solid-js";

//Importations customs
import { request } from "../services/services";
import { Formater } from "../services/services";

// Register request
const fetchRegister = async (credentials:any) => (await request('api/authentication/register', 'POST', credentials)).json().then(response=> actionRegister(response))

function actionRegister(response:any){
    if (response == 'ok'){
        console.log("ok=>",response)
        window.location.href ='/'
    }
    else{
        console.log("ko=>",response)
    }
}

export default function Register(){

    // Contient les identifiants transformé
    const [credentials, setCredentials] = createSignal();
    const [login] = createResource(credentials, fetchRegister);

    //Identifiants entrée
    const [username, setUsername] = createSignal('');
    const [ pwd, setPwd ] = createSignal('');

    // Fonction exécuté lors du submit
    const handleRegister = async (event:any) => {
        const formdata=Formater({username: username(), password: pwd()})
        setCredentials(formdata)
    }
    
    return (
        <main class="flex h-screen">
          <div class="w-full max-w-xs m-auto bg-indigo-100 rounded p-5">   
            <div>
              <div>
                <label class="block mb-2 text-indigo-500" for="username">Username</label>
                <input class="w-full p-2 mb-6 text-indigo-700 border-b-2 border-indigo-500 outline-none focus:bg-gray-300" type="text" name="username" value={ username() } oninput={e => setUsername((e.target as HTMLTextAreaElement).value)} />
              </div>
              <div>
                <label class="block mb-2 text-indigo-500" for="password">Password</label>
                <input class="w-full p-2 mb-6 text-indigo-700 border-b-2 border-indigo-500 outline-none focus:bg-gray-300" type="password" name="password" value={ pwd() } oninput={ e => setPwd((e.target as HTMLTextAreaElement).value)}/>
              </div>
              <div>          
                <button class="w-full bg-indigo-700 hover:bg-pink-700 text-white font-bold py-2 px-4 mb-6 rounded text-center cursor-default" onClick={handleRegister}> Enregistrer </button>
              </div>       
            </div>        
          </div>
        </main>
      );
}
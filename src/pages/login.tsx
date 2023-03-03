// import axios from 'axios'
import { createResource, createSignal, onMount } from 'solid-js'
import authenticationCheck from '../utils';
import { request } from '../services/services';
import { Formater } from '../services/services';


// const loginRequest = async (identifiants:Array<string>) => (await axios.post('http://localhost:8000/api/login', {"username":identifiants[0], "password":identifiants[1]}).then(
//   response => {
//     if(response.data.token){
//       // Enregistrement du token dans le local storage
//       localStorage.setItem("Authorization", response.data.token);
//       console.log("token récup depuis backend => ", localStorage.getItem('Authorization'));

//       // // Test requête "GET" authentifié
//       // var authorization = localStorage.getItem("Authorization");
//       // axios.get('http://localhost:8000/api/token_authenticated', { headers: { Authorization : String(authorization) }}).then(response=> {
//       //   console.log(response.data);
//       // })

//       // Redirection
//       window.location.href = '/';
//     }
//     else{
//       // Message d'erreur recup depuis le back-end ; ici déclencher la notification
//       console.log(response.data)
//     }
//   }
// ))

// Enregistre le token et fait la redirection
function actionLogin(response:any){
  if(response.token){
    // Enregistrement du token dans le local storage
    localStorage.setItem("Authorization", response.token);
    console.log("token récup depuis backend => ", localStorage.getItem('Authorization'));

    // Redirection
    window.location.href = '/';
  }
  else{
    // Message d'erreur recup depuis le back-end ; ici déclencher la notification
    console.log(response)
  }
}

// loginRequest
const fetchLogin = async (credentials:any) => (await request('api/authentication/login', "POST", credentials)).json().then(response=> actionLogin(response))

export default function Login() {
  // Contient les identifiants transformé
  const [credentials, setCredentials] = createSignal();
  const [login] = createResource(credentials, fetchLogin);
  
  // Identifiants entrée
  const [username, setUsername] = createSignal('');
  const [ pwd, setPwd ] = createSignal('');
  
  // Vérif du statut d'authentification
  // console.log("authenticationCheck=>",authenticationCheck())

  // Fontion executé lors du submit
  const handleLogin = async (event:any) => {
    const formdata=Formater({username: username(), password:pwd()})
    setCredentials(formdata);
  }

  onMount(()=> {
    // console.log(window.location.href)
  })

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
            <button class="w-full bg-indigo-700 hover:bg-pink-700 text-white font-bold py-2 px-4 mb-6 rounded text-center cursor-default" onClick={handleLogin}> Se connecter </button>
          </div>       
        </div>        
      </div>
    </main>
  );
}
function useState(arg0: string): [any, any] {
  throw new Error('Function not implemented.');
}


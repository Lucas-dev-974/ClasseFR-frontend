import authenticationCheck from "../utils";
import { Switch, Match } from "solid-js";

export default function Navbar(page:any){
    const connexion = authenticationCheck();
    console.log(page.page)
    
    function logout(){
        localStorage.removeItem('Authorization');
        window.location.href = '/';
    }

    return(
        <nav class="w-full text-center text-xl flex justify-center items-center relative" style="height: 64px">
            <a href="/" class="text-center text-white tracking-[.20em]">ClassiFR</a>
            <Switch>
                {/* Bouton Logout */}
                <Match when={connexion}> 
                    <div class="flex absolute right-0">
                        <button class="text-white hidden md:block mr-20" onclick={logout}>Se déconnecter</button>
                        <svg class="block md:hidden mr-2"  onclick={logout} xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24"><path fill="white" d="m17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/></svg>
                    </div>
                </Match>
                
                {/* Bouton Login */}
                <Match when={!connexion && page.page != "login"}>
                    <div class="flex absolute right-0">
                        <button class="text-white hidden md:block mr-20" onClick={ ()=> window.location.href = "/login" }>S'authentifier</button>
                        <svg class="block md:hidden mr-2" onClick={ ()=> window.location.href = "/login" } xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24"><path fill="white" d="M11 7L9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5l-5-5zm9 12h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-8v2h8v14z"/></svg>
                    </div>
                </Match>
            </Switch>
        </nav>
    )
}
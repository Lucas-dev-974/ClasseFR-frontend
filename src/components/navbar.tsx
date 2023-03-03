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
        <nav class="w-full text-center text-xl flex justify-center items-center" style="height: 64px">
            <a href="/" class="text-center text-white tracking-[.20em]">ClassiFR</a>
            <Switch>
                <Match when={connexion} > <button onclick={logout}>se déco</button> </Match>
                <Match when={!connexion && page.page != "login"}>
                    <button onClick={ ()=> window.location.href = "/login"}>S'authentifier</button>
                </Match>
            </Switch>
        </nav>
    )
}
// Importations SolidJS
import { Component, createResource, createSignal, Match, onMount, Show, Switch } from 'solid-js';

// Importations des pages
import Prediction from './pages/Prediction'
import Index from './pages/index';
import Stats_globales from './pages/stats_globales';
import Entrainement from './pages/entrainement';
import Stats_modele from './pages/stats_modele';
import Login from './pages/login';
import Register from './pages/register';

// Importations elts customs
import styles from './App.module.css';
import Navbar from './components/navbar';

import Notification from './services/notification';
import authenticationCheck from './utils';
import { notifs } from './signaux';
import { request } from './services/services';

const App: Component = () => {
  // Récuperer le dernier elt de l'url
  const page = window.location.pathname.split( '/' )[window.location.pathname.split( '/' ).length - 1]; // ATTENTION, implique qu'il n'est pas possible d'avoir des urls dont la fin est identiques

  // var verifToken = jwt.verify(token, "1bc3851624fa399d46350929f20dd5610d0aa5994b621d69");
  // var tokenTest = jwt.sign({data: 'foobar'}, 'secret');
  // console.log("iciiiiiiiiii=>", verifToken);

  // Vérif si utilisateur connecté
  const connexion = authenticationCheck();

  return (
    <main class={styles.App}>
      <Navbar page={page} />

      <Show when={notifs().length > 0}>
        <Notification notif={notifs()[notifs().length - 1]} />
      </Show>
      
      <Switch fallback={<div>Not Found</div>}>
        <Match when={page == ""}> <Index /> </Match>
        <Match when={page == "login" && !connexion}> <Login/> </Match> {/* Concernant la page Login si user pas connecté tente d'y accéder plutot faire une redirection ? */}
        <Match when={page == "register" && connexion}> <Register/> </Match>
        <Match when={page == "prediction"}> <Prediction /> </Match>
        <Match when={page == "stats_globales"}> <Stats_globales/> </Match>
        <Match when={page == "entrainement" && connexion}> <Entrainement/> </Match> {/* OU afficher message perso "Vous devez vous connecter pour avoir accès à cette page !" */}
        <Match when={page == "stats_modele" && connexion}> <Stats_modele/> </Match>
      </Switch>
    </main>
  );
};

export default App;

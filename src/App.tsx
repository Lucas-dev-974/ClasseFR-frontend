import { Component, createSignal, Match, onMount, Show, Switch } from 'solid-js';

// Importations des pages
import Prediction from './pages/Prediction'
import Index from './pages/index';
import Stats_globales from './pages/stats_globales';
import Entrainement from './pages/entrainement';
// import Stats_modele from './pages/stats_modele';
import Stats_modele from './pages/stats_modele';
import Login from './pages/login';

import styles from './App.module.css';
import Navbar from './components/navbar';

import Notification from './services/notification';
import { notifs } from './signaux';

const App: Component = () => {

  // Récuperer le dernier elt de l'url
  const page = window.location.pathname.split( '/' )[window.location.pathname.split( '/' ).length - 1]; // ATTENTION, implique qu'il n'est pas possible d'avoir des urls dont la fin est identiques
  
  return (
    <main class={styles.App}>
      <Navbar page={page} />

      <Show when={notifs().length > 0}>
        <Notification notif={notifs()[notifs().length - 1]} />
      </Show>
      
      <Switch fallback={<div>Not Found</div>}>
        <Match when={page == ""}> <Index /> </Match>
        <Match when={page == "login"}> <Login/> </Match>
        <Match when={page == "prediction"}> <Prediction /> </Match>
        <Match when={page == "stats_globales"}> <Stats_globales/> </Match>
        <Match when={page == "entrainement"}> <Entrainement/> </Match>
        {/* <Match when={page == "stats_modele"}> <Stats_modele/> </Match> */}
        <Match when={page == "stats_modele"}> <Stats_modele/> </Match>
      </Switch>
    </main>
  );
};

export default App;

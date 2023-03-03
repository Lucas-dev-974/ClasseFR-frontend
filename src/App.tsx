import { Component, createSignal, Match, onMount, Show, Switch } from 'solid-js';

// Importations des pages
import Prediction from './pages/Prediction'
import Index from './pages/index';
import Stats_globales from './pages/stats_globales';
// import Stats_modele from './pages/stats_modele';

import styles from './App.module.css';
import Navbar from './components/navbar';


const App: Component = () => {

  // Récuperer le dernier elt de l'url
  const page = window.location.pathname.split( '/' )[window.location.pathname.split( '/' ).length - 1]; // ATTENTION, implique qu'il n'est pas possible d'avoir des urls dont la fin est identiques 
  
  return (
    <main class={styles.App}>
      <Navbar />
      <Switch fallback={<div>Not Found</div>}>
        <Match when={page == ""}> <Index /> </Match>
        <Match when={page == "prediction"}> <Prediction /> </Match>
        <Match when={page == "stats_globales"}> <Stats_globales/> </Match>
        {/* <Match when={page == "stats_modele"}> <Stats_modele/> </Match> */}
      </Switch>
    </main>
  );
};

export default App;

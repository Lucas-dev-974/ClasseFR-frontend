import { Component, createSignal, Match, onMount, Show, Switch } from 'solid-js';
import Prediction from './pages/Prediction'
import Index from './pages/index';

import styles from './App.module.css';
import Navbar from './components/navbar';


const App: Component = () => {
  const page = window.location.pathname.split( '/' )[window.location.pathname.split( '/' ).length - 1]
  
  return (
    <main class={styles.App}>
      <Navbar />
      <Switch fallback={<div>Not Found</div>}>
        <Match when={page == ""}>
          <Index />
        </Match>
        <Match when={page == "prediction"}>
          <Prediction />
        </Match>
      </Switch>
    </main>
  );
};

export default App;

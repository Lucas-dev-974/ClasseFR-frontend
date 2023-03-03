import { Component, createSignal, Match, onMount, Show, Switch } from 'solid-js';


import styles from './App.module.css';



const App: Component = () => {
  const page = window.location.pathname.split( '/' )[window.location.pathname.split( '/' ).length - 1]
  
  return (
    <main class={styles.App}>

    </main>
  );
};

export default App;

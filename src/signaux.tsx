import { createStore } from 'solid-js/store';
import { createEffect, onMount } from 'solid-js';

const [user, setUser]       = createStore({})
const [_notif, setNotif]    = createStore([])

export const [classes, setClasses] = createStore([])
export const [trainClassesSelect, setTrainClassesSelect] = createStore([]);

export const [models, setModels] = createStore([])
export const [selectedModel, setSelectedModel] = createStore()

// Functions
export const notifs    = () => { return _notif }
export const pushNotif = (__notif: any) => {
    console.log(__notif)
    const notif = {
        id:      notifs().length + 1,
        message: __notif.message,
        color:   __notif.color ?? 'blue'
    }
    
    setNotif([...notifs(), notif]);
}
export const removeNotif = (notifid: number) => setNotif((items: any) => items.filter((item: any) => item.id !== notifid));

// Models
// export const pushModel   = (model: Object) => {}


export const selectClasse = (classe: any) => {
    classe = JSON.parse(classe.target.value)
    const classe_ever_selected = trainClassesSelect.map(clas => clas.id == classe.id).includes(true)
    
    if(classe_ever_selected) setTrainClassesSelect(trainClassesSelect.filter(clas => clas.id != classe.id))
    else setTrainClassesSelect([...trainClassesSelect, classe])  
}


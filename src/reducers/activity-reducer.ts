import ActivityList from "../components/ActivityList"
import { Activity } from "../types"

export type ActivityActions = {
    type: 'save-activity', payload: { newActivity: Activity }//El payload es lo que contiene los datos 
} |
{ type: 'set-activeId', payload: { id: Activity['id'] } } |
{ type: 'delete-activity', payload: { id: Activity['id'] } }|
{ type: 'restar-app'}


export type ActivityState = {
    activities: Activity[],
    activeId: Activity['id']
}
const localStorageActivities = (): Activity[] => {
    //Si localStorage contiene algun elemento lo unico que hacemos es obtener el contenido y si no solo retornamos un arreglo vacio 
    const activities = localStorage.getItem('activities')
    return activities ? JSON.parse(activities) : []
}
export const initialState: ActivityState = {
    activities: localStorageActivities(),
    activeId: ''
}
export const ActivityReducer = (
    state: ActivityState = initialState,
    action: ActivityActions
) => {
    if (action.type === 'save-activity') {
        //Este codigo maneja la logica para actualizar el state 
        let updatedActivities: Activity[] = []
        if (state.activeId) {//Si existe la actividad se edita 
            updatedActivities = state.activities.map(activity => activity.id === state.activeId
                ? action.payload.newActivity// si existe se remplaza con la nueva informacion para la edicion 
                : activity //Si no se encutra simplemente se mantiene lo que ya se tiene 
            )
        } else {
            updatedActivities = [...state.activities, action.payload.newActivity] //Si hay un nuevo elemento se agrega al arreglo  
        }

        return {//Actualizamos y copiamos el state por si se añaden nuevos elementos al arreglo 
            ...state,
            activities: updatedActivities,//[...state.activities, action.payload.newActivity]//Optenemos la informacion ingresada del action 
            activeId: ''

        }

    }
    if (action.type === 'set-activeId') {
        return {
            ...state,
            activeId: action.payload.id,
        }
    }
    if (action.type === 'delete-activity') {
        return {
            ...state,
            activities: state.activities.filter(activity => activity.id !== action.payload.id)//Eliminamos el elemento que selecciono el usuario 
        }

    }
    if (action.type === 'restar-app') {
        return {
            activities:[],
            activeId:''
        }
    }
    return state
}
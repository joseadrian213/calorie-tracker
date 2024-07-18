import { useState, ChangeEvent, FormEvent, Dispatch, useEffect } from "react"
import {v4 as uuidv4} from "uuid"
import { Activity } from "../types"
import { categories } from "../data/categories"
import { ActivityActions, ActivityState } from "../reducers/activity-reducer"
type FormProps ={
 dispatch:Dispatch<ActivityActions>,
 state:ActivityState   
}
const initialState={
    id:uuidv4(),
    category: 1,//Estamos asignando el valor defecto que tendra 
    name: '',
    calories: 0
}
export default function Form({dispatch, state}:FormProps) {
    const [activity, setActivity] = useState<Activity>(initialState)
    useEffect(()=>{
        if (state.activeId) {
            const selectedActivity=state.activities.filter(stateActivity=>stateActivity.id === state.activeId)[0]//Retornamos posición 0 para que retorne un objeto  
            setActivity(selectedActivity)
        }
    },[state.activeId])
    //Aqui estamos utilizando un type union y se utiliza cuando estamos pasando diferentes tipos de parametros
    //Le indicamos que sera de tipo select o tipo input 
    const handleChange = (e: ChangeEvent<HTMLSelectElement> | ChangeEvent<HTMLInputElement>) => {
       const isNumberField=['category','calories'].includes(e.target.id)//Verificamos que elementos son numeros cons nombres que le pasamos por las llaves 
       
        setActivity({
            ...activity,//Copiamos el objeto para no perder la informacion 
            // [e.target.id]: e.target.value //Le pasamos la informacion al objeto el primer target obitne el id y lo asigna de manera automatica al objeto cuando encuentre su llave y el segundo tan solo contiene el valor 
            [e.target.id]: isNumberField? +e.target.value : e.target.value//Si es numero lo que hacemos es convertir a numero con + 
        })
    }
    //Maneja opacidad del boton si contiene informacion 
    const isValidActivity=()=>{
        const {name,calories}=activity
        return name.trim() !== '' && calories>0; 

    }
    const handleSubmit=(e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        dispatch({type:'save-activity',payload:{newActivity:activity}})
        setActivity({
            ...initialState,
            id:uuidv4()//De esta forma permitimos que se actualice un id nuevo cada que se introduzca un nuevo dato 
        })
    }
    return (
        <form
            className="space-y-5 bg-white shadow p-10 rounded-lg"
            onSubmit={handleSubmit}
        >
            <div className="grid grid-cols-1 gap-3">
                <label htmlFor="category" className="font-bold">Categoría:</label>
                <select name="" id="category"
                    className="border border-slate-300 p-2 rounded-lg w-full bg-white"
                    value={activity.category}
                    onChange={handleChange}
                >
                    {categories.map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                </select>
            </div>
            <div className="grid grid-cols-1 gap-3">
                <label htmlFor="name" className="font-bold">Actividad:</label>
                <input type="text" id="name"
                    className="border border-slate-300 p-2 rounded-lg"
                    placeholder="Ej. Comida, Jugo de Naranja, Ensalada, Ejercicio, Pesas, Bicicleta"
                    value={activity.name}
                    onChange={handleChange}

                />
            </div>
            <div className="grid grid-cols-1 gap-3">
                <label htmlFor="calories" className="font-bold">Calorías:</label>
                <input type="number" id="calories"
                    className="border border-slate-300 p-2 rounded-lg"
                    placeholder="Calorías. ej. 300 o 500"
                    value={activity.calories}
                    onChange={handleChange}

                />
            </div>

            <input type="submit"
                className="bg-gray-800 hover:bg-gray-900 w-full p-2 font-bold uppercase text-white
            cursor-pointer disabled:opacity-10"
                value={activity.category ===1 ? `Guardar Comida`:`Guardar Ejercicio`}
                disabled={!isValidActivity()}
            />
        </form>
    )
}

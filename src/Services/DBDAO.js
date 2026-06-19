// Crud para tasks

// Funcion de creacion de tareas

import {supabase} from "./supabaseClient.js";
import {validateTask} from "../utils/validators.js";

// Metodos de crud para tasks

//Añadir
export async function addTask(tasks) {
    if (validateTask(tasks.nombre, tasks.descripcion)) {
        const {error} = await supabase
            .from('Tasks')
            .insert({
                nombre: tasks.nombre,
                descripcion: tasks.descripcion,
                fecha_completada: null,
                user_id: tasks.user_id
            });
        if (error) {
            throw new Error(error.message);
        }
        return {success: true};
    } else {
        throw new Error("Datos de tarea invalidos");
    }
}

//Actualizar
export async function updateTask(tasks) {
    if (validateTask(tasks.nombre, tasks.descripcion)) {
        const {error} = await supabase
            .from('Tasks')
            .update({
                nombre: tasks.nombre,
                descripcion: tasks.descripcion,
                })
            .eq('id', tasks.id);
            if (error) {
                throw new Error(error.message);
            }
            return {success: true};
    } else {
        throw new Error("Datos de tarea invalidos");
    }
}

//Borrar
export async function deleteTask(tasks) {
    if (!tasks.id) {
        throw new Error("La tarea no existe.")
    }
    const {error} = await supabase
        .from('Tasks')
        .delete()
        .eq('id', tasks.id)
        .eq('user_id', tasks.user_id);
    if (error) {
        throw new Error(error.message);
    }
    return {success: true};
}

//Agarrar
export async function getTasks(user_id) {
    if (!user_id) {
        throw new Error("ID de usuario requerido");
    }
    const {data, error} = await supabase
        .from('Tasks')
        .select()
        .eq('user_id', user_id);
    if (error) {
        throw new Error(error.message);
    }
    return data;
}

//Marcarlas como completadas
export async function markTaskComplete(tasks) {
    if (!tasks.id) {
        throw new Error("ID de tarea requerido");
    }
    const {error} = await supabase
        .from('Tasks')
        .update({ fecha_completada: new Date().toISOString(), completada: true })
        .eq('id', tasks.id)
        .eq('user_id', tasks.user_id);
    if (error) {
        throw new Error(error.message);
    }
    return { success: true };
}

//Crud para users

//Esto es para funciones futuras

export async function getUser(user_id) {
    if (!user_id) {
        throw new Error("Id de usuario requerido");
    }
    const {data, error} = await supabase
        .from('users')
        .select()
        .eq('user_id', user_id);
        if(error) {
            throw new Error(error.message);
        }
        return data;
}

export async function updateUserProfile(user_id, nombre) {
    if (!user_id || !nombre || nombre.trim().length === 0) {
        throw new Error("ID de usuario requerido");
    }
    const {data, error} = await supabase
        .from('users')
        .update({ nombre: nombre })
        .eq('user_id', user_id);
        if (error) {
            throw new Error(error.message);
        }
        return data;
}

//Crud para rachas

//Agarra las rachas
export async function getRacha(user_id){
    if (!user_id) {
        throw new Error("ID de usuario requerido");
    }
    const {data, error} = await supabase
        .from(`Rachas`)
        .select()
        .eq('user_id', user_id);
    if (error) {
        throw new Error(error.message);
    }
    return data;
}

//Actualiza las rachas
export async function updateRacha(user_id, racha) {
    if (!user_id || !racha) {
        throw new Error("Datos de racha requeridos.");
    }
    const {error} = await supabase
        .from('Rachas')
        .update({
            dias_consecutivos: racha.dias_consecutivos,
            multiplicador: racha.multiplicador,
            puntos_totales: racha.puntos_totales,
            fecha_completada_ultima_tarea: racha.fecha_completada_ultima_tarea,
            record: racha.record
        })
        .eq('user_id', user_id)
        if(error) {
            throw new Error(error.message);
        }
        return {success: true};
}
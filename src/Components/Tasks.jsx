import '../styles/Tasks.css';
import {useContext, useState} from "react";
import {AuthContext} from "../Context/AuthContext.jsx";
import {validateTask} from "../utils/validators.js";

export function Tasks({onMarcarHecha, tareasNoHechas, onEliminarTarea, onAddTarea, onEditarTarea}) {
    // Props desde Dashboard

        const [titulo, setTitulo] = useState("");
        const [descripcion, setDescripcion] = useState("");
       const [error, setError] = useState('')
       const Auth = useContext(AuthContext);
       const [editandoId, setEditandoId] = useState(null);


    async function handleAddTarea(e){
        // Validar con Validator.js
        // Si falla, setError y retornar
        // Llamar a DBDAO.addTarea(titulo, descripcion)
        // setTareas actualizado
        e.preventDefault();
        if (validateTask(titulo, descripcion, Auth.user.id)) {
            console.log('añadiendo tarea: ', titulo, descripcion, Auth.user.id);
            onAddTarea(titulo, descripcion, Auth.user.id)
        } else {
            setError("Tarea no valida");
            return;
        }
    }

    function handleClickEditar(tarea) {
        console.log('click editar:', tarea);
        setEditandoId(tarea.id);
        setTitulo(tarea.nombre);
        setDescripcion(tarea.descripcion);
    }

     async function handleEditarTarea(e){
         // Validar
         // Llamar a DBDAO.updateTarea(id, titulo, descripcion)
         // setTareas actualizado
         console.log('handleEditarTarea ejecutado');
         e.preventDefault();
         if (validateTask( titulo, descripcion)){
             onEditarTarea(editandoId, titulo, descripcion);
             setEditandoId(null);
             setTitulo("");
             setDescripcion("");
         } else {
             setError("Tarea no valida");
         }
     }

     function handleEliminarTarea(id){
         onEliminarTarea(id);
     }


     function handleMarcarHecha(id){
         // Llamar a onMarcarHecha(id) que viene de Dashboard
         // Dashboard actualiza la racha
            onMarcarHecha(id);
     }

    return (
        <div className="tasks-container">
            <form onSubmit={(e) => {
                console.log('editandoId en submit:', editandoId);
                editandoId ? handleEditarTarea(e) : handleAddTarea(e)}}>
                <input value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Título" />
                <input value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Descripción" />
                <button type="submit" className="add-btn">Añadir</button>
            </form>

            {error && <p className="error-message">{error}</p>}

            <div className="tasks-list">
                {tareasNoHechas.map(tarea => (
                    <div key={tarea.id} className="task-card">
                        <h2 className="task-title">{tarea.titulo}</h2>
                        <p className="task-description">{tarea.descripcion}</p>

                        <div className="task-actions">
                            <button type="button" className="btn-edit" onClick={() => handleClickEditar(tarea)}>Editar</button>
                            <button type="button" className="btn-delete" onClick={() => handleEliminarTarea(tarea.id)}>Eliminar</button>
                        </div>

                        <div className="task-checkbox-wrapper">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    className="task-checkbox"
                                    onChange={() => handleMarcarHecha(tarea.id)}
                                />
                                ¿Está completada?
                            </label>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Tasks;
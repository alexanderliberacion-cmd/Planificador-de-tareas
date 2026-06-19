import '../styles/Tasks.css';
import {useContext, useState} from "react";
import {AuthContext} from "../Context/AuthContext.jsx";
import {validateTask} from "../utils/validators.js";

export function Tasks({onMarcarHecha, tareasNoHechas, onEliminarTarea, onAddTarea, onEditarTarea}) {
    //States
    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [error, setError] = useState('')
    const Auth = useContext(AuthContext);
    const [editandoId, setEditandoId] = useState(null);

    //Maneja el añadir tarea
    async function handleAddTarea(e){
        e.preventDefault();

        //Si es valido llamara a onaddTarea y la añadira, si no dara error y cerrara la aplicacion
        if (validateTask(titulo, descripcion, Auth.user.id)) {
            onAddTarea(titulo, descripcion, Auth.user.id)
        } else {
            setError("Tarea no valida");
        }
    }

    //Maneja el clickear el boton de editar y actualiza los estados
    function handleClickEditar(tarea) {
        setEditandoId(tarea.id);
        setTitulo(tarea.nombre);
        setDescripcion(tarea.descripcion);
    }

    //Maneja el editar la tarea
     async function handleEditarTarea(e){
         e.preventDefault();

         //Si es valida llamara a onEditarTarea y reinicia el formularia, si no dara error
         if (validateTask( titulo, descripcion)){
             onEditarTarea(editandoId, titulo, descripcion);
             setEditandoId(null);
             setTitulo("");
             setDescripcion("");
         } else {
             setError("Tarea no valida");
         }
     }

    //Maneja el eliminar una tarea segun su id, y llamara a onEliminarTarea
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
            <form onSubmit={(e) => {editandoId ? handleEditarTarea(e) : handleAddTarea(e)}}>
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
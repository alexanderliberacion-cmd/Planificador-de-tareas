import Tasks from "./Tasks.jsx";
import Rachas from "./Rachas.jsx";
import '../styles/Dashboard.css';
import {addTask, deleteTask, getRacha, getTasks, markTaskComplete, updateRacha, updateTask} from "../Services/DBDAO.js";
import {useContext, useEffect, useState} from "react";
import {AuthContext} from "../Context/AuthContext.jsx";

export const Dashboard = () => {

    //Este componente enseñara las tareas y las rachas y las podras declarar como hechas.
    const [tasks, setTasks] = useState([]);
    const [dias, setDias] = useState(0);
    const [multiplicador, setMultiplicador] = useState(1);
    const [puntosTotales, setPuntosTotales] = useState(0);
    const [record, setRecord] = useState(0);
    const [rachas, setRachas] = useState([]);
    const Auth = useContext(AuthContext);

    //Comprueban si las tareas estan completadas o no
    const tareasNoHechas = tasks.filter(tarea => !tarea.completada);
    const tareasHechas = tasks.filter(tarea => tarea.completada === true);

    //Carga las tareas y rachas desde el dao
    useEffect(() => {
            async function loadTasks() {
               const data = await getTasks(Auth.user.id);
                setTasks(data);
            }
            loadTasks();
            async function loadRachas() {
               const data = await getRacha(Auth.user.id);
                setRachas(data);
        }
        loadRachas();

    },[])


    //calcula la racha
    async function calcularRacha(tareasHechas){
        const today = new Date(); //Agarra una nueva fecha cada dia
        let diasCalculados = 0;
        //Si la nueva fecha, que es una string basada en el apartado de rachas de fecha completada, es igual a today entonces se añadira
        //la longitud de tareasHechas a diasCalculados.
        // Si esta nueva date es menor o igual que toda, significara que el usuario ha saltado un dia y se reseteara la racha
        if(new Date(rachas[0]?.fecha_completada_ultima_tarea).toDateString() === today.toDateString()) {
            diasCalculados = tareasHechas.length;
        } else if (rachas[0]?.fecha_completada_ultima_tarea <= today) {
            diasCalculados = 0;
        }
        let multiplicador = 0;

        //Calcula el multiplicador segun los dias calculados.
        if (diasCalculados >= 1 && diasCalculados <= 4) {
                multiplicador = 1;
        } else if (diasCalculados >= 5 && diasCalculados <= 9) {
                multiplicador = 2;
        } else if (diasCalculados >= 10) {
                multiplicador = 3;
        } else if (diasCalculados == 0) {
            multiplicador = 1;
        }

        //Calcula las tareasHechas y el multiplicador para sacar los puntos
        const puntosTotales = tareasHechas.length *  multiplicador

        return {diasCalculados, multiplicador, puntosTotales}
    }

    // Se actualiza el record, si los dias son superiores al record, el nuevo record es el valor de dias.
    function actualizarRecord(){
        if (dias > record) {
            setRecord(dias);
        }
    }

    //Este useffect maneja la actualizacion de las rachas
   useEffect(() => {
       //Revisa si hay tareasHechas y actualiza los valores. Despues simplemente llama a updateRacha del Dao
       async function handleRachaUpdate() {
           if (tareasHechas.length > 0) {
               const {diasCalculados, multiplicador, puntosTotales} = await calcularRacha(tareasHechas);
               setDias(diasCalculados);
               setMultiplicador(multiplicador);
               setPuntosTotales(puntosTotales);
               actualizarRecord();
               await updateRacha(Auth.user.id, {dias_consecutivos: diasCalculados, multiplicador, puntos_totales: puntosTotales, record, fecha_completada_ultima_tarea: new Date().toISOString()});
           }
       }
       handleRachaUpdate();
   }, [tareasHechas,Auth.user.id]);


    //Las marca como hechas segun el id
     async function onMarcarHecha(id){
         await markTaskComplete({id: id ,user_id: Auth.user.id});
         const resultOfHechas = await getTasks(Auth.user.id);
         setTasks(resultOfHechas);
     }
    //Las elimina segun el id
     async function onEliminarTarea(id){
         await deleteTask({id:id, user_id: Auth.user.id});
         const resultOfDeleted = await getTasks(Auth.user.id);
         setTasks(resultOfDeleted);
     }
    //Maneja el añadir tarea, recibiendo los datos de addTask en Dao y actualizandolos
     async function onAddTarea(nombre, descripcion, user_id){
        await addTask({nombre, descripcion, user_id});
        const resultOfAdded = await getTasks(Auth.user.id);
        setTasks(resultOfAdded);
     }

    //Maneja el editar tareas recibiendo el updateTask de Dao y actualizando los valores
     async function onEditarTarea(id, titulo, descripcion) {
         await updateTask({id, nombre: titulo, descripcion, user_id: Auth.user.id});
         const resultOfEditarTarea = await getTasks(Auth.user.id);
         setTasks(resultOfEditarTarea);
     }


    return (
        <div className="dashboard">
            <div className="dashboard-wrapper">
                <div className="tasks-section">
                    <Tasks onMarcarHecha={onMarcarHecha} tareasNoHechas={tareasNoHechas} tareasHechas={tareasHechas} onEliminarTarea={onEliminarTarea} onAddTarea={onAddTarea} onEditarTarea={onEditarTarea} />
                </div>
                <div className="rachas-section">
                    <Rachas dias={dias} multiplicador={multiplicador} puntosTotales={puntosTotales} record={record} />
                </div>
                <button onClick={Auth.logout} className="logout">Logout</button>
            </div>
        </div>
    )
}

export default Dashboard;
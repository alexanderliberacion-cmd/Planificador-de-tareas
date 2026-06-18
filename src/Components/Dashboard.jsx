import Tasks from "./Tasks.jsx";
import Rachas from "./Rachas.jsx";
import '../styles/Dashboard.css';
import {addTask, deleteTask, getRacha, getTasks, markTaskComplete, updateRacha, updateTask} from "../Services/DBDAO.js";
import {useContext, useEffect, useState} from "react";
import {AuthContext} from "../Context/AuthContext.jsx";



export const Dashboard = () => {

    //Este componente enseñara las tareas y las rachas y las podras declarar como hechas.
    const [tasks, setTasks] = useState([])
    const [dias, setDias] = useState(0);
    const [multiplicador, setMultiplicador] = useState(1);
    const [puntosTotales, setPuntosTotales] = useState(0);
    const [record, setRecord] = useState(0);
    const [rachas, setRachas] = useState([]);
    const Auth = useContext(AuthContext);

    const tareasNoHechas = tasks.filter(tarea => !tarea.completada);
    const tareasHechas = tasks.filter(tarea => tarea.completada === true);

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



    async function calcularRacha(tareasHechas){
        // Revisa la fecha de última tarea completada vs hoy
        // Si es hoy, incrementa días en 1
        // Si pasó más de 1 día, resetRacha()
        // Calcula multiplicador según días
        // Calcula puntos = tareasCompletadas * multiplicador
        const today = new Date();
        let diasCalculados = 0;
        if(new Date(rachas[0]?.fecha_completada_ultima_tarea).toDateString() === today.toDateString()) {
            diasCalculados = tareasHechas.length;
        } else if (rachas[0]?.fecha_completada_ultima_tarea <= today) {
            diasCalculados = 0;
        }
        let multiplicador = 0;

        if (diasCalculados >= 1 && diasCalculados <= 4) {
                multiplicador = 1;
        } else if (diasCalculados >= 5 && diasCalculados <= 9) {
                multiplicador = 2;
        } else if (diasCalculados >= 10) {
                multiplicador = 3;
        } else if (diasCalculados == 0) {
            multiplicador = 1;
        }

        const puntosTotales = tareasHechas.length *  multiplicador

        return {diasCalculados, multiplicador, puntosTotales}
    }

    function actualizarRecord(){
        // Si dias > record, setRecord(dias)
        if (dias > record) {
            setRecord(dias);
        }
    }

   useEffect(() => {
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




     async function onMarcarHecha(id){
         // Esta funcion declarara como hechas o no hechas las tareas de tasks, como un callback pasado a tasks.
         await markTaskComplete({id: id ,user_id: Auth.user.id});
         const resultOfHechas = await getTasks(Auth.user.id);
         setTasks(resultOfHechas);
     }

     async function onEliminarTarea(id){
         await deleteTask({id:id, user_id: Auth.user.id});
         const resultOfDeleted = await getTasks(Auth.user.id);
         setTasks(resultOfDeleted);
     }

     async function onAddTarea(nombre, descripcion, user_id){
        await addTask({nombre, descripcion, user_id});
        const resultOfAdded = await getTasks(Auth.user.id);
        setTasks(resultOfAdded);
     }

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
                <button onClick={Auth.logout} className="Logout">Logout</button>
            </div>
        </div>
    )
}

export default Dashboard;
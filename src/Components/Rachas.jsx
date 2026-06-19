import '../styles/Rachas.css';
import {useContext, useEffect, useState} from "react";
import {getRacha} from "../Services/DBDAO.js";
import {AuthContext} from "../Context/AuthContext.jsx";

export function Rachas({dias, multiplicador, puntosTotales, record}){

    const [rachas, setRachas] = useState([]);
    const Auth = useContext(AuthContext);

    //Carga las rachas
    useEffect(() => {
        async function loadRacha(){
            const data = await getRacha(Auth.user.id)
            setRachas(data);
        }
        loadRacha();
    },[])

    return (
        <div className="rachas-container">
            <div className="rachas-card">
                <div className="rachas-header">
                    <h2 className="rachas-title">Racha</h2>
                </div>
                <div className="racha-item">
                    <span className="racha-label">Días:</span>
                    <span className="racha-value">{dias}</span>
                </div>
                <div className="racha-item">
                    <span className="racha-label">Multiplicador:</span>
                    <span className="racha-value">{multiplicador}x</span>
                </div>
                <div className="racha-item">
                    <span className="racha-label">Puntos:</span>
                    <span className="racha-value">{puntosTotales}</span>
                </div>
                <div className="racha-item">
                    <span className="racha-label">Récord:</span>
                    <span className="racha-value">{record}</span>
                </div>
            </div>
        </div>
    )
}

export default Rachas;
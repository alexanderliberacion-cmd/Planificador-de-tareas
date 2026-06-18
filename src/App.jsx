import Login from "./Components/Login.jsx";
import Register from "./Components/Register.jsx";
import Dashboard from "./Components/Dashboard.jsx";
import './styles/App.css';
import {useContext} from "react";
import {AuthContext} from "./Context/AuthContext.jsx";

export default function App() {
    const {user} = useContext(AuthContext);
    if (!user) {
        return (
            <main className="main">
                <div className="header">
                    <h1 className="title">Planificador de tareas</h1>
                    <section className="auth-buttons">
                        <Login/>
                        <Register/>
                    </section>
                </div>
            </main>
        )
    } else {
        return (
            <main className="main">
                <div className="header">
                    <h1 className="title">Planificador de tareas</h1>
                </div>
                <Dashboard/>
            </main>
        )
    }

}
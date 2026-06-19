import '../styles/Login.css';
import {useContext, useState} from "react";
import {AuthContext} from "../Context/AuthContext";
import {validateEmail, validatePassword} from "../utils/validators.js";
import {useNavigate} from "react-router-dom";

export const Login = () => {
    const {login} = useContext(AuthContext)

    //State para email y password
     const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate();

    //Maneja el inicio de sesion.
    async function handleLogin(e){
        e.preventDefault();

        //Si no esta validado saltara un mensaje de error y saldra de la aplicacion.
        if (!validateEmail(email) || !validatePassword(password)){
            setError('Email o contraseña no valida');
            return;
        }
        //Si esta validado entonces llamara a login de dao y te llevara al Dashboard. Si no dara mensaje de error
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (error) {
            setError(error.message);
        }
    }

    return (
        <form onSubmit={handleLogin} autoComplete="off">
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
            {error && <p className="error-message">{error}</p>}
            <button type="submit" className="login-btn">Login</button>
        </form>
    )
}

export default Login;
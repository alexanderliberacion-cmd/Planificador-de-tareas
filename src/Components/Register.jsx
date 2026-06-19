import '../styles/Register.css';
import {useContext, useState} from "react";
import {AuthContext} from "../Context/AuthContext";
import {validateEmail, validatePassword} from "../utils/validators.js";
import {useNavigate} from "react-router-dom";

export const Register = () => {
    // States
     const [email, setEmail] = useState('');
     const [password, setPassword] = useState('');
     const [error, setError] = useState('');
    const {register} = useContext(AuthContext);
    const navigate = useNavigate();

    //Registra a el usuario
    async function registerUser(e){
        e.preventDefault();

        //Si no es valido muestra error y cierra la aplicacion
        if (!validateEmail(email) || !validatePassword(password)){
            setError('Email o contraseña no valida');
            return;
        }

        // Si es valido se registrara con el metodo de dao y te enviara al dashboard. Si no saldra un mensaje de error.
        try {
            await register(email,password);
            navigate('/dashboard');
        } catch(error) {
            setError(error.message);
        }
    }

    return (
        <form onSubmit={registerUser} autoComplete="off">
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            {error && <p className="error-message">{error}</p>}
            <button type="submit" className="register-btn">Register</button>
        </form>
    )

}

export default Register;
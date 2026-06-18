import '../styles/Register.css';
import {useContext, useState} from "react";
import {AuthContext} from "../Context/AuthContext";
import {validateEmail, validatePassword} from "../utils/validators.js";
import {useNavigate} from "react-router-dom";

export const Register = () => {
    // State para email y password
     const [email, setEmail] = useState('')
     const [password, setPassword] = useState('')
     const [error, setError] = useState('')
    const {register} = useContext(AuthContext);
    const navigate = useNavigate();
    async function registerUser(e){
        // Valida con validator.js
        //Si no se usa setError y se retorna
        //Llama a la api de Supabase
        // Si existe, setError
        // Si es exitoso se redirige a Dashboard
        // Si falla setError
        e.preventDefault();

        if (!validateEmail(email) || !validatePassword(password)){
            setError('Email o contraseña no valida');
            return;
        }

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
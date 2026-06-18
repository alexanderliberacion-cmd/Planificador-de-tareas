import {createContext} from "react";
import {useEffect, useState} from "react";
import {supabase} from "../Services/supabaseClient.js";

// Creando el objeto para el router
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); //el estado del usuario
    const [loading, setLoading] = useState(true); //Si esta cargando o no.

    //Cuando se inicia la app revisa si el usuario tiene session o no.
    // Si tiene session se le añadira al estado, si no se quedara como no.
    //Despues simplemente se vuelve a poner el loading, como false
    useEffect(() => {
        supabase.auth.onAuthStateChange((event, session) => {
            if (session) {
                setUser(session.user);
            } else {
                setUser(null);
            }
            setLoading(false);
        })
    }, [])

    function login(email, password) {
        return supabase.auth.signInWithPassword({email,password});

    }

    async function register(email,password) {
        await supabase.auth.signUp({email,password});
    }

    function logout() {
        return supabase.auth.signOut();
    }

    return (
        <AuthContext.Provider value={{user, loading, login, register, logout}}>
            {children}
        </AuthContext.Provider>
    )
}
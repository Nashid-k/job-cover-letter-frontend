import React, { createContext, useContext, useState } from "react";
// import { loginUser } from "../../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({children}) =>{
    const [user, setUser] = useState(null);

    const loginUser = (user, token) =>{
        setUser(user);
        localStorage.setItem("token", token)
    };

    const logoutUser = () =>{
        setUser(null);
        localStorage.removeItem("token");
    }

    return (
        <AuthContext.Provider value={{user, loginUser, logoutUser}}>
            {children}
        </AuthContext.Provider>
    )
};


// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(){
    return useContext(AuthContext)
}
import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode"

const AuthContext = createContext(null);

function AuthProvider({children}) {
    const [user ,setUser] = useState(null);

    useEffect(()=>{
        const token = localStorage.getItem("token");
        if(token){
            const decodedUser = jwtDecode(token)
            if(decodedUser.exp * 1000 < Date.now()){
                console.log("Token expired, logging out...");
                localStorage.removeItem("token");
            }else{
                setUser(decodedUser)
            }
        }
    },[])

    const login = (token) =>{
        localStorage.setItem("token", token);
        const {username, id, ...rest} = jwtDecode(token)
        setUser({username, id});
    }

    const logout = () =>{
        localStorage.removeItem("token");
        setUser(null)
    }

  return (
    <AuthContext.Provider value={{ user , login , logout}}>
        {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider

export const useAuth = () =>{
    return useContext(AuthContext)
}
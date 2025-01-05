import { createContext, ReactNode, useContext, useEffect, useState } from "react"
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Loader } from "../../../components/Loader/Loader";

interface User{
    id: string,
    email: string,
    emailVerified: boolean
}

interface AuthenticationContentType{
    user: User | null,
    login: (email: string, password: string) => Promise<void>,
    signup: (email: string, password: string) => Promise<void>,
    logout: () => void
}

const AuthenticationContext = createContext<AuthenticationContentType | null>(null);

export function useAuthentication(){
    return useContext(AuthenticationContext)
}

export const AuthenticationContextProvider = ( ) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true)
    const location = useLocation();

    const isOnAuthPage = 
    location.pathname === "/login" || location.pathname === "/signup" || location.pathname === "/request-password-reset";

    const login = async (email: string, password: string) => {
        try{
            const response = await fetch("/api/v1/auth/login" , {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({email, password})
            })
            if( !response.ok ){
                const errorData = await response.json()
                const {message} = errorData
                throw new Error(message)
            }
            const {token} = await response.json()
            localStorage.setItem("token", token)
        }catch(error){
            //console.log("Error in Login", (error as Error).message)
            throw error;
        }
    }

    const signup = async (email: string, password: string) => {
        setIsLoading(true)
        try{
            const response = await fetch("/api/v1/auth/register" , {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({email, password})
            })
            const data = await response.json()
            if( !response.ok ){
                const {message} = data
                throw new Error(message)
            }
            const {token} = data
            localStorage.setItem("token", token)
        }catch(error){
            console.log("Error in Login", (error as Error).message)
            throw error;
        }finally{
            setIsLoading(false)
        }
    }

    const logout = () => {
        localStorage.removeItem("token")
        setUser(null)
    }
    
    const fetchUser = async () => {
        const token = localStorage.getItem("token")
        if(!token){
            setUser(null)
            setIsLoading(false)
            return
        }
        setIsLoading(true)
        console.log("FetchUser se ejecuto")
        try{
            const response = await fetch("/api/v1/auth/user", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if(!response.ok){
                throw new Error("Authentication failed")
            }
            const user = await response.json()
            setUser(user)
        }catch(error){
            console.log(error)
        }finally{
            setIsLoading(false)
        }
    }

    useEffect( () =>  {
        //this will call when the context has been rendered, when the component is rendered
        if(user){
            return
        }
        fetchUser()
    }, [user, location.pathname])

    if(isLoading){
        return <Loader />
    }

    if(!isLoading && !user && !isOnAuthPage){
        return <Navigate to="/login" />
    }

    if( user && user.emailVerified && isOnAuthPage ){
        return <Navigate to="/" />
    }


  return (
    <AuthenticationContext.Provider value={{ user, login, signup, logout }}>
        {
            user && !user.emailVerified ? <Navigate to="/verify-email" /> : null
        }
        <Outlet />
    </AuthenticationContext.Provider> 
  )
}

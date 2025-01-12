import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState } from "react"
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Loader } from "../../../components/Loader/Loader";

export interface User{
    id: string,
    email: string,
    name: string,
    emailVerified: boolean,
    profilePicture?: string,
    firstName?: string,
    lastName?: string,
    company?: string,
    position?: string,
    location?: string,
    profileCompleted: boolean
}

interface AuthenticationContentType{
    user: User | null,
    setUser: Dispatch<SetStateAction<User | null>>
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
    location.pathname === "/auth/login" || location.pathname === "/auth/signup" || 
    location.pathname === "/auth/request-password-reset";

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
            //console.log(error)
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
        return <Navigate to="/auth/login" />
    }

    if( user && !user.emailVerified && location.pathname !== "/auth/verify-email" ){
        console.log(user)
        return <Navigate to="/auth/verify-email" />
    }

    if( user && user.emailVerified && location.pathname == "/auth/verify-email" ){
        return <Navigate to="/" />
    }

    if(
        user &&
        user.emailVerified &&
        !user.profileCompleted
        && !location.pathname.includes("/auth/profile")
    ){
        return <Navigate to={`/auth/profile/${user.id}`} />
    }

    if(
        user &&
        user.emailVerified &&
        user.profileCompleted &&
        location.pathname.includes("/auth/profile")
    ){
        return <Navigate to="/" />
    }

    if(user && isOnAuthPage){
        return <Navigate to="/" />
    }

  return (
    <AuthenticationContext.Provider value={{ user, login, signup, logout, setUser }}>
        <Outlet />
    </AuthenticationContext.Provider> 
  )
}

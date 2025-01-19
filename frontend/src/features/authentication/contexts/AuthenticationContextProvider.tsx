import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState } from "react"
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Loader } from "../../../components/Loader/Loader";
import { request } from "../../../utils/api";

export interface AuthenticationResponse{
    token: string,
    message: string
}

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
        await request<AuthenticationResponse>({
            endpoint: "/api/v1/auth/login",
            method: "POST",
            body: JSON.stringify({email, password}),
            onSuccess: ({token}) => {
                localStorage.setItem("token", token)
            },
            onFailure: (err) => {
                throw new Error(err)
            }
        })
    }

    const signup = async (email: string, password: string) => {
        await request<AuthenticationResponse>({
            endpoint: "/api/v1/auth/register",
            method: "POST",
            body: JSON.stringify({email, password}),
            onSuccess: ( {token} ) => {
                localStorage.setItem("token", token)
            },
            onFailure: (err) => {
                throw new Error(err);
            }
        })
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
        await request<User>({
            endpoint: "/api/v1/auth/user",
            onSuccess: data => setUser(data),
            onFailure: (err) => console.log(err)
        })
        setIsLoading(false)
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

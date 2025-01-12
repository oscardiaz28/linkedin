import { Link, useNavigate } from "react-router-dom"
import { Box } from "../../components/Box/Box"
import { Button } from "../../../../components/Button/Button"
import { Input } from "../../../../components/Input/Input"

import styles from '../../components/AuthLayout/AuthLayout.module.scss'
import { Separator } from "../../components/Separator/Separator"
import classes from './Signup.module.scss'
import { FormEvent, useState } from "react"
import { useAuthentication } from "../../contexts/AuthenticationContextProvider"

export const Signup = () => {

  const [errorMessage, setErrorMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const {signup} = useAuthentication()
  const navigate = useNavigate();
  
  const doSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrorMessage("")
    setIsLoading(true)
    const email = e.currentTarget.email.value;
    const password = e.currentTarget.password.value;
    try{
      await signup(email, password)
      navigate("/")
    }catch(error){
      if(error instanceof Error){
        setErrorMessage(error.message)
      }else{
        setErrorMessage("Un error inesperado ha ocurrido");
      }
    }finally{
      setIsLoading(false)
    }
  }

  return (
    <div>
      <Box>
        <h1>Regístrate</h1>
        <p className={styles.subtitle_form}>Saca el máximo partido a tu vida profesional.</p>
        <form action="" onSubmit={ doSignup }>
          <Input type="email" id="email" label="Email" />
          <Input type="password" id="password" label="Password" />
          {errorMessage && <p className={styles.error}>{errorMessage}</p>}
          <p className={classes.disclaimer}>
          Al hacer clic en «Aceptar y Unirse», aceptas las <a href="">Condiciones de uso</a>, la <a href="">Política de privacidad</a> y la <a href="">Política de cookies</a> de LinkedIn.
          </p>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "..." : "Aceptar y Unirse"}
          </Button>
        </form>
        <Separator>o</Separator>
        <div className={styles.register}>
          ¿Ya estás en LinkedIn? <Link to="/auth/login">Iniciar sesión</Link>
        </div>
      </Box>
    </div>
  )
}

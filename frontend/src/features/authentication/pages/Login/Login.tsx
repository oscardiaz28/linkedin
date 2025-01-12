import { FormEvent, useState } from "react"
import { Box } from "../../components/Box/Box"

import styles from '../../components/AuthLayout/AuthLayout.module.scss'
import { Input } from "../../../../components/Input/Input"
import { Button } from "../../../../components/Button/Button"
import { Separator } from "../../components/Separator/Separator"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuthentication } from "../../contexts/AuthenticationContextProvider"


export const Login = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const {login} = useAuthentication();
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLogin = async (e: FormEvent<HTMLFormElement> ) => {
    e.preventDefault()
    const email = e.currentTarget.email.value;
    const password = e.currentTarget.password.value;
    setErrorMessage("")
    try{
      await login(email, password)
      const destination = location.state?.from || "/";
      navigate(destination)
    }catch(error){
      if(error instanceof Error){
        setErrorMessage(error.message)
      }else{
        setErrorMessage("Un error inesperado ha ocurrido")
      }
    }
  }

  return (
    <div>
      <Box>
        <h1>Iniciar Sesión</h1>
        <p className={styles.subtitle_form}>Mantente al día de tu mundo profesional.</p>
        <form action="" onSubmit={ handleLogin }>
          <Input type="email" id="email" label="Email" />
          <Input type="password" id="password" label="Password" />
          {errorMessage && <p className={styles.error}>{errorMessage}</p>}
          <Button type="submit">
            Iniciar Sesión
          </Button>
        </form>
        <Separator>o</Separator>
        <div className={styles.register}>
          ¿Estás empezando a usar LinkedIn? <Link to="/auth/signup">Unirse ahora</Link>
        </div>
      </Box>
    </div>
  )
}

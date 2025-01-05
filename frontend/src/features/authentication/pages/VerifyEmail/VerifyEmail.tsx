import { FormEvent, useState } from "react"
import { Box } from "../../components/Box/Box"
import { Input } from "../../components/Input/Input"
import { Layout } from "../../components/Layout/Layout"

import classes from '../../components/Layout/Layout.module.scss'
import styles from './VerifyEmail.module.scss'
import { Button } from "../../components/Button/Button"
import { useNavigate } from "react-router-dom"
import { useAuthentication } from "../../contexts/AuthenticationContextProvider"

export const VerifyEmail = () => {

  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const navigate = useNavigate()
  const {logout} = useAuthentication()
 
  const handleVerify = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true)
    const token = e.currentTarget.code.value;
    await validateEmail(token)
  }

  const validateEmail = async (code: string) => {
    setMessage("")
    setErrorMessage("")
    try{
      const response = await fetch(`/api/v1/auth/validate-email-verification-token?token=${code}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })
      if(!response.ok){
        const errorData = await response.json()
        const {message} = errorData
        throw new Error(message)                
      }
      setErrorMessage("")
      navigate("/")
    }catch(e){
      if(e instanceof Error){
        setErrorMessage(e.message)
      }else{
        setErrorMessage("Hubo un error")
      }
    }finally{
      setIsLoading(false)
    }
  }

  const sendEmailVerificationAgain = async () => {
    setMessage("")
    setErrorMessage("")
    try{
      const response = await fetch("/api/v1/auth/send-email-verification-token", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })
      if(!response.ok){
        throw new Error(`Hubo un error`)
      }
      setErrorMessage("")
      setMessage("Codigo enviando exitosamente. Por favor revisa tu email.")
    }catch(e){
      if(e instanceof Error){
        setErrorMessage(e.message)
      }else{
        setErrorMessage("Hubo un error")
      }
    }
  }

  const exit = () => {
    logout()
  }

  return (
    <Layout>
      <Box>
        <button className={styles.exit} onClick={ exit }>Salir</button>
        <h1>Verifica tu email</h1>
        <p className={classes.subtitle_form}>Solo queda un paso para completar tu registro. Verifica tu dirección de correo electrónico</p>
        <form action="" onSubmit={ handleVerify }>
          <Input type="text" key="code" name="code" label="Codigo de verificación" />
          {message && <p className={classes.correct} >{message}</p> }
          {errorMessage && <p className={classes.error} >{errorMessage}</p> }
          <Button type="submit" disabled={isLoading}>
            { isLoading ? "Validando" : "Validar email" }
          </Button>
          <Button type="button" outline style={{marginTop: "1rem"}} onClick={ sendEmailVerificationAgain } >Enviar nuevamente</Button>
        </form>

      </Box>
    </Layout>
  )
}

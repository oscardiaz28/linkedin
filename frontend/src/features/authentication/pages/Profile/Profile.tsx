import { useState } from 'react'
import { Box } from '../../components/Box/Box'
import { useAuthentication } from '../../contexts/AuthenticationContextProvider'
import styles from './Profile.module.scss'
import { Input } from '../../../../components/Input/Input'
import { Button } from '../../../../components/Button/Button'
import { useNavigate } from 'react-router-dom'

export const Profile = () => {
    const {user, setUser, logout} = useAuthentication()
    const [step, setStep] = useState(0)
    const [error, setError] = useState("")
    const [data, setData] = useState({
        firstname: "",
        lastname: "",
        company: "",
        position: "",
        location: ""
    })
    const navigate = useNavigate()

    const onSubmit = async () => {
        try{
            const url = `/api/v1/auth/profile/${user?.id}?firstname=${data.firstname}&lastname=${data.lastname}&company=${data.company}&position=${data.position}&location=${data.location}`
            const response = await fetch(url, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })
            if(!response.ok){
                const {message} = await response.json()
                throw new Error(message)
            }
            const updatedUser = await response.json()
            setUser(updatedUser)
            navigate("/")

        }catch(err){
            if(err instanceof Error){
                setError(err.message)
            }else{
                setError("Ha ocurrido un error")
            }
        }
    }

  return (
    <div className={styles.root}>
        <button className={styles.btn_exit} onClick={ () => logout() } >Salir</button>
        <Box>
            <h1>Un ultimo paso</h1>
            <p className={styles.subtitle}>Cuéntanos un poco sobre ti para que podamos personalizar tu experiencia.</p>
            {step == 0 && (
                <div className={styles.inputs}>
                    <Input 
                    onFocus={ () => setError("") }
                    required
                    label='Nombre'
                    name='firstname'
                    placeholder='John'
                    value={data.firstname || ""}
                    onChange={ (e) => setData( (prev) => ({...prev, firstname: e.target.value}) ) }
                    />
                    <Input 
                    onFocus={ () => setError("") }
                    required
                    label='Apellidos'
                    name='lastname'
                    placeholder='Doe'
                    value={data.lastname || ""}
                    onChange={ (e) => setData( (prev) => ({...prev, lastname: e.target.value}) ) }
                    />
                </div>
            )}
            {step == 1 && (
                <div className={styles.inputs}>
                    <Input 
                    onFocus={ () => setError("") }
                    required
                    label='Ultima Empresa'
                    name='company'
                    placeholder='Google Inc'
                    value={data.company || ""}
                    onChange={ (e) => setData( (prev) => ({...prev, company: e.target.value}) ) }
                    />
                    <Input 
                    onFocus={ () => setError("") }
                    required
                    label='Ultimo Puesto'
                    name='position'
                    placeholder='Software Engineer'
                    value={data.position || ""}
                    onChange={ (e) => setData( (prev) => ({...prev, position: e.target.value}) ) }
                    />
                </div>
            )}
            {step == 2 && (
                <div className={styles.inputs}>
                    <Input 
                    onFocus={ () => setError("") }
                    required
                    label='Ubicación'
                    name='location'
                    value={data.location || ""}
                    placeholder='San Francisco, CA'
                    onChange={ (e) => setData( (prev) => ({...prev, location: e.target.value}) ) }
                    />
                </div>
            )}
            {error && <p className={styles.error}>{error}</p> }
            <div className={styles.buttons}>
                {step > 0 && (
                    <Button outline onClick={ () => setStep( (prev) => prev - 1 ) } >
                        Regresar
                    </Button>
                )}
                {step < 2 && (
                    <Button
                    disabled={
                        (step == 0 && (!data.firstname || !data.lastname) ) ||
                        (step == 1 && (!data.company || !data.position) ) 
                    }
                    onClick={ () => setStep((prev) => prev + 1) }
                    >
                        Siguiente
                    </Button>
                )}
                { step === 2 && (
                    <Button 
                    disabled={!data.location}
                    onClick={ onSubmit }
                    >
                        Guardar
                    </Button>
                ) }
            </div>
            
        </Box>

    </div>
  )
}

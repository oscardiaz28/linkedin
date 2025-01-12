import { Dispatch, FormEvent, SetStateAction, useState } from 'react'
import styles from './Modal.module.scss'
import { Input } from '../../../../components/Input/Input'
import { Button } from '../../../../components/Button/Button'

interface PostingModalProps{
    showModal: boolean,
    content?: string,
    picture?: string,
    setShowModal: Dispatch<SetStateAction<boolean>>,
    setShowActions?: Dispatch<SetStateAction<boolean>>,
    onSubmit: (content: string, picture: string) => Promise<void>,
    title: string

}

export const Modal = ( { title, onSubmit, showModal, content, picture, setShowModal, setShowActions } : PostingModalProps ) => {
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)
        const content = e.currentTarget.content.value
        const picture = e.currentTarget.picture.value
        if(!content){
            setError("El contenido es requerido")
            setIsLoading(false)
            return
        }
        try{
            await onSubmit(content, picture)
            if(setShowActions){
                setShowActions(false)
            }
        }catch(err){
            if(err instanceof Error){
                setError(err.message)
            }else{
                setError("Ha ocurrido un error")
            }
        }finally{
            setIsLoading(false)
            setShowModal(false)
        }
    }

    if(!showModal) return null;

  return (
    <div className={styles.root}>
        <div className={styles.modal}>
            <div className={styles.header}>
                <h3 className={styles.title}>{title}</h3>
                <button onClick={ () => {
                    setShowModal(false)
                    if(setShowActions){
                        setShowActions(false)
                    }
                } }>
                <svg width="13" height="13" viewBox="-0.5 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 21.32L21 3.32001" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M3 3.32001L21 21.32" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
            </div>
            <form action="" onSubmit={ handleSubmit }>
                <div className={styles.body}>
                    <textarea  
                    placeholder='¿Sobre qué quieres hablar?'
                    onFocus={ () => setError("") }
                    onChange={ () => setError("") }
                    name='content'
                    defaultValue={content} 
                    />
                    <Input 
                    defaultValue={picture}
                    placeholder='URL de imagen (opcional)'
                    name='picture'
                    style={{marginBlock: 0}}
                    />
                </div>
                {error && <div className={styles.error}>{error}</div> }
                <div className={styles.footer}>
                    <Button type='submit' disabled={isLoading} >
                        Post
                    </Button>
                </div>
            </form>
        </div>
    </div>

  )



}

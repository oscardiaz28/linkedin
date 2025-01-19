import { useNavigate } from 'react-router-dom'
import { useAuthentication, User } from '../../../authentication/contexts/AuthenticationContextProvider'
import styles from './Comment.module.scss'
import { useState } from 'react'
import { timeAgo } from '../../utils/date'
import { Input } from '../../../../components/Input/Input'

export interface Comment{
    id: number,
    content: string,
    author: User,
    creationDate: string,
    updatedDate: string
}

interface CommentProps{
    comment: Comment,
    deleteComment: (commentId: number) => Promise<void>,
    editComment: (commentId: number, content: string) => Promise<void>
}

export const Comment = ( { comment, deleteComment, editComment } : CommentProps) => {

    const navigate = useNavigate();
    const [showActions, setShowActions] = useState(false);
    const [editing, setEditing] = useState(false)
    const [commentContent, setCommentContent] = useState(comment.content)
    const {user} = useAuthentication()

  return (
    <div className={styles.root} key={comment.id}>
        { !editing ? (
            <>
                <div className={styles.header}>
                    <button className={styles.author}
                    >
                        <img src={comment.author.profilePicture || "avatar.svg"} alt="" 
                        className={styles.avatar}
                        />
                        <div>
                            <div className={styles.name}>
                                {comment.author.firstName + " " + comment.author.lastName}
                            </div>
                            <div className={styles.title}>
                                {comment.author.position + " " + comment.author.company}
                            </div>
                            <div className={styles.date}>
                                {timeAgo(new Date(comment.updatedDate || comment.creationDate))}
                                {comment.updatedDate ? " . Editado" : ""}
                            </div>
                        </div>
                    </button>
                    {comment.author.id == user?.id && (
                        <button
                            className={`${styles.toggle} ${showActions ? styles.active : ""}`}
                            onClick={ () => setShowActions(!showActions) }
                            >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 512">
                                <path d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z" />
                            </svg>
                        </button>
                         )}
                        {showActions && (
                            <div className={styles.menu}>
                                <button onClick={ () => setEditing(true) } >Editar</button>
                                <button onClick={ () => deleteComment(comment.id) } >Eliminar</button>
                            </div>
                    )}
                </div>
                <div className={styles.content}>{comment.content}</div>
            </>
        ) : (
            <div className={styles.form_edit_container}>
                <form action=""
                onSubmit={ async (e) => {
                    e.preventDefault()
                    await editComment(comment.id, commentContent),
                    setEditing(false)
                    setShowActions(false)
                } }
                >
                    <Input 
                    type='text'
                    value={commentContent}
                    onChange={ (e) => {
                        setCommentContent(e.target.value)
                    } }
                    placeholder='Edita tu comentario'
                    />
                </form>
                <button className={styles.toggle} onClick={ () => {
                    setEditing(false)
                    setShowActions(false)
                } }>
                    <svg width="15" height="15" viewBox="-0.5 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 21.32L21 3.32001" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M3 3.32001L21 21.32" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>
            </div>
        )}
    </div>
  )
}

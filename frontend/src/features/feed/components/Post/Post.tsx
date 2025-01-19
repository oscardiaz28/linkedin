import { Dispatch, FormEvent, SetStateAction, useEffect, useState } from 'react'
import { useAuthentication, User } from '../../../authentication/contexts/AuthenticationContextProvider'
import styles from './Post.module.scss'
import { useNavigate } from 'react-router-dom'
import { timeAgo } from '../../utils/date'
import { Input } from '../../../../components/Input/Input'
import { Comment } from '../Comment/Comment'
import { Modal } from '../Modal/Modal'
import { TimeAgo } from '../TimeAgo/TimeAgo'
import { request } from '../../../../utils/api'
import { useWebSocket } from '../../../ws/Ws'

export interface Post{
  id: number,
  content: string,
  author: User,
  picture?: string,
  creationDate?: string,
  updatedDate?: string
}

interface PostProps{
  post: Post,
  setPosts?: Dispatch<SetStateAction<Post[]>>
}

export const Post = ( {post, setPosts} : PostProps ) => {
  const navigate = useNavigate();
  const {user} = useAuthentication();
  const [showMenu, setShowMenu] = useState(false)
  const [editing, setEditing] = useState(false)
  const [showComments, setShowComments] = useState(false)
  
  const [content, setContent] = useState("")
  const [comments, setComments] = useState<Comment[]>([])
  const [likes, setLikes] = useState<User[]>([]);
  const [postLiked, setPostLiked] = useState<boolean | undefined>(undefined)
  const {client} = useWebSocket();

  useEffect(() => {
    const fetchComments = async () => {
      try{
        const url = `/api/v1/feed/posts/${post.id}/comments`
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}` 
          }
        })
        if(!response.ok){
          const {message} = await response.json()
          throw new Error(message)
        }
        const data = await response.json()
        setComments(data)
      }catch(err){
        if(err instanceof Error){
          console.log(err.message)
        }else{
          console.log("Ha ocurrido un error")
        }
      }
    }
    fetchComments()
  }, [post.id])

  useEffect( () => {
    const fetchLikes = async () => {
      try{
        const url = `/api/v1/feed/posts/${post.id}/likes`
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}` 
          }
        })
        if(!response.ok){
          const {message} = await response.json()
          throw new Error(message)
        }
        const data = await response.json()
        setLikes(data)
        setPostLiked( !!data.some( (like: User) => like.id === user?.id ) )
      }catch(err){
        if(err instanceof Error){
          console.log(err.message)
        }else{
          console.log("Ha ocurrido un error")
        }
      }
    }
    fetchLikes()
  }, [post.id, user?.id] )

  useEffect(() => {
    const subscription = client?.subscribe(`/topic/likes/${post.id}`, (message) => {
      const likes = JSON.parse(message.body)
      setLikes(likes)
      setPostLiked(likes.some( (like: User) => like.id === user?.id ))
    })
    return () => subscription?.unsubscribe();

  }, [post.id, user?.id, client])

  useEffect(() => {
    const subscription = client?.subscribe(`/topic/comments/${post.id}`, (message) => {
      const comment = JSON.parse(message.body)
      setComments( (prev) => [comment, ...prev] )
    })
    return () => subscription?.unsubscribe();
  }, [post.id, client])
  
  const like = async () => {
    setPostLiked((prev) => !prev)
    await request<Post>({
      endpoint: `/api/v1/feed/posts/${post.id}/like`,
      method: "PUT",
      onSuccess: () => {
      },
      onFailure: (err) => {
        console.log(err)
        setPostLiked( (prev) => !prev )
      }
    })
  }

  const deletePost = async (id: number) => {
    const url = `/api/v1/feed/posts/${id}`
    try{
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })
      if(!response.ok){
        const {message} = await response.json()
        throw new Error(message);
      }
      setPosts( (prev) => prev.filter( (p) => p.id !== id ) )

    }catch(err){
      console.log(err)
    }
  }

  const editComment = async (id: number, content: string) => {
    try{
      const url = `/api/v1/feed/comments/${id}`
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({content})
      })
      if(!response.ok){
        const {message} = await response.json()
        throw new Error(message)
      }
      setComments( (prev) => 
        prev.map( (comment) => (comment.id === id) ? {...comment, content} : comment )
      )

    }catch(err){
      if(err instanceof Error){
        console.log(err.message)
      }else{
        console.log("Ha ocurrido un error.")        
      }
    }
  }

  const deleteComment = async (id: number) => {
    try{
      const url = `/api/v1/feed/comments/${id}`
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })
      if(!response.ok){
        const {message} = await response.json()
        throw new Error(message)
      }
      setComments( (prev) => prev.filter( (comment) => comment.id !== id ) )
    }catch(err){
      if(err instanceof Error){
        console.log(err.message)
      }else{
        console.log("Ha ocurrido un error.")        
      }
    }
  }

  const postComment =  async (e : FormEvent<HTMLFormElement> ) => {
    e.preventDefault();
    if(!content){
      return;
    }
    try{
      const url = `/api/v1/feed/posts/${post.id}/comment`
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({content})
      })
      if(!response.ok){
        const {message} = await response.json()
        throw new Error(message)
      }
      const data = await response.json()
      setContent("")
    }catch(err){{
      if(err instanceof Error){
        console.log(err.message)
      }else{
        console.log("Ha ocurrido un error.")        
      }
    }}

  }

  const editPost = async (content: string, picture: string) => {
    try{
      const url = `/api/v1/feed/posts/${post.id}`
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({content, picture})
      })
      if(!response.ok){
        const {message} = await response.json()
        throw new Error(message)
      }
      const data = await response.json()
      setPosts( (prev) => {
        return prev.map( (p) => {
          if(p.id === post.id){
            return data
          }
          return p
        })
      } )

    }catch(err){
      if(err instanceof Error){
        console.log(err.message)
      }else{
        console.log("Ha ocurrido un error.")        
      }
    }
    setShowMenu(false)
  }

  return (

    <>
      {editing ? <Modal 

      onSubmit={ editPost }
      title='Editar Publicación' 
      content={post.content}
      picture={post.picture}
      showModal={editing}
      setShowModal={setEditing}
      setShowActions={setShowMenu}

      /> : null}
      <div className={styles.root}>

        <div className={styles.top}>

          <div className={styles.author}>
            <button
            onClick={ () => navigate("/profile/"+post.author.id) }
            >
              <img src={post.author.profilePicture || "avatar.svg" } className={styles.avatar} alt="" />
            </button>
            <div className={styles.info}>
              <div className={styles.name}>{post.author.firstName + " " + post.author.lastName}</div>
              <div className={styles.title}>{post.author.position + " at " + post.author.company}</div>
              <TimeAgo date={post.creationDate || ''} edited={!!post.updatedDate} />
            </div>
          </div>
          <div className={styles.options}>
            {post.author.id == user?.id && (
              <button
              className={`${styles.toggle} ${showMenu ? styles.active : ""}`}
              onClick={ () => setShowMenu(!showMenu) }
              >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 512">
                  <path d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z" />
                </svg>
              </button>
            )}
            {showMenu && (
              <div className={styles.menu}>
                <button onClick={ () => setEditing(true) } >Editar</button>
                <button onClick={ () => deletePost(post.id) } >Eliminar</button>
              </div>
            )}

          </div>

        </div>

        <div className={styles.content}>
            {post.content}
        </div>

        {post.picture && ( <img src={post.picture} alt="" className={styles.picture} /> ) }

        <div className={styles.stats}>
          
              { likes.length > 0 ? (
                <div className={styles.stat}>
                  <span>{postLiked ? "You " : likes[0].firstName + " " + likes[0].lastName + " "}</span>
                  {likes.length - 1 > 0 ? (
                    <span>
                      and {likes.length - 1} {likes.length - 1 === 1 ? "other " : "others "}
                    </span>
                  ) : null}
                  liked this
              </div>
            )  : (
            <div></div>
          )}

          {comments.length > 0 ? (
            <button className={styles.stat} onClick={ () => setShowComments((prev) => !prev) }>
              <span>{comments.length} { comments.length == 1 ? "comentario" : "comentarios" }</span>
            </button>
          ) : (
            <div></div>
          )}

        </div>

        <div className={styles.actions}>

          <button onClick={ like } className={postLiked ? styles.active : "" }>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor">
              <path d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8l0-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5l0 3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20-.1-.1s0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5l0 3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2l0-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z" />
            </svg>
            <span>Like</span>
          </button>

          <button
          onClick={ () => {
            setShowComments( (prev) => !prev)
          } }
          className={ showComments ? styles.active : "" }
          >
            <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                  <path d="M123.6 391.3c12.9-9.4 29.6-11.8 44.6-6.4c26.5 9.6 56.2 15.1 87.8 15.1c124.7 0 208-80.5 208-160s-83.3-160-208-160S48 160.5 48 240c0 32 12.4 62.8 35.7 89.2c8.6 9.7 12.8 22.5 11.8 35.5c-1.4 18.1-5.7 34.7-11.3 49.4c17-7.9 31.1-16.7 39.4-22.7zM21.2 431.9c1.8-2.7 3.5-5.4 5.1-8.1c10-16.6 19.5-38.4 21.4-62.9C17.7 326.8 0 285.1 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208s-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9c-11.9 8.7-31.3 20.6-54.3 30.6c-15.1 6.6-32.3 12.6-50.1 16.1c-.8 .2-1.6 .3-2.4 .5c-4.4 .8-8.7 1.5-13.2 1.9c-.2 0-.5 .1-.7 .1c-5.1 .5-10.2 .8-15.3 .8c-6.5 0-12.3-3.9-14.8-9.9c-2.5-6-1.1-12.8 3.4-17.4c4.1-4.2 7.8-8.7 11.3-13.5c1.7-2.3 3.3-4.6 4.8-6.9l.3-.5z" />
                </svg>
              <span>Comentarios</span>
          </button>

        </div>

        {showComments ? (
          <div className={styles.comments}>
            <form action="" onSubmit={ postComment }>
              <Input 
              onChange={ (e) => setContent(e.target.value)  }
              value={content}
              placeholder='Agrega un comentario...'
              name='content'
              style={{marginBlock: 0}}
              />
            </form>
            {comments?.map( (comment) => {
              return (
                <Comment 
                  key={comment.id}
                  editComment={ editComment }
                  comment={comment}
                  deleteComment={deleteComment}
                />
              )
            } )}
          </div>
        ) : null }

      </div>
    </>

  )
}

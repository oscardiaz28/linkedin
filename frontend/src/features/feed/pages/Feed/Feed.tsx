import { useNavigate } from 'react-router-dom'
import { useAuthentication } from '../../../authentication/contexts/AuthenticationContextProvider'
import styles from './Feed.module.scss'
import { RightSidebar } from '../../components/RightSidebar/RightSidebar'
import { LeftSidebar } from '../../components/LeftSidebar/LeftSidebar'
import { Button } from '../../../../components/Button/Button'
import { useEffect, useState } from 'react'
import { Modal } from '../../components/Modal/Modal'
import { Post } from '../../components/Post/Post'

export const Feed = () => {

  const {user} = useAuthentication()
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [feedContent, setFeedContent] = useState<"all" | "connexions">("connexions")
  const [posts, setPosts] = useState<Post[]>([])
  const [error, setError] = useState("")

  const handlePost = async (content: string, picture: string) => {
    try{
      const url = `/api/v1/feed/posts`
      const response = await fetch(url, {
        method: "POST",
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
      setPosts( (prevPosts) => [data, ...prevPosts] )
    }catch(err){
      if(err instanceof Error){
        setError(err.message)
      }else{
        setError("Un error ocurrio. Por favor intenta mas tarde")
      }
    }
  }

  useEffect( () => {
    const fetchPosts = async () => {
      try{
        const url = "/api/v1/feed" + (feedContent === "connexions" ? "" : "/posts")
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        })
        if(!response.ok){
          const {message} = await response.json()
          throw new Error(message)
        }
        const data = await response.json()
        setPosts(data)
      }catch(e){
        if(e instanceof Error){
          setError(e.message)
        }else{
          setError("Un error ocurrio. Por favor intenta mas tarde")
        }
      }
    }
    fetchPosts()
  }, [feedContent] )
  
  
  return (
    <div className={styles.root}>

      <div className={styles.left}>
        <LeftSidebar />
      </div>

      <div className={styles.center}>
        <div className={styles.posting}>

          <button className={styles.btn_picture} onClick={ () => navigate(`/profile/${user?.id}`)  }>
            <img src={user?.profilePicture || "avatar.svg"} alt="" 
            className={`${styles.top} ${styles.avatar}`}
            />
          </button>
          <button className={styles.btn_posting} onClick={ () => setShowModal(true) } >Crear Publicación</button>

          <Modal title="Crear Publicación" onSubmit={ handlePost } showModal={showModal} setShowModal={setShowModal} /> 

        </div>

        <div className={styles.header}>
          <button
          className={feedContent == "all" ? styles.active : "" }
          onClick={ () => setFeedContent("all") }
          >Todos</button>

          <button
          className={feedContent == "connexions" ? styles.active : "" }
          onClick={ () => setFeedContent("connexions") }
          >Feed</button>
        </div>

        <div className={styles.feed}>
          {posts.map( (post) => (
            <Post key={post.id} post={post} setPosts={setPosts} />
          ) )}
        </div>

      </div>
      
      <div className={styles.right}>
        <RightSidebar />
      </div>
      

    </div>
  )
}

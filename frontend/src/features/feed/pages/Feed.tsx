import { useNavigate } from 'react-router-dom'
import { useAuthentication } from '../../authentication/contexts/AuthenticationContextProvider'
import styles from './Feed.module.scss'

export const Feed = () => {

  const {user, logout} = useAuthentication()
  const navigate = useNavigate()

  const handleLogout = () => {  
    logout()
    navigate("/login")
  }

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <div>Hola {user?.email}</div>
        <span>|</span>
        <button onClick={ handleLogout }>Logout</button>
      </header>

      <main className={styles.content}>

        <div className={styles.left}></div>

        <div className={styles.center}>
          <div className={styles.posting}></div>
          <div className={styles.feed}></div>
        </div>
        
        <div className={styles.right}>

        </div>

      </main>

    </div>
  )
}

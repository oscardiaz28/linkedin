import { Dispatch, SetStateAction } from 'react'
import styles from './Profile.module.scss'
import { useAuthentication } from '../../../../features/authentication/contexts/AuthenticationContextProvider'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../../../Button/Button'

interface  ProfileProps {
    setShowNavigationMenu: Dispatch<SetStateAction<boolean>>
    showProfileMenu: boolean,
    setShowProfileMenu: Dispatch<SetStateAction<boolean>>
}

export const Profile = ({setShowNavigationMenu, showProfileMenu, setShowProfileMenu}: ProfileProps ) => {

  const {user, logout} = useAuthentication()
  const navigate = useNavigate()

  const handleLogout = () => {  
    logout()
    navigate("/auth/login")
  }

  return (
    <div className={styles.root}>
      <button className={styles.toggle}
        onClick={ () => {
          setShowProfileMenu((prev) => !prev)
          if(window.innerWidth <= 1080){
            setShowNavigationMenu(false)
          }
        } }
      >
        <img  
        className={`${styles.top} ${styles.avatar}`}
        src={user?.profilePicture || "avatar.svg"}
        />
        <div className={styles.name}>
          {user?.firstName + " " + user?.lastName.charAt(0)+"."}
        </div>

      </button>

      {showProfileMenu ? (
        <div className={styles.menu}>

          <div className={styles.content}>
            <img 
            className={`${styles.left} ${styles.avatar}`}
            src={user?.profilePicture || "avatar.svg"}
            />
            <div className={styles.right}>
              <div className={styles.name}>{user?.firstName + " " + user?.lastName}</div>
              <div className={styles.title}>{user?.position + " " + user?.company}</div>
            </div>
          </div>

          <Button
            type='button'
            outline
            onClick={ () => {
              setShowProfileMenu(false)
              navigate(`/profile/${user?.id}`)
            } }
          >
            Ver Perfil
          </Button>

          <button className={styles.btn_logout}
          onClick={ () => {
            logout()
            navigate("/auth/login")
          } }
          >Cerrar Sesión</button>

        </div>
      ) : null }
      
    </div>
  )
}

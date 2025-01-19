import { NavLink } from 'react-router-dom'
import styles from './Header.module.scss'
import { Input } from '../Input/Input'
import { useAuthentication } from '../../features/authentication/contexts/AuthenticationContextProvider'
import { useEffect, useState } from 'react'
import { Profile } from './components/Profile/Profile'
import { NavigationMenu } from './components/NavigationMenu/NavigationMenu'
import { useWebSocket } from '../../features/ws/Ws'
import { request } from '../../utils/api'
import { Notification } from '../../features/feed/pages/Notifications/Notifications'

export const Header = () => {
  const {user} = useAuthentication();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNavigationMenu, setShowNavigationMenu] = useState(
    window.innerWidth > 1080 ? true : false
  )
  const { client, connected } = useWebSocket();
  const [notifications, setNotifications] = useState<Notification[]>([])
  const nonReadNotificationsCount = notifications.filter( (notification) => !notification.read ).length
  
  useEffect(() => {
      const fetchNotifications = async () => {
          await request<Notification[]>({
              endpoint: "/api/v1/notifications",
              onSuccess: (data) => setNotifications(data),
              onFailure: (err) => console.log(err) 
          })
      } 
      fetchNotifications();
  }, [])

  useEffect( () => {
      const subscription = client?.subscribe(`/topic/users/${user?.id}/notifications`, (message) => {
          const notification = JSON.parse(message.body)
          setNotifications( (prev) => {
              const index = prev.findIndex( (n) => n.id == notification.id )
              if( index === -1 ){
                  return [notification, ...prev]
              }
              return prev.map( (n) => (n.id === notification.id ? notification: n ))
          } )
      })
      return () => subscription?.unsubscribe()
  }, [user?.id, client])   
  

  useEffect(() => {
    //watch window size changes
    const handleResize = () => {
      setShowNavigationMenu(window.innerWidth > 1080 )
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize);
    }

  }, [])


  return (
    <header className={styles.root}
    >
        <div className={styles.container}>

            <div className={styles.left}>
                <NavLink to="/">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-supported-dps="24x24" fill="currentColor" className={styles.logo} width="40" height="40" focusable="false">
        <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"></path>
                  </svg>
                </NavLink>
                <input type="text" placeholder='Buscar' className={styles.input} />
            </div>

            <div className={styles.right}>

              <button className={styles.toggle} onClick={ () => {
                setShowNavigationMenu( (prev) => !prev)
                setShowProfileMenu(false)
              }}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor">
                  <path d="M0 96C0 78.3 14.3 64 32 64l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 128C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32L32 448c-17.7 0-32-14.3-32-32s14.3-32 32-32l384 0c17.7 0 32 14.3 32 32z" />
                </svg>
                <span>Menu</span>
              </button>

              { showNavigationMenu ? (
                  <NavigationMenu count={nonReadNotificationsCount} setShowProfileMenu={setShowProfileMenu} setShowNavigationMenu={setShowNavigationMenu} />
              ) : null }

              {user ? (
                <Profile
                  setShowNavigationMenu={setShowNavigationMenu}
                  showProfileMenu={showProfileMenu}
                  setShowProfileMenu={setShowProfileMenu}
                />
              ) : null }

            </div>
        </div>
    </header>
  )
}

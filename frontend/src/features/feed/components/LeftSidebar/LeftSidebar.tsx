import { useAuthentication } from '../../../authentication/contexts/AuthenticationContextProvider'
import styles from './LeftSidebar.module.scss'

export const LeftSidebar = () => {

    const {user} = useAuthentication();

  return (
    <div className={styles.root}>
        <div className={styles.cover}>
            <img src="https://images.unsplash.com/photo-1735908235934-90d1f89d9add?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
        </div>
        <div className={styles.avatar}>
            <img src={user?.profilePicture || "avatar.svg"} alt="" />
        </div>
        <div className={styles.name}>{user?.firstName + " " + user?.lastName}</div>
        <div className={styles.title}>{user?.position + " at " + user?.company}</div>
        <div className={styles.info}>
            <div className={styles.item}>
                <div className={styles.label}>Espectadores de Perfil</div>
                <div className={styles.value}>1,234</div>
            </div>
            <div className={styles.item}>
                <div className={styles.label}>Conexiones</div>
                <div className={styles.value}>1,234</div>
            </div>
        </div>
    </div>
  )
}

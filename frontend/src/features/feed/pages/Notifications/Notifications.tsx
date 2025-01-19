import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useAuthentication, User } from '../../../authentication/contexts/AuthenticationContextProvider'
import { LeftSidebar } from '../../components/LeftSidebar/LeftSidebar'
import { RightSidebar } from '../../components/RightSidebar/RightSidebar'
import styles from './Notifications.module.scss'
import { useNavigate } from 'react-router-dom'
import { request } from '../../../../utils/api'
import { TimeAgo } from '../../components/TimeAgo/TimeAgo'
import { useWebSocket } from '../../../ws/Ws'

enum NotificationType{
    LIKE,
    COMMENT
}

export interface Notification{
    id: number,
    recipient: User,
    actor: User,
    read: boolean,
    type: NotificationType,
    resourceId: number,
    creationDate: string
}

export const Notifications = () => {
    const [notifications, setNotifications] = useState<Notification[]>([])
    const { client, connected } = useWebSocket()
    const {user} = useAuthentication();

    useEffect( () => {
        const fetchNotifications = async () => {
            await request<Notification[]>({
                endpoint: "/api/v1/notifications",
                onSuccess: (data) => setNotifications(data),
                onFailure: (err) => {console.log(err)}
            })
        }
        fetchNotifications();
    }, [])

    useEffect( () => {
        const subscription = client?.subscribe(`/topic/users/${user?.id}/notifications`, (message) => {
            const notification = JSON.parse(message.body)
            setNotifications( (prev) => {
                const filtered = prev.filter( (n) => n.id !== notification.id )
                return [notification, ...filtered];
            } )
        })
        return () => subscription?.unsubscribe()
    }, [user?.id, client])

  return (
    <div className={styles.root}>
        <div className={styles.left}>
            <LeftSidebar />
        </div>
        <div className={styles.center}>
            { notifications.length == 0 && (
                <p style={{padding: "1rem"}} >No tienes notificaciones</p>
            )}
            { notifications.map( (notification) => (
                <Notification key={notification.id} notification={notification} setNotifications={setNotifications} />
            ) ) }            

        </div>
        <div className={styles.right}>
            <RightSidebar />
        </div>
    </div>
  )
}

const Notification = ( {
    notification, 
    setNotifications
} : {
    notification: Notification, 
    setNotifications: Dispatch<SetStateAction<Notification[]>>
} ) => {
    const navigate = useNavigate();
    async function markNotificationAsRead(notificationId: number){
        await request({
            endpoint: `/api/v1/notifications/${notificationId}`,
            method: "PUT",
            onSuccess: () => {
                setNotifications( (prev) => 
                    prev.map( (notification) =>  
                        notification.id === notificationId ? {...notification, isRead: true} : notification
                    )
                )
            },
            onFailure: (err) => {
                console.log(err)
            }
        })
    }

    return (
        <>
        <button
        onClick={ () => {
            markNotificationAsRead(notification.id)
            navigate(`/posts/${notification.resourceId}`)
        } }
        className={
            notification.read ? styles.notification : `${styles.notification} ${styles.unread}`
        }
        >
            <img src={notification.actor.profilePicture || "avatar.svg"} alt="" className={styles.avatar} />
            <p style={{marginRight: "auto"}}>
                <strong>{notification.actor.firstName + " " + notification.actor.lastName}</strong>{" "}
                {notification.type.toString() === "LIKE" ? "liked" : "commented on"} your post.
            </p>
            <TimeAgo date={notification.creationDate} edited={false} />
        </button>
        </>
    )
}

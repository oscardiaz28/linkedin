import { Outlet } from 'react-router-dom'
import styles from './ApplicationLayout.module.scss'
import { Header } from '../Header/Header'
import { WebSocketContextProvider } from '../../features/ws/Ws'

export const ApplicationLayout = () => {
  return (
    <WebSocketContextProvider>
      <div className={styles.root}>
          <Header />
          <main className={styles.container}>
            <Outlet />
          </main>
      </div>
    </WebSocketContextProvider>
  )
}

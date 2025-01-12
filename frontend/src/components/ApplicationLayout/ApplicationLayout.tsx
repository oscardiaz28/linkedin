import { Outlet } from 'react-router-dom'
import styles from './ApplicationLayout.module.scss'
import { Header } from '../Header/Header'

export const ApplicationLayout = () => {
  return (
    <div className={styles.root}>
        <Header />
        <main className={styles.container}>
          <Outlet />
        </main>
    </div>
  )
}

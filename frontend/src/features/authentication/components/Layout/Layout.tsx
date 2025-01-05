import { ReactNode } from "react"
import styles from './Layout.module.scss'

export const Layout = ( { children } : {children: ReactNode} ) => {
  return (
    <div className={styles.root}>
        <header className={styles.container}>
          <a href="">
            <img src="/logo.svg" alt="" className={styles.logo} />
          </a>
        </header>
        <main className={styles.container}>
          {children}
        </main>
        <footer>
          <ul className={styles.container}>
            <li style={{display: "flex", gap: "1rem"}}>
              <img src="/logo-dark.svg" alt="" style={{width: "6rem"}} />
              <span> 2024</span>
            </li>
            <li>
              <a href="">Condiciones de Uso</a>
            </li>
            <li>
              <a href="">Políticas de Privacidad</a>
            </li>
            <li>
              <a href="">Pautas comunitarias</a>
            </li>
            <li>
              <a href="">Políticas de cookies</a>
            </li>
            <li>
              <a href="">Políticas de copyright</a>
            </li>
            <li>
              <a href="">Enviar comentarios</a>
            </li>
          </ul>
        </footer>
    </div>
  )
}

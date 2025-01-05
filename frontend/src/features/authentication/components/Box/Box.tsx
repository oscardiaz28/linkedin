import { ReactNode } from "react"
import styles from "./Box.module.scss"

export const Box = ({children} : {children: ReactNode} )  => {
  return (
    <div className={styles.root}>
        {children}
    </div>
  )
}

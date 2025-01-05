import { ReactNode } from "react"
import styles from "./Separator.module.scss"

export const Separator = ({children} : {children: ReactNode} ) => {
  return (
    <div className={styles.root}>{children}</div>
  )
}

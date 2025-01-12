import { ButtonHTMLAttributes } from "react"
import styles from "./Button.module.scss"

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    outline?: boolean
}

export const Button = ({outline, children, ...others} : ButtonProps) => {
  return (
    <button className={`${styles.root} ${outline ? styles.outline : ""}`} {...others} >
        {children}
    </button>
  )
}

import { InputHTMLAttributes } from 'react'
import styles from './Input.module.scss'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
    label: string
}

export const Input = ({label, ...otherProps} : InputProps ) => {
  return (
    <div className={styles.root}>
        <label htmlFor="">{label}</label>
        <input {...otherProps} />
    </div>
  )
}

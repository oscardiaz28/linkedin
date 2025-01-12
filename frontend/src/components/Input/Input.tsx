import { InputHTMLAttributes } from 'react'
import styles from './Input.module.scss'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
    label?: string
    size?: "small" | "medium" | "large"
}

export const Input = ({label, size, width, ...otherProps} : InputProps ) => {
  return (
    <div className={`${styles.root} ${styles[size || "large"]} `}>
      {
        label ? (
          <label htmlFor="">{label}</label>
        ) : null }
        <input {...otherProps} 
        style={{ width: width ? `${width}px` : '100%' }}
        />
    </div>
  )
}

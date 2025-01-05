import styles from './Loader.module.scss'

export const Loader = () => {
  return (
    <div className={styles.root}>
        <img src="/logo.svg" alt="" />
        <div className={styles.container}>
          <div className={styles.content}></div>
        </div>
    </div>
  )
}



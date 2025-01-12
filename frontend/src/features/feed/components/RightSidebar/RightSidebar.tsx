import styles from './RightSidebar.module.scss'

export const RightSidebar = () => {
  return (
    <div className={styles.root}>
        <h3>Agrega a tu feed</h3>
        <div className={styles.items}>
            <div className={styles.item}>
                <img src="https://i.pravatar.cc/300" alt="" className={styles.avatar} />
                <div className={styles.content}>
                    <div className={styles.name}>Anis Doe</div>
                    <div className={styles.title}>Backend Developer</div>
                    <button type='button' className={styles.button}>+ Seguir</button>
                </div>
            </div>
            <div className={styles.item}>
                <img src="https://i.pravatar.cc/300" alt="" className={styles.avatar} />
                <div className={styles.content}>
                    <div className={styles.name}>Anis Doe</div>
                    <div className={styles.title}>Backend Developer</div>
                    <button type='button' className={styles.button}>+ Seguir</button>
                </div>
            </div>
        </div>
    </div>
  )
}

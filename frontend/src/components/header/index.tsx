import React, { useContext } from "react"
import styles from './index.module.css'
import { Context } from "../.."

export const Header = ({username}: {username?: string}) => {

    const { store } = useContext(Context)

    const onExitButtonClick = () => {
        store.logout()
    }

    return(
        <div className={styles.header}>
            <img className={styles.logo} src="/logo.png"/>
            {username ? 
                <nav className={styles.navbar}>
                    <ul className={styles.username}>{username}</ul>
                    <ul className={styles.exit_button} onClick={onExitButtonClick}>Выйти</ul>         
                </nav>
                :
                <></>
            }
        </div>
    )

}
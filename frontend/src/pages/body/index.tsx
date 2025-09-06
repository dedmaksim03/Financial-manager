import { ReactNode } from "react"
import styles from './index.module.css'

export const BodyPage = ({children}: {children: ReactNode}) => {
    return (
        
        <main className={styles.main_сontainer}>
            {children}  
        </main>
    )
}
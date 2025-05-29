import { ReactNode } from 'react'
import  NavBar  from '../../components/navbar/navbar'
import styles from './index.module.css'

export const MainPage = ({children}: {children: ReactNode}) => {
    return (
        <div className={styles.home_page}>
            <div className={styles.navbar}>
                <NavBar/>
            </div>    
            <div className={styles.payload}>
                {children}
            </div>               
        </div>
           )
}
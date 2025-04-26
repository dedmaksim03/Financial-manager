import { Button } from '../../components/button'
import { Input } from '../../components/input'
import styles from './index.module.css'

export const LoginPage = () => {
    return (
        <div className={styles.main_сontainer}>
            <div className={styles.form_container}>
                <Input type='text' placeholder='Логин'/>
                <Input type='password' placeholder='Пароль'/>
                <Button text='Вход'/>
            </div>
        </div>

    )
}
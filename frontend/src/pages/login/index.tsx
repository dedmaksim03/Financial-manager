import { ChangeEvent, useContext, useState } from 'react'
import { Button } from '../../components/button'
import { Input } from '../../components/input'
import styles from './index.module.css'
import { Context } from '../..'
import { useNavigate } from 'react-router-dom'
import { RegistrationPage } from '../registration'

export const LoginPage = ({onRegistrationClick}: {onRegistrationClick: ()=>void}) => {

    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const { store } = useContext(Context)

    const _setUsername = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setUsername(event.target.value)
        // console.log(`Enter username: ${username}`)
    }
    const _setPassword = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setPassword(event.target.value)
        // console.log(`Enter password: ${password}`)
    }

    const onLoginClick = async (): Promise<void> => {
        await store.login({username: username, password: password})
        console.log('button click')
    }

    return (
        <div className={styles.main_сontainer}>
            <div className={styles.form_container}>
                <Input type='text' placeholder='Логин' onChange={_setUsername}/>
                <Input type='password' placeholder='Пароль' onChange={_setPassword}/>
                <Button text='Вход' onClick={onLoginClick}/>
                <p className={styles.registration} onClick={onRegistrationClick}>Регистрация</p>
            </div>
        </div>

    )
}
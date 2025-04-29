import { ChangeEvent, useContext, useState } from 'react'
import { Button } from '../../components/button'
import { Input } from '../../components/input'
import styles from './index.module.css'
import { Context } from '../..'
import { useNavigate } from 'react-router-dom'

export const RegistrationPage = ({onLoginClick}: {onLoginClick: ()=>void}) => {

    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [passwordRetry, setPasswordRetry] = useState<string>('');

    const { store } = useContext(Context)

    const checkCorrectPassword = () => {
        
    }

    const _setUsername = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setUsername(event.target.value)
        // console.log(`Enter username: ${username}`)
    }
    const _setPassword = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setPassword(event.target.value)
        // console.log(`Enter password: ${password}`)
    }
    const _setPasswordRetry = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setPasswordRetry(event.target.value)
        // console.log(`Enter password: ${password}`)
    }

    const onRegistrationClick = async (): Promise<void> => {
        await store.registration({username: username, password: password})
        console.log('button click')
    }

    return (
        <div className={styles.main_сontainer}>
            <div className={styles.form_container}>
                <Input type='text' placeholder='Логин' onChange={_setUsername}/>
                <Input type='password' placeholder='Пароль' onChange={_setPassword}/>
                <Input type='password' placeholder='Повторный пароль' onChange={_setPasswordRetry}/>
                <Button text='Создать' onClick={onRegistrationClick}/>
                <p className={styles.login} onClick={onLoginClick}>Уже есть аккаунт? Вход</p>
            </div>
        </div>

    )
}
import { useContext, useState } from "react"
import { ButtonSubmit } from '../../components/buttons'
import { Input } from '../../components/input'
import styles from './index.module.css'
import { Context } from "../.."

export const AuthPage = () => {
    const { store } = useContext(Context)
    const [isRegistration, setIsRegistration] = useState<boolean>(false)
    const [passwordRetry, setPasswordRetry] = useState<string>('');

    const _setIsRegistrationTrue = () => {
        setIsRegistration(true)
    }

    const _setIsRegistrationFalse = () => {
        setIsRegistration(false)
    }

    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const _setUsername = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setUsername(event.target.value)
    }
    const _setPassword = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setPassword(event.target.value)
    }

    const _setPasswordRetry = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setPasswordRetry(event.target.value)
    }    

    const onLoginClick = async (): Promise<void> => {
        await store.login({username: username, password: password})
        console.log('button click')
    }    

    const onRegistrationClick = async (): Promise<void> => {
        await store.registration({username: username, password: password})
    }


    return(
        <div className={styles.main_сontainer}>
            <div className={styles.form_container}>
                <Input type="text" placeholder="Логин" onChange={_setUsername} />
                <Input type="password" placeholder="Пароль" onChange={_setPassword} />
                {isRegistration && (
                    <Input
                        type="password"
                        placeholder="Повторный пароль"
                        onChange={_setPasswordRetry}
                    />
                    )}

                <div className={styles.inputButton}>
                    <ButtonSubmit
                        innerText={isRegistration ? "Создать" : "Вход"}
                        onClick={isRegistration ? onRegistrationClick : onLoginClick}
                    />
                </div>

                <p
                    className={styles.bottomHint}
                    onClick={isRegistration ? _setIsRegistrationFalse : _setIsRegistrationTrue}
                >
                    {isRegistration ? "Уже есть аккаунт? Вход" : "Регистрация"}
                </p>
            </div>
        </div>
    )
}
import { useState } from "react"
import { LoginPage } from "../login"
import { RegistrationPage } from "../registration"

export const AuthPage = () => {
    const [isRegistration, setIsRegistration] = useState<boolean>(false)

    const _setIsRegistrationTrue = () => {
        setIsRegistration(true)
    }

    const _setIsRegistrationFalse = () => {
        setIsRegistration(false)
    }

    if (isRegistration) {
        return <RegistrationPage onLoginClick={_setIsRegistrationFalse}/>
    }
    else {
        return <LoginPage onRegistrationClick={_setIsRegistrationTrue}/>
    }
}
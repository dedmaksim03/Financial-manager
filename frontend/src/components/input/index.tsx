import { ChangeEvent } from 'react'
import styles from './index.module.css'

interface InputProps {
    type: string 
    placeholder: string
    onChange: (value: React.ChangeEvent<HTMLInputElement>) => void
}

export const Input = ({type, placeholder, onChange}: InputProps) => {
    return (
        <input 
            className={styles.input} 
            type={type} 
            placeholder={placeholder}
            onChange={onChange}
        >

        </input>
    )
}
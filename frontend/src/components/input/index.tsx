import styles from './index.module.css'

interface InputProps {
    type: string 
    placeholder: string
}

export const Input = ({type, placeholder}: InputProps) => {
    return (
        <input className={styles.input} type={type} placeholder={placeholder}></input>
    )
}
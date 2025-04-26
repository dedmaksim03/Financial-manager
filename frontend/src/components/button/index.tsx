import styles from './index.module.css'

interface ButtonProps {
    text: string
}

export const Button = ({text}: ButtonProps) => {
    return (
        <button className={styles.button}>
            {text}
        </button>
    )
}
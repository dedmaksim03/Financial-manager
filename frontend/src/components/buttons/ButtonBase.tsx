import { Button, ButtonProps } from "antd";
import styles from './index.module.css'
import { sign } from "crypto";

interface Props {
    color: "default" | "primary" | "danger" | "blue" | "purple" | "cyan" | "green" | "magenta" | "pink" | "red" | "orange" | "yellow" | "volcano" | "geekblue" | "lime" | "gold" | undefined
    onClick: () => void
    children: React.ReactNode;
}

const ButtonBase: React.FC<Props> = ({ color, onClick, children}) =>  {
    return (
        <div className={styles.button}>
            <Button block type="primary" variant="filled" onClick={onClick} style={{height: "100%", fontSize: '2vh'}}>
                {children}
            </Button>
        </div>

    )
}

export default ButtonBase


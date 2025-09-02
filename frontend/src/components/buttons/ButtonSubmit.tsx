import  ButtonBase  from "./ButtonBase";
import styles from './index.module.css'

const ButtonSubmit: React.FC<{ onClick: () => void, innerText: string }> = ({ onClick, innerText }) => (
    <div className={styles.button}>  
        <ButtonBase color="primary" onClick={onClick}>
            {innerText}
        </ButtonBase>
    </div>
);

export default ButtonSubmit
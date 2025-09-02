import ButtonBase  from "./ButtonBase";
import styles from './index.module.css'

const ButtonDelete: React.FC<{ onClick: () => void }> = ({ onClick }) => (
    <div className={styles.button}>  
        <ButtonBase color="danger" onClick={onClick}>
            Удалить
        </ButtonBase>
    </div>

);

export default ButtonDelete
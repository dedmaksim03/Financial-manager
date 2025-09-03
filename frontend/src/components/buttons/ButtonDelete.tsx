import ButtonBase  from "./ButtonBase";
import styles from './index.module.css'
import type { CommonButtonProps } from './ButtonBase';

const ButtonDelete: React.FC<CommonButtonProps> = (props) => (
    <div className={styles.button}>  
        <ButtonBase color="danger" {...props}>
            Удалить
        </ButtonBase>
    </div>

);

export default ButtonDelete
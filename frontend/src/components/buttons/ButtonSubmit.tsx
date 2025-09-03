import  ButtonBase  from "./ButtonBase";
import styles from './index.module.css'
import type { CommonButtonProps } from './ButtonBase';

const ButtonSubmit: React.FC<CommonButtonProps> = (props) => (
    <div className={styles.button}>  
        <ButtonBase color="primary" {...props}>
            {props.children}
        </ButtonBase>
    </div>
);

export default ButtonSubmit
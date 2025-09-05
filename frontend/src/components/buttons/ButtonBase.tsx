import { Button } from "antd";
import styles from './index.module.css'
import { sign } from "crypto";

type Props = React.ComponentProps<typeof Button> & {
    children: React.ReactNode;
    variant?: 'filled' | 'outlined' | 'text' | 'dashed' | 'solid';
};

const ButtonBase: React.FC<Props> = (props) =>  {

    const { variant = 'solid', ...restProps } = props; 

    return (
        <div className={styles.button}>
            <Button {...props} block variant={variant} style={{height: "100%", width: '100%', fontSize: '1em', borderRadius: '15px', textWrap: 'wrap'}}>
                {props.children}
            </Button>
        </div>

    )
}

export default ButtonBase
export type CommonButtonProps = Props


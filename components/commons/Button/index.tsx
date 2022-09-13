import { Button as MantineButton, ButtonProps } from '@mantine/core';
import styles from "./button.module.css";

interface IProps {
  onClick?: () => void;
}

const Button = (props: ButtonProps & IProps) => {
  const {
    className = "",
    children,
    onClick,
    ...buttonProps
  } = props;

  return (
    <MantineButton {...buttonProps} className={`${styles.button} ${className}`} onClick={onClick}>
      {children}
    </MantineButton>
  );
};

export default Button;

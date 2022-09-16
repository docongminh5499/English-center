import { Button as MantineButton, ButtonProps } from '@mantine/core';
import React from 'react';
import styles from "./button.module.css";

interface IProps {
  onClick?: () => void;
}

const Button = React.forwardRef<HTMLButtonElement, React.PropsWithChildren<IProps & ButtonProps>>((props, ref) => {
  const {
    className = "",
    children,
    onClick,
    ...buttonProps
  } = props;

  return (
    <MantineButton {...buttonProps} ref={ref} className={`${styles.button} ${className}`} onClick={onClick}>
      {children}
    </MantineButton>
  );
});

Button.displayName = "Button";
export default Button;

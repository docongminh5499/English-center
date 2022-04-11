import { useRouter } from "next/router";
import styles from "./button.module.css";

interface IProps {
  theme?: "primary" | "secondary" | "danger" | "success";
  externalClassName?: string;
  type?: "submit" | "button";
  href?: string;
  children?: React.ReactNode | React.ReactNode[];
  onClick?: () => void;
}

const Button = (props: IProps) => {
  const {
    externalClassName = "",
    type = "button",
    children,
    href,
    theme = "",
    onClick,
  } = props;

  const router = useRouter();
  const handleOnClick = href ? () => router.push(href) : onClick;

  let themeClass = "";
  if (theme == "primary") themeClass = styles.buttonPrimary;
  if (theme == "secondary") themeClass = styles.buttonSecondary;
  if (theme == "danger") themeClass = styles.buttonDanger;
  if (theme == "success") themeClass = styles.buttonSucess;

  return (
    <button
      type={type}
      className={`${styles.button} ${externalClassName} ${themeClass}`}
      onClick={() => handleOnClick && handleOnClick()}
    >
      {children}
    </button>
  );
};

export default Button;

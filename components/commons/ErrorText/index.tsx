import styles from "./errorText.module.css";

interface IProps {
  text: string;
}

const ErrorText = ({ text }: IProps) => {
  return <p className={styles.text}>{'* ' + text}</p>;
};

export default ErrorText;

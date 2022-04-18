import { UseFormRegisterReturn } from "react-hook-form";
import ErrorText from "../ErrorText";
import styles from './input.module.css';

interface IProps {
  label?: string;
  type?: string;
  placeholder?: string;
  registerForm?: UseFormRegisterReturn;
  error?: string;
  id?: string;
  autoComplete?: string;
}

const Input = ({
  label,
  type,
  placeholder,
  registerForm,
  error,
  id,
  autoComplete,
}: IProps) => {
  return (
    <div className={styles.inputContainer}>
      {label && <label htmlFor={id}>{label}</label>}
      <input
        placeholder={placeholder || ""}
        type={type || "text"}
        id={id}
        autoComplete={autoComplete}
        {...registerForm}
      />
      {error && <ErrorText text={error} />}
    </div>
  );
};

export default Input;

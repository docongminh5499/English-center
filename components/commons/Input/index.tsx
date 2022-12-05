import { Input as MantineInput, InputProps } from '@mantine/core';
import { UseFormRegisterReturn } from "react-hook-form";
import ErrorText from "../ErrorText";

interface IProps {
  label?: string;
  type?: string;
  placeholder?: string;
  registerForm?: UseFormRegisterReturn;
  error?: any;
  id?: string;
  autoComplete?: string;
  className?: string;
}

const Input = (props: InputProps & IProps) => {
  const {registerForm, ...leftProps} = props;
  return (
    <MantineInput.Wrapper
      id={props.id}
      label={props.label}
      error={props.error && <ErrorText text={props.error} />}
      className={`${props.className || ""}`}
    >
      <MantineInput
        id={props.id}
        placeholder={props.placeholder || ''}
        type={props.type || 'text'}
        autoComplete={props.autoComplete}
        {...leftProps}
        {...props.registerForm}
      />
    </MantineInput.Wrapper>
  );
};

export default Input;

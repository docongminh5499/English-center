import Head from "next/head";
import Layout from "../../commons/Layout";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Url } from "../../../helpers/constants";
import { toast } from "react-toastify";
import { useAuth } from "../../../stores/Auth";
import { useRouter } from "next/router";
import Input from "../../commons/Input";
import Button from "../../commons/Button";
import styles from "./login.module.css";

interface IProps {}

const schema = yup.object().shape({
  username: yup.string().required("Vui lòng nhập tên người dùng"),
  password: yup.string().required("Vui lòng nhập mật khẩu"),
});

const LoginScreen = (props: IProps) => {
  const [, authAction] = useAuth();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data: any) => {
    try {
      await authAction.logIn(data);
      const returnUrl = (router.query.returnUrl || "/") as string;
      router.push(returnUrl);
    } catch (error: any) {
      if (error.status && error.status == 404) {
        toast.error("Tên đăng nhập hoặc mật khẩu không đúng");
      } else {
        toast.error("Hệ thống gặp sự cố. Vui lòng thử lại sau");
      }
    }
  };
  return (
    <>
      <Head>
        <title>Đăng nhập</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <div className={styles.loginContainer}>
          <div className={styles.login}>
            <p className={styles.title}>Đăng nhập</p>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Input
                type="text"
                label="Tên đăng nhập"
                id="username_login_screen"
                registerForm={register("username")}
                placeholder="Tên đăng nhập"
                error={errors.username?.message}
              />
              <Input
                type="password"
                label="Mật khẩu"
                id="password_login_screen"
                registerForm={register("password")}
                placeholder="Mật khẩu"
                error={errors.password?.message}
                autoComplete="on"
              />
              <Button type="submit" theme="primary">
                Đăng nhập
              </Button>
            </form>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default LoginScreen;

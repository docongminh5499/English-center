import Head from "next/head";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useAuth } from "../../../stores/Auth";
import { useRouter } from "next/router";
import Input from "../../commons/Input";
import Button from "../../commons/Button";
import { IconUser, IconLockOpen, IconEye, IconEyeOff } from "@tabler/icons";
import styles from "./login.module.css";
import { useState } from "react";
import { Anchor, Text } from "@mantine/core";



interface IProps { }

const schema = yup.object().shape({
  username: yup.string().required("Vui lòng nhập tên người dùng"),
  password: yup.string().required("Vui lòng nhập mật khẩu"),
});

const LoginScreen = (props: IProps) => {
  const [, authAction] = useAuth();
  const [seePassword, setSeePassword] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data: any) => {
    try {
      setLoggingIn(true);
      await authAction.logIn(data);
      const returnUrl = (router.query.returnUrl || "/") as string;
      await router.replace(returnUrl);
      setLoggingIn(false);
    } catch (error: any) {
      setLoggingIn(false);
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
      <div className={styles.loginContainer}>
        <div className={styles.loginBanner}>
          <img src="/assets/images/login_banner.jpg" alt="banner" />
        </div>
        <div className={styles.login}>
          <p className={styles.title}>Đăng nhập</p>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              styles={{ input: { color: "#444" } }}
              icon={<IconUser size={"1.6rem"} color="#444" stroke={1.5} />}
              type="text"
              id="username_login_screen"
              registerForm={register("username")}
              placeholder="Tên đăng nhập"
              autoComplete="off"
              error={errors.username?.message}
            />
            <Input
              styles={{ input: { color: "#444" } }}
              icon={<IconLockOpen size={"1.6rem"} color="#444" stroke={1.5} />}
              type={seePassword ? "text" : "password"}
              id="password_login_screen"
              registerForm={register("password")}
              placeholder="Mật khẩu"
              autoComplete="off"
              error={errors.password?.message}
              rightSection={
                seePassword ? (<IconEye
                  onClick={() => setSeePassword(!seePassword)}
                  size={"1.6rem"} color="#444" stroke={1.5} />
                ) : (<IconEyeOff
                  onClick={() => setSeePassword(!seePassword)}
                  size={"1.6rem"} color="#444" stroke={1.5} />)}
            />
            <Text style={{ fontSize: "1.1rem" }} align="center">
              Chưa có tài khoản? <Anchor onClick={() => router.push({
                pathname: "/register",
                query: { returnUrl: router.query.returnUrl || "/" },
              })}>Đăng ký ngay</Anchor>
            </Text>
            <Button type="submit" color="primary" loading={loggingIn}>
              Đăng nhập
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginScreen;

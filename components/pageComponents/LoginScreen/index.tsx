import Head from "next/head";
import Layout from "../../commons/Layout";
import API from "../../../helpers/api";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Url } from "../../../helpers/constants";
import { toast } from "react-toastify";
import { useAuth } from "../../../stores/Auth";
import { useRouter } from "next/router";

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
      const response = await API.post(Url.users.signIn, data);
      await authAction.logIn(response);
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
        <p>Trang LOGIN</p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            type="text"
            {...register("username")}
            placeholder="Tên đăng nhập"
          />
          {errors.username && <p>{errors.username.message}</p>}
          <input
            type="password"
            {...register("password")}
            autoComplete="on"
            placeholder="Mật khẩu"
          />
          {errors.password && <p>{errors.password.message}</p>}
          <button type="submit">Đăng nhập</button>
        </form>
      </Layout>
    </>
  );
};

export default LoginScreen;

import Head from "next/head";
import { useAuth } from "../../../stores/Auth";
import Layout from "../../commons/Layout";
import styles from "./home.module.css";

interface IProps {}

const HomeScreen = (props: IProps) => {
  const [authState] = useAuth();

  return (
    <>
      <Head>
        <title>Trang chủ</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <p>Trang HOME</p>
        <div>{authState.username}</div>
        <div>{authState.role}</div>
        <div>{authState.expireTime}</div>
      </Layout>
    </>
  );
};

export default HomeScreen;

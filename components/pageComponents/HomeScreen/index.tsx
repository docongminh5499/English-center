import Head from "next/head";
import Layout from "../../commons/Layout";
import styles from "./home.module.css";

interface IProps {}

const HomeScreen = (props: IProps) => {
  return (
    <>
      <Head>
        <title>Trang chủ</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <p>Trang HOME</p>
      </Layout>
    </>
  );
};

export default HomeScreen;

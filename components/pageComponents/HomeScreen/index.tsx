import Head from "next/head";
import { UserRole } from "../../../helpers/constants";
import Layout from "../../commons/Layout";
import Sidebar from "../../commons/Sidebar";
import styles from "./home.module.css";
import { useRouter } from "next/router";
import { useEffect } from "react";

interface IProps { 
  userRole?: UserRole
}

const HomeScreen = (props: IProps) => {
  const router = useRouter();
  useEffect(() => {
    if (props.userRole === UserRole.TEACHER)
      router.push("/teacher");

    // TODO: Another user role

  }, []);


  return (
    <>
      <Head>
        <title>Trang chủ</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout displaySidebar={false} userRole={props.userRole}>
          
          {/* TODO : Guest home page */}

      </Layout>
    </>
  );
};

export default HomeScreen;

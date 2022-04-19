import Head from "next/head";
import { UserRole } from "../../../helpers/constants";
import { useAuth } from "../../../stores/Auth";
import Layout from "../../commons/Layout";
import Sidebar from "../../commons/Sidebar";
import styles from "./home.module.css";
import TeacherHome from "./teacher.home";

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
        <div className={styles.homeContainer}>
          <Sidebar />
          {authState.role == UserRole.TEACHER && <TeacherHome />}
        </div>
      </Layout>
    </>
  );
};

export default HomeScreen;

import Head from "next/head";
import Button from "../../commons/Button";
import Layout from "../../commons/Layout";
import styles from "./notFound.module.css";

interface IProps { }

const NotFoundScreen = (props: IProps) => {
  return (
    <>
      <Head>
        <title>Không tìm thấy trang</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout displaySidebar={false}>
        <div className={styles.notFoundContainer}>
          <p className={styles.statusText}>404 - Not Found</p>
          <p className={styles.notFoundText}>Không tìm thấy trang</p>
          <Button href="/" color="success">
            <p>Về trang chủ</p>
          </Button>
        </div>
      </Layout>
    </>
  );
};

export default NotFoundScreen;

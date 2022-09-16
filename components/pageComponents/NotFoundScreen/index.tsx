import Head from "next/head";
import { useRouter } from "next/router";
import Button from "../../commons/Button";
import styles from "./notFound.module.css";

interface IProps { }

const NotFoundScreen = (props: IProps) => {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>Không tìm thấy trang</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.notFoundContainer}>
        <p className={styles.statusText}>404 - Not Found</p>
        <p className={styles.notFoundText}>Không tìm thấy trang</p>
        <Button onClick={() => router.push("/")} color="green">
          <p>Về trang chủ</p>
        </Button>
      </div>
    </>
  );
};

export default NotFoundScreen;

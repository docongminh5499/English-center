import CircularProgress from "@mui/material/CircularProgress";
import Head from "next/head";
import styles from "./loading.module.css";

interface IProps {}

const LoadingScreen = (props: IProps) => {
  return (
    <>
      <Head>
        <title>English Center - Trung tâm Tiếng anh uy tín hàng đầu Việt Nam</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.loadingContainer}>
        <CircularProgress color="inherit" />
        <p className={styles.loadingText}>Đang tải...</p>
      </div>
    </>
  );
};

export default LoadingScreen;

import Head from "next/head";
import Layout from "../../commons/Layout";

interface IProps { }

const NotFoundScreen = (props: IProps) => {
  return (
    <>
      <Head>
        <title>Không tìm thấy trang</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout displaySidebar={false}>
        <p>404 Not Found</p>
      </Layout>
    </>
  );
};

export default NotFoundScreen;

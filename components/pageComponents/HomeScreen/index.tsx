import Head from "next/head";
import { UserRole } from "../../../helpers/constants";
import styles from "./home.module.css";
import { useRouter } from "next/router";
import { useEffect } from "react";
import LoadingScreen from "../LoadingScreen";

interface IProps {
  userRole?: UserRole
}

const HomeScreen = (props: IProps) => {
  const router = useRouter();
  useEffect(() => {
    if (props.userRole === UserRole.TEACHER)
      router.push("/teacher");
    if (props.userRole === UserRole.EMPLOYEE)
      router.push("/employee");

    // TODO: Another user role

  }, [props.userRole]);


  return (
    <>
      <Head>
        <title>Trang chủ</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {props.userRole !== UserRole.GUEST && <LoadingScreen />}

      {/* TODO : Guest home page */}
    </>
  );
};

export default HomeScreen;

import Head from "next/head";
import { UserRole } from "../../../helpers/constants";
import styles from "./home.module.css";
import { useRouter } from "next/router";
import { useEffect } from "react";
import LoadingScreen from "../LoadingScreen";
import { useAuth } from "../../../stores/Auth";

interface IProps {
  userRole?: UserRole
}

const HomeScreen = (props: IProps) => {
  const [authState] = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (authState.loggingOut) return;

    if (props.userRole === UserRole.TEACHER)
      router.replace("/teacher");
    else if (props.userRole === UserRole.EMPLOYEE)
      router.replace("/employee");
    else if (props.userRole === UserRole.STUDENT)
      router.push("/student");

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

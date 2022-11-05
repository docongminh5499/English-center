import { Container } from "@mantine/core"
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { UserRole } from "../../../helpers/constants";
import LoadingScreen from "../LoadingScreen";

interface IProps {
  userRole?: UserRole | null;
}

const PersonalScreen = (props: IProps) => {
  const router = useRouter();
  useEffect(() => {
    if (props.userRole === UserRole.TEACHER)
      router.replace("/teacher/personal");
    else if (props.userRole === UserRole.EMPLOYEE)
      router.replace("/employee/personal");
    else if (props.userRole === UserRole.TUTOR)
      router.replace("/tutor/personal");

    // TODO: Another user role

  }, [props.userRole]);

  return (
    <>
      <Head>
        <title>Tài khoản cá nhân</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <LoadingScreen />
    </>
  )
}


export default PersonalScreen;
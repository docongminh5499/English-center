import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { UserRole } from "../../../helpers/constants";
import LoadingScreen from "../LoadingScreen";

interface IProps {
  userRole?: UserRole | null;
}

const ModifyPersonalScreen = (props: IProps) => {
  const router = useRouter();
  useEffect(() => {
    if (props.userRole === UserRole.TEACHER)
      router.replace("/teacher/modify-personal");
    else if (props.userRole === UserRole.EMPLOYEE)
      router.replace("/employee/modify-personal");
    else if (props.userRole === UserRole.TUTOR)
      router.replace("/tutor/modify-personal")

    // TODO: Another user role

  }, [props.userRole]);

  return (
    <>
      <Head>
        <title>Chỉnh sửa tài khoản</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <LoadingScreen />
    </>
  )
}


export default ModifyPersonalScreen;